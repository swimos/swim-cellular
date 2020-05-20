import {Item, Value, Record} from "@swim/core";
import {ValueDownlink, MapDownlink, NodeRef} from "@swim/mesh";
import {Color, BoxShadow, HtmlView} from "@swim/ui";
import {PopoverView} from "@swim/ux";
import {AnyGeoPoint, GeoPoint, MapboxView} from "@swim/maps";

export class RegionMapPopoverView extends PopoverView {
  /** @hidden */
  readonly _nodeRef: NodeRef;
  /** @hidden */
  _titleView: HtmlView;
  /** @hidden */
  _infoTable: HtmlView;
  /** @hidden */
  _statusTable: HtmlView;
  /** @hidden */
  _alertsTable: HtmlView;
  /** @hidden */
  _infoLink: ValueDownlink<Value> | null;
  /** @hidden */
  _statusLink: ValueDownlink<Value> | null;
  /** @hidden */
  _alertsLink: MapDownlink<Value, Value> | null;

  constructor(nodeRef: NodeRef) {
    super();
    this._nodeRef = nodeRef;
    this._infoLink = null;
    this._statusLink = null;
    this._alertsLink = null;
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
        .fontWeight("500");

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
        .fontSize(16);

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
        .fontSize(16);

    content.append("div")
        .marginRight(16)
        .marginLeft(16)
        .fontSize(16)
        .fontWeight("bold")
        .text("Alerts");
    this._alertsTable = content.append("table")
        .width("100%")
        .marginBottom(16)
        .paddingRight(16)
        .paddingLeft(16)
        .fontSize(16);
  }

  didSetInfo(newInfo: Value): void {
    //console.log(this._nodeRef.nodeUri() + " didSetInfo:", newInfo.toAny());
    this._titleView.text(newInfo.get("name").stringValue(null));
    newInfo.forEach(function (item: Item): void {
      const key = item.key.stringValue(void 0);
      if (key !== void 0 && key !== "name") {
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
      if (key !== void 0) {
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

  didUpdateAlert(key: Value, newAlert: Value): void {
    const siteNodeUri = key.stringValue(void 0);
    //console.log(this._nodeRef.nodeUri() + " didUpdateAlert " + siteNodeUri + ":", newAlert.toAny());
    if (siteNodeUri !== void 0) {
      let tableRow = this._alertsTable.getChildView(siteNodeUri) as HtmlView | null;
      let valueCell: HtmlView;
      if (tableRow === null) {
        tableRow = this._alertsTable.append("tr", siteNodeUri)
            .color("#cccccc");
        const coordinates = newAlert.get("coordinates").toAny() as AnyGeoPoint | undefined;
        if (coordinates !== void 0) {
          tableRow.cursor("pointer");
          tableRow.on("click", this.onAlertClick.bind(this, siteNodeUri, GeoPoint.fromAny(coordinates)));
        }
        tableRow.append("th", "key")
            .width("50%")
            .padding([2, 4, 2, 0])
            .textAlign("left")
            .text(siteNodeUri);
        valueCell = tableRow.append("td", "value")
            .width("50%")
            .padding([2, 0, 2, 4]);
      } else {
        valueCell = tableRow.getChildView("value") as HtmlView;
      }
      if (newAlert instanceof Record) {
        const value = newAlert.deleted("coordinates");
        if (value.length === 1 && value.get("severity").isDefined()) {
          valueCell.text(value.get("severity").numberValue(0).toFixed(2));
        } else {
          valueCell.text(JSON.stringify(value.toAny()));
        }
      } else {
        valueCell.text(newAlert.stringValue(null));
      }
    }
  }

  didRemoveAlert(key: Value, oldAlert: Value): void {
    const siteNodeUri = key.stringValue(void 0);
    //console.log(this._nodeRef.nodeUri() + " didRemoveAlert " + siteNodeUri);
    if (siteNodeUri !== void 0) {
      this._alertsTable.removeChildView(siteNodeUri);
    }
  }

  protected onAlertClick(siteNodeUri: string, geoPoint: GeoPoint, event: MouseEvent): void {
    //console.log(this._nodeRef.nodeUri() + " onAlertClick " + siteNodeUri);
    const mapboxView = this.mapboxView;
    if (mapboxView !== null) {
      mapboxView.map.flyTo({
        center: geoPoint.toAny(),
        zoom: 12,
      });
    }
  }

  get mapboxView(): MapboxView | null {
    let view = this.source;
    while (view !== null) {
      if (view instanceof MapboxView) {
        return view;
      }
      view = view.parentView;
    }
    return null;
  }

  protected didHide(): void {
    super.didHide();
    this.remove();
  }

  protected onMount(): void {
    super.onMount();
    this.linkInfo();
    this.linkStatus();
    this.linkAlerts();
  }

  protected onUnmount(): void {
    this.unlinkInfo();
    this.unlinkStatus();
    this.unlinkAlerts();
    super.onUnmount();
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

  protected linkAlerts(): void {
    if (this._alertsLink === null) {
      this._alertsLink = this._nodeRef.downlinkMap()
          .laneUri("alerts")
          .didUpdate(this.didUpdateAlert.bind(this))
          .didRemove(this.didRemoveAlert.bind(this))
          .open();
    }
  }

  protected unlinkAlerts(): void {
    if (this._alertsLink !== null) {
      this._alertsLink.close();
      this._alertsLink = null;
    }
  }
}
