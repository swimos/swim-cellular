(function () {
  const COUNTRY_URI = swim.Uri.parse("/country/US");

  const SUB_REGIONS_URI = swim.Uri.parse("subRegions");

  const SITES_URI = swim.Uri.parse("sites");

  const STATUS_URI = swim.Uri.parse("status");

  const ALERTS_URI = swim.Uri.parse("alerts");

  const GEOMETRY_URI = swim.Uri.parse("geometry");

  const KPIS_URI = swim.Uri.parse("kpis");

  const INFO_URI = swim.Uri.parse("info");

  const RAN_HISTORY_URI = swim.Uri.parse("ranHistory");

  const MIN_SITE_ZOOM = 8;

  const cellTowerIcon = swim.VectorIcon.create(24, 24, "M15.4,14.1L15.4,14.1L15.4,14.1L12.7,4L11.3,4L8.6,14.1L7,20L9.1,20L12,17.3L14.9,20L17,20L15.4,14.1ZM9.9,15.3L10.9,16.3L9.1,18.1L9.9,15.3ZM14.2,15.3L14.9,18.1L13.1,16.3L14.2,15.3ZM10.3,13.7L11,10.9L13,10.9L13.8,13.7L12,15.3L10.3,13.7Z");
  const cellTowerIconSize = 24;

  const subscriberIcon = swim.VectorIcon.create(24, 24, "M15,4C16.1,4,17,4.9,17,6L17,18C17,19.1,16.1,20,15,20L9,20C7.9,20,7,19.1,7,18L7,6C7,4.9,7.9,4,9,4L15,4ZM12,17.5C11.4,17.5,11,17.9,11,18.5C11,19.1,11.4,19.5,12,19.5C12.6,19.5,13,19.1,13,18.5C13,17.9,12.6,17.5,12,17.5ZM15,7L9,7L9,17L15,17L15,7ZM13.5,5L10.5,5C10.2,5,10,5.2,10,5.5C10,5.7,10.2,5.9,10.4,6L10.5,6L13.5,6C13.8,6,14,5.8,14,5.5C14,5.3,13.8,5.1,13.6,5L13.5,5Z");
  const subscriberIconSize = 24;

  class CellularSiteKpiHistoryDownlink extends swim.MapDownlinkTrait {
    constructor(kpiModel, nodeUri, laneUri, propKey) {
      super();
      this.kpiModel = kpiModel;
      this.propKey = propKey;
      this.downlink.nodeUri(nodeUri).laneUri(laneUri);
    }
    downlinkDidUpdate(key, value) {
      const t = key.numberValue(void 0);
      const v = value.get(this.propKey).numberValue(void 0);
      if (t !== void 0 && v !== void 0) {
        const dataPointModel = new swim.GenericModel();
        const dataPointTrait = new swim.DataPointTrait();
        dataPointTrait.x.setState(new swim.DateTime(t));
        dataPointTrait.y.setState(v);
        dataPointModel.setTrait("dataPoint", dataPointTrait);
        this.kpiModel.appendChild(dataPointModel, "" + t);
      }
    }
  }

  class CellularSiteKpisDownlink extends swim.ValueDownlinkTrait {
    constructor(tableModel, nodeUri, laneUri) {
      super();
      this.tableModel = tableModel;
      this.downlink.nodeUri(nodeUri).laneUri(laneUri);
    }
    downlinkDidSet(value) {
      value.forEach((item) => {
        const key = item.key.stringValue(void 0);
        if (key !== void 0) {
          let displayKey = key;
          if (key === "avg_mean_ul_sinr") {
            displayKey = "Avg Mean Sinr"
          } else if (key == "sum_rrc_re_establishment_failures") {
            displayKey = "Sum Reconnect Failures"
          } else if (key == "count") {
            displayKey = "Samples Received"
          } else if (key == "severity") {
            displayKey = "Severity Level"
          }
          const rowModel = this.getOrCreateRowModel(displayKey);
          const valueCell = rowModel.getTrait("value");

          if (key == "severity") {
            valueCell.content.setState(item.toValue().numberValue(0).toFixed(2) + "");
          } else {
            valueCell.content.setState(item.toValue().stringValue(""));
          }

        }
      });
    }
    updateRowModel(key, value) {
      const rowModel = this.getOrCreateRowModel(key, value);
      const valueCell = rowModel.getTrait("value");
      valueCell.content.setState(value);
      return rowModel;
    }
    getOrCreateRowModel(key, value) {
      let rowModel = this.tableModel.getChild(key);
      if (rowModel === null) {
        rowModel = this.createRowModel(key);
        this.appendChild(rowModel, key);
      }
      return rowModel;
    }
    createRowModel(key) {
      const rowModel = new swim.GenericModel();
      const rowTrait = new swim.RowTrait();
      const keyCell = new swim.TextCellTrait();
      keyCell.content.setState(key);
      const valueCell = new swim.TextCellTrait();
      rowModel.setTrait("row", rowTrait);
      rowModel.setTrait("key", keyCell);
      rowModel.setTrait("value", valueCell);
      rowModel.setTrait("status", new swim.StatusTrait());
      return rowModel;
    }
  }

class CellularSiteInfoDownlink extends swim.ValueDownlinkTrait {
    constructor(tableModel, nodeUri, laneUri) {
      super();
      this.tableModel = tableModel;
      this.downlink.nodeUri(nodeUri).laneUri(laneUri);
    }
    downlinkDidSet(value) {
      value.forEach((item) => {
        const key = item.key.stringValue(void 0);
        if (key !== void 0 & key !== "coordinates") {
          let displayKey = key;
          const rowModel = this.getOrCreateRowModel(displayKey);
          const valueCell = rowModel.getTrait("value");
          const value = item.toValue().stringValue("");
          valueCell.content.setState(value);
        }
      });
    }
    updateRowModel(key, value) {
      const rowModel = this.getOrCreateRowModel(key, value);
      const valueCell = rowModel.getTrait("value");
      valueCell.content.setState(value);
      return rowModel;
    }
    getOrCreateRowModel(key, value) {
      let rowModel = this.tableModel.getChild(key);
      if (rowModel === null) {
        rowModel = this.createRowModel(key);
        this.appendChild(rowModel, key);
      }
      return rowModel;
    }
    createRowModel(key) {
      const rowModel = new swim.GenericModel();
      const rowTrait = new swim.RowTrait();
      const keyCell = new swim.TextCellTrait();
      keyCell.content.setState(key);
      const valueCell = new swim.TextCellTrait();
      rowModel.setTrait("row", rowTrait);
      rowModel.setTrait("key", keyCell);
      rowModel.setTrait("value", valueCell);
      rowModel.setTrait("status", new swim.StatusTrait());
      return rowModel;
    }
  }

  class CellularSiteGroup extends swim.DownlinkNodeGroup {
    constructor(nodeUri, laneUri, metaHostUri) {
      super(metaHostUri);
      this.downlink.nodeUri(nodeUri).laneUri(laneUri);
    }
    initNodeModel(nodeModel) {
      const entityTrait = nodeModel.getTrait(swim.EntityTrait);
      //console.log("CellularSiteGroup.initNodeModel " + entityTrait.uri);
      entityTrait.icon.setState(cellTowerIcon);

      const statusTrait = nodeModel.getTrait(swim.StatusTrait);
      statusTrait.setStatusFactor("operational", swim.StatusFactor.create("Operational", swim.StatusVector.of([swim.Status.normal, 1])));

      const locationTrait = new swim.LocationTrait();
      nodeModel.setTrait("location", locationTrait);

      const widgetGroup = new swim.WidgetGroup();
      entityTrait.setTrait("widgets", widgetGroup);

      const kpiWidget = this.createKpiWidget(entityTrait);
      entityTrait.appendChild(kpiWidget, "kpi");

      const kpiHistory1Widget = this.createKpiHistoryWidget(entityTrait, "sinrHistory", "Sinr History", "sinr", "mean_ul_sinr");
      entityTrait.appendChild(kpiHistory1Widget, "kpi1History");

      const kpiHistory2Widget = this.createKpiHistoryWidget(entityTrait, "rrcHistory", "Reconnect Failure History", "rrc", "rrc_re_establishment_failures");
      entityTrait.appendChild(kpiHistory2Widget, "kpi2History");

      const infoWidget = this.createInfoWidget(entityTrait);
      entityTrait.appendChild(infoWidget, "info");

    }
    updateNodeModel(nodeModel, value) {
      const entityTrait = nodeModel.getTrait(swim.EntityTrait);
      //console.log("CellularSiteGroup.updateNodeModel " + entityTrait.uri + ":", value.toAny());

      entityTrait.aggregateStatus = function (statusVector) {}; // don't aggregate subentity status

      const locationTrait = nodeModel.getTrait(swim.LocationTrait);

      const coordinates = value.get("coordinates");
      const lng = coordinates.getItem(0).numberValue(NaN);
      const lat = coordinates.getItem(1).numberValue(NaN);
      if (isFinite(lng) && isFinite(lat)) {
        const geographic = swim.GeographicPoint.fromInit({
          geometry: new swim.GeoPoint(lng, lat),
          width: cellTowerIconSize,
          height: cellTowerIconSize,
          graphics: cellTowerIcon,
        });
        locationTrait.setGeographic(geographic);
      } else {
        locationTrait.setGeographic(null);
      }

      const kpiHistory1Widget = entityTrait.getChild("kpi1History");
      const kpiHistory1Model = kpiHistory1Widget.getChild("sinrHistory");

      const kpi1PlotModel = kpiHistory1Model.getChild("sinr");
      const kpi1StatusTrait = kpi1PlotModel.getTrait(swim.StatusTrait);

      const kpiHistory2Widget = entityTrait.getChild("kpi2History");
      const kpiHistory2Model = kpiHistory2Widget.getChild("rrcHistory");

      const kpi2PlotModel = kpiHistory2Model.getChild("rrc");
      const kpi2StatusTrait = kpi2PlotModel.getTrait(swim.StatusTrait);


      const statusTrait = nodeModel.getTrait(swim.StatusTrait);
      const severity = value.get("severity").numberValue(0);
      if (severity > 1) {
        statusTrait.setStatusFactor("site", swim.StatusFactor.create("Site", swim.StatusVector.of([swim.Status.alert, severity - 1])));
        kpi1StatusTrait.setStatusFactor("site", swim.StatusFactor.create("Site", swim.StatusVector.of([swim.Status.alert, severity - 1])));
        kpi2StatusTrait.setStatusFactor("site", swim.StatusFactor.create("Site", swim.StatusVector.of([swim.Status.alert, severity - 1])));
      } else if (severity > 0) {
        statusTrait.setStatusFactor("site", swim.StatusFactor.create("Site", swim.StatusVector.of([swim.Status.warning, severity])));
        kpi1StatusTrait.setStatusFactor("site", swim.StatusFactor.create("Site", swim.StatusVector.of([swim.Status.warning, severity])));
        kpi2StatusTrait.setStatusFactor("site", swim.StatusFactor.create("Site", swim.StatusVector.of([swim.Status.warning, severity])));
      } else {
        statusTrait.setStatusFactor("site", null);
        kpi1StatusTrait.setStatusFactor("site", null);
        kpi2StatusTrait.setStatusFactor("site", null);
      }
    }
    createKpiWidget(entityTrait, propKey) {
      const widgetModel = new swim.GenericModel();
      const widgetTrait = new swim.WidgetTrait();
      widgetTrait.subtitle.setState(entityTrait.title.state.toUpperCase());
      widgetModel.setTrait("widget", widgetTrait);
      widgetTrait.title.setState("KPIs");

      const tableModel = this.createKpiTable(entityTrait, propKey);
      widgetModel.appendChild(tableModel, "table");

      return widgetModel;
    }
    createKpiTable(entityTrait) {
      const tableModel = new swim.GenericModel();
      const tableTrait = new swim.TableTrait();
      tableTrait.colSpacing.setState(swim.Length.px(12));
      tableModel.setTrait("table", tableTrait);

      const keyColTrait = new swim.ColTrait();
      keyColTrait.layout.setState({key: "key", grow: 2, textColor: swim.Look.mutedColor});
      tableModel.setTrait("key", keyColTrait);

      const valueColTrait = new swim.ColTrait();
      valueColTrait.layout.setState({key: "value", grow: 1});
      tableModel.setTrait("value", valueColTrait);

      const downlinkTrait = new CellularSiteKpisDownlink(tableModel, entityTrait.uri, KPIS_URI);
      downlinkTrait.driver.setTrait(tableTrait);
      tableModel.setTrait("downlink", downlinkTrait);

      return tableModel;
    }
    createKpiHistoryWidget(entityTrait, widgetKey, widgetTitle, plotKey, propKey) {
      const widgetModel = new swim.GenericModel();
      const widgetTrait = new swim.WidgetTrait();
      widgetTrait.title.setState(widgetTitle);
      widgetTrait.subtitle.setState(entityTrait.title.state.toUpperCase());
      widgetModel.setTrait("widget", widgetTrait);

      const kpiHistoryModel = this.createKpiHistoryGadget(entityTrait, plotKey, propKey);
      widgetModel.appendChild(kpiHistoryModel, widgetKey);
      return widgetModel;
    }
    createKpiHistoryGadget(entityTrait, plotKey, propKey) {
      const kpiModel = new swim.GenericModel();
      const kpiPlotTrait = new swim.LinePlotTrait();
      kpiModel.setTrait("plot", kpiPlotTrait);
      const kpiPlotStatus = new swim.StatusTrait();
      kpiModel.setTrait("status", kpiPlotStatus);
      const kpiDataSetTrait = new swim.DataSetTrait();
      kpiModel.setTrait("dataSet", kpiDataSetTrait  );

      const chartModel = new swim.GenericModel();
      const chartTrait = new swim.ChartTrait();
      chartModel.setTrait("chart", chartTrait);
      const graphTrait = new swim.GraphTrait();
      chartModel.setTrait("graph", graphTrait);
      chartModel.appendChild(kpiModel, plotKey);

      const downlinkTrait = new CellularSiteKpiHistoryDownlink(kpiModel, entityTrait.uri, RAN_HISTORY_URI, propKey);
      downlinkTrait.driver.setTrait(chartTrait);
      kpiModel.setTrait("downlink", downlinkTrait);

      return chartModel;
    }
    createInfoWidget(entityTrait) {
      const widgetModel = new swim.GenericModel();
      const widgetTrait = new swim.WidgetTrait();
      widgetTrait.subtitle.setState(entityTrait.title.state.toUpperCase());
      widgetModel.setTrait("widget", widgetTrait);
      widgetTrait.title.setState("Info");

      const tableModel = this.createInfoTable(entityTrait);
      widgetModel.appendChild(tableModel, "table");

      return widgetModel;
    }
    createInfoTable(entityTrait) {
      const tableModel = new swim.GenericModel();
      const tableTrait = new swim.TableTrait();
      tableTrait.colSpacing.setState(swim.Length.px(12));
      tableModel.setTrait("table", tableTrait);

      const keyColTrait = new swim.ColTrait();
      keyColTrait.layout.setState({key: "key", grow: 1, textColor: swim.Look.mutedColor});
      tableModel.setTrait("key", keyColTrait);

      const valueColTrait = new swim.ColTrait();
      valueColTrait.layout.setState({key: "value", grow: 2});
      tableModel.setTrait("value", valueColTrait);

      const downlinkTrait = new CellularSiteInfoDownlink(tableModel, entityTrait.uri, INFO_URI);
      downlinkTrait.driver.setTrait(tableTrait);
      tableModel.setTrait("downlink", downlinkTrait);

      return tableModel;
    }
    onStopConsuming() {
      super.onStopConsuming();
      this.removeChildren();
    }
  }

  class CellularRegionLocation extends swim.DownlinkLocationTrait {
    constructor(nodeUri, laneUri) {
      super();
      this.downlink.nodeUri(nodeUri).laneUri(laneUri);
    }
    downlinkDidSet(value) {
      //console.log("CellularRegionLocation.downlinkDidSet " + this.downlink.nodeUri() + ":", value.toAny());
      const districtTrait = this.getTrait(swim.DistrictTrait);

      const minZoom = value.get("minZoom");
      const maxZoom = value.get("maxZoom");
      if (minZoom.isDefined() || maxZoom.isDefined()) {
        this.setZoomRange(minZoom.numberValue(-Infinity), maxZoom.numberValue(Infinity));
      }

      const minSiteZoom = value.get("minSiteZoom");
      if (minSiteZoom.isDefined()) {
        districtTrait.setZoomRange(minSiteZoom.numberValue(-Infinity), Infinity);
      }

      const type = value.get("type").stringValue(void 0);
      if (type === "Polygon") {
        const geographic = swim.GeographicArea.fromInit({
          geometry: value.get("coordinates").toAny()[0],
        });
        this.setGeographic(geographic);
        districtTrait.setBoundary(geographic.geometry);
      } else if (type === "MultiPolygon") {
        const geographic = swim.GeographicArea.fromInit({
          geometry: value.get("coordinates").toAny()[0],
        });
        this.setGeographic(geographic);
        districtTrait.setBoundary(geographic.geometry);
      } else {
        //const centroid = value.get("centroid");
        //const lng = centroid.getItem(0).numberValue(NaN);
        //const lat = centroid.getItem(1).numberValue(NaN);
        //if (isFinite(lng) && isFinite(lat)) {
        //  const radius = 4;
        //  const geometry = new swim.LocationMarker(lng, lat, radius);
        //  districtTrait.geometry.model.setGeometry(geometry);
        //}
      }
    }
  }

  class CellularStateStatusDownlink extends swim.ValueDownlinkTrait {
    constructor(widgetModel, pieModel, nodeUri, laneUri) {
      super();
      this.widgetModel = widgetModel;
      this.pieModel = pieModel;
      this.downlink.nodeUri(nodeUri).laneUri(laneUri);
    }
    downlinkDidSet(value) {
      const siteCount = value.get("siteCount").numberValue(0);
      const warnCount = value.get("warnCount").numberValue(0);
      const alertCount = value.get("alertCount").numberValue(0);
      const normalCount = siteCount - (warnCount + alertCount);
      this.widgetModel.getTrait("widget").title.setState("# Sites: " + siteCount);

      const alertSliceModel = this.getOrCreateSliceModel("alert");
      const normalSliceModel = this.getOrCreateSliceModel("normal");
      const warnSliceModel = this.getOrCreateSliceModel("warn");

      const alertStatusVector = swim.StatusVector.of([swim.Status.alert, 1]);
      this.updateSlice(alertSliceModel, alertCount, " Alerts", alertStatusVector);

      const normalStatusVector = swim.StatusVector.of([swim.Status.normal, 1]);
      this.updateSlice(normalSliceModel, normalCount, " Normal", normalStatusVector);

      const warnStatusVector = swim.StatusVector.of([swim.Status.warning, 1]);
      this.updateSlice(warnSliceModel, warnCount, " Warnings", warnStatusVector);

    }
    getOrCreateSliceModel(key) {
      let sliceModel = this.pieModel.getChild(key);
      if (sliceModel === null) {
        // create a new slice
        sliceModel = new swim.GenericModel();
        sliceModel.setTrait("slice", new swim.SliceTrait());
        sliceModel.setTrait("status", new swim.StatusTrait());
        this.pieModel.setChild(key, sliceModel);
      }
      return sliceModel;
    }
    updateSlice(sliceModel, state, legend, statusVector) {
      const sliceTrait = sliceModel.getTrait("slice");
      const sliceStatusTrait = sliceModel.getTrait("status");
      /*
      sliceTrait.formatLabel = function (value) {
        return value + "";
      };
      */
      sliceTrait.value.setState(state);
      sliceTrait.legend.setState(state + legend);
      sliceStatusTrait.setStatusFactor("status", swim.StatusFactor.create("Status", statusVector));
    }
  }

  class CellularStateAlertsDownlink extends swim.MapDownlinkTrait {

    constructor(tableModel, nodeUri, laneUri) {
      super();
      this.tableModel = tableModel;
      this.downlink.nodeUri(nodeUri).laneUri(laneUri);
    }
   downlinkDidUpdate(key, value) {
      if (key !== void 0) {
        const rowModel = this.getOrCreateRowModel(key.stringValue());
        const keyCell = rowModel.getTrait("key");
        keyCell.content.setState(key.stringValue());
        const valueCell = rowModel.getTrait("value");
        valueCell.content.setState(value.get("severity").numberValue(0).toFixed(2));
      }
    }
    downlinkDidRemove(key, value) {
      if (key !== void 0) {
        this.tableModel.removeChild(key.stringValue());
      }
    }
    getOrCreateRowModel(key) {
      let rowModel = this.tableModel.getChild(key);
      if (rowModel === null) {
        rowModel = this.createRowModel(key);
        this.appendChild(rowModel, key);
      }
      return rowModel;
    }
    createRowModel(key) {
      const rowModel = new swim.GenericModel();
      const rowTrait = new swim.RowTrait();
      const keyCell = new swim.TextCellTrait();
      keyCell.content.setState(key);
      const valueCell = new swim.TextCellTrait();
      rowModel.setTrait("row", rowTrait);
      rowModel.setTrait("key", keyCell);
      rowModel.setTrait("value", valueCell);
      rowModel.setTrait("status", new swim.StatusTrait());
      return rowModel;
    }

  }

  class CellularStateGroup extends swim.DownlinkNodeGroup {
    constructor(nodeUri, laneUri, metaHostUri) {
      super(metaHostUri);
      this.downlink.nodeUri(nodeUri).laneUri(laneUri);
    }
    initNodeModel(nodeModel) {
      const entityTrait = nodeModel.getTrait(swim.EntityTrait);
      //console.log("CellularStateGroup.initNodeModel " + entityTrait.uri);

      entityTrait.aggregateStatus = function (statusVector) {}; // don't aggregate subentity status

      const statusTrait = nodeModel.getTrait(swim.StatusTrait);
      statusTrait.setStatusFactor("operational", swim.StatusFactor.create("Operational", swim.StatusVector.of([swim.Status.normal, 1])));

      const locationTrait = new CellularRegionLocation(entityTrait.uri, GEOMETRY_URI);
      locationTrait.setZoomRange(-Infinity, MIN_SITE_ZOOM);
      nodeModel.setTrait("location", locationTrait);

      const districtTrait = new swim.DistrictTrait();
      districtTrait.setZoomRange(MIN_SITE_ZOOM, Infinity);
      districtTrait.setBoundary(swim.GeoBox.undefined());
      nodeModel.setTrait("district", districtTrait);

      const subdistricts = new CellularSiteGroup(entityTrait.uri, SITES_URI, this.metaHostUri);
      subdistricts.setTrait("status", new swim.StatusTrait());
      nodeModel.setChild("subdistricts", subdistricts);
      entityTrait.subentities.binds = false;
      entityTrait.subentities.setModel(subdistricts);

      const widgetGroup = new swim.WidgetGroup();
      entityTrait.setTrait("widgets", widgetGroup);

      const statusWidget = this.createStatusWidget(entityTrait);
      entityTrait.appendChild(statusWidget, "status");

      const alertsWidget = this.createAlertsWidget(entityTrait);
      entityTrait.appendChild(alertsWidget, "alertsWidget");
    }
    updateNodeModel(nodeModel, value) {
      //const entityTrait = nodeModel.getTrait(swim.EntityTrait);
      //console.log("CellularStateGroup.updateNodeModel " + entityTrait.uri + ":", value.toAny());

      const statusTrait = nodeModel.getTrait(swim.StatusTrait);
      const siteCount = value.get("siteCount").numberValue(0);
      const warnCount = value.get("warnCount").numberValue(0);
      const alertCount = value.get("alertCount").numberValue(0);
      const warnRatio = warnCount / siteCount;
      const alertRatio = alertCount / siteCount;
      if (alertRatio > 0.015) {
        const alert = Math.min((1 / 0.015) * (alertRatio - 0.015), 1);
        statusTrait.setStatusFactor("region", swim.StatusFactor.create("Region", swim.StatusVector.of([swim.Status.alert, alert])));
      } else if (warnRatio > 0.15) {
        const warning = Math.min((1 / 0.15) * (warnRatio - 0.15), 1);
        statusTrait.setStatusFactor("region", swim.StatusFactor.create("Region", swim.StatusVector.of([swim.Status.warning, warning])));
      } else {
        statusTrait.setStatusFactor("region", null);
      }
    }
    createStatusWidget(entityTrait) {
      const widgetModel = new swim.GenericModel();
      const widgetTrait = new swim.WidgetTrait();
      widgetTrait.title.setState("Status");
      widgetTrait.subtitle.setState(entityTrait.title.state.toUpperCase());
      widgetModel.setTrait("widget", widgetTrait);

      const pieModel = this.createStatusGadget(entityTrait, widgetModel);
      widgetModel.appendChild(pieModel, "pie");

      return widgetModel;

      return widgetModel;
    }
    createStatusGadget(entityTrait, widgetModel) {
      const pieModel = new swim.GenericModel();
      const pieTrait = new swim.PieTrait();
      pieModel.setTrait("pie", pieTrait);

      const downlinkTrait = new CellularStateStatusDownlink(widgetModel, pieModel, entityTrait.uri, STATUS_URI);
      downlinkTrait.driver.setTrait(pieTrait);
      pieModel.setTrait("downlink", downlinkTrait);
      return pieModel;
    }
    createStatusTable(entityTrait) {
      const tableModel = new swim.GenericModel();
      const tableTrait = new swim.TableTrait();
      tableTrait.colSpacing.setState(swim.Length.px(12));
      tableModel.setTrait("table", tableTrait);

      const keyColTrait = new swim.ColTrait();
      keyColTrait.layout.setState({key: "key", grow: 1, textColor: swim.Look.mutedColor});
      tableModel.setTrait("key", keyColTrait);

      const valueColTrait = new swim.ColTrait();
      valueColTrait.layout.setState({key: "value", grow: 1});
      tableModel.setTrait("value", valueColTrait);

      const downlinkTrait = new CellularStateStatusDownlink(tableModel, entityTrait.uri, STATUS_URI);
      downlinkTrait.driver.setTrait(tableTrait);
      tableModel.setTrait("downlink", downlinkTrait);

      return tableModel;
    }
    createAlertsWidget(entityTrait) {
      const widgetModel = new swim.GenericModel();
      const widgetTrait = new swim.WidgetTrait();
      widgetTrait.title.setState("Site Alerts");
      widgetTrait.subtitle.setState(entityTrait.title.state.toUpperCase());
      widgetModel.setTrait("widget", widgetTrait);

      const tableModel = this.createKeyEventsTable(entityTrait);
      widgetModel.appendChild(tableModel, "table");

      return widgetModel;
    }
    createKeyEventsTable(entityTrait) {
      const tableModel = new swim.GenericModel();
      const tableTrait = new swim.TableTrait();
      tableTrait.colSpacing.setState(swim.Length.px(12));
      tableModel.setTrait("table", tableTrait);

      const keyColTrait = new swim.ColTrait();
      keyColTrait.layout.setState({key: "key", grow: 2, textColor: swim.Look.mutedColor});
      tableModel.setTrait("key", keyColTrait);

      const valueColTrait = new swim.ColTrait();
      valueColTrait.layout.setState({key: "value", grow: 1});
      tableModel.setTrait("value", valueColTrait);

      const downlinkTrait = new CellularStateAlertsDownlink(tableModel, entityTrait.uri, ALERTS_URI);
      downlinkTrait.driver.setTrait(tableTrait);
      tableModel.setTrait("downlink", downlinkTrait);

      return tableModel;
    }
    onStopConsuming() {
      super.onStopConsuming();
      this.removeChildren();
    }
  }

  class CellularPlugin extends swim.EntityPlugin {
    injectEntity(entityModel, domainModel) {
      const entityTrait = domainModel.getTrait(swim.EntityTrait);
      const domainUri = entityTrait.uri.toString();
      const entityUri = entityModel.uri.toString();
      //console.log("CellularPlugin.injectEntity " + domainUri + ", " + entityUri + ":", entityModel);

      if (entityUri === "warp://localhost:9001") {
        entityTrait.title.setState("Cellular");
        entityTrait.icon.setState(cellTowerIcon);

        entityModel.setTrait("status", new swim.StatusTrait());
        entityModel.setTrait("indicated", new swim.IndicatedTrait());

        const districtTrait = new swim.DistrictTrait();
        districtTrait.setZoomRange(-Infinity, Infinity);
        entityModel.setTrait("district", districtTrait);

        const subdistricts = new CellularStateGroup(COUNTRY_URI, SUB_REGIONS_URI, this.metaHostUri);
        subdistricts.setTrait("status", new swim.StatusTrait());
        entityModel.setChild("subdistricts", subdistricts);

        const mapModel = new swim.GenericModel();
        const mapEntity = new swim.EntityTrait(swim.Uri.parse("/map"));
        mapModel.setTrait("entity", mapEntity);
        mapEntity.title.setState("Map");
        const mapSubentities = new CellularStateGroup(COUNTRY_URI, SUB_REGIONS_URI, this.metaHostUri);
        mapSubentities.setTrait("status", new swim.StatusTrait());
        mapEntity.subentities.setModel(mapSubentities);
        mapEntity.subentities.insertModel();
        mapModel.setTrait("status", new swim.StatusTrait());
        mapModel.setTrait("indicated", new swim.IndicatedTrait());
        entityModel.subentities.model.prependChild(mapModel);
      }
    }
  }
  swim.PrismService.insertPlugin(new CellularPlugin());
})();
