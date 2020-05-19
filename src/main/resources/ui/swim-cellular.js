(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@swim/ui'), require('@swim/map'), require('@swim/mapbox'), require('@swim/math'), require('@swim/view')) :
    typeof define === 'function' && define.amd ? define(['exports', '@swim/ui', '@swim/map', '@swim/mapbox', '@swim/math', '@swim/view'], factory) :
    (global = global || self, factory((global.swim = global.swim || {}, global.swim.cellular = global.swim.cellular || {}), global.swim, global.swim, global.swim, global.swim, global.swim));
}(this, (function (exports, ui, map, mapbox, math, view) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    var GoogleMapProjection = (function () {
        function GoogleMapProjection(mapView) {
            this._mapView = mapView;
        }
        Object.defineProperty(GoogleMapProjection.prototype, "map", {
            get: function () {
                return this._mapView._map;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoogleMapProjection.prototype, "bounds", {
            get: function () {
                var bounds = this._mapView._map.getBounds();
                var sw = bounds.getSouthWest();
                var ne = bounds.getNorthEast();
                return new map.GeoBox(sw.lng(), sw.lat(), ne.lng(), ne.lat());
            },
            enumerable: false,
            configurable: true
        });
        GoogleMapProjection.prototype.project = function (lng, lat) {
            var geoPoint;
            if (typeof lng === "number") {
                geoPoint = new google.maps.LatLng(lat, lng);
            }
            else if (Array.isArray(lng)) {
                geoPoint = new google.maps.LatLng(lng[1], lng[0]);
            }
            else {
                geoPoint = new google.maps.LatLng(lng.lat, lng.lng);
            }
            var projection = this._mapView._mapOverlay.getProjection();
            var point = projection.fromLatLngToContainerPixel(geoPoint);
            return new math.PointR2(point.x, point.y);
        };
        GoogleMapProjection.prototype.unproject = function (x, y) {
            var viewPoint;
            if (typeof x === "number") {
                viewPoint = new google.maps.Point(x, y);
            }
            else if (Array.isArray(x)) {
                viewPoint = new google.maps.Point(x[0], x[1]);
            }
            else {
                viewPoint = new google.maps.Point(x.x, x.y);
            }
            var projection = this._mapView._mapOverlay.getProjection();
            var point = projection.fromContainerPixelToLatLng(viewPoint);
            return new map.GeoPoint(point.lng(), point.lat());
        };
        return GoogleMapProjection;
    }());

    var GoogleMapView = (function (_super) {
        __extends(GoogleMapView, _super);
        function GoogleMapView(map) {
            var _this = _super.call(this) || this;
            _this.onMapRender = _this.onMapRender.bind(_this);
            _this._map = map;
            _this._geoProjection = new GoogleMapProjection(_this);
            _this._mapOverlay = null;
            _this._mapZoom = map.getZoom();
            _this._mapHeading = map.getHeading();
            _this._mapTilt = map.getTilt();
            _this.initMap(map);
            return _this;
        }
        Object.defineProperty(GoogleMapView.prototype, "map", {
            get: function () {
                return this._map;
            },
            enumerable: false,
            configurable: true
        });
        GoogleMapView.prototype.initMap = function (map) {
        };
        Object.defineProperty(GoogleMapView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        GoogleMapView.prototype.project = function (lng, lat) {
            return this._geoProjection.project.apply(this._geoProjection, arguments);
        };
        GoogleMapView.prototype.unproject = function (x, y) {
            return this._geoProjection.unproject.apply(this._geoProjection, arguments);
        };
        Object.defineProperty(GoogleMapView.prototype, "geoProjection", {
            get: function () {
                return this._geoProjection;
            },
            enumerable: false,
            configurable: true
        });
        GoogleMapView.prototype.setGeoProjection = function (geoProjection) {
            this.willSetGeoProjection(geoProjection);
            this._geoProjection = geoProjection;
            this.onSetGeoProjection(geoProjection);
            this.didSetGeoProjection(geoProjection);
        };
        GoogleMapView.prototype.willSetGeoProjection = function (geoProjection) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillSetGeoProjection !== void 0) {
                    viewObserver.viewWillSetGeoProjection(geoProjection, this);
                }
            });
        };
        GoogleMapView.prototype.onSetGeoProjection = function (geoProjection) {
            if (!this.isHidden() && !this.isCulled()) {
                this.requireUpdate(view.View.NeedsProject, true);
            }
        };
        GoogleMapView.prototype.didSetGeoProjection = function (geoProjection) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetGeoProjection !== void 0) {
                    viewObserver.viewDidSetGeoProjection(geoProjection, this);
                }
            });
        };
        Object.defineProperty(GoogleMapView.prototype, "mapOverlay", {
            get: function () {
                return this._mapOverlay;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoogleMapView.prototype, "mapZoom", {
            get: function () {
                return this._mapZoom;
            },
            enumerable: false,
            configurable: true
        });
        GoogleMapView.prototype.setMapZoom = function (newMapZoom) {
            var oldMapZoom = this._mapZoom;
            if (oldMapZoom !== newMapZoom) {
                this.willSetMapZoom(newMapZoom, oldMapZoom);
                this._mapZoom = newMapZoom;
                this.onSetMapZoom(newMapZoom, oldMapZoom);
                this.didSetMapZoom(newMapZoom, oldMapZoom);
            }
        };
        GoogleMapView.prototype.willSetMapZoom = function (newMapZoom, oldMapZoom) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewWillSetMapZoom !== void 0) {
                    viewObserver.viewWillSetMapZoom(newMapZoom, oldMapZoom, this);
                }
            });
        };
        GoogleMapView.prototype.onSetMapZoom = function (newMapZoom, oldMapZoom) {
        };
        GoogleMapView.prototype.didSetMapZoom = function (newMapZoom, oldMapZoom) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetMapZoom !== void 0) {
                    viewObserver.viewDidSetMapZoom(newMapZoom, oldMapZoom, this);
                }
            });
        };
        Object.defineProperty(GoogleMapView.prototype, "mapHeading", {
            get: function () {
                return this._mapHeading;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GoogleMapView.prototype, "mapTilt", {
            get: function () {
                return this._mapTilt;
            },
            enumerable: false,
            configurable: true
        });
        GoogleMapView.prototype.cascadeProcess = function (processFlags, viewContext) {
            viewContext = this.mapViewContext(viewContext);
            _super.prototype.cascadeProcess.call(this, processFlags, viewContext);
        };
        GoogleMapView.prototype.cascadeDisplay = function (displayFlags, viewContext) {
            viewContext = this.mapViewContext(viewContext);
            _super.prototype.cascadeDisplay.call(this, displayFlags, viewContext);
        };
        GoogleMapView.prototype.childViewContext = function (childView, viewContext) {
            return viewContext;
        };
        GoogleMapView.prototype.mapViewContext = function (viewContext) {
            var mapViewContext = Object.create(viewContext);
            mapViewContext.geoProjection = this._geoProjection;
            mapViewContext.geoFrame = this.geoFrame;
            mapViewContext.mapZoom = this._mapZoom;
            mapViewContext.mapHeading = this._mapHeading;
            mapViewContext.mapTilt = this._mapTilt;
            return mapViewContext;
        };
        Object.defineProperty(GoogleMapView.prototype, "geoFrame", {
            get: function () {
                var bounds = this._map.getBounds();
                var sw = bounds.getSouthWest();
                var ne = bounds.getNorthEast();
                return new map.GeoBox(sw.lng(), sw.lat(), ne.lng(), ne.lat());
            },
            enumerable: false,
            configurable: true
        });
        GoogleMapView.prototype.hitTest = function (x, y, viewContext) {
            viewContext = this.mapViewContext(viewContext);
            return _super.prototype.hitTest.call(this, x, y, viewContext);
        };
        GoogleMapView.prototype.onMapRender = function () {
            this._mapHeading = this._map.getHeading();
            this._mapTilt = this._map.getTilt();
            this.setMapZoom(this._map.getZoom());
            this.setGeoProjection(this._geoProjection);
        };
        GoogleMapView.prototype.overlayCanvas = function () {
            if (this._parentView !== null) {
                return this.canvasView;
            }
            else {
                var GoogleMapOverlayView = (function (_super) {
                    __extends(GoogleMapOverlayView, _super);
                    function GoogleMapOverlayView(mapView) {
                        var _this = _super.call(this) || this;
                        _this._mapView = mapView;
                        _this._canvasView = null;
                        return _this;
                    }
                    GoogleMapOverlayView.prototype.onAdd = function () {
                        var panes = this.getPanes();
                        var overlayMouseTarget = GoogleMapView.materializeAncestors(panes.overlayMouseTarget);
                        var overlayContainer = overlayMouseTarget.parentView;
                        var container = overlayContainer.parentView;
                        this._canvasView = container.append("canvas");
                        this._canvasView.append(this._mapView);
                    };
                    GoogleMapOverlayView.prototype.onRemove = function () {
                        if (this._canvasView !== null) {
                            this._canvasView.remove();
                            this._canvasView = null;
                        }
                    };
                    GoogleMapOverlayView.prototype.draw = function () {
                        this._mapView.onMapRender();
                    };
                    return GoogleMapOverlayView;
                }(google.maps.OverlayView));
                var mapOverlay = new GoogleMapOverlayView(this);
                mapOverlay.setMap(this._map);
                this._mapOverlay = mapOverlay;
                return mapOverlay._canvasView;
            }
        };
        GoogleMapView.materializeAncestors = function (node) {
            var parentNode = node.parentNode;
            if (parentNode instanceof HTMLElement && !parentNode.view) {
                GoogleMapView.materializeAncestors(parentNode);
            }
            return view.View.fromNode(node);
        };
        return GoogleMapView;
    }(map.MapGraphicsView));

    var GoogleMapViewController = (function (_super) {
        __extends(GoogleMapViewController, _super);
        function GoogleMapViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        GoogleMapViewController.prototype.viewWillSetGeoProjection = function (geoProjection, view) {
        };
        GoogleMapViewController.prototype.viewDidSetGeoProjection = function (geoProjection, view) {
        };
        GoogleMapViewController.prototype.viewWillSetMapZoom = function (newMapZoom, oldMapZoom, view) {
        };
        GoogleMapViewController.prototype.viewDidSetMapZoom = function (newMapZoom, oldMapZoom, view) {
        };
        return GoogleMapViewController;
    }(map.MapGraphicsViewController));

    var EsriProjection = {
        webMercatorUtils: void 0,
        init: function () {
            if (EsriProjection.webMercatorUtils === void 0) {
                window.require(["esri/geometry/support/webMercatorUtils"], function (webMercatorUtils) {
                    EsriProjection.webMercatorUtils = webMercatorUtils;
                });
            }
        },
    };

    var EsriView = (function (_super) {
        __extends(EsriView, _super);
        function EsriView() {
            var _this = _super.call(this) || this;
            EsriProjection.init();
            return _this;
        }
        Object.defineProperty(EsriView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        EsriView.prototype.willSetGeoProjection = function (geoProjection) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillSetGeoProjection !== void 0) {
                    viewObserver.viewWillSetGeoProjection(geoProjection, this);
                }
            });
        };
        EsriView.prototype.onSetGeoProjection = function (geoProjection) {
            if (!this.isHidden() && !this.isCulled()) {
                this.requireUpdate(view.View.NeedsProject, false);
            }
        };
        EsriView.prototype.didSetGeoProjection = function (geoProjection) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetGeoProjection !== void 0) {
                    viewObserver.viewDidSetGeoProjection(geoProjection, this);
                }
            });
        };
        EsriView.prototype.willSetMapZoom = function (newMapZoom, oldMapZoom) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewWillSetMapZoom !== void 0) {
                    viewObserver.viewWillSetMapZoom(newMapZoom, oldMapZoom, this);
                }
            });
        };
        EsriView.prototype.onSetMapZoom = function (newMapZoom, oldMapZoom) {
        };
        EsriView.prototype.didSetMapZoom = function (newMapZoom, oldMapZoom) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetMapZoom !== void 0) {
                    viewObserver.viewDidSetMapZoom(newMapZoom, oldMapZoom, this);
                }
            });
        };
        EsriView.prototype.cascadeProcess = function (processFlags, viewContext) {
            viewContext = this.mapViewContext(viewContext);
            _super.prototype.cascadeProcess.call(this, processFlags, viewContext);
        };
        EsriView.prototype.cascadeDisplay = function (displayFlags, viewContext) {
            viewContext = this.mapViewContext(viewContext);
            _super.prototype.cascadeDisplay.call(this, displayFlags, viewContext);
        };
        EsriView.prototype.childViewContext = function (childView, viewContext) {
            return viewContext;
        };
        EsriView.prototype.mapViewContext = function (viewContext) {
            var mapViewContext = Object.create(viewContext);
            mapViewContext.geoProjection = this.geoProjection;
            mapViewContext.geoFrame = this.geoFrame;
            mapViewContext.mapZoom = this.mapZoom;
            mapViewContext.mapHeading = this.mapHeading;
            mapViewContext.mapTilt = this.mapTilt;
            return mapViewContext;
        };
        EsriView.prototype.hitTest = function (x, y, viewContext) {
            viewContext = this.mapViewContext(viewContext);
            return _super.prototype.hitTest.call(this, x, y, viewContext);
        };
        return EsriView;
    }(map.MapGraphicsView));

    var EsriViewController = (function (_super) {
        __extends(EsriViewController, _super);
        function EsriViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EsriViewController.prototype.viewWillSetGeoProjection = function (geoProjection, view) {
        };
        EsriViewController.prototype.viewDidSetGeoProjection = function (geoProjection, view) {
        };
        EsriViewController.prototype.viewWillSetMapZoom = function (newMapZoom, oldMapZoom, view) {
        };
        EsriViewController.prototype.viewDidSetMapZoom = function (newMapZoom, oldMapZoom, view) {
        };
        return EsriViewController;
    }(map.MapGraphicsViewController));

    var EsriMapViewProjection = (function () {
        function EsriMapViewProjection(map) {
            EsriProjection.init();
            this._map = map;
        }
        Object.defineProperty(EsriMapViewProjection.prototype, "map", {
            get: function () {
                return this._map;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EsriMapViewProjection.prototype, "bounds", {
            get: function () {
                var extent = this._map.extent;
                if (extent !== null) {
                    extent = EsriProjection.webMercatorUtils.webMercatorToGeographic(extent);
                }
                if (extent !== null) {
                    return new map.GeoBox(extent.xmin, extent.ymin, extent.xmax, extent.ymax);
                }
                else {
                    return map.GeoBox.globe();
                }
            },
            enumerable: false,
            configurable: true
        });
        EsriMapViewProjection.prototype.project = function (lng, lat) {
            var geoPoint;
            if (typeof lng === "number") {
                geoPoint = { x: lng, y: lat, spatialReference: { wkid: 4326 } };
            }
            else if (Array.isArray(lng)) {
                geoPoint = { x: lng[0], y: lng[1], spatialReference: { wkid: 4326 } };
            }
            else {
                geoPoint = { x: lng.lng, y: lng.lat, spatialReference: { wkid: 4326 } };
            }
            var point = this._map.toScreen(geoPoint);
            return point !== null ? new math.PointR2(point.x, point.y) : math.PointR2.origin();
        };
        EsriMapViewProjection.prototype.unproject = function (x, y) {
            var viewPoint;
            if (typeof x === "number") {
                viewPoint = { x: x, y: y };
            }
            else if (Array.isArray(x)) {
                viewPoint = { x: x[0], y: x[1] };
            }
            else {
                viewPoint = x;
            }
            var point = this._map.toMap(viewPoint);
            return point !== null ? new map.GeoPoint(point.longitude, point.latitude) : map.GeoPoint.origin();
        };
        return EsriMapViewProjection;
    }());

    var EsriMapView = (function (_super) {
        __extends(EsriMapView, _super);
        function EsriMapView(map) {
            var _this = _super.call(this) || this;
            _this.onMapRender = _this.onMapRender.bind(_this);
            _this._map = map;
            _this._geoProjection = new EsriMapViewProjection(_this._map);
            _this._mapZoom = map.zoom;
            _this._mapHeading = map.rotation;
            _this.initMap(_this._map);
            return _this;
        }
        Object.defineProperty(EsriMapView.prototype, "map", {
            get: function () {
                return this._map;
            },
            enumerable: false,
            configurable: true
        });
        EsriMapView.prototype.initMap = function (map) {
            map.watch("extent", this.onMapRender);
        };
        Object.defineProperty(EsriMapView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        EsriMapView.prototype.project = function (lng, lat) {
            return this._geoProjection.project.apply(this._geoProjection, arguments);
        };
        EsriMapView.prototype.unproject = function (x, y) {
            return this._geoProjection.unproject.apply(this._geoProjection, arguments);
        };
        Object.defineProperty(EsriMapView.prototype, "geoProjection", {
            get: function () {
                return this._geoProjection;
            },
            enumerable: false,
            configurable: true
        });
        EsriMapView.prototype.setGeoProjection = function (geoProjection) {
            this.willSetGeoProjection(geoProjection);
            this._geoProjection = geoProjection;
            this.onSetGeoProjection(geoProjection);
            this.didSetGeoProjection(geoProjection);
        };
        Object.defineProperty(EsriMapView.prototype, "mapZoom", {
            get: function () {
                return this._mapZoom;
            },
            enumerable: false,
            configurable: true
        });
        EsriMapView.prototype.setMapZoom = function (newMapZoom) {
            var oldMapZoom = this._mapZoom;
            if (oldMapZoom !== newMapZoom) {
                this.willSetMapZoom(newMapZoom, oldMapZoom);
                this._mapZoom = newMapZoom;
                this.onSetMapZoom(newMapZoom, oldMapZoom);
                this.didSetMapZoom(newMapZoom, oldMapZoom);
            }
        };
        Object.defineProperty(EsriMapView.prototype, "mapHeading", {
            get: function () {
                return this._mapHeading;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EsriMapView.prototype, "mapTilt", {
            get: function () {
                return 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EsriMapView.prototype, "geoFrame", {
            get: function () {
                var extent = this._map.extent;
                if (extent !== null) {
                    extent = EsriProjection.webMercatorUtils.webMercatorToGeographic(extent);
                }
                if (extent !== null) {
                    return new map.GeoBox(extent.xmin, extent.ymin, extent.xmax, extent.ymax);
                }
                else {
                    return map.GeoBox.globe();
                }
            },
            enumerable: false,
            configurable: true
        });
        EsriMapView.prototype.onMapRender = function () {
            this._mapHeading = this._map.rotation;
            this.setMapZoom(this._map.zoom);
            this.setGeoProjection(this._geoProjection);
        };
        EsriMapView.prototype.overlayCanvas = function () {
            if (this._parentView !== null) {
                return this.canvasView;
            }
            else {
                var map = this._map;
                var container = view.View.fromNode(map.container);
                var esriViewRoot = view.View.fromNode(container.node.querySelector(".esri-view-root"));
                var esriOverlaySurface = view.View.fromNode(esriViewRoot.node.querySelector(".esri-overlay-surface"));
                var canvas = esriOverlaySurface.append("canvas");
                canvas.setEventSurface(esriViewRoot.node);
                canvas.append(this);
                return canvas;
            }
        };
        return EsriMapView;
    }(EsriView));

    var EsriMapViewController = (function (_super) {
        __extends(EsriMapViewController, _super);
        function EsriMapViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EsriMapViewController.prototype.viewWillSetGeoProjection = function (geoProjection, view) {
        };
        EsriMapViewController.prototype.viewDidSetGeoProjection = function (geoProjection, view) {
        };
        return EsriMapViewController;
    }(EsriViewController));

    var EsriSceneViewProjection = (function () {
        function EsriSceneViewProjection(map) {
            EsriProjection.init();
            this._map = map;
        }
        Object.defineProperty(EsriSceneViewProjection.prototype, "map", {
            get: function () {
                return this._map;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EsriSceneViewProjection.prototype, "bounds", {
            get: function () {
                var extent = this._map.extent;
                if (extent !== null) {
                    extent = EsriProjection.webMercatorUtils.webMercatorToGeographic(extent);
                }
                if (extent !== null) {
                    return new map.GeoBox(extent.xmin, extent.ymin, extent.xmax, extent.ymax);
                }
                else {
                    return map.GeoBox.globe();
                }
            },
            enumerable: false,
            configurable: true
        });
        EsriSceneViewProjection.prototype.project = function (lng, lat) {
            var geoPoint;
            if (typeof lng === "number") {
                geoPoint = { x: lng, y: lat, spatialReference: { wkid: 4326 } };
            }
            else if (Array.isArray(lng)) {
                geoPoint = { x: lng[0], y: lng[1], spatialReference: { wkid: 4326 } };
            }
            else {
                geoPoint = { x: lng.lng, y: lng.lat, spatialReference: { wkid: 4326 } };
            }
            var point = this._map.toScreen(geoPoint);
            return point !== null ? new math.PointR2(point.x, point.y) : math.PointR2.origin();
        };
        EsriSceneViewProjection.prototype.unproject = function (x, y) {
            var viewPoint;
            if (typeof x === "number") {
                viewPoint = { x: x, y: y };
            }
            else if (Array.isArray(x)) {
                viewPoint = { x: x[0], y: x[1] };
            }
            else {
                viewPoint = x;
            }
            var point = this._map.toMap(viewPoint);
            return point !== null ? new map.GeoPoint(point.longitude, point.latitude) : map.GeoPoint.origin();
        };
        return EsriSceneViewProjection;
    }());

    var EsriSceneView = (function (_super) {
        __extends(EsriSceneView, _super);
        function EsriSceneView(map) {
            var _this = _super.call(this) || this;
            _this.onMapRender = _this.onMapRender.bind(_this);
            _this._map = map;
            _this._geoProjection = new EsriSceneViewProjection(_this._map);
            _this._mapZoom = map.zoom;
            _this._mapHeading = map.camera.heading;
            _this._mapTilt = map.camera.tilt;
            _this.initMap(_this._map);
            return _this;
        }
        Object.defineProperty(EsriSceneView.prototype, "map", {
            get: function () {
                return this._map;
            },
            enumerable: false,
            configurable: true
        });
        EsriSceneView.prototype.initMap = function (map) {
            map.watch("extent", this.onMapRender);
        };
        Object.defineProperty(EsriSceneView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        EsriSceneView.prototype.project = function (lng, lat) {
            return this._geoProjection.project.apply(this._geoProjection, arguments);
        };
        EsriSceneView.prototype.unproject = function (x, y) {
            return this._geoProjection.unproject.apply(this._geoProjection, arguments);
        };
        Object.defineProperty(EsriSceneView.prototype, "geoProjection", {
            get: function () {
                return this._geoProjection;
            },
            enumerable: false,
            configurable: true
        });
        EsriSceneView.prototype.setGeoProjection = function (geoProjection) {
            this.willSetGeoProjection(geoProjection);
            this._geoProjection = geoProjection;
            this.onSetGeoProjection(geoProjection);
            this.didSetGeoProjection(geoProjection);
        };
        Object.defineProperty(EsriSceneView.prototype, "mapZoom", {
            get: function () {
                return this._mapZoom;
            },
            enumerable: false,
            configurable: true
        });
        EsriSceneView.prototype.setMapZoom = function (newMapZoom) {
            var oldMapZoom = this._mapZoom;
            if (oldMapZoom !== newMapZoom) {
                this.willSetMapZoom(newMapZoom, oldMapZoom);
                this._mapZoom = newMapZoom;
                this.onSetMapZoom(newMapZoom, oldMapZoom);
                this.didSetMapZoom(newMapZoom, oldMapZoom);
            }
        };
        Object.defineProperty(EsriSceneView.prototype, "mapHeading", {
            get: function () {
                return this._mapHeading;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EsriSceneView.prototype, "mapTilt", {
            get: function () {
                return this._mapTilt;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(EsriSceneView.prototype, "geoFrame", {
            get: function () {
                var extent = this._map.extent;
                if (extent !== null) {
                    extent = EsriProjection.webMercatorUtils.webMercatorToGeographic(extent);
                }
                if (extent !== null) {
                    return new map.GeoBox(extent.xmin, extent.ymin, extent.xmax, extent.ymax);
                }
                else {
                    return map.GeoBox.globe();
                }
            },
            enumerable: false,
            configurable: true
        });
        EsriSceneView.prototype.onMapRender = function () {
            this._mapHeading = this._map.camera.heading;
            this._mapTilt = this._map.camera.tilt;
            this.setMapZoom(this._map.zoom);
            this.setGeoProjection(this._geoProjection);
        };
        EsriSceneView.prototype.overlayCanvas = function () {
            if (this._parentView !== null) {
                return this.canvasView;
            }
            else {
                var map = this._map;
                var container = view.View.fromNode(map.container);
                var esriViewRoot = view.View.fromNode(container.node.querySelector(".esri-view-root"));
                var esriViewSurface = view.View.fromNode(esriViewRoot.node.querySelector(".esri-view-surface"));
                var canvas = esriViewSurface.append("canvas");
                canvas.append(this);
                return canvas;
            }
        };
        return EsriSceneView;
    }(EsriView));

    var EsriSceneViewController = (function (_super) {
        __extends(EsriSceneViewController, _super);
        function EsriSceneViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        EsriSceneViewController.prototype.viewWillSetGeoProjection = function (geoProjection, view) {
        };
        EsriSceneViewController.prototype.viewDidSetGeoProjection = function (geoProjection, view) {
        };
        return EsriSceneViewController;
    }(EsriViewController));

    var INFO_COLOR = ui.Color.parse("#44d7b6");
    var WARN_COLOR = ui.Color.parse("#f9f070");
    var ALERT_COLOR = ui.Color.parse("#f6511d");
    var WARN_INTERPOLATOR = ui.ColorInterpolator.between(INFO_COLOR, WARN_COLOR);
    var ALERT_INTERPOLATOR = ui.ColorInterpolator.between(WARN_COLOR, ALERT_COLOR);
    var STATUS_TWEEN = ui.Transition.duration(500, ui.Ease.cubicOut);
    var SiteMapView = (function (_super) {
        __extends(SiteMapView, _super);
        function SiteMapView(nodeRef) {
            var _this = _super.call(this) || this;
            _this._nodeRef = nodeRef;
            return _this;
        }
        SiteMapView.prototype.onSetStatus = function (newStatus) {
            var severity = newStatus.get("severity").numberValue(0);
            if (severity === 0) {
                this.fill(INFO_COLOR, STATUS_TWEEN);
            }
            else if (severity <= 1) {
                var color = WARN_INTERPOLATOR.interpolate(severity);
                this.fill(color, STATUS_TWEEN);
                this.ripple(color, 1, 2500);
            }
            else {
                var color = ALERT_INTERPOLATOR.interpolate(severity - 1);
                this.fill(color, STATUS_TWEEN);
                this.ripple(color, 2, 5000);
            }
        };
        SiteMapView.prototype.ripple = function (color, width, duration) {
            var rootMapView = this.rootMapView;
            if (!this.isHidden() && !this.isCulled() && !document.hidden && this.geoBounds.intersects(rootMapView.geoFrame)) {
                var ripple_1 = new map.MapCircleView()
                    .geoCenter(this.geoCenter.value)
                    .radius(0)
                    .stroke(color)
                    .strokeWidth(width);
                rootMapView.appendChildView(ripple_1);
                var frame = rootMapView.viewFrame;
                var radius = Math.min(frame.width, frame.height) / 8;
                var tween = ui.Transition.duration(duration);
                ripple_1.stroke(color.alpha(0), tween)
                    .radius(radius, tween.onEnd(function () { ripple_1.remove(); }));
            }
        };
        Object.defineProperty(SiteMapView.prototype, "rootMapView", {
            get: function () {
                var rootMapView = this;
                do {
                    var parentView = rootMapView.parentView;
                    if (map.MapView.is(parentView)) {
                        rootMapView = parentView;
                        continue;
                    }
                    break;
                } while (true);
                return rootMapView;
            },
            enumerable: false,
            configurable: true
        });
        __decorate([
            ui.MemberAnimator(ui.Color)
        ], SiteMapView.prototype, "fill", void 0);
        __decorate([
            ui.MemberAnimator(ui.Color)
        ], SiteMapView.prototype, "stroke", void 0);
        __decorate([
            ui.MemberAnimator(ui.Color)
        ], SiteMapView.prototype, "strokeWidth", void 0);
        return SiteMapView;
    }(map.MapCircleView));

    var INFO_COLOR$1 = ui.Color.parse("#44d7b6").alpha(0.1);
    var WARN_COLOR$1 = ui.Color.parse("#f9f070").alpha(0.25);
    var ALERT_COLOR$1 = ui.Color.parse("#f6511d").alpha(0.5);
    var WARN_INTERPOLATOR$1 = ui.ColorInterpolator.between(INFO_COLOR$1, WARN_COLOR$1);
    var ALERT_INTERPOLATOR$1 = ui.ColorInterpolator.between(WARN_COLOR$1, ALERT_COLOR$1);
    var STATUS_TWEEN$1 = ui.Transition.duration(5000, ui.Ease.cubicOut);
    var RegionMapView = (function (_super) {
        __extends(RegionMapView, _super);
        function RegionMapView(nodeRef) {
            var _this = _super.call(this) || this;
            _this._nodeRef = nodeRef;
            _this._minZoom = -Infinity;
            _this._maxZoom = Infinity;
            _this._minSubRegionZoom = Infinity;
            _this._minSiteZoom = Infinity;
            _this._statusLink = null;
            _this._geometryLink = null;
            _this._subRegionsLink = null;
            _this._sitesLink = null;
            return _this;
        }
        RegionMapView.prototype.onSetStatus = function (newStatus) {
            var siteCount = newStatus.get("siteCount").numberValue(0);
            var warnCount = newStatus.get("warnCount").numberValue(0);
            var alertCount = newStatus.get("alertCount").numberValue(0);
            var warnRatio = warnCount / siteCount;
            var alertRatio = alertCount / siteCount;
            if (alertRatio > 0.015) {
                var u = Math.min((1 / 0.015) * (alertRatio - 0.015), 1);
                var color = ALERT_INTERPOLATOR$1.interpolate(u);
                this.fill(color.alpha(0.25 + 0.25 * u), STATUS_TWEEN$1)
                    .stroke(color.alpha(0.5 + 0.25 * u), STATUS_TWEEN$1)
                    .strokeWidth(1 + u, STATUS_TWEEN$1);
            }
            else if (warnRatio > 0.15) {
                var u = Math.min((1 / 0.15) * (warnRatio - 0.15), 1);
                var color = WARN_INTERPOLATOR$1.interpolate(u);
                this.fill(color.alpha(0.1 + 0.15 * u), STATUS_TWEEN$1)
                    .stroke(color.alpha(0.2 + 0.3 * u), STATUS_TWEEN$1)
                    .strokeWidth(1, STATUS_TWEEN$1);
            }
            else {
                this.fill(INFO_COLOR$1.alpha(0.1), STATUS_TWEEN$1)
                    .stroke(INFO_COLOR$1.alpha(0.2), STATUS_TWEEN$1)
                    .strokeWidth(1, STATUS_TWEEN$1);
            }
        };
        RegionMapView.prototype.onSetGeometry = function (newGeometry) {
            var minZoom = newGeometry.get("minZoom").numberValue(void 0);
            if (minZoom !== void 0) {
                this._minZoom = minZoom;
                this.requireUpdate(ui.View.NeedsProject);
            }
            var maxZoom = newGeometry.get("maxZoom").numberValue(void 0);
            if (maxZoom !== void 0) {
                this._maxZoom = maxZoom;
                this.requireUpdate(ui.View.NeedsProject);
            }
            var minSubRegionZoom = newGeometry.get("minSubRegionZoom").numberValue(void 0);
            if (minSubRegionZoom !== void 0) {
                this._minSubRegionZoom = minSubRegionZoom;
                this.requireUpdate(ui.View.NeedsProject);
            }
            var minSiteZoom = newGeometry.get("minSiteZoom").numberValue(void 0);
            if (minSiteZoom !== void 0) {
                this._minSiteZoom = minSiteZoom;
                this.requireUpdate(ui.View.NeedsProject);
            }
            var type = newGeometry.get("type").stringValue(void 0);
            if (type !== void 0) {
                var geometryView = this.getChildView("geometry");
                if (geometryView === null) {
                    geometryView = new map.MapGroupView();
                    this.setChildView("geometry", geometryView);
                }
                else {
                    geometryView.removeAll();
                }
                if (type === "Polygon") {
                    var coordinates = newGeometry.get("coordinates").toAny();
                    geometryView.append(map.MapPolygonView).points(coordinates[0]);
                }
                else if (type === "MultiPolygon") {
                    var coordinates = newGeometry.get("coordinates").toAny();
                    for (var i = 0; i < coordinates.length; i += 1) {
                        geometryView.append(map.MapPolygonView).points(coordinates[i][0]);
                    }
                }
            }
        };
        RegionMapView.prototype.onUpdateSubRegion = function (key, newSubRegionStatus) {
            var subRegionNodeUri = key.stringValue();
            var subRegionMapView = this.getChildView(subRegionNodeUri);
            if (subRegionMapView === null) {
                var subRegionNodeRef = this._nodeRef.nodeRef(subRegionNodeUri);
                subRegionMapView = new RegionMapView(subRegionNodeRef);
                this.setChildView(subRegionNodeUri, subRegionMapView);
            }
            subRegionMapView.onSetStatus(newSubRegionStatus);
        };
        RegionMapView.prototype.onRemoveSubRegion = function (key, oldSubRegionStatus) {
            var subRegionNodeUri = key.stringValue();
            this.removeChildView(subRegionNodeUri);
        };
        RegionMapView.prototype.onUpdateSite = function (key, newSiteStatus) {
            var siteNodeUri = key.stringValue();
            var siteMapView = this.getChildView(siteNodeUri);
            if (siteMapView === null) {
                var siteNodeRef = this._nodeRef.nodeRef(siteNodeUri);
                var coordinates = newSiteStatus.get("coordinates").toAny();
                siteMapView = new SiteMapView(siteNodeRef)
                    .geoCenter(coordinates)
                    .radius(4)
                    .fill(this.fill.value.alpha(1));
                this.setChildView(siteNodeUri, siteMapView);
            }
            siteMapView.onSetStatus(newSiteStatus);
        };
        RegionMapView.prototype.onRemoveSite = function (key, oldSiteStatus) {
            var siteNodeUri = key.stringValue();
            this.removeChildView(siteNodeUri);
        };
        RegionMapView.prototype.onMount = function () {
            _super.prototype.onMount.call(this);
            this.linkGeometry();
        };
        RegionMapView.prototype.onUnmount = function () {
            this.unlinkStatus();
            this.unlinkGeometry();
            this.unlinkSubRegions();
            this.unlinkSites();
            _super.prototype.onUnmount.call(this);
        };
        RegionMapView.prototype.didProject = function (viewContext) {
            var geometryView = this.getChildView("geometry");
            var geometryBounds;
            if (geometryView !== null) {
                geometryView.setHidden(viewContext.mapZoom >= this._maxZoom);
                geometryBounds = geometryView.geoBounds;
            }
            else {
                geometryBounds = viewContext.geoFrame;
            }
            this.setHidden(viewContext.mapZoom < this._minZoom);
            if (viewContext.mapZoom >= this._minSubRegionZoom && geometryBounds.intersects(viewContext.geoFrame)) {
                this.linkSubRegions();
            }
            else {
                this.unlinkSubRegions();
            }
            if (viewContext.mapZoom >= this._minSiteZoom && geometryBounds.intersects(viewContext.geoFrame)) {
                this.linkSites();
            }
            else {
                this.unlinkSites();
            }
            _super.prototype.didProject.call(this, viewContext);
        };
        RegionMapView.prototype.linkStatus = function () {
            if (this._statusLink === null) {
                this._statusLink = this._nodeRef.downlinkValue()
                    .laneUri("status")
                    .didSet(this.onSetStatus.bind(this))
                    .open();
            }
        };
        RegionMapView.prototype.unlinkStatus = function () {
            if (this._statusLink !== null) {
                this._statusLink.close();
                this._statusLink = null;
            }
        };
        RegionMapView.prototype.linkGeometry = function () {
            if (this._geometryLink === null) {
                this._geometryLink = this._nodeRef.downlinkValue()
                    .laneUri("geometry")
                    .didSet(this.onSetGeometry.bind(this))
                    .open();
            }
        };
        RegionMapView.prototype.unlinkGeometry = function () {
            if (this._geometryLink !== null) {
                this._geometryLink.close();
                this._geometryLink = null;
            }
        };
        RegionMapView.prototype.linkSubRegions = function () {
            if (this._subRegionsLink === null) {
                this._subRegionsLink = this._nodeRef.downlinkMap()
                    .laneUri("subRegions")
                    .didUpdate(this.onUpdateSubRegion.bind(this))
                    .didRemove(this.onRemoveSubRegion.bind(this))
                    .open();
            }
        };
        RegionMapView.prototype.unlinkSubRegions = function () {
            if (this._subRegionsLink !== null) {
                this._subRegionsLink.close();
                this._subRegionsLink = null;
                this._childViews.forEach(function (view) {
                    if (view instanceof RegionMapView) {
                        view.remove();
                    }
                }, this);
            }
        };
        RegionMapView.prototype.linkSites = function () {
            if (this._sitesLink === null) {
                this._sitesLink = this._nodeRef.downlinkMap()
                    .laneUri("sites")
                    .didUpdate(this.onUpdateSite.bind(this))
                    .didRemove(this.onRemoveSite.bind(this))
                    .open();
            }
        };
        RegionMapView.prototype.unlinkSites = function () {
            if (this._sitesLink !== null) {
                this._sitesLink.close();
                this._sitesLink = null;
                this._childViews.forEach(function (view) {
                    if (view instanceof SiteMapView) {
                        view.remove();
                    }
                }, this);
            }
        };
        __decorate([
            ui.MemberAnimator(ui.Color)
        ], RegionMapView.prototype, "fill", void 0);
        __decorate([
            ui.MemberAnimator(ui.Color)
        ], RegionMapView.prototype, "stroke", void 0);
        __decorate([
            ui.MemberAnimator(ui.Length)
        ], RegionMapView.prototype, "strokeWidth", void 0);
        return RegionMapView;
    }(map.MapLayerView));

    exports.RegionMapView = RegionMapView;
    exports.SiteMapView = SiteMapView;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=swim-cellular.js.map
