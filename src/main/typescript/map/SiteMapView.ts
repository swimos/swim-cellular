import {Value} from "@swim/core";
import {NodeRef} from "@swim/mesh";
import {
  Color,
  ColorInterpolator,
  Ease,
  Tween,
  Transition,
} from "@swim/ui";
import {MapView, MapCircleView} from "@swim/map";
import {SiteMapPopoverView} from "./SiteMapPopoverView";

const INFO_COLOR = Color.parse("#44d7b6");
const WARN_COLOR = Color.parse("#f9f070");
const ALERT_COLOR = Color.parse("#f6511d");
const WARN_INTERPOLATOR = ColorInterpolator.between(INFO_COLOR, WARN_COLOR);
const ALERT_INTERPOLATOR = ColorInterpolator.between(WARN_COLOR, ALERT_COLOR);
const STATUS_TWEEN = Transition.duration<any>(500, Ease.cubicOut);

export class SiteMapView extends MapCircleView {
  /** @hidden */
  readonly _nodeRef: NodeRef;
  /** @hidden */
  _statusColor: Color;
  /** @hidden */
  _popoverView: SiteMapPopoverView | null;

  constructor(nodeRef: NodeRef) {
    super();
    this.onClick = this.onClick.bind(this);
    this.fill._inherit = null;
    this.stroke._inherit = null;
    this.strokeWidth._inherit = null;
    this._nodeRef = nodeRef;
    this._statusColor = INFO_COLOR;
    this._popoverView = null;
  }

  didSetStatus(newStatus: Value, tween: Tween<any> = STATUS_TWEEN): void {
    //console.log(this._nodeRef.nodeUri() + " didSetStatus:", newStatus.toAny());
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
      const ripple = new MapCircleView()
          .geoCenter(this.geoCenter.value)
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

  protected onMount(): void {
    super.onMount();
    this.on("click", this.onClick);
  }

  protected onUnmount(): void {
    this.off("click", this.onClick);
    super.onUnmount();
  }

  protected onClick(event: MouseEvent): void {
    //console.log(this._nodeRef.nodeUri() + " onClick");
    event.stopPropagation();
    let popoverView = this._popoverView;
    if (popoverView === null) {
      popoverView = new SiteMapPopoverView(this._nodeRef);
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
}
