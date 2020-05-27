import {Item, Value, Record, DateTime} from "@swim/core";
import {ValueDownlink, MapDownlink, NodeRef} from "@swim/mesh";
import {Color, BoxShadow, ViewMouseEvent, HtmlView, TextRunView} from "@swim/ui";
import {PopoverView} from "@swim/ux";
import {ChartView, LineGraphView, DatumView} from "@swim/vis";

export class SiteMapPopoverView extends PopoverView {
  /** @hidden */
  readonly _nodeRef: NodeRef;
  /** @hidden */
  _titleView: HtmlView;
  /** @hidden */
  _kpisTable: HtmlView;
  /** @hidden */
  _historyChart: ChartView;
  /** @hidden */
  _statusTable: HtmlView;
  /** @hidden */
  _infoTable: HtmlView;
  /** @hidden */
  _infoLink: ValueDownlink<Value> | null;
  /** @hidden */
  _statusLink: ValueDownlink<Value> | null;
  /** @hidden */
  _kpisLink: ValueDownlink<Value> | null;
  /** @hidden */
  _historyLink: MapDownlink<Value, Value> | null;

  constructor(nodeRef: NodeRef) {
    super();
    this._nodeRef = nodeRef;
    this._infoLink = null;
    this._statusLink = null;
    this._kpisLink = null;
    this._historyLink = null;
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
        .text("KPIs");
    this._kpisTable = content.append("table")
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
        .text("History");
    const historyContainer = content.append("div")
        .position("relative")
        .height(120)
        .marginBottom(16);
    const historyCanvas = historyContainer.append("canvas");
    this._historyChart = new ChartView()
        .bottomAxis("time")
        .leftAxis("linear")
        .topGutter(8)
        .leftGutter(32)
        .rightGutter(32)
        .leftDomainPadding([0.1, 0.1])
        .bottomGesture(true)
        .domainColor("#cccccc")
        .tickMarkColor("#cccccc")
        .font("12px sans-serif")
        .textColor("#cccccc");
    historyCanvas.append(this._historyChart);

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
    this._titleView.text(newInfo.get("node").stringValue(null));
    newInfo.forEach(function (item: Item): void {
      const key = item.key.stringValue(void 0);
      if (key !== void 0 && key !== "node" && key !== "coordinates") {
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

  didSetKpis(newKpis: Value): void {
    //console.log(this._nodeRef.nodeUri() + " didSetKpis:", newKpis.toAny());
    newKpis.forEach(function (item: Item): void {
      const key = item.key.stringValue(void 0);
      if (key !== void 0) {
        let tableRow = this._kpisTable.getChildView(key) as HtmlView | null;
        let valueCell: HtmlView;
        if (tableRow === null) {
          tableRow = this._kpisTable.append("tr", key)
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

  didUpdateHistory(key: Value, newSample: Value): void {
    //console.log(this._nodeRef.nodeUri() + " didUpdateHistory " + key.toAny() + ":", newSample.toAny());
    const t = new DateTime(key.numberValue(0));
    newSample.forEach(function (item: Item): void {
      const key = item.key.stringValue(void 0);
      const value = item.numberValue(void 0);
      if (key !== void 0 && key !== "recorded_time" && value !== void 0) {
        let historyPlot = this._historyChart.getChildView(key) as LineGraphView<DateTime, number> | null;
        if (historyPlot === null) {
          historyPlot = new LineGraphView<DateTime, number>()
              .hitMode("data")
              .stroke("#ffffff")
              .strokeWidth(2)
              .on("mouseover", function (event: ViewMouseEvent): void {
                const datum = event.targetView as DatumView<DateTime, number>;
                const y = datum.y.value!;
                datum.label(TextRunView.fromAny({
                  text: y.toFixed(2) + "  " + key,
                }));
              })
              .on("mouseout", function (event: ViewMouseEvent): void {
                const datum = event.targetView as DatumView<DateTime, number>;
                datum.label(null);
              });
          this._historyChart.setChildView(key, historyPlot);
        }
        historyPlot.insertDatum({x: t, y: value});

        const futureKey = key + "-future";
        let futurePlot = this._historyChart.getChildView(futureKey) as LineGraphView<DateTime, number> | null;
        if (futurePlot === null) {
          futurePlot = new LineGraphView<DateTime, number>()
              .hitMode("data")
              .stroke("#ffffff")
              .strokeWidth(2);
          this._historyChart.setChildView(futureKey, futurePlot);
        }
        futurePlot.removeAll();
        const prevDatum = historyPlot._data.previousValue(t);
        if (prevDatum !== void 0) {
          futurePlot.insertDatum({x: t, y: value, opacity: 1});
          const nextValue = (prevDatum.y.value! + value) / 2;
          futurePlot.insertDatum({x: new DateTime(t.time() + 60000), y: nextValue, opacity: 0});
        }
      }
    }, this);
  }

  didRemoveHistory(key: Value, oldSample: Value): void {
    //console.log(this._nodeRef.nodeUri() + " didRemoveHistory " + key.toAny());
    const t = new DateTime(key.numberValue(0));
    oldSample.forEach(function (item: Item): void {
      const key = item.key.stringValue(void 0);
      const value = item.numberValue(void 0);
      if (key !== void 0 && key !== "recorded_time" && value !== void 0) {
        let historyPlot = this._historyChart.getChildView(key) as LineGraphView<DateTime, number> | null;
        if (historyPlot !== null) {
          historyPlot.removeDatum(t);
        }
      }
    }, this);
  }

  protected onMount(): void {
    super.onMount();
    this.linkInfo();
    this.linkStatus();
    this.linkKpis();
    this.linkHistory();
  }

  protected onUnmount(): void {
    this.unlinkInfo();
    this.unlinkStatus();
    this.unlinkKpis();
    this.unlinkHistory();
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

  protected linkKpis(): void {
    if (this._kpisLink === null) {
      this._kpisLink = this._nodeRef.downlinkValue()
          .laneUri("kpis")
          .didSet(this.didSetKpis.bind(this))
          .open();
    }
  }

  protected unlinkKpis(): void {
    if (this._kpisLink !== null) {
      this._kpisLink.close();
      this._kpisLink = null;
    }
  }

  protected linkHistory(): void {
    if (this._historyLink === null) {
      this._historyLink = this._nodeRef.downlinkMap()
          .laneUri("trueCallHistory")
          .didUpdate(this.didUpdateHistory.bind(this))
          .didRemove(this.didRemoveHistory.bind(this))
          .open();
    }
  }

  protected unlinkHistory(): void {
    if (this._historyLink !== null) {
      this._historyLink.close();
      this._historyLink = null;
    }
  }
}
