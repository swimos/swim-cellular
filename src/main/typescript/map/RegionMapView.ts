import {
  Value,
  PointR2,
  BoxR2,
} from "@swim/core";
import {
  ValueDownlink,
  MapDownlink,
  NodeRef,
} from "@swim/mesh";
import {
  AnyLength,
  Length,
  AnyColor,
  Color,
  ColorInterpolator,
  Ease,
  Tween,
  Transition,
  View,
  MemberAnimator,
  FillView,
  StrokeView,
} from "@swim/ui";
import {
  AnyGeoPoint,
  GeoPoint,
  GeoBox,
  MapViewContext,
  MapView,
  MapLayerView,
  MapGroupView,
  MapPolygonView,
} from "@swim/maps";
import {RegionMapPopoverView} from "./RegionMapPopoverView";
import {SiteMapView} from "./SiteMapView";

const INFO_COLOR = Color.parse("#44d7b6");
const WARN_COLOR = Color.parse("#f9f070");
const ALERT_COLOR = Color.parse("#f6511d");
const WARN_INTERPOLATOR = ColorInterpolator.between(INFO_COLOR, WARN_COLOR);
const ALERT_INTERPOLATOR = ColorInterpolator.between(WARN_COLOR, ALERT_COLOR);
const STATUS_TWEEN = Transition.duration<any>(5000, Ease.cubicOut);

export class RegionMapView extends MapLayerView implements FillView, StrokeView {
  /** @hidden */
  readonly _nodeRef: NodeRef;
  /** @hidden */
  _minZoom: number;
  /** @hidden */
  _maxZoom: number;
  /** @hidden */
  _minSubRegionZoom: number;
  /** @hidden */
  _minSiteZoom: number;
  /** @hidden */
  _geoCentroid: GeoPoint;
  /** @hidden */
  _viewCentroid: PointR2;
  /** @hidden */
  _statusColor: Color;
  /** @hidden */
  _statusPhase: number;
  /** @hidden */
  _popoverView: RegionMapPopoverView | null;
  /** @hidden */
  _statusLink: ValueDownlink<Value> | null;
  /** @hidden */
  _geometryLink: ValueDownlink<Value> | null;
  /** @hidden */
  _subRegionsLink: MapDownlink<Value, Value> | null;
  /** @hidden */
  _sitesLink: MapDownlink<Value, Value> | null;

  constructor(nodeRef: NodeRef) {
    super();
    this.onClick = this.onClick.bind(this);
    this._nodeRef = nodeRef;
    this._minZoom = -Infinity;
    this._maxZoom = Infinity;
    this._minSubRegionZoom = Infinity;
    this._minSiteZoom = Infinity;
    this._geoCentroid = GeoPoint.origin();
    this._viewCentroid = PointR2.origin();
    this._statusColor = INFO_COLOR;
    this._statusPhase = 1;
    this._popoverView = null;
    this._statusLink = null;
    this._geometryLink = null;
    this._subRegionsLink = null;
    this._sitesLink = null;
  }

  @MemberAnimator(Color)
  fill: MemberAnimator<this, Color, AnyColor>;

  @MemberAnimator(Color)
  stroke: MemberAnimator<this, Color, AnyColor>;

  @MemberAnimator(Length)
  strokeWidth: MemberAnimator<this, Length, AnyLength>;

  didSetStatus(newStatus: Value, tween: Tween<any> = STATUS_TWEEN): void {
    //console.log(this._nodeRef.nodeUri() + " didSetStatus:", newStatus.toAny());
    const siteCount = newStatus.get("siteCount").numberValue(0);
    const warnCount = newStatus.get("warnCount").numberValue(0);
    const alertCount = newStatus.get("alertCount").numberValue(0);
    const warnRatio = warnCount / siteCount;
    const alertRatio = alertCount / siteCount;
    let color: Color;
    let phase: number;
    if (alertRatio > 0.015) {
      phase = Math.min((1 / 0.015) * (alertRatio - 0.015), 1);
      color = ALERT_INTERPOLATOR.interpolate(phase);
      this.fill(color.alpha(0.25 + 0.25 * phase), tween)
          .stroke(color.alpha(0.5 + 0.25 * phase), tween)
          .strokeWidth(1 + phase, tween);
    } else if (warnRatio > 0.15) {
      phase = Math.min((1 / 0.15) * (warnRatio - 0.15), 1);
      color = WARN_INTERPOLATOR.interpolate(phase);
      this.fill(color.alpha(0.1 + 0.15 * phase), tween)
          .stroke(color.alpha(0.2 + 0.3 * phase), tween)
          .strokeWidth(1, tween);
    } else {
      phase = 1;
      color = INFO_COLOR;
      this.fill(color.alpha(0.1), tween)
          .stroke(color.alpha(0.2), tween)
          .strokeWidth(1, tween);
    }
    if (this._popoverView !== null) {
      this._popoverView.backgroundColor(color.darker(2).alpha(0.9), tween);
    }
    this._statusColor = color;
    this._statusPhase = phase;
  }

  protected didSetGeometry(newGeometry: Value): void {
    //console.log(this._nodeRef.nodeUri() + " didSetGeometry:", newGeometry.toAny());
    const minZoom = newGeometry.get("minZoom").numberValue(void 0);
    if (minZoom !== void 0) {
      this._minZoom = minZoom;
      this.requireUpdate(View.NeedsProject);
    }
    const maxZoom = newGeometry.get("maxZoom").numberValue(void 0);
    if (maxZoom !== void 0) {
      this._maxZoom = maxZoom;
      this.requireUpdate(View.NeedsProject);
    }
    const minSubRegionZoom = newGeometry.get("minSubRegionZoom").numberValue(void 0);
    if (minSubRegionZoom !== void 0) {
      this._minSubRegionZoom = minSubRegionZoom;
      this.requireUpdate(View.NeedsProject);
    }
    const minSiteZoom = newGeometry.get("minSiteZoom").numberValue(void 0);
    if (minSiteZoom !== void 0) {
      this._minSiteZoom = minSiteZoom;
      this.requireUpdate(View.NeedsProject);
    }

    const type = newGeometry.get("type").stringValue(void 0);
    if (type !== void 0) {
      let geometryView = this.getChildView("geometry") as MapGroupView | null;
      if (geometryView === null) {
        geometryView = new MapGroupView();
        geometryView.on("click", this.onClick);
        this.setChildView("geometry", geometryView);
      } else {
        geometryView.removeAll();
      }
      if (type === "Polygon") {
        const coordinates = newGeometry.get("coordinates").toAny() as AnyGeoPoint[][];
        geometryView.append(MapPolygonView).points(coordinates[0]);
      } else if (type === "MultiPolygon") {
        const coordinates = newGeometry.get("coordinates").toAny() as AnyGeoPoint[][][];
        for (let i = 0; i < coordinates.length; i += 1) {
          geometryView.append(MapPolygonView).points(coordinates[i][0]);
        }
      }
    }
    const centroid = newGeometry.get("centroid").toAny() as AnyGeoPoint | undefined;
    if (centroid !== void 0) {
      this._geoCentroid = GeoPoint.fromAny(centroid);
    }
  }

  protected didUpdateSubRegion(key: Value, newSubRegionStatus: Value): void {
    //console.log(this._nodeRef.nodeUri() + " didUpdateSubRegion " + key.toAny() + ":", newSubRegionStatus.toAny());
    const subRegionNodeUri = key.stringValue()!;
    let subRegionMapView = this.getChildView(subRegionNodeUri) as RegionMapView | null;
    if (subRegionMapView === null) {
      const subRegionNodeRef = this._nodeRef.nodeRef(subRegionNodeUri);
      subRegionMapView = new RegionMapView(subRegionNodeRef);
      subRegionMapView.didSetStatus(newSubRegionStatus, false);
      this.setChildView(subRegionNodeUri, subRegionMapView);
    } else {
      subRegionMapView.didSetStatus(newSubRegionStatus);
    }
  }

  protected didRemoveSubRegion(key: Value, oldSubRegionStatus: Value): void {
    //console.log(this._nodeRef.nodeUri() + " didRemoveSubRegion " + key.toAny() + ":", oldSubRegionStatus.toAny());
    const subRegionNodeUri = key.stringValue()!;
    this.removeChildView(subRegionNodeUri);
  }

  protected didUpdateSite(key: Value, newSiteStatus: Value): void {
    //console.log(this._nodeRef.nodeUri() + " didUpdateSite " + key.toAny() + ":", newSiteStatus.toAny());
    const siteNodeUri = key.stringValue()!;
    let siteMapView = this.getChildView(siteNodeUri) as SiteMapView | null;
    if (siteMapView === null) {
      const siteNodeRef = this._nodeRef.nodeRef(siteNodeUri);
      siteMapView = new SiteMapView(siteNodeRef);
      siteMapView.didSetStatus(newSiteStatus, false);
      this.setChildView(siteNodeUri, siteMapView);
    } else {
      siteMapView.didSetStatus(newSiteStatus);
    }
  }

  protected didRemoveSite(key: Value, oldSiteStatus: Value): void {
    //console.log(this._nodeRef.nodeUri() + " didRemoveSite " + key.toAny() + ":", oldSiteStatus.toAny());
    const siteNodeUri = key.stringValue()!;
    this.removeChildView(siteNodeUri);
  }

  protected onMount(): void {
    super.onMount();
    //this.linkStatus();
    this.linkGeometry();
  }

  protected onUnmount(): void {
    this.unlinkStatus();
    this.unlinkGeometry();
    this.unlinkSubRegions();
    this.unlinkSites();
    super.onUnmount();
  }

  protected didProject(viewContext: MapViewContext): void {
    const geometryView = this.getChildView("geometry") as MapGroupView | null;
    let geometryBounds: GeoBox;
    if (geometryView !== null) {
      geometryView.setHidden(viewContext.mapZoom >= this._maxZoom);
      geometryBounds = geometryView.geoBounds;
    } else {
      geometryBounds = viewContext.geoFrame;
    }
    this.setHidden(viewContext.mapZoom < this._minZoom);
    if (viewContext.mapZoom >= this._minSubRegionZoom && geometryBounds.intersects(viewContext.geoFrame)) {
      this.linkSubRegions();
    } else {
      this.unlinkSubRegions();
    }
    if (viewContext.mapZoom >= this._minSiteZoom && geometryBounds.intersects(viewContext.geoFrame)) {
      this.linkSites();
    } else {
      if (this._sitesLink !== null) {
        this.rootView!.dismissModals();
      }
      this.unlinkSites();
    }
    this._viewCentroid = viewContext.geoProjection.project(this._geoCentroid);
    if (viewContext.mapZoom >= this._maxZoom && this._popoverView !== null) {
      this.rootView!.dismissModal(this._popoverView);
      this._popoverView.setSource(null);
      this._popoverView = null;
    }
    super.didProject(viewContext);
  }

  get popoverFrame(): BoxR2 {
    const inversePageTransform = this.pageTransform.inverse();
    const centroid = this._viewCentroid;
    let [px, py] = inversePageTransform.transform(centroid.x, centroid.y);
    px = Math.round(px);
    py = Math.round(py);
    return new BoxR2(px, py, px, py);
  }

  protected onClick(event: MouseEvent): void {
    //console.log(this._nodeRef.nodeUri() + " onClick");
    event.stopPropagation();
    let popoverView = this._popoverView;
    if (popoverView === null) {
      popoverView = new RegionMapPopoverView(this._nodeRef);
      popoverView.setSource(this);
      popoverView.hideModal();
      popoverView.backgroundColor.didUpdate = function () {
        popoverView!.place();
      };
      this._popoverView = popoverView;
    }
    popoverView.backgroundColor(this._statusColor.darker(2).alpha(0.9));
    this.rootView!.toggleModal(popoverView, {multi: event.altKey});
  }

  protected linkStatus(): void {
    if (this._statusLink === null) {
      this._statusLink = this._nodeRef.downlinkValue()
          .laneUri("status")
          .didSet(this.didSetStatus.bind(this))
          .open();
    }
  }

  protected unlinkStatus(): void {
    if (this._statusLink !== null) {
      this._statusLink.close();
      this._statusLink = null;
    }
  }

  protected linkGeometry(): void {
    if (this._geometryLink === null) {
      this._geometryLink = this._nodeRef.downlinkValue()
          .laneUri("geometry")
          .didSet(this.didSetGeometry.bind(this))
          .open();
    }
  }

  protected unlinkGeometry(): void {
    if (this._geometryLink !== null) {
      this._geometryLink.close();
      this._geometryLink = null;
    }
  }

  protected linkSubRegions(): void {
    if (this._subRegionsLink === null) {
      this._subRegionsLink = this._nodeRef.downlinkMap()
          .laneUri("subRegions")
          .didUpdate(this.didUpdateSubRegion.bind(this))
          .didRemove(this.didRemoveSubRegion.bind(this))
          .open();
    }
  }

  protected unlinkSubRegions(): void {
    if (this._subRegionsLink !== null) {
      this._subRegionsLink.close();
      this._subRegionsLink = null;
      this._childViews.forEach(function (view: MapView): void {
        if (view instanceof RegionMapView) {
          view.remove();
        }
      }, this);
    }
  }

  protected linkSites(): void {
    if (this._sitesLink === null) {
      //console.log(this._nodeRef.nodeUri() + " linkSites");
      //this.tileOutlineColor("#cc0000");
      this._sitesLink = this._nodeRef.downlinkMap()
          .laneUri("sites")
          .didUpdate(this.didUpdateSite.bind(this))
          .didRemove(this.didRemoveSite.bind(this))
          .open();
    }
  }

  protected unlinkSites(): void {
    if (this._sitesLink !== null) {
      //console.log(this._nodeRef.nodeUri() + " unlinkSites");
      //this.tileOutlineColor(void 0);
      this._sitesLink.close();
      this._sitesLink = null;
      this._childViews.forEach(function (view: MapView): void {
        if (view instanceof SiteMapView) {
          view.remove();
        }
      }, this);
    }
  }
}
