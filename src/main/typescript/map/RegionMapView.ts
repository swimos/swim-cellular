import {Value} from "@swim/core";
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
  Transition,
  View,
  MemberAnimator,
  FillView,
  StrokeView,
} from "@swim/ui";
import {
  AnyGeoPoint,
  GeoBox,
  MapViewContext,
  MapView,
  MapLayerView,
  MapGroupView,
  MapPolygonView,
} from "@swim/maps";
import {SiteMapView} from "./SiteMapView";

const INFO_COLOR = Color.parse("#44d7b6").alpha(0.1);
const WARN_COLOR = Color.parse("#f9f070").alpha(0.25);
const ALERT_COLOR = Color.parse("#f6511d").alpha(0.5);
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
  _statusLink: ValueDownlink<Value> | null;
  /** @hidden */
  _geometryLink: ValueDownlink<Value> | null;
  /** @hidden */
  _subRegionsLink: MapDownlink<Value, Value> | null;
  /** @hidden */
  _sitesLink: MapDownlink<Value, Value> | null;

  constructor(nodeRef: NodeRef) {
    super();
    this._nodeRef = nodeRef;
    this._minZoom = -Infinity;
    this._maxZoom = Infinity;
    this._minSubRegionZoom = Infinity;
    this._minSiteZoom = Infinity;
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

  onSetStatus(newStatus: Value): void {
    //console.log(this._nodeRef.nodeUri() + " onSetStatus: " + newStatus);
    const siteCount = newStatus.get("siteCount").numberValue(0);
    const warnCount = newStatus.get("warnCount").numberValue(0);
    const alertCount = newStatus.get("alertCount").numberValue(0);
    const warnRatio = warnCount / siteCount;
    const alertRatio = alertCount / siteCount;
    if (alertRatio > 0.015) {
      const u = Math.min((1 / 0.015) * (alertRatio - 0.015), 1);
      const color = ALERT_INTERPOLATOR.interpolate(u);
      this.fill(color.alpha(0.25 + 0.25 * u), STATUS_TWEEN)
          .stroke(color.alpha(0.5 + 0.25 * u), STATUS_TWEEN)
          .strokeWidth(1 + u, STATUS_TWEEN);
    } else if (warnRatio > 0.15) {
      const u = Math.min((1 / 0.15) * (warnRatio - 0.15), 1);
      const color = WARN_INTERPOLATOR.interpolate(u);
      this.fill(color.alpha(0.1 + 0.15 * u), STATUS_TWEEN)
          .stroke(color.alpha(0.2 + 0.3 * u), STATUS_TWEEN)
          .strokeWidth(1, STATUS_TWEEN);
    } else {
      this.fill(INFO_COLOR.alpha(0.1), STATUS_TWEEN)
          .stroke(INFO_COLOR.alpha(0.2), STATUS_TWEEN)
          .strokeWidth(1, STATUS_TWEEN);
    }
  }

  protected onSetGeometry(newGeometry: Value): void {
    //console.log(this._nodeRef.nodeUri() + " onSetGeometry:", newGeometry.toAny());
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
  }

  protected onUpdateSubRegion(key: Value, newSubRegionStatus: Value): void {
    //console.log(this._nodeRef.nodeUri() + " onUpdateSubRegion " + key.toAny() + ":", newSubRegionStatus.toAny());
    const subRegionNodeUri = key.stringValue()!;
    let subRegionMapView = this.getChildView(subRegionNodeUri) as RegionMapView | null;
    if (subRegionMapView === null) {
      const subRegionNodeRef = this._nodeRef.nodeRef(subRegionNodeUri);
      subRegionMapView = new RegionMapView(subRegionNodeRef);
      this.setChildView(subRegionNodeUri, subRegionMapView);
    }
    subRegionMapView.onSetStatus(newSubRegionStatus);
  }

  protected onRemoveSubRegion(key: Value, oldSubRegionStatus: Value): void {
    //console.log(this._nodeRef.nodeUri() + " onUpdateSubRegion " + key.toAny() + ":", oldSubRegionStatus.toAny());
    const subRegionNodeUri = key.stringValue()!;
    this.removeChildView(subRegionNodeUri);
  }

  protected onUpdateSite(key: Value, newSiteStatus: Value): void {
    //console.log(this._nodeRef.nodeUri() + " onUpdateSite " + key.toAny() + ":", newSiteStatus.toAny());
    const siteNodeUri = key.stringValue()!;
    let siteMapView = this.getChildView(siteNodeUri) as SiteMapView | null;
    if (siteMapView === null) {
      const siteNodeRef = this._nodeRef.nodeRef(siteNodeUri);
      const coordinates = newSiteStatus.get("coordinates").toAny() as AnyGeoPoint;
      siteMapView = new SiteMapView(siteNodeRef)
          .geoCenter(coordinates)
          .radius(4)
          .fill(this.fill.value!.alpha(1));
      this.setChildView(siteNodeUri, siteMapView);
    }
    siteMapView.onSetStatus(newSiteStatus);
  }

  protected onRemoveSite(key: Value, oldSiteStatus: Value): void {
    //console.log(this._nodeRef.nodeUri() + " onRemoveSite " + key.toAny() + ":", oldSiteStatus.toAny());
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
      this.unlinkSites();
    }
    super.didProject(viewContext);
  }

  protected linkStatus(): void {
    if (this._statusLink === null) {
      this._statusLink = this._nodeRef.downlinkValue()
          .laneUri("status")
          .didSet(this.onSetStatus.bind(this))
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
          .didSet(this.onSetGeometry.bind(this))
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
          .didUpdate(this.onUpdateSubRegion.bind(this))
          .didRemove(this.onRemoveSubRegion.bind(this))
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
          .didUpdate(this.onUpdateSite.bind(this))
          .didRemove(this.onRemoveSite.bind(this))
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
