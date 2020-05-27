import {Value} from "@swim/core";
import {MapDownlink, NodeRef} from "@swim/mesh";
import {
  AnyColor,
  Color,
  ColorInterpolator,
  Ease,
  Tween,
  Transition,
  View,
  MemberAnimator,
} from "@swim/ui";
import {
  AnyGeoPoint,
  MapViewContext,
  MapView,
  MapGroupView,
  MapCircleView,
} from "@swim/maps";
import {SiteMapPopoverView} from "./SiteMapPopoverView";
import {SectorMapView} from "./SectorMapView";

const INFO_COLOR = Color.parse("#44d7b6");
const WARN_COLOR = Color.parse("#f9f070");
const ALERT_COLOR = Color.parse("#f6511d");
const WARN_INTERPOLATOR = ColorInterpolator.between(INFO_COLOR, WARN_COLOR);
const ALERT_INTERPOLATOR = ColorInterpolator.between(WARN_COLOR, ALERT_COLOR);
const STATUS_TWEEN = Transition.duration<any>(500, Ease.cubicOut);

const MIN_SECTOR_ZOOM = 10;

export class SiteMapView extends MapGroupView {
  /** @hidden */
  readonly _nodeRef: NodeRef;
  /** @hidden */
  _sectorsLink: MapDownlink<Value, Value> | null;
  /** @hidden */
  _statusColor: Color;
  /** @hidden */
  _popoverView: SiteMapPopoverView | null;

  constructor(nodeRef: NodeRef) {
    super();
    this.onClick = this.onClick.bind(this);
    this._nodeRef = nodeRef;
    this._sectorsLink = null;
    this._statusColor = INFO_COLOR;
    this._popoverView = null;
  }

  @MemberAnimator(Color)
  fill: MemberAnimator<this, Color, AnyColor>;

  @MemberAnimator(Color)
  stroke: MemberAnimator<this, Color, AnyColor>;

  @MemberAnimator(Number)
  strokeWidth: MemberAnimator<this, number>;

  didSetStatus(newStatus: Value, tween: Tween<any> = STATUS_TWEEN): void {
    //console.log(this._nodeRef.nodeUri() + " didSetStatus:", newStatus.toAny());
    let marker = this.getChildView("marker") as MapCircleView | null;
    if (marker === null) {
      const coordinates = newStatus.get("coordinates").toAny() as AnyGeoPoint;
      marker = new MapCircleView().geoCenter(coordinates).radius(4);
      this.setChildView("marker", marker);
    }
    let color: Color;
    const severity = newStatus.get("severity").numberValue(0);
    if (severity > 1) {
      color = ALERT_INTERPOLATOR.interpolate(severity - 1);
      this.fill(color, tween);
      if (tween !== false) {
        this.ripple(color, 2, 5000);
      }
    } else if (severity > 0) {
      color = WARN_INTERPOLATOR.interpolate(severity);
      this.fill(color, tween);
      if (tween !== false) {
        this.ripple(color, 1, 2500);
      }
    } else {
      color = INFO_COLOR;
      this.fill(INFO_COLOR, tween);
    }
    if (this._popoverView !== null) {
      this._popoverView.backgroundColor(color.darker(2).alpha(0.9), tween);
    }
    this._statusColor = color;
  }

  ripple(color: Color, width: number, duration: number): void {
    const rootMapView = this.rootMapView;
    if (!this.isHidden() && !this.isCulled() && !document.hidden && this.geoBounds.intersects(rootMapView.geoFrame)) {
      const marker = this.getChildView("marker") as MapCircleView;
      const ripple = new MapCircleView()
          .geoCenter(marker.geoCenter.value)
          .radius(0)
          .stroke(color)
          .strokeWidth(width);
      rootMapView.appendChildView(ripple);
      const frame = rootMapView.viewFrame;
      const radius = Math.min(frame.width, frame.height) / 8;
      const tween = Transition.duration<any>(duration);
      ripple.stroke(color.alpha(0), tween)
            .radius(radius, tween.onEnd(function () { ripple.remove(); }));
    }
  }

  get rootMapView(): MapView {
    let rootMapView: MapView = this;
    do {
      const parentView = rootMapView.parentView;
      if (MapView.is(parentView)) {
        rootMapView = parentView;
        continue;
      }
      break;
    } while (true);
    return rootMapView;
  }

  protected didUpdateSector(key: Value, newSectorStatus: Value): void {
    //console.log(this._nodeRef.nodeUri() + " didUpdateSector " + key.toAny() + ":", newSectorStatus.toAny());
    const sectorNodeUri = key.stringValue()!;
    const azimuth = newSectorStatus.get("azimuth").stringValue()!;
    let azimuthView = this.getChildView(azimuth) as MapGroupView | null;
    if (azimuthView === null) {
      azimuthView = new MapGroupView();
      this.setChildView(azimuth, azimuthView);
    }
    let sectorMapView = azimuthView.getChildView(sectorNodeUri) as SectorMapView | null;
    if (sectorMapView === null) {
      const marker = this.getChildView("marker") as MapCircleView;
      const sectorNodeRef = this._nodeRef.nodeRef(sectorNodeUri);
      sectorMapView = new SectorMapView(sectorNodeRef)
          .geoCenter(marker.geoCenter.value);
      sectorMapView.didSetStatus(newSectorStatus, false);
      azimuthView.setChildView(sectorNodeUri, sectorMapView);
    } else {
      sectorMapView.didSetStatus(newSectorStatus);
    }
  }

  protected didRemoveSector(key: Value, oldSectorStatus: Value): void {
    //console.log(this._nodeRef.nodeUri() + " didRemoveSector " + key.toAny() + ":", oldSectorStatus.toAny());
    const sectorNodeUri = key.stringValue()!;
    const azimuth = oldSectorStatus.get("azimuth").stringValue()!;
    const azimuthView = this.getChildView(azimuth) as MapGroupView | null;
    if (azimuthView !== null) {
      azimuthView.removeChildView(sectorNodeUri);
      if (azimuthView.childViews.length === 0) {
        this.removeChildView(azimuthView);
      }
    }
  }

  protected onMount(): void {
    super.onMount();
  }

  protected onUnmount(): void {
    super.onUnmount();
    this.unlinkSectors();
  }

  protected onInsertChildView(childView: View, targetView: View | null): void {
    super.onInsertChildView(childView, targetView);
    if (childView.key === "marker") {
      childView.on("click", this.onClick);
    }
  }

  protected onRemoveChildView(childView: View): void {
    super.onRemoveChildView(childView);
    if (childView.key === "marker") {
      childView.off("click", this.onClick);
    }
  }

  protected didProject(viewContext: MapViewContext): void {
    if (viewContext.mapZoom >= MIN_SECTOR_ZOOM && this.geoBounds.intersects(viewContext.geoFrame)) {
      this.linkSectors();
    } else {
      if (this._sectorsLink !== null) {
        this.rootView!.dismissModals();
      }
      this.unlinkSectors();
    }
    super.didProject(viewContext);
  }

  protected onClick(event: MouseEvent): void {
    //console.log(this._nodeRef.nodeUri() + " onClick");
    event.stopPropagation();
    let popoverView = this._popoverView;
    if (popoverView === null) {
      popoverView = new SiteMapPopoverView(this._nodeRef);
      popoverView.setSource(this.getChildView("marker"));
      popoverView.hideModal();
      popoverView.backgroundColor.didUpdate = function () {
        popoverView!.place();
      };
      this._popoverView = popoverView;
    }
    popoverView.backgroundColor(this._statusColor.darker(2).alpha(0.9));
    this.rootView!.toggleModal(popoverView, {multi: event.altKey});
  }

  protected linkSectors(): void {
    if (this._sectorsLink === null) {
      //console.log(this._nodeRef.nodeUri() + " linkSectors");
      this._sectorsLink = this._nodeRef.downlinkMap()
          .laneUri("sectors")
          .didUpdate(this.didUpdateSector.bind(this))
          .didRemove(this.didRemoveSector.bind(this))
          .open();
    }
  }

  protected unlinkSectors(): void {
    if (this._sectorsLink !== null) {
      //console.log(this._nodeRef.nodeUri() + " unlinkSectors");
      this._sectorsLink.close();
      this._sectorsLink = null;
      let i = 0;
      while (i < this._childViews.length) {
        const childView = this._childViews[i];
        if (childView instanceof MapGroupView) {
          childView.remove();
        } else {
          i += 1;
        }
      }
    }
  }
}
