import {Value} from "@swim/core";
import {NodeRef} from "@swim/mesh";
import {
  AnyLength,
  Length,
  AnyColor,
  Color,
  ColorInterpolator,
  Ease,
  Transition,
  MemberAnimator,
} from "@swim/ui";
import {MapView, MapCircleView} from "@swim/map";

const INFO_COLOR = Color.parse("#44d7b6");
const WARN_COLOR = Color.parse("#f9f070");
const ALERT_COLOR = Color.parse("#f6511d");
const WARN_INTERPOLATOR = ColorInterpolator.between(INFO_COLOR, WARN_COLOR);
const ALERT_INTERPOLATOR = ColorInterpolator.between(WARN_COLOR, ALERT_COLOR);
const STATUS_TWEEN = Transition.duration<any>(500, Ease.cubicOut);

export class SiteMapView extends MapCircleView {
  /** @hidden */
  readonly _nodeRef: NodeRef;

  constructor(nodeRef: NodeRef) {
    super();
    this._nodeRef = nodeRef;
  }

  @MemberAnimator(Color)
  fill: MemberAnimator<this, Color, AnyColor>;

  @MemberAnimator(Color)
  stroke: MemberAnimator<this, Color, AnyColor>;

  @MemberAnimator(Color)
  strokeWidth: MemberAnimator<this, Length, AnyLength>;

  onSetStatus(newStatus: Value): void {
    //console.log(this._nodeRef.nodeUri() + " onSetStatus:", newStatus.toAny());
    const severity = newStatus.get("severity").numberValue(0);
    if (severity === 0) {
      this.fill(INFO_COLOR, STATUS_TWEEN);
    } else if (severity <= 1) {
      const color = WARN_INTERPOLATOR.interpolate(severity);
      this.fill(color, STATUS_TWEEN);
      this.ripple(color, 1, 2500);
    } else {
      const color = ALERT_INTERPOLATOR.interpolate(severity - 1);
      this.fill(color, STATUS_TWEEN);
      this.ripple(color, 2, 5000);
    }
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
