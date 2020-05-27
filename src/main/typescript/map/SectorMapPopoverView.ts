import {Item, Value, Record} from "@swim/core";
import {ValueDownlink, NodeRef} from "@swim/mesh";
import {Color, BoxShadow, HtmlView} from "@swim/ui";
import {PopoverView} from "@swim/ux";

export class SectorMapPopoverView extends PopoverView {
  /** @hidden */
  readonly _nodeRef: NodeRef;
  /** @hidden */
  _titleView: HtmlView;
  /** @hidden */
  _statusTable: HtmlView;
  /** @hidden */
  _infoTable: HtmlView;
  /** @hidden */
  _infoLink: ValueDownlink<Value> | null;
  /** @hidden */
  _statusLink: ValueDownlink<Value> | null;

  constructor(nodeRef: NodeRef) {
    super();
    this._nodeRef = nodeRef;
    this._infoLink = null;
    this._statusLink = null;
    this.initPopover();
  }

  protected initPopover(): void {
    this.width(320)
        .height(480)
        .borderRadius(16)
        .boxShadow(BoxShadow.of(0, 2, 4, 0, Color.rgb(0, 0, 0, 0.5)))
        .backgroundColor(Color.parse("#1e2022").alpha(0.9));

    const content = this.append("div")
        .height("100%")
        .overflowY("auto")
        .color("#ffffff");

    this._titleView = content.append("div")
        .marginTop(16)
        .marginRight(16)
        .marginBottom(16)
        .marginLeft(16)
        .fontSize(20)
        .fontWeight("500")
        .text(this._nodeRef.nodeUri().toString());

    content.append("div")
        .marginRight(16)
        .marginLeft(16)
        .fontSize(16)
        .fontWeight("bold")
        .text("Status");
    this._statusTable = content.append("table")
        .width("100%")
        .marginBottom(16)
        .paddingRight(16)
        .paddingLeft(16)
        .fontSize(14);

    content.append("div")
        .marginRight(16)
        .marginLeft(16)
        .fontSize(16)
        .fontWeight("bold")
        .text("Info");
    this._infoTable = content.append("table")
        .width("100%")
        .marginBottom(16)
        .paddingRight(16)
        .paddingLeft(16)
        .fontSize(14);
  }

  didSetInfo(newInfo: Value): void {
    //console.log(this._nodeRef.nodeUri() + " didSetInfo:", newInfo.toAny());
    newInfo.forEach(function (item: Item): void {
      const key = item.key.stringValue(void 0);
      if (key !== void 0) {
        let tableRow = this._infoTable.getChildView(key) as HtmlView | null;
        let valueCell: HtmlView;
        if (tableRow === null) {
          tableRow = this._infoTable.append("tr", key)
              .color("#cccccc");
          tableRow.append("th", "key")
              .width("50%")
              .padding([2, 4, 2, 0])
              .textAlign("left")
              .text(key);
          valueCell = tableRow.append("td", "value")
              .width("50%")
              .padding([2, 0, 2, 4]);
        } else {
          valueCell = tableRow.getChildView("value") as HtmlView;
        }
        const value = item.toValue();
        if (value instanceof Record) {
          valueCell.text(JSON.stringify(value.toAny()));
        } else {
          valueCell.text(value.stringValue(null));
        }
      }
    }, this);
  }

  didSetStatus(newStatus: Value): void {
    //console.log(this._nodeRef.nodeUri() + " didSetStatus:", newStatus.toAny());
    newStatus.forEach(function (item: Item): void {
      const key = item.key.stringValue(void 0);
      if (key !== void 0 && key !== "coordinates") {
        let tableRow = this._statusTable.getChildView(key) as HtmlView | null;
        let valueCell: HtmlView;
        if (tableRow === null) {
          tableRow = this._statusTable.append("tr", key)
              .color("#cccccc");
          tableRow.append("th", "key")
              .width("50%")
              .padding([2, 4, 2, 0])
              .textAlign("left")
              .text(key);
          valueCell = tableRow.append("td", "value")
              .width("50%")
              .padding([2, 0, 2, 4]);
        } else {
          valueCell = tableRow.getChildView("value") as HtmlView;
        }
        const value = item.toValue();
        if (value instanceof Record) {
          valueCell.text(JSON.stringify(value.toAny()));
        } else {
          valueCell.text(value.stringValue(null));
        }
      }
    }, this);
  }

  protected onMount(): void {
    super.onMount();
    this.linkInfo();
    this.linkStatus();
  }

  protected onUnmount(): void {
    this.unlinkInfo();
    this.unlinkStatus();
    super.onUnmount();
  }

  protected didHide(): void {
    super.didHide();
    this.remove();
  }

  protected linkInfo(): void {
    if (this._infoLink === null) {
      this._infoLink = this._nodeRef.downlinkValue()
          .laneUri("info")
          .didSet(this.didSetInfo.bind(this))
          .open();
    }
  }

  protected unlinkInfo(): void {
    if (this._infoLink !== null) {
      this._infoLink.close();
      this._infoLink = null;
    }
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
}
