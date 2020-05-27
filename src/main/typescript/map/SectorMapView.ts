import {Value} from "@swim/core";
import {NodeRef} from "@swim/mesh";
import {Angle, Ease, Transition, Tween, View} from "@swim/ui";
import {MapViewContext, MapArcView} from "@swim/maps";
import {SectorMapPopoverView} from "./SectorMapPopoverView";

const STATUS_TWEEN = Transition.duration<any>(500, Ease.cubicOut);

export class SectorMapView extends MapArcView {
  /** @hidden */
  readonly _nodeRef: NodeRef;
  /** @hidden */
  _status: Value;
  /** @hidden */
  _popoverView: SectorMapPopoverView | null;

  constructor(nodeRef: NodeRef) {
    super();
    this.onClick = this.onClick.bind(this);
    this._nodeRef = nodeRef;
    this._status = Value.absent();
    this._popoverView = null;
  }

  didSetStatus(newStatus: Value, tween: Tween<any> = STATUS_TWEEN): void {
    this._status = newStatus;
    if (this._popoverView !== null) {
      this._popoverView.backgroundColor(this.fill.value!.darker(2).alpha(0.9), tween);
    }
    this.requireUpdate(View.NeedsProject);
  }

  protected onMount(): void {
    super.onMount();
    this.on("click", this.onClick);
  }

  protected onUnmount(): void {
    super.onUnmount();
    this.off("click", this.onClick);
  }

  onProject(viewContext: MapViewContext): void {
    super.onProject(viewContext);
    const index = this.parentView!.childViews.indexOf(this);
    const azimuth = this._status.get("azimuth").numberValue()!;
    const sweep = this._status.get("sweep").numberValue()!;
    this.startAngle(Angle.deg(azimuth - sweep / 2 - viewContext.mapHeading))
        .sweepAngle(Angle.deg(sweep))
        .innerRadius(6 + 6 * index)
        .outerRadius(6 + 6 * index + 4);
  }

  protected onClick(event: MouseEvent): void {
    //console.log(this._nodeRef.nodeUri() + " onClick");
    event.stopPropagation();
    let popoverView = this._popoverView;
    if (popoverView === null) {
      popoverView = new SectorMapPopoverView(this._nodeRef);
      popoverView.setSource(this);
      popoverView.hideModal();
      popoverView.backgroundColor.didUpdate = function () {
        popoverView!.place();
      };
      this._popoverView = popoverView;
    }
    popoverView.backgroundColor(this.fill.value!.darker(2).alpha(0.9));
    this.rootView!.toggleModal(popoverView, {multi: event.altKey});
  }
}
