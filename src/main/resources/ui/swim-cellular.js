(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@swim/core'), require('@swim/ui'), require('@swim/map'), require('@swim/mapbox'), require('@swim/math'), require('@swim/view'), require('@swim/color'), require('@swim/font'), require('@swim/util'), require('@swim/codec'), require('@swim/structure'), require('@swim/length'), require('@swim/transition'), require('@swim/gesture'), require('@swim/angle'), require('@swim/transform'), require('@swim/gauge'), require('@swim/pie'), require('@swim/chart')) :
    typeof define === 'function' && define.amd ? define(['exports', '@swim/core', '@swim/ui', '@swim/map', '@swim/mapbox', '@swim/math', '@swim/view', '@swim/color', '@swim/font', '@swim/util', '@swim/codec', '@swim/structure', '@swim/length', '@swim/transition', '@swim/gesture', '@swim/angle', '@swim/transform', '@swim/gauge', '@swim/pie', '@swim/chart'], factory) :
    (global = global || self, factory((global.swim = global.swim || {}, global.swim.cellular = global.swim.cellular || {}), global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim));
}(this, (function (exports, core, ui, map, mapbox, math, view, color, font, util, codec, structure, length, transition, gesture, angle, transform, gauge) { 'use strict';

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

    var BoxShadow = (function () {
        function BoxShadow(inset, offsetX, offsetY, blurRadius, spreadRadius, color, next) {
            this.inset = inset;
            this.offsetX = offsetX;
            this.offsetY = offsetY;
            this.blurRadius = blurRadius;
            this.spreadRadius = spreadRadius;
            this.color = color;
            this.next = next;
        }
        BoxShadow.prototype.isDefined = function () {
            return this.inset || this.offsetX.isDefined() || this.offsetY.isDefined()
                || this.blurRadius.isDefined() || this.spreadRadius.isDefined()
                || this.color.isDefined() || (this.next !== null ? this.next.isDefined() : false);
        };
        BoxShadow.prototype.and = function (inset, offsetX, offsetY, blurRadius, spreadRadius, color) {
            var next = this.next !== null ? this.next.and.apply(this.next, arguments) : BoxShadow.of.apply(null, arguments);
            return new BoxShadow(this.inset, this.offsetX, this.offsetY, this.blurRadius, this.spreadRadius, this.color, next);
        };
        BoxShadow.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof BoxShadow) {
                return this.inset === that.inset && this.offsetX.equals(that.offsetX)
                    && this.offsetY.equals(that.offsetY) && this.blurRadius.equals(that.blurRadius)
                    && this.spreadRadius.equals(that.spreadRadius) && this.color.equals(that.color)
                    && util.Objects.equal(this.next, that.next);
            }
            return false;
        };
        BoxShadow.prototype.toString = function () {
            if (this.isDefined()) {
                var s = "";
                var boxShadow = this;
                do {
                    if (boxShadow.inset) {
                        s += "inset";
                        s += " ";
                    }
                    s += boxShadow.offsetX.toString();
                    s += " ";
                    s += boxShadow.offsetY.toString();
                    s += " ";
                    s += boxShadow.blurRadius.toString();
                    s += " ";
                    s += boxShadow.spreadRadius.toString();
                    s += " ";
                    s += boxShadow.color.toString();
                    if (boxShadow.next !== null) {
                        s += ", ";
                        boxShadow = boxShadow.next;
                        continue;
                    }
                    break;
                } while (true);
                return s;
            }
            else {
                return "none";
            }
        };
        BoxShadow.none = function () {
            if (BoxShadow._none === void 0) {
                BoxShadow._none = new BoxShadow(false, length.Length.zero(), length.Length.zero(), length.Length.zero(), length.Length.zero(), color.Color.black(), null);
            }
            return BoxShadow._none;
        };
        BoxShadow.of = function (inset, offsetX, offsetY, blurRadius, spreadRadius, color$1) {
            if (arguments.length === 1) {
                return BoxShadow.fromAny(arguments[0]);
            }
            else if (typeof inset !== "boolean") {
                if (arguments.length === 3) {
                    color$1 = color.Color.fromAny(arguments[2]);
                    spreadRadius = length.Length.zero();
                    blurRadius = length.Length.zero();
                    offsetY = length.Length.fromAny(arguments[1]);
                    offsetX = length.Length.fromAny(arguments[0]);
                }
                else if (arguments.length === 4) {
                    color$1 = color.Color.fromAny(arguments[3]);
                    spreadRadius = length.Length.zero();
                    blurRadius = length.Length.fromAny(arguments[2]);
                    offsetY = length.Length.fromAny(arguments[1]);
                    offsetX = length.Length.fromAny(arguments[0]);
                }
                else if (arguments.length === 5) {
                    color$1 = color.Color.fromAny(arguments[4]);
                    spreadRadius = length.Length.fromAny(arguments[3]);
                    blurRadius = length.Length.fromAny(arguments[2]);
                    offsetY = length.Length.fromAny(arguments[1]);
                    offsetX = length.Length.fromAny(arguments[0]);
                }
                else {
                    throw new TypeError("" + arguments);
                }
                inset = false;
            }
            else {
                if (arguments.length === 4) {
                    color$1 = color.Color.fromAny(arguments[3]);
                    spreadRadius = length.Length.zero();
                    blurRadius = length.Length.zero();
                    offsetX = length.Length.fromAny(arguments[1]);
                    offsetY = length.Length.fromAny(arguments[2]);
                }
                else if (arguments.length === 5) {
                    color$1 = color.Color.fromAny(arguments[4]);
                    spreadRadius = length.Length.zero();
                    blurRadius = length.Length.fromAny(arguments[3]);
                    offsetX = length.Length.fromAny(arguments[1]);
                    offsetY = length.Length.fromAny(arguments[2]);
                }
                else if (arguments.length === 6) {
                    color$1 = color.Color.fromAny(arguments[5]);
                    spreadRadius = length.Length.fromAny(arguments[4]);
                    blurRadius = length.Length.fromAny(arguments[3]);
                    offsetY = length.Length.fromAny(arguments[2]);
                    offsetX = length.Length.fromAny(arguments[1]);
                }
                else {
                    throw new TypeError("" + arguments);
                }
            }
            return new BoxShadow(inset, offsetX, offsetY, blurRadius, spreadRadius, color$1, null);
        };
        BoxShadow.fromAny = function () {
            var values = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                values[_i] = arguments[_i];
            }
            var value;
            if (arguments.length === 0) {
                value = BoxShadow.none();
            }
            else if (arguments.length === 1) {
                value = arguments[0];
            }
            else {
                value = arguments;
            }
            if (value instanceof BoxShadow) {
                return value;
            }
            else if (typeof value === "string") {
                return BoxShadow.parse(value);
            }
            else if (typeof value === "object" && value !== null && value.length === void 0) {
                value = value;
                var inset = value.inset || false;
                var offsetX = value.offsetX !== void 0 ? length.Length.fromAny(value.offsetX) : length.Length.zero();
                var offsetY = value.offsetY !== void 0 ? length.Length.fromAny(value.offsetY) : length.Length.zero();
                var blurRadius = value.blurRadius !== void 0 ? length.Length.fromAny(value.blurRadius) : length.Length.zero();
                var spreadRadius = value.spreadRadius !== void 0 ? length.Length.fromAny(value.spreadRadius) : length.Length.zero();
                var color$1 = value.color !== void 0 ? color.Color.fromAny(value.color) : color.Color.black();
                return new BoxShadow(inset, offsetX, offsetY, blurRadius, spreadRadius, color$1, null);
            }
            else if (typeof value === "object" && value !== null && value.length > 0) {
                value = value;
                var boxShadow = BoxShadow.fromAny(value[0]);
                for (var i = 1; i < value.length; i += 1) {
                    boxShadow = boxShadow.and(value[i]);
                }
                return boxShadow;
            }
            throw new TypeError("" + value);
        };
        BoxShadow.fromValue = function (value) {
            var boxShadow;
            value.forEach(function (item, index) {
                var header = item.header("boxShadow");
                if (header.isDefined()) {
                    var inset_1;
                    var offsetX_1;
                    var offsetY_1;
                    var blurRadius_1;
                    var spreadRadius_1;
                    var color_1;
                    header.forEach(function (item, index) {
                        var key = item.key.stringValue();
                        if (key !== void 0) {
                            if (key === "inset") {
                                inset_1 = item.toValue().booleanValue(inset_1);
                            }
                            else if (key === "offsetX") {
                                offsetX_1 = item.toValue().cast(length.Length.form(), offsetX_1);
                            }
                            else if (key === "offsetY") {
                                offsetY_1 = item.toValue().cast(length.Length.form(), offsetY_1);
                            }
                            else if (key === "blurRadius") {
                                blurRadius_1 = item.toValue().cast(length.Length.form(), blurRadius_1);
                            }
                            else if (key === "spreadRadius") {
                                spreadRadius_1 = item.toValue().cast(length.Length.form(), spreadRadius_1);
                            }
                            else if (key === "color") {
                                color_1 = item.toValue().cast(color.Color.form(), color_1);
                            }
                        }
                        else if (item instanceof structure.Value) {
                            if (index === 0 && item instanceof structure.Text && item.value === "inset") {
                                inset_1 = true;
                            }
                            else if (index === 0 || index === 1 && inset_1 !== void 0) {
                                offsetX_1 = item.cast(length.Length.form(), offsetX_1);
                            }
                            else if (index === 1 || index === 2 && inset_1 !== void 0) {
                                offsetY_1 = item.cast(length.Length.form(), offsetY_1);
                            }
                            else if (index === 2 || index === 3 && inset_1 !== void 0) {
                                blurRadius_1 = item.cast(length.Length.form(), blurRadius_1);
                                if (blurRadius_1 === void 0) {
                                    color_1 = item.cast(color.Color.form(), color_1);
                                }
                            }
                            else if ((index === 3 || index === 4 && inset_1 === void 0) && color_1 === void 0) {
                                spreadRadius_1 = item.cast(length.Length.form(), spreadRadius_1);
                                if (spreadRadius_1 === void 0) {
                                    color_1 = item.cast(color.Color.form(), color_1);
                                }
                            }
                            else if ((index === 4 || index === 5 && inset_1 === void 0) && color_1 === void 0) {
                                color_1 = item.cast(color.Color.form(), color_1);
                            }
                        }
                    });
                    inset_1 = inset_1 !== void 0 ? inset_1 : false;
                    offsetX_1 = offsetX_1 !== void 0 ? offsetX_1 : length.Length.zero();
                    offsetY_1 = offsetY_1 !== void 0 ? offsetY_1 : length.Length.zero();
                    blurRadius_1 = blurRadius_1 !== void 0 ? blurRadius_1 : length.Length.zero();
                    spreadRadius_1 = spreadRadius_1 !== void 0 ? spreadRadius_1 : length.Length.zero();
                    color_1 = color_1 !== void 0 ? color_1 : color.Color.black();
                    var next = new BoxShadow(inset_1 || false, offsetX_1, offsetY_1, blurRadius_1, spreadRadius_1, color_1, null);
                    if (boxShadow !== void 0) {
                        boxShadow = boxShadow.and(next);
                    }
                    else {
                        boxShadow = next;
                    }
                }
            });
            return boxShadow;
        };
        BoxShadow.parse = function (string) {
            var input = codec.Unicode.stringInput(string);
            while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                input = input.step();
            }
            var parser = BoxShadow.Parser.parse(input);
            if (parser.isDone()) {
                while (input.isCont() && codec.Unicode.isWhitespace(input.head())) {
                    input = input.step();
                }
            }
            if (input.isCont() && !parser.isError()) {
                parser = codec.Parser.error(codec.Diagnostic.unexpected(input));
            }
            return parser.bind();
        };
        BoxShadow.isInit = function (value) {
            if (typeof value === "object" && value !== null) {
                var init = value;
                return init.offsetX !== void 0 && init.offsetY !== void 0 && init.color !== void 0;
            }
            return false;
        };
        BoxShadow.form = function (unit) {
            if (unit !== void 0) {
                unit = BoxShadow.fromAny(unit);
            }
            if (unit !== BoxShadow.none()) {
                return new BoxShadow.Form(unit);
            }
            else {
                if (BoxShadow._form === void 0) {
                    BoxShadow._form = new BoxShadow.Form(BoxShadow.none());
                }
                return BoxShadow._form;
            }
        };
        return BoxShadow;
    }());

    var BoxShadowParser = (function (_super) {
        __extends(BoxShadowParser, _super);
        function BoxShadowParser(boxShadow, identOutput, offsetXParser, offsetYParser, blurRadiusParser, spreadRadiusParser, colorParser, step) {
            var _this = _super.call(this) || this;
            _this.boxShadow = boxShadow;
            _this.identOutput = identOutput;
            _this.offsetXParser = offsetXParser;
            _this.offsetYParser = offsetYParser;
            _this.blurRadiusParser = blurRadiusParser;
            _this.spreadRadiusParser = spreadRadiusParser;
            _this.colorParser = colorParser;
            _this.step = step;
            return _this;
        }
        BoxShadowParser.prototype.feed = function (input) {
            return BoxShadowParser.parse(input, this.boxShadow, this.identOutput, this.offsetXParser, this.offsetYParser, this.blurRadiusParser, this.spreadRadiusParser, this.colorParser, this.step);
        };
        BoxShadowParser.parse = function (input, boxShadow, identOutput, offsetXParser, offsetYParser, blurRadiusParser, spreadRadiusParser, colorParser, step) {
            if (step === void 0) { step = 1; }
            var c = 0;
            do {
                if (step === 1) {
                    while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                        input.step();
                    }
                    if (input.isCont()) {
                        if (codec.Unicode.isAlpha(c)) {
                            step = 2;
                        }
                        else {
                            step = 4;
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 2) {
                    identOutput = identOutput || codec.Unicode.stringOutput();
                    while (input.isCont() && (c = input.head(), codec.Unicode.isAlpha(c))) {
                        input = input.step();
                        identOutput.write(c);
                    }
                    if (!input.isEmpty()) {
                        var ident = identOutput.bind();
                        switch (ident) {
                            case "inset":
                                step = 3;
                                break;
                            case "none": return codec.Parser.done(BoxShadow.none());
                            default: return codec.Parser.error(codec.Diagnostic.message("unknown box-shadow: " + ident, input));
                        }
                    }
                }
                if (step === 3) {
                    if (input.isCont()) {
                        if (codec.Unicode.isSpace(input.head())) {
                            input.step();
                            step = 4;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected("space", input));
                        }
                    }
                    else if (input.isDone()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 4) {
                    if (offsetXParser === void 0) {
                        while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                            input.step();
                        }
                        if (!input.isEmpty()) {
                            offsetXParser = length.LengthParser.parse(input);
                        }
                    }
                    else {
                        offsetXParser = offsetXParser.feed(input);
                    }
                    if (offsetXParser !== void 0) {
                        if (offsetXParser.isDone()) {
                            step = 5;
                        }
                        else if (offsetXParser.isError()) {
                            return offsetXParser.asError();
                        }
                    }
                }
                if (step === 5) {
                    if (input.isCont()) {
                        if (codec.Unicode.isSpace(input.head())) {
                            input.step();
                            step = 6;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected("space", input));
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 6) {
                    if (offsetYParser === void 0) {
                        while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                            input.step();
                        }
                        if (!input.isEmpty()) {
                            offsetYParser = length.LengthParser.parse(input);
                        }
                    }
                    else {
                        offsetYParser = offsetYParser.feed(input);
                    }
                    if (offsetYParser !== void 0) {
                        if (offsetYParser.isDone()) {
                            step = 7;
                        }
                        else if (offsetYParser.isError()) {
                            return offsetYParser.asError();
                        }
                    }
                }
                if (step === 7) {
                    if (input.isCont()) {
                        if (codec.Unicode.isSpace(input.head())) {
                            input.step();
                            step = 8;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected("space", input));
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 8) {
                    if (blurRadiusParser === void 0) {
                        while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                            input.step();
                        }
                        if (input.isCont() && (c === 45 || c >= 48 && c <= 57)) {
                            blurRadiusParser = length.LengthParser.parse(input);
                        }
                        else if (!input.isEmpty()) {
                            step = 12;
                        }
                    }
                    else {
                        blurRadiusParser = blurRadiusParser.feed(input);
                    }
                    if (blurRadiusParser !== void 0) {
                        if (blurRadiusParser.isDone()) {
                            step = 9;
                        }
                        else if (blurRadiusParser.isError()) {
                            return blurRadiusParser.asError();
                        }
                    }
                }
                if (step === 9) {
                    if (input.isCont()) {
                        if (codec.Unicode.isSpace(input.head())) {
                            input.step();
                            step = 10;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected("space", input));
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 10) {
                    if (spreadRadiusParser === void 0) {
                        while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                            input.step();
                        }
                        if (input.isCont() && (c === 45 || c >= 48 && c <= 57)) {
                            spreadRadiusParser = length.LengthParser.parse(input);
                        }
                        else if (!input.isEmpty()) {
                            step = 12;
                        }
                    }
                    else {
                        spreadRadiusParser = spreadRadiusParser.feed(input);
                    }
                    if (spreadRadiusParser !== void 0) {
                        if (spreadRadiusParser.isDone()) {
                            step = 11;
                        }
                        else if (spreadRadiusParser.isError()) {
                            return spreadRadiusParser.asError();
                        }
                    }
                }
                if (step === 11) {
                    if (input.isCont()) {
                        if (codec.Unicode.isSpace(input.head())) {
                            input.step();
                            step = 12;
                        }
                        else {
                            return codec.Parser.error(codec.Diagnostic.expected("space", input));
                        }
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.error(codec.Diagnostic.unexpected(input));
                    }
                }
                if (step === 12) {
                    if (colorParser === void 0) {
                        while (input.isCont() && codec.Unicode.isSpace(input.head())) {
                            input.step();
                        }
                        if (!input.isEmpty()) {
                            colorParser = color.ColorParser.parse(input);
                        }
                    }
                    else {
                        colorParser = colorParser.feed(input);
                    }
                    if (colorParser !== void 0) {
                        if (colorParser.isDone()) {
                            var inset = identOutput !== void 0 ? identOutput.bind() === "inset" : false;
                            var offsetX = offsetXParser.bind();
                            var offsetY = offsetYParser.bind();
                            var blurRadius = blurRadiusParser !== void 0 ? blurRadiusParser.bind() : length.Length.zero();
                            var spreadRadius = spreadRadiusParser !== void 0 ? spreadRadiusParser.bind() : length.Length.zero();
                            var color$1 = colorParser.bind();
                            var next = new BoxShadow(inset, offsetX, offsetY, blurRadius, spreadRadius, color$1, null);
                            if (boxShadow === void 0) {
                                boxShadow = next;
                            }
                            else {
                                boxShadow = boxShadow.and(next);
                            }
                            identOutput = void 0;
                            offsetXParser = void 0;
                            offsetYParser = void 0;
                            blurRadiusParser = void 0;
                            spreadRadiusParser = void 0;
                            colorParser = void 0;
                            step = 13;
                        }
                        else if (colorParser.isError()) {
                            return colorParser.asError();
                        }
                    }
                }
                if (step === 13) {
                    while (input.isCont() && (c = input.head(), codec.Unicode.isSpace(c))) {
                        input.step();
                    }
                    if (input.isCont() && c === 44) {
                        input.step();
                        step = 1;
                        continue;
                    }
                    else if (!input.isEmpty()) {
                        return codec.Parser.done(boxShadow);
                    }
                }
                break;
            } while (true);
            return new BoxShadowParser(boxShadow, identOutput, offsetXParser, offsetYParser, blurRadiusParser, spreadRadiusParser, colorParser, step);
        };
        return BoxShadowParser;
    }(codec.Parser));
    BoxShadow.Parser = BoxShadowParser;

    var BoxShadowForm = (function (_super) {
        __extends(BoxShadowForm, _super);
        function BoxShadowForm(unit) {
            var _this = _super.call(this) || this;
            _this._unit = unit;
            return _this;
        }
        BoxShadowForm.prototype.unit = function (unit) {
            if (arguments.length === 0) {
                return this._unit;
            }
            else {
                return new BoxShadowForm(unit);
            }
        };
        BoxShadowForm.prototype.mold = function (boxShadow) {
            var shadow = BoxShadow.fromAny(boxShadow);
            var record = structure.Record.create();
            do {
                var header = structure.Record.create(5);
                if (shadow.inset) {
                    header.push("inset");
                }
                header.push(length.Length.form().mold(shadow.offsetX));
                header.push(length.Length.form().mold(shadow.offsetY));
                header.push(length.Length.form().mold(shadow.blurRadius));
                header.push(length.Length.form().mold(shadow.spreadRadius));
                header.push(color.Color.form().mold(shadow.color));
                record.attr("boxShadow", header);
                if (shadow.next !== null) {
                    shadow = shadow.next;
                    continue;
                }
                break;
            } while (true);
            return record;
        };
        BoxShadowForm.prototype.cast = function (item) {
            var value = item.toValue();
            var boxShadow;
            try {
                boxShadow = BoxShadow.fromValue(value);
                if (boxShadow === void 0) {
                    var string = value.stringValue();
                    if (string !== void 0) {
                        boxShadow = BoxShadow.parse(string);
                    }
                }
            }
            catch (e) {
            }
            return boxShadow;
        };
        return BoxShadowForm;
    }(structure.Form));
    BoxShadow.Form = BoxShadowForm;

    var DarkBase = (function () {
        function DarkBase() {
            this.font = font.Font.parse("14px sans-serif");
            this.color = color.Color.parse("#ffffff");
            this.backgroundColor = color.Color.parse("#1e2022");
        }
        return DarkBase;
    }());
    var DarkPrimary = (function () {
        function DarkPrimary() {
            this.fillColor = color.Color.parse("#32c5ff");
            this.iconColor = color.Color.parse("#1e2022");
        }
        return DarkPrimary;
    }());
    var DarkSecondary = (function () {
        function DarkSecondary() {
            this.fillColor = color.Color.parse("#44d7b6");
            this.iconColor = color.Color.parse("#1e2022");
        }
        return DarkSecondary;
    }());
    var DarkDisabled = (function () {
        function DarkDisabled() {
            this.fillColor = color.Color.parse("#7b7c7d");
            this.iconColor = color.Color.parse("#ffffff");
        }
        return DarkDisabled;
    }());
    var DarkFloating = (function () {
        function DarkFloating() {
            this.shadow = BoxShadow.of(0, 2, 4, 0, color.Color.black(0.5));
        }
        return DarkFloating;
    }());
    var DarkTheme = (function () {
        function DarkTheme() {
            this.base = new DarkBase();
            this.primary = new DarkPrimary();
            this.secondary = new DarkSecondary();
            this.disabled = new DarkDisabled();
            this.floating = new DarkFloating();
        }
        DarkTheme.prototype.getStyle = function (view) {
            return null;
        };
        return DarkTheme;
    }());

    var LightBase = (function () {
        function LightBase() {
            this.font = font.Font.parse("14px sans-serif");
            this.color = color.Color.parse("#4a4a4a");
            this.backgroundColor = color.Color.parse("#ffffff");
        }
        return LightBase;
    }());
    var LightPrimary = (function () {
        function LightPrimary() {
            this.fillColor = color.Color.parse("#32c5ff");
            this.iconColor = color.Color.parse("#1e2022");
        }
        return LightPrimary;
    }());
    var LightSecondary = (function () {
        function LightSecondary() {
            this.fillColor = color.Color.parse("#44d7b6");
            this.iconColor = color.Color.parse("#1e2022");
        }
        return LightSecondary;
    }());
    var LightDisabled = (function () {
        function LightDisabled() {
            this.fillColor = color.Color.parse("#7b7c7d");
            this.iconColor = color.Color.parse("#ffffff");
        }
        return LightDisabled;
    }());
    var LightFloating = (function () {
        function LightFloating() {
            this.shadow = BoxShadow.of(0, 2, 4, 0, color.Color.black(0.5));
        }
        return LightFloating;
    }());
    var LightTheme = (function () {
        function LightTheme() {
            this.base = new LightBase();
            this.primary = new LightPrimary();
            this.secondary = new LightSecondary();
            this.disabled = new LightDisabled();
            this.floating = new LightFloating();
        }
        LightTheme.prototype.getStyle = function (view) {
            return null;
        };
        return LightTheme;
    }());

    var Theme = {};
    Object.defineProperty(Theme, "dark", {
        get: function () {
            var theme = new DarkTheme();
            Object.defineProperty(Theme, "dark", {
                value: theme,
                enumerable: true,
                configurable: true,
                writable: true,
            });
            return theme;
        },
        set: function (theme) {
            Object.defineProperty(Theme, "dark", {
                value: theme,
                enumerable: true,
                configurable: true,
                writable: true,
            });
        },
        enumerable: true,
        configurable: true,
    });
    Object.defineProperty(Theme, "light", {
        get: function () {
            var theme = new LightTheme();
            Object.defineProperty(Theme, "light", {
                value: theme,
                enumerable: true,
                configurable: true,
                writable: true,
            });
            return theme;
        },
        set: function (theme) {
            Object.defineProperty(Theme, "light", {
                value: theme,
                enumerable: true,
                configurable: true,
                writable: true,
            });
        },
        enumerable: true,
        configurable: true,
    });

    var ScrimView = (function (_super) {
        __extends(ScrimView, _super);
        function ScrimView(node) {
            var _this = _super.call(this, node) || this;
            _this._modalState = "hidden";
            _this._transition = transition.Transition.duration(250, transition.Ease.cubicOut);
            _this.onClick = _this.onClick.bind(_this);
            _this.onSyntheticClick = _this.onSyntheticClick.bind(_this);
            if (typeof PointerEvent !== "undefined") {
                _this.on("pointerup", _this.onClick, { passive: true });
                _this.on("click", _this.onSyntheticClick);
            }
            else if (typeof TouchEvent !== "undefined") {
                _this.onSyntheticClick = _this.onSyntheticClick.bind(_this);
                _this.on("touchend", _this.onClick, { passive: true });
                _this.on("click", _this.onSyntheticClick);
            }
            else {
                _this.on("click", _this.onClick);
            }
            return _this;
        }
        ScrimView.prototype.initNode = function (node) {
            this.addClass("scrim")
                .display("none")
                .position("absolute")
                .top(0)
                .right(0)
                .bottom(0)
                .left(0)
                .pointerEvents("auto")
                .cursor("pointer");
            this.backgroundColor.setAutoState(color.Color.black(0));
        };
        Object.defineProperty(ScrimView.prototype, "modalState", {
            get: function () {
                return this._modalState;
            },
            enumerable: false,
            configurable: true
        });
        ScrimView.prototype.isShown = function () {
            return this._modalState === "shown" || this._modalState === "showing";
        };
        ScrimView.prototype.isHidden = function () {
            return this._modalState === "hidden" || this._modalState === "hiding";
        };
        ScrimView.prototype.transition = function (transition$1) {
            if (transition$1 === void 0) {
                return this._transition;
            }
            else {
                transition$1 = transition.Transition.fromAny(transition$1);
                this._transition = transition$1;
                return this;
            }
        };
        ScrimView.prototype.show = function (opacity, tween) {
            if (this._modalState === "hidden" || this._modalState === "hiding") {
                if (tween === void 0 || tween === true) {
                    tween = this._transition;
                }
                else {
                    tween = transition.Transition.forTween(tween);
                }
                this.willShow();
                this.display("block");
                if (tween !== null) {
                    this.backgroundColor.setAutoState(color.Color.black(0));
                    this.backgroundColor.setAutoState(color.Color.black(opacity), tween.onEnd(this.didShow.bind(this)));
                }
                else {
                    this.backgroundColor.setAutoState(color.Color.black(opacity));
                    this.didShow();
                }
            }
        };
        ScrimView.prototype.willShow = function () {
            this._modalState = "showing";
        };
        ScrimView.prototype.didShow = function () {
            this._modalState = "shown";
        };
        ScrimView.prototype.hide = function (tween) {
            if (this._modalState === "shown" || this._modalState === "showing") {
                if (tween === void 0 || tween === true) {
                    tween = this._transition;
                }
                else {
                    tween = transition.Transition.forTween(tween);
                }
                this.willHide();
                if (tween !== null) {
                    this.backgroundColor.setAutoState(color.Color.black(0), tween.onEnd(this.didHide.bind(this)));
                }
                else {
                    this.backgroundColor.setAutoState(color.Color.black(0));
                    this.didHide();
                }
            }
        };
        ScrimView.prototype.willHide = function () {
            this._modalState = "hiding";
        };
        ScrimView.prototype.didHide = function () {
            this._modalState = "hidden";
            this.display("none");
        };
        ScrimView.prototype.onClick = function (event) {
            var rootView = this.rootView;
            if (rootView instanceof view.UiView) {
                event.stopPropagation();
                rootView.onFallthroughClick(event);
            }
        };
        ScrimView.prototype.onSyntheticClick = function (event) {
            event.preventDefault();
            event.stopPropagation();
        };
        return ScrimView;
    }(view.HtmlView));

    var IlluminationView = (function (_super) {
        __extends(IlluminationView, _super);
        function IlluminationView(node) {
            var _this = _super.call(this, node) || this;
            _this._illuminationState = "passivated";
            _this._illuminationTimer = 0;
            return _this;
        }
        IlluminationView.prototype.initNode = function (node) {
            this.addClass("illumination")
                .position("absolute")
                .width(length.Length.zero())
                .height(length.Length.zero())
                .borderRadius(length.Length.pct(50))
                .backgroundColor(color.Color.white())
                .pointerEvents("none");
        };
        Object.defineProperty(IlluminationView.prototype, "illuminationState", {
            get: function () {
                return this._illuminationState;
            },
            enumerable: false,
            configurable: true
        });
        IlluminationView.prototype.onUnmount = function () {
            this._illuminationState = "passivated";
            this.cancelIlluminate();
            _super.prototype.onUnmount.call(this);
        };
        IlluminationView.prototype.illuminate = function (clientX, clientY, opacity, transition, delay) {
            if (delay === void 0) { delay = 0; }
            if (this._illuminationState === "passivated") {
                this.cancelIlluminate();
                if (delay !== 0) {
                    var illuminate = this.illuminate.bind(this, clientX, clientY, opacity, transition, 0);
                    this._illuminationTimer = setTimeout(illuminate, delay);
                }
                else {
                    this.willIlluminate();
                    var clientBounds = this._node.offsetParent.getBoundingClientRect();
                    var cx = clientX - clientBounds.left;
                    var cy = clientY - clientBounds.top;
                    var rx = Math.max(cx, clientBounds.width - cx);
                    var ry = Math.max(cy, clientBounds.height - cy);
                    var r = Math.sqrt(rx * rx + ry * ry);
                    this.opacity(opacity);
                    if (transition !== null) {
                        this.left(cx)
                            .top(cy)
                            .left(cx - r, transition.onEnd(this.didIlluminate.bind(this)))
                            .top(cy - r, transition)
                            .width(2 * r, transition)
                            .height(2 * r, transition);
                    }
                    else {
                        this.left(cx - r)
                            .top(cy - r)
                            .width(2 * r)
                            .height(2 * r);
                        this.didIlluminate();
                    }
                    this._illuminationState = "illuminated";
                }
            }
        };
        IlluminationView.prototype.willIlluminate = function () {
        };
        IlluminationView.prototype.didIlluminate = function () {
        };
        IlluminationView.prototype.cancelIlluminate = function () {
            if (this._illuminationTimer !== 0) {
                clearTimeout(this._illuminationTimer);
                this._illuminationTimer = 0;
            }
        };
        IlluminationView.prototype.stimulate = function (clientX, clientY, opacity, transition) {
            if (this._illuminationState === "passivated") {
                this.illuminate(clientX, clientY, opacity, transition);
            }
            if (this._illuminationState === "illuminated") {
                this.willStimulate();
                if (transition !== null) {
                    this.opacity(0, transition.onEnd(this.didStimulate.bind(this)));
                }
                else {
                    this.opacity(0);
                    this.didStimulate();
                }
                this._illuminationState = "stimulated";
            }
        };
        IlluminationView.prototype.willStimulate = function () {
        };
        IlluminationView.prototype.didStimulate = function () {
            this.remove();
        };
        IlluminationView.prototype.dissipate = function (clientX, clientY, transition) {
            if (this._illuminationState === "passivated") {
                this.cancelIlluminate();
                this.didDissipate();
            }
            else if (this._illuminationState === "illuminated") {
                this.willDissipate();
                if (transition !== null) {
                    this.opacity(0, transition.onEnd(this.didDissipate.bind(this)));
                }
                else {
                    this.opacity(0);
                    this.didDissipate();
                }
            }
            this._illuminationState = "dissipated";
        };
        IlluminationView.prototype.willDissipate = function () {
        };
        IlluminationView.prototype.didDissipate = function () {
            this.remove();
        };
        return IlluminationView;
    }(view.HtmlView));

    var TactileView = (function (_super) {
        __extends(TactileView, _super);
        function TactileView(node) {
            return _super.call(this, node) || this;
        }
        TactileView.prototype.initNode = function (node) {
            this.addClass("tactile");
        };
        Object.defineProperty(TactileView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TactileView.prototype, "tactileTransition", {
            get: function () {
                return transition.Transition.duration(250, transition.Ease.cubicOut);
            },
            enumerable: false,
            configurable: true
        });
        TactileView.prototype.onBeginTrack = function (track, event) {
            if (track.view === void 0) {
                var delay = track.pointerType === "mouse" ? 0 : 100;
                var illumination = this.prepend(IlluminationView);
                illumination.illuminate(track.x, track.y, 0.1, this.tactileTransition, delay);
                track.view = illumination;
            }
        };
        TactileView.prototype.onMoveTrack = function (track, event) {
            _super.prototype.onMoveTrack.call(this, track, event);
            if (!this.clientBounds.contains(track.x, track.y)) {
                track.preventDefault();
                this.beginHover(track.id, track.pointerType, event);
                if (track.view instanceof IlluminationView) {
                    track.view.dissipate(track.x, track.y, this.tactileTransition);
                }
            }
        };
        TactileView.prototype.onEndTrack = function (track, event) {
            if (track.view instanceof IlluminationView) {
                if (this.clientBounds.contains(track.x, track.y)) {
                    track.view.stimulate(track.x, track.y, 0.1, this.tactileTransition);
                }
                else {
                    track.view.dissipate(track.x, track.y, this.tactileTransition);
                }
            }
        };
        TactileView.prototype.onCancelTrack = function (track, event) {
            if (track.view instanceof IlluminationView) {
                track.view.dissipate(track.x, track.y, this.tactileTransition);
            }
        };
        return TactileView;
    }(gesture.GestureView));

    var PopoverView = (function (_super) {
        __extends(PopoverView, _super);
        function PopoverView(node) {
            if (node === void 0) { node = document.createElement("div"); }
            var _this = _super.call(this, node) || this;
            _this.arrowWidth.setState(length.Length.fromAny(10));
            _this.arrowHeight.setState(length.Length.fromAny(8));
            _this._source = null;
            _this._sourceFrame = null;
            _this._modalState = "shown";
            _this._placement = ["top", "bottom", "right", "left"];
            _this._placementFrame = null;
            _this._popoverTransition = transition.Transition.duration(250, transition.Ease.cubicOut);
            var arrow = _this.createArrow();
            if (arrow !== null) {
                var arrowView = view.View.fromNode(arrow);
                _this.prependChildView(arrowView, "arrow");
            }
            return _this;
        }
        PopoverView.prototype.createArrow = function () {
            var arrow = document.createElement("div");
            arrow.setAttribute("class", "popover-arrow");
            arrow.style.setProperty("display", "none");
            arrow.style.setProperty("position", "absolute");
            arrow.style.setProperty("width", "0");
            arrow.style.setProperty("height", "0");
            return arrow;
        };
        Object.defineProperty(PopoverView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PopoverView.prototype, "source", {
            get: function () {
                return this._source;
            },
            enumerable: false,
            configurable: true
        });
        PopoverView.prototype.setSource = function (source) {
            if (this._source !== source) {
                this.willSetSource(source);
                if (this._source !== null && this.isMounted()) {
                    this._source.removeViewObserver(this);
                }
                this._source = source;
                this.onSetSource(source);
                if (this._source !== null && this.isMounted()) {
                    this._source.addViewObserver(this);
                }
                this.didSetSource(source);
            }
        };
        PopoverView.prototype.willSetSource = function (source) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.popoverWillSetSource !== void 0) {
                    viewObserver.popoverWillSetSource(source, this);
                }
            });
        };
        PopoverView.prototype.onSetSource = function (source) {
            this.requireUpdate(view.View.NeedsLayout);
        };
        PopoverView.prototype.didSetSource = function (source) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.popoverDidSetSource !== void 0) {
                    viewObserver.popoverDidSetSource(source, this);
                }
            });
        };
        Object.defineProperty(PopoverView.prototype, "modalState", {
            get: function () {
                return this._modalState;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(PopoverView.prototype, "modalView", {
            get: function () {
                return this;
            },
            enumerable: false,
            configurable: true
        });
        PopoverView.prototype.toggleModal = function (tween) {
            if (this._modalState === "hidden" || this._modalState === "hiding") {
                this.showModal(tween);
            }
            else if (this._modalState === "shown" || this._modalState === "showing") {
                this.hideModal(tween);
            }
        };
        PopoverView.prototype.showModal = function (tween) {
            if (this._modalState === "hidden" || this._modalState === "hiding") {
                if (tween === void 0 || tween === true) {
                    tween = this._popoverTransition;
                }
                else {
                    tween = transition.Transition.forTween(tween);
                }
                this.willShow();
                var placement = this.place();
                if (tween !== null) {
                    tween = tween.onEnd(this.didShow.bind(this));
                    if (placement === "above") {
                        this.opacity.setState(void 0);
                        if (this.marginTop.value === void 0) {
                            this.marginTop(-this._node.clientHeight);
                        }
                        this.marginTop(0, tween);
                    }
                    else if (placement === "below") {
                        this.opacity.setState(void 0);
                        if (this.marginTop.value === void 0) {
                            this.marginTop(this._node.clientHeight);
                        }
                        this.marginTop(0, tween);
                    }
                    else {
                        this.marginTop.setState(void 0);
                        if (this.opacity.value === void 0) {
                            this.opacity(0);
                        }
                        this.opacity(1, tween);
                    }
                }
                else {
                    this.didShow();
                }
            }
        };
        PopoverView.prototype.willShow = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.popoverWillShow !== void 0) {
                    viewObserver.popoverWillShow(this);
                }
            });
            this.visibility("visible");
            this._modalState = "showing";
        };
        PopoverView.prototype.didShow = function () {
            this._modalState = "shown";
            this.pointerEvents("auto");
            this.marginTop.setState(void 0);
            this.opacity.setState(void 0);
            this.didObserve(function (viewObserver) {
                if (viewObserver.popoverDidShow !== void 0) {
                    viewObserver.popoverDidShow(this);
                }
            });
        };
        PopoverView.prototype.hideModal = function (tween) {
            if (this._modalState === "shown" || this._modalState === "showing") {
                if (tween === void 0 || tween === true) {
                    tween = this._popoverTransition;
                }
                else {
                    tween = transition.Transition.forTween(tween);
                }
                this.willHide();
                var placement = this.place();
                if (tween !== null) {
                    tween = tween.onEnd(this.didHide.bind(this));
                    if (placement === "above") {
                        this.opacity.setState(void 0);
                        if (this.marginTop.value === void 0) {
                            this.marginTop(0);
                        }
                        this.marginTop(-this._node.clientHeight, tween);
                    }
                    else if (placement === "below") {
                        this.opacity.setState(void 0);
                        if (this.marginTop.value === void 0) {
                            this.marginTop(0);
                        }
                        this.marginTop(this._node.clientHeight, tween);
                    }
                    else {
                        this.marginTop.setState(void 0);
                        if (this.opacity.value === void 0) {
                            this.opacity(1);
                        }
                        this.opacity(0, tween);
                    }
                }
                else {
                    this.didHide();
                }
            }
        };
        PopoverView.prototype.willHide = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.popoverWillHide !== void 0) {
                    viewObserver.popoverWillHide(this);
                }
            });
            this.pointerEvents("none");
            this._modalState = "hiding";
        };
        PopoverView.prototype.didHide = function () {
            this._modalState = "hidden";
            this.visibility("hidden");
            this.marginTop.setState(void 0);
            this.opacity.setState(void 0);
            this.didObserve(function (viewObserver) {
                if (viewObserver.popoverDidHide !== void 0) {
                    viewObserver.popoverDidHide(this);
                }
            });
        };
        PopoverView.prototype.placement = function (placement) {
            if (placement === void 0) {
                return this._placement;
            }
            else {
                if (!util.Objects.equalArray(this._placement, placement)) {
                    this._placement.length = 0;
                    for (var i = 0, n = placement.length; i < n; i += 1) {
                        this._placement.push(placement[i]);
                    }
                    this.place();
                }
                return this;
            }
        };
        PopoverView.prototype.placementFrame = function (placementFrame) {
            if (placementFrame === void 0) {
                return this._placementFrame;
            }
            else {
                if (!util.Objects.equal(this._placementFrame, placementFrame)) {
                    this._placementFrame = placementFrame;
                    this.place();
                }
                return this;
            }
        };
        PopoverView.prototype.popoverTransition = function (popoverTransition) {
            if (popoverTransition === void 0) {
                return this._popoverTransition;
            }
            else {
                if (popoverTransition !== null) {
                    popoverTransition = transition.Transition.fromAny(popoverTransition);
                }
                return this;
            }
        };
        PopoverView.prototype.modifyUpdate = function (updateFlags) {
            var additionalFlags = 0;
            if ((updateFlags & (view.View.NeedsScroll | view.View.NeedsAnimate)) !== 0) {
                additionalFlags |= view.View.NeedsLayout;
            }
            additionalFlags |= _super.prototype.modifyUpdate.call(this, updateFlags | additionalFlags);
            return additionalFlags;
        };
        PopoverView.prototype.didMount = function () {
            if (this._source !== null) {
                this._source.addViewObserver(this);
            }
            _super.prototype.didMount.call(this);
        };
        PopoverView.prototype.willUnmount = function () {
            _super.prototype.willUnmount.call(this);
            if (this._source !== null) {
                this._source.removeViewObserver(this);
            }
        };
        PopoverView.prototype.onLayout = function (viewContext) {
            _super.prototype.onLayout.call(this, viewContext);
            this.place();
        };
        PopoverView.prototype.place = function () {
            var source = this._source;
            var oldSourceFrame = this._sourceFrame;
            var newSourceFrame = source !== null ? source.popoverFrame : null;
            if (newSourceFrame !== null && this._placement.length !== 0 && !newSourceFrame.equals(oldSourceFrame)) {
                var placement = this.placePopover(source, newSourceFrame);
                var arrow = this.getChildView("arrow");
                if (arrow instanceof view.HtmlView) {
                    this.placeArrow(source, newSourceFrame, arrow, placement);
                }
                return placement;
            }
            else {
                return "none";
            }
        };
        PopoverView.prototype.placePopover = function (source, sourceFrame) {
            var node = this._node;
            var parent = node.offsetParent;
            if (parent === null) {
                return "none";
            }
            var popoverWidth = node.clientWidth;
            var popoverHeight = node.clientHeight;
            var parentBounds = parent.getBoundingClientRect();
            var parentLeft = parentBounds.left;
            var parentTop = parentBounds.top;
            var sourceLeft = sourceFrame.left - window.pageXOffset - parentLeft;
            var sourceRight = sourceFrame.right - window.pageXOffset - parentLeft;
            var sourceTop = sourceFrame.top - window.pageYOffset - parentTop;
            var sourceBottom = sourceFrame.bottom - window.pageYOffset - parentTop;
            var sourceWidth = sourceFrame.width;
            var sourceHeight = sourceFrame.height;
            var sourceX = sourceLeft + sourceWidth / 2;
            var sourceY = sourceTop + sourceHeight / 2;
            var placementFrame = this._placementFrame;
            var placementLeft = (placementFrame !== null ? placementFrame.left : 0);
            var placementRight = (placementFrame !== null ? placementFrame.right : window.innerWidth) - parentLeft;
            var placementTop = (placementFrame !== null ? placementFrame.top : 0);
            var placementBottom = (placementFrame !== null ? placementFrame.bottom : window.innerHeight) - parentTop;
            var marginLeft = sourceLeft - placementLeft - window.pageXOffset;
            var marginRight = placementRight - sourceLeft - sourceWidth;
            var marginTop = sourceTop - placementTop - window.pageYOffset;
            var marginBottom = placementBottom - sourceTop - sourceHeight;
            var arrowHeight = this.arrowHeight.value.pxValue();
            var placement;
            for (var i = 0; i < this._placement.length; i += 1) {
                var p = this._placement[i];
                if (p === "above" || p === "below" || p === "over") {
                    placement = p;
                    break;
                }
                else if (p === "top" && popoverHeight + arrowHeight <= marginTop) {
                    placement = p;
                    break;
                }
                else if (p === "bottom" && popoverHeight + arrowHeight <= marginBottom) {
                    placement = p;
                    break;
                }
                else if (p === "left" && popoverWidth + arrowHeight <= marginLeft) {
                    placement = p;
                    break;
                }
                else if (p === "right" && popoverWidth + arrowHeight <= marginRight) {
                    placement = p;
                    break;
                }
            }
            if (placement === void 0) {
                placement = "none";
                for (var i = 0, n = this._placement.length; i < n; i += 1) {
                    var p = this._placement[i];
                    if (p === "top" && marginTop >= marginBottom) {
                        placement = p;
                        break;
                    }
                    else if (p === "bottom" && marginBottom >= marginTop) {
                        placement = p;
                        break;
                    }
                    else if (p === "left" && marginLeft >= marginRight) {
                        placement = p;
                        break;
                    }
                    else if (p === "right" && marginRight >= marginLeft) {
                        placement = p;
                        break;
                    }
                }
            }
            var maxWidthStyle = node.style.getPropertyValue("max-width");
            var maxHeightStyle = node.style.getPropertyValue("max-height");
            var oldMaxWidth = maxWidthStyle ? length.Length.fromAny(maxWidthStyle).pxValue() : 0;
            var oldMaxHeight = maxHeightStyle ? length.Length.fromAny(maxHeightStyle).pxValue() : 0;
            var maxWidth = oldMaxWidth;
            var maxHeight = oldMaxHeight;
            var left = node.offsetLeft;
            var top = node.offsetTop;
            var right;
            var bottom;
            if (placement === "above") {
                left = placementLeft;
                top = placementTop;
                right = (placementFrame !== null ? placementFrame.width : window.innerWidth) - placementRight;
                maxWidth = Math.max(0, placementRight - placementLeft);
                maxHeight = Math.max(0, placementBottom - placementTop);
            }
            else if (placement === "below") {
                left = placementLeft;
                top = placementBottom - popoverHeight;
                right = placementRight - (placementFrame !== null ? placementFrame.width : window.innerWidth);
                maxWidth = Math.max(0, placementRight - placementLeft);
                maxHeight = Math.max(0, placementBottom - placementTop);
            }
            else if (placement === "over") {
                left = placementLeft;
                top = placementTop;
                right = placementRight - (placementFrame !== null ? placementFrame.width : window.innerWidth);
                bottom = placementBottom - (placementFrame !== null ? placementFrame.height : window.innerHeight);
                maxWidth = Math.max(0, placementRight - placementLeft);
                maxHeight = Math.max(0, placementBottom - placementTop);
            }
            else if (placement === "top") {
                if (sourceX - popoverWidth / 2 <= placementLeft) {
                    left = placementLeft;
                }
                else if (sourceX + popoverWidth / 2 >= placementRight) {
                    left = placementRight - popoverWidth;
                }
                else {
                    left = sourceX - popoverWidth / 2;
                }
                top = Math.max(placementTop, sourceTop - (popoverHeight + arrowHeight));
                maxWidth = Math.max(0, placementRight - placementLeft);
                maxHeight = Math.max(0, sourceBottom - placementTop);
            }
            else if (placement === "bottom") {
                if (sourceX - popoverWidth / 2 <= placementLeft) {
                    left = placementLeft;
                }
                else if (sourceX + popoverWidth / 2 >= placementRight) {
                    left = placementRight - popoverWidth;
                }
                else {
                    left = sourceX - popoverWidth / 2;
                }
                top = Math.max(placementTop, sourceBottom + arrowHeight);
                maxWidth = Math.max(0, placementRight - placementLeft);
                maxHeight = Math.max(0, placementBottom - sourceTop);
            }
            else if (placement === "left") {
                left = Math.max(placementLeft, sourceLeft - (popoverWidth + arrowHeight));
                if (sourceY - popoverHeight / 2 <= placementTop) {
                    top = placementTop;
                }
                else if (sourceY + popoverHeight / 2 >= placementBottom) {
                    top = placementBottom - popoverHeight;
                }
                else {
                    top = sourceY - popoverHeight / 2;
                }
                maxWidth = Math.max(0, sourceRight - placementLeft);
                maxHeight = Math.max(0, placementBottom - placementTop);
            }
            else if (placement === "right") {
                left = Math.max(placementLeft, sourceRight + arrowHeight);
                if (sourceY - popoverHeight / 2 <= placementTop) {
                    top = placementTop;
                }
                else if (sourceY + popoverHeight / 2 >= placementBottom) {
                    top = placementBottom - popoverHeight;
                }
                else {
                    top = sourceY - popoverHeight / 2;
                }
                maxWidth = Math.max(0, placementRight - sourceLeft);
                maxHeight = Math.max(0, placementBottom - placementTop);
            }
            if (placement !== "none" && (left !== node.offsetLeft || top !== node.offsetTop
                || maxWidth !== oldMaxWidth || maxHeight !== oldMaxHeight)) {
                this.willPlacePopover(placement);
                node.style.setProperty("position", "absolute");
                node.style.setProperty("left", left + "px");
                if (right !== void 0) {
                    node.style.setProperty("right", right + "px");
                }
                else {
                    node.style.removeProperty("right");
                }
                node.style.setProperty("top", top + "px");
                if (bottom !== void 0) {
                    node.style.setProperty("bottom", bottom + "px");
                }
                else {
                    node.style.removeProperty("bottom");
                }
                node.style.setProperty("max-width", maxWidth + "px");
                node.style.setProperty("max-height", maxHeight + "px");
                this.onPlacePopover(placement);
                this.didPlacePopover(placement);
            }
            return placement;
        };
        PopoverView.prototype.willPlacePopover = function (placement) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.popoverWillPlace !== void 0) {
                    viewObserver.popoverWillPlace(placement, this);
                }
            });
        };
        PopoverView.prototype.onPlacePopover = function (placement) {
        };
        PopoverView.prototype.didPlacePopover = function (placement) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.popoverDidPlace !== void 0) {
                    viewObserver.popoverDidPlace(placement, this);
                }
            });
        };
        PopoverView.prototype.placeArrow = function (source, sourceFrame, arrow, placement) {
            var node = this._node;
            var parent = node.offsetParent;
            if (parent === null) {
                return;
            }
            var arrowNode = arrow._node;
            var parentBounds = parent.getBoundingClientRect();
            var parentLeft = parentBounds.left;
            var parentTop = parentBounds.top;
            var sourceLeft = sourceFrame.left - window.pageXOffset - parentLeft;
            var sourceTop = sourceFrame.top - window.pageYOffset - parentTop;
            var sourceWidth = sourceFrame.width;
            var sourceHeight = sourceFrame.height;
            var sourceX = sourceLeft + sourceWidth / 2;
            var sourceY = sourceTop + sourceHeight / 2;
            var offsetLeft = node.offsetLeft;
            var offsetRight = offsetLeft + node.clientWidth;
            var offsetTop = node.offsetTop;
            var offsetBottom = offsetTop + node.clientHeight;
            var backgroundColor = this.backgroundColor() || color.Color.transparent();
            var borderRadius = this.borderRadius();
            var radius = borderRadius instanceof length.Length ? borderRadius.pxValue() : 0;
            var arrowWidth = this.arrowWidth.value.pxValue();
            var arrowHeight = this.arrowHeight.value.pxValue();
            var arrowXMin = offsetLeft + radius + arrowWidth / 2;
            var arrowXMax = offsetRight - radius - arrowWidth / 2;
            var arrowYMin = offsetTop + radius + arrowWidth / 2;
            var arrowYMax = offsetBottom - radius - arrowWidth / 2;
            arrowNode.style.removeProperty("top");
            arrowNode.style.removeProperty("right");
            arrowNode.style.removeProperty("bottom");
            arrowNode.style.removeProperty("left");
            arrowNode.style.removeProperty("border-left-width");
            arrowNode.style.removeProperty("border-left-style");
            arrowNode.style.removeProperty("border-left-color");
            arrowNode.style.removeProperty("border-right-width");
            arrowNode.style.removeProperty("border-right-style");
            arrowNode.style.removeProperty("border-right-color");
            arrowNode.style.removeProperty("border-top-width");
            arrowNode.style.removeProperty("border-top-style");
            arrowNode.style.removeProperty("border-top-color");
            arrowNode.style.removeProperty("border-bottom-width");
            arrowNode.style.removeProperty("border-bottom-style");
            arrowNode.style.removeProperty("border-bottom-color");
            if (placement === "none" || placement === "above" || placement === "below" || placement === "over") {
                arrowNode.style.setProperty("display", "none");
            }
            else if (offsetTop - arrowHeight >= sourceY
                && arrowXMin <= sourceX && sourceX <= arrowXMax) {
                arrowNode.style.setProperty("display", "block");
                arrowNode.style.setProperty("top", (-arrowHeight) + "px");
                arrowNode.style.setProperty("left", (sourceX - offsetLeft - arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-left-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-left-style", "solid");
                arrowNode.style.setProperty("border-left-color", "transparent");
                arrowNode.style.setProperty("border-right-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-right-style", "solid");
                arrowNode.style.setProperty("border-right-color", "transparent");
                arrowNode.style.setProperty("border-bottom-width", arrowHeight + "px");
                arrowNode.style.setProperty("border-bottom-style", "solid");
                arrowNode.style.setProperty("border-bottom-color", backgroundColor.toString());
            }
            else if (offsetBottom + arrowHeight <= sourceY
                && arrowXMin <= sourceX && sourceX <= arrowXMax) {
                arrowNode.style.setProperty("display", "block");
                arrowNode.style.setProperty("bottom", (-arrowHeight) + "px");
                arrowNode.style.setProperty("left", (sourceX - offsetLeft - arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-left-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-left-style", "solid");
                arrowNode.style.setProperty("border-left-color", "transparent");
                arrowNode.style.setProperty("border-right-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-right-style", "solid");
                arrowNode.style.setProperty("border-right-color", "transparent");
                arrowNode.style.setProperty("border-top-width", arrowHeight + "px");
                arrowNode.style.setProperty("border-top-style", "solid");
                arrowNode.style.setProperty("border-top-color", backgroundColor.toString());
            }
            else if (offsetLeft - arrowHeight >= sourceX
                && arrowYMin <= sourceY && sourceY <= arrowYMax) {
                arrowNode.style.setProperty("display", "block");
                arrowNode.style.setProperty("left", (-arrowHeight) + "px");
                arrowNode.style.setProperty("top", (sourceY - offsetTop - arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-top-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-top-style", "solid");
                arrowNode.style.setProperty("border-top-color", "transparent");
                arrowNode.style.setProperty("border-bottom-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-bottom-style", "solid");
                arrowNode.style.setProperty("border-bottom-color", "transparent");
                arrowNode.style.setProperty("border-right-width", arrowHeight + "px");
                arrowNode.style.setProperty("border-right-style", "solid");
                arrowNode.style.setProperty("border-right-color", backgroundColor.toString());
            }
            else if (offsetRight + arrowHeight <= sourceX
                && arrowYMin <= sourceY && sourceY <= arrowYMax) {
                arrowNode.style.setProperty("display", "block");
                arrowNode.style.setProperty("right", (-arrowHeight) + "px");
                arrowNode.style.setProperty("top", (sourceY - offsetTop - arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-top-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-top-style", "solid");
                arrowNode.style.setProperty("border-top-color", "transparent");
                arrowNode.style.setProperty("border-bottom-width", (arrowWidth / 2) + "px");
                arrowNode.style.setProperty("border-bottom-style", "solid");
                arrowNode.style.setProperty("border-bottom-color", "transparent");
                arrowNode.style.setProperty("border-left-width", arrowHeight + "px");
                arrowNode.style.setProperty("border-left-style", "solid");
                arrowNode.style.setProperty("border-left-color", backgroundColor.toString());
            }
            else {
                arrowNode.style.setProperty("display", "none");
            }
        };
        PopoverView.prototype.viewDidMount = function (view) {
            this.place();
        };
        PopoverView.prototype.viewDidPower = function (view) {
            this.place();
        };
        PopoverView.prototype.viewDidScroll = function (viewContext, view) {
            this.place();
        };
        PopoverView.prototype.viewDidLayout = function (viewContext, view) {
            this.place();
        };
        PopoverView.prototype.viewDidSetAttribute = function (name, value, view) {
            this.place();
        };
        PopoverView.prototype.viewDidSetStyle = function (name, value, priority, view) {
            this.place();
        };
        __decorate([
            view.MemberAnimator(length.Length)
        ], PopoverView.prototype, "arrowWidth", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], PopoverView.prototype, "arrowHeight", void 0);
        return PopoverView;
    }(view.HtmlView));

    var PopoverViewController = (function (_super) {
        __extends(PopoverViewController, _super);
        function PopoverViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(PopoverViewController.prototype, "source", {
            get: function () {
                var view = this._view;
                return view !== null ? view.source : null;
            },
            enumerable: false,
            configurable: true
        });
        PopoverViewController.prototype.popoverWillSetSource = function (source, view) {
        };
        PopoverViewController.prototype.popoverDidSetSource = function (source, view) {
        };
        PopoverViewController.prototype.popoverWillPlace = function (placement, view) {
        };
        PopoverViewController.prototype.popoverDidPlace = function (placement, view) {
        };
        PopoverViewController.prototype.popoverWillShow = function (view) {
        };
        PopoverViewController.prototype.popoverDidShow = function (view) {
        };
        PopoverViewController.prototype.popoverWillHide = function (view) {
        };
        PopoverViewController.prototype.popoverDidHide = function (view) {
        };
        return PopoverViewController;
    }(view.HtmlViewController));

    var DrawerView = (function (_super) {
        __extends(DrawerView, _super);
        function DrawerView(node) {
            var _this = _super.call(this, node) || this;
            _this.collapsedWidth.setAutoState(length.Length.px(60));
            _this.expandedWidth.setAutoState(length.Length.px(200));
            _this.drawerSlide.setState(0);
            _this.drawerSlide.update = _this.updateDrawerSlide.bind(_this);
            _this.drawerStretch.setState(1);
            _this.drawerStretch.update = _this.updateDrawerStretch.bind(_this);
            _this._drawerPlacement = "left";
            _this._drawerState = "hidden";
            _this._drawerTransition = transition.Transition.duration(250, transition.Ease.cubicOut);
            return _this;
        }
        DrawerView.prototype.initNode = function (node) {
            this.addClass("drawer")
                .display("none")
                .flexDirection("column")
                .overflowX("hidden")
                .overflowY("auto")
                .overscrollBehaviorY("contain")
                .webkitOverflowScrolling("touch")
                .backgroundColor("#26282a");
        };
        Object.defineProperty(DrawerView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DrawerView.prototype, "drawerState", {
            get: function () {
                return this._drawerState;
            },
            enumerable: false,
            configurable: true
        });
        DrawerView.prototype.isShown = function () {
            return this._drawerState === "shown" || this._drawerState === "showing";
        };
        DrawerView.prototype.isHidden = function () {
            return this._drawerState === "hidden" || this._drawerState === "hiding";
        };
        DrawerView.prototype.isCollapsed = function () {
            return this._drawerState === "collapsed" || this._drawerState === "collapsing";
        };
        DrawerView.prototype.drawerPlacement = function (newPlacement) {
            var oldPlacement = this._drawerPlacement;
            if (newPlacement === void 0) {
                return oldPlacement;
            }
            else {
                if (oldPlacement !== newPlacement) {
                    this.willSetDrawerPlacement(newPlacement, oldPlacement);
                    this._drawerPlacement = newPlacement;
                    this.onSetDrawerPlacement(newPlacement, oldPlacement);
                    this.didSetDrawerPlacement(newPlacement, oldPlacement);
                }
                return this;
            }
        };
        DrawerView.prototype.isHorizontal = function () {
            return this._drawerPlacement === "top" || this._drawerPlacement === "bottom";
        };
        DrawerView.prototype.isVertical = function () {
            return this._drawerPlacement === "left" || this._drawerPlacement === "right";
        };
        DrawerView.prototype.willSetDrawerPlacement = function (newPlacement, oldPlacement) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.drawerWillSetPlacement !== void 0) {
                    viewObserver.drawerWillSetPlacement(newPlacement, oldPlacement, this);
                }
            });
        };
        DrawerView.prototype.onSetDrawerPlacement = function (newPlacement, oldPlacement) {
            this.requireUpdate(view.View.NeedsLayout);
        };
        DrawerView.prototype.didSetDrawerPlacement = function (newPlacement, oldPlacement) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.drawerDidSetPlacement !== void 0) {
                    viewObserver.drawerDidSetPlacement(newPlacement, oldPlacement, this);
                }
            });
        };
        DrawerView.prototype.updateDrawerSlide = function (drawerSlide) {
            var drawerPlacement = this._drawerPlacement;
            if (drawerPlacement === "top") {
                this.updateDrawerSlideTop(drawerSlide);
            }
            else if (drawerPlacement === "right") {
                this.updateDrawerSlideRight(drawerSlide);
            }
            else if (drawerPlacement === "bottom") {
                this.updateDrawerSlideBottom(drawerSlide);
            }
            else if (drawerPlacement === "left") {
                this.updateDrawerSlideLeft(drawerSlide);
            }
        };
        DrawerView.prototype.updateDrawerSlideTop = function (drawerSlide) {
            this.top.setAutoState(length.Length.px((drawerSlide - 1) * this._node.offsetHeight));
        };
        DrawerView.prototype.updateDrawerSlideRight = function (drawerSlide) {
            this.right.setAutoState(length.Length.px((drawerSlide - 1) * this._node.offsetWidth));
        };
        DrawerView.prototype.updateDrawerSlideBottom = function (drawerSlide) {
            this.bottom.setAutoState(length.Length.px((drawerSlide - 1) * this._node.offsetHeight));
        };
        DrawerView.prototype.updateDrawerSlideLeft = function (drawerSlide) {
            this.left.setAutoState(length.Length.px((drawerSlide - 1) * this._node.offsetWidth));
        };
        DrawerView.prototype.updateDrawerStretch = function (drawerStretch) {
            if (this.isVertical()) {
                var collapsedWidth = this.collapsedWidth.value;
                var expandedWidth = this.expandedWidth.value;
                var width = collapsedWidth.times(1 - drawerStretch).plus(expandedWidth.times(drawerStretch));
                this.width.setAutoState(width);
            }
        };
        DrawerView.prototype.onLayout = function (viewContext) {
            _super.prototype.onLayout.call(this, viewContext);
            this.place(viewContext);
            if (viewContext.viewIdiom === "mobile") {
                this.borderRightColor(color.Color.transparent());
                this.boxShadow.setState(BoxShadow.of(0, 2, 4, 0, color.Color.black(0.5)));
            }
            else {
                this.borderRightColor(color.Color.black());
                this.boxShadow.setState(void 0);
            }
        };
        DrawerView.prototype.place = function (viewContext) {
            var drawerPlacement = this._drawerPlacement;
            if (drawerPlacement === "top") {
                this.placeTop(viewContext);
            }
            else if (drawerPlacement === "right") {
                this.placeRight(viewContext);
            }
            else if (drawerPlacement === "bottom") {
                this.placeBottom(viewContext);
            }
            else if (drawerPlacement === "left") {
                this.placeLeft(viewContext);
            }
        };
        DrawerView.prototype.placeTop = function (viewContext) {
            this.addClass("drawer-top")
                .removeClass("drawer-right")
                .removeClass("drawer-bottom")
                .removeClass("drawer-left");
            this.position.setAutoState("fixed");
            this.width.setAutoState(void 0);
            this.height.setAutoState(void 0);
            this.top.setAutoState(void 0);
            this.right.setAutoState(length.Length.zero());
            this.bottom.setAutoState(void 0);
            this.left.setAutoState(length.Length.zero());
            this.updateDrawerSlideTop(this.drawerSlide.value);
            var safeArea = viewContext.viewport.safeArea;
            this.edgeInsets.setState({
                insetTop: 0,
                insetRight: safeArea.insetRight,
                insetBottom: 0,
                insetLeft: safeArea.insetLeft,
            });
            if (this.isCollapsed()) {
                this.expand();
            }
        };
        DrawerView.prototype.placeRight = function (viewContext) {
            this.removeClass("drawer-top")
                .addClass("drawer-right")
                .removeClass("drawer-bottom")
                .removeClass("drawer-left");
            this.position.setAutoState("fixed");
            this.width.setAutoState(void 0);
            this.height.setAutoState(void 0);
            this.top.setAutoState(length.Length.zero());
            this.right.setAutoState(void 0);
            this.bottom.setAutoState(length.Length.zero());
            this.left.setAutoState(void 0);
            this.updateDrawerSlideRight(this.drawerSlide.value);
            this.updateDrawerStretch(this.drawerStretch.value);
            var safeArea = viewContext.viewport.safeArea;
            this.paddingTop.setAutoState(length.Length.px(safeArea.insetTop));
            this.paddingBottom.setAutoState(length.Length.px(safeArea.insetBottom));
            this.edgeInsets.setState({
                insetTop: 0,
                insetRight: safeArea.insetRight,
                insetBottom: 0,
                insetLeft: 0,
            });
        };
        DrawerView.prototype.placeBottom = function (viewContext) {
            this.removeClass("drawer-top")
                .removeClass("drawer-right")
                .addClass("drawer-bottom")
                .removeClass("drawer-left");
            this.position.setAutoState("fixed");
            this.width.setAutoState(void 0);
            this.height.setAutoState(void 0);
            this.top.setAutoState(void 0);
            this.right.setAutoState(length.Length.zero());
            this.bottom.setAutoState(void 0);
            this.left.setAutoState(length.Length.zero());
            this.updateDrawerSlideBottom(this.drawerSlide.value);
            var safeArea = viewContext.viewport.safeArea;
            this.edgeInsets.setState({
                insetTop: 0,
                insetRight: safeArea.insetRight,
                insetBottom: 0,
                insetLeft: safeArea.insetLeft,
            });
            if (this.isCollapsed()) {
                this.expand();
            }
        };
        DrawerView.prototype.placeLeft = function (viewContext) {
            this.removeClass("drawer-top")
                .removeClass("drawer-right")
                .removeClass("drawer-bottom")
                .addClass("drawer-left");
            this.position.setAutoState("fixed");
            this.width.setAutoState(void 0);
            this.height.setAutoState(void 0);
            this.top.setAutoState(length.Length.zero());
            this.right.setAutoState(void 0);
            this.bottom.setAutoState(length.Length.zero());
            this.left.setAutoState(void 0);
            this.updateDrawerSlideLeft(this.drawerSlide.value);
            this.updateDrawerStretch(this.drawerStretch.value);
            var safeArea = viewContext.viewport.safeArea;
            this.paddingTop.setAutoState(length.Length.px(safeArea.insetTop));
            this.paddingBottom.setAutoState(length.Length.px(safeArea.insetBottom));
            this.edgeInsets.setState({
                insetTop: 0,
                insetRight: 0,
                insetBottom: 0,
                insetLeft: safeArea.insetLeft,
            });
        };
        Object.defineProperty(DrawerView.prototype, "modalState", {
            get: function () {
                var drawerState = this._drawerState;
                if (drawerState === "collapsed" || drawerState === "collapsing") {
                    return "shown";
                }
                else {
                    return drawerState;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DrawerView.prototype, "modalView", {
            get: function () {
                return this;
            },
            enumerable: false,
            configurable: true
        });
        DrawerView.prototype.showModal = function (tween) {
            this.show(tween);
        };
        DrawerView.prototype.hideModal = function (tween) {
            this.hide(tween);
        };
        DrawerView.prototype.show = function (tween) {
            if (!this.isShown() || this.drawerSlide.value !== 1 || this.drawerStretch.value !== 1) {
                if (tween === void 0 || tween === true) {
                    tween = this._drawerTransition;
                }
                else {
                    tween = transition.Transition.forTween(tween);
                }
                this.willShow();
                if (tween !== null) {
                    this.drawerStretch(1, tween)
                        .drawerSlide(1, tween.onEnd(this.didShow.bind(this)));
                }
                else {
                    this.drawerStretch(1)
                        .drawerSlide(1);
                    this.didShow();
                }
            }
        };
        DrawerView.prototype.willShow = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.drawerWillShow !== void 0) {
                    viewObserver.drawerWillShow(this);
                }
            });
            this._drawerState = "showing";
            this.display("flex");
        };
        DrawerView.prototype.didShow = function () {
            this._drawerState = "shown";
            this.didObserve(function (viewObserver) {
                if (viewObserver.drawerDidShow !== void 0) {
                    viewObserver.drawerDidShow(this);
                }
            });
        };
        DrawerView.prototype.hide = function (tween) {
            if (!this.isHidden() || this.drawerSlide.value !== 0) {
                if (tween === void 0 || tween === true) {
                    tween = this._drawerTransition;
                }
                else {
                    tween = transition.Transition.forTween(tween);
                }
                this.willHide();
                if (tween !== null) {
                    this.drawerSlide(0, tween.onEnd(this.didHide.bind(this)));
                }
                else {
                    this.drawerSlide(0);
                    this.didHide();
                }
            }
        };
        DrawerView.prototype.willHide = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.drawerWillHide !== void 0) {
                    viewObserver.drawerWillHide(this);
                }
            });
            this._drawerState = "hiding";
        };
        DrawerView.prototype.didHide = function () {
            this.display("none");
            this._drawerState = "hidden";
            this.didObserve(function (viewObserver) {
                if (viewObserver.drawerDidHide !== void 0) {
                    viewObserver.drawerDidHide(this);
                }
            });
        };
        DrawerView.prototype.expand = function (tween) {
            if (!this.isShown() || this.drawerSlide.value !== 1 || this.drawerStretch.value !== 1) {
                if (tween === void 0 || tween === true) {
                    tween = this._drawerTransition;
                }
                else {
                    tween = transition.Transition.forTween(tween);
                }
                this.willExpand();
                if (tween !== null) {
                    this.drawerSlide(1, tween)
                        .drawerStretch(1, tween.onEnd(this.didExpand.bind(this)));
                }
                else {
                    this.drawerSlide(1)
                        .drawerStretch(1);
                    this.didExpand();
                }
            }
        };
        DrawerView.prototype.willExpand = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.drawerWillExpand !== void 0) {
                    viewObserver.drawerWillExpand(this);
                }
            });
            this._drawerState = "showing";
        };
        DrawerView.prototype.didExpand = function () {
            this._drawerState = "shown";
            this.didObserve(function (viewObserver) {
                if (viewObserver.drawerDidExpand !== void 0) {
                    viewObserver.drawerDidExpand(this);
                }
            });
        };
        DrawerView.prototype.collapse = function (tween) {
            if (this.isVertical() && (!this.isCollapsed() || this.drawerSlide.value !== 1 || this.drawerStretch.value !== 0)) {
                if (tween === void 0 || tween === true) {
                    tween = this._drawerTransition;
                }
                else {
                    tween = transition.Transition.forTween(tween);
                }
                this.willCollapse();
                if (tween !== null) {
                    this.drawerSlide(1, tween)
                        .drawerStretch(0, tween.onEnd(this.didCollapse.bind(this)));
                }
                else {
                    this.drawerSlide(1)
                        .drawerStretch(0);
                    this.didCollapse();
                }
            }
        };
        DrawerView.prototype.willCollapse = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.drawerWillCollapse !== void 0) {
                    viewObserver.drawerWillCollapse(this);
                }
            });
            this._drawerState = "collapsing";
            this.display("flex");
        };
        DrawerView.prototype.didCollapse = function () {
            this._drawerState = "collapsed";
            this.didObserve(function (viewObserver) {
                if (viewObserver.drawerDidCollapse !== void 0) {
                    viewObserver.drawerDidCollapse(this);
                }
            });
        };
        DrawerView.prototype.toggle = function (tween) {
            var drawerState = this._drawerState;
            if (drawerState === "hidden" || drawerState === "hiding") {
                this.show(tween);
            }
            else if (drawerState === "collapsed" || drawerState === "collapsing") {
                this.expand(tween);
            }
            else if (this.viewIdiom === "mobile") {
                this.hide(tween);
            }
            else {
                this.collapse(tween);
            }
        };
        __decorate([
            view.MemberAnimator(length.Length)
        ], DrawerView.prototype, "collapsedWidth", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], DrawerView.prototype, "expandedWidth", void 0);
        __decorate([
            view.MemberAnimator(Number)
        ], DrawerView.prototype, "drawerSlide", void 0);
        __decorate([
            view.MemberAnimator(Number)
        ], DrawerView.prototype, "drawerStretch", void 0);
        __decorate([
            view.ViewScope
        ], DrawerView.prototype, "edgeInsets", void 0);
        return DrawerView;
    }(view.HtmlView));

    var DrawerViewController = (function (_super) {
        __extends(DrawerViewController, _super);
        function DrawerViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        DrawerViewController.prototype.drawerWillSetPlacement = function (newPlacement, oldPlacement, view) {
        };
        DrawerViewController.prototype.drawerDidSetPlacement = function (newPlacement, oldPlacement, view) {
        };
        DrawerViewController.prototype.drawerWillShow = function (view) {
        };
        DrawerViewController.prototype.drawerDidShow = function (view) {
        };
        DrawerViewController.prototype.drawerWillHide = function (view) {
        };
        DrawerViewController.prototype.drawerDidHide = function (view) {
        };
        DrawerViewController.prototype.drawerWillExpand = function (view) {
        };
        DrawerViewController.prototype.drawerDidExpand = function (view) {
        };
        DrawerViewController.prototype.drawerWillCollapse = function (view) {
        };
        DrawerViewController.prototype.drawerDidCollapse = function (view) {
        };
        return DrawerViewController;
    }(view.HtmlViewController));

    var DrawerButton = (function (_super) {
        __extends(DrawerButton, _super);
        function DrawerButton(node) {
            var _this = _super.call(this, node) || this;
            _this.onClick = _this.onClick.bind(_this);
            _this._drawerView = null;
            _this.initChildren();
            return _this;
        }
        DrawerButton.prototype.initNode = function (node) {
            this.addClass("drawer-button")
                .display("flex")
                .justifyContent("center")
                .alignItems("center")
                .width(48)
                .height(48)
                .userSelect("none")
                .cursor("pointer");
        };
        DrawerButton.prototype.initChildren = function () {
            this.append(this.createIcon(), "icon");
        };
        DrawerButton.prototype.createIcon = function () {
            var icon = view.SvgView.create("svg")
                .width(30)
                .height(30)
                .viewBox("0 0 30 30")
                .stroke("#ffffff")
                .strokeWidth(2)
                .strokeLinecap("round");
            icon.append("path").d("M4 7h22M4 15h22M4 23h22");
            return icon;
        };
        Object.defineProperty(DrawerButton.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(DrawerButton.prototype, "drawerView", {
            get: function () {
                return this._drawerView;
            },
            enumerable: false,
            configurable: true
        });
        DrawerButton.prototype.setDrawerView = function (drawerView) {
            this._drawerView = drawerView;
        };
        Object.defineProperty(DrawerButton.prototype, "iconView", {
            get: function () {
                var childView = this.getChildView("icon");
                return childView instanceof view.HtmlView ? childView : null;
            },
            enumerable: false,
            configurable: true
        });
        DrawerButton.prototype.onMount = function () {
            _super.prototype.onMount.call(this);
            this.on("click", this.onClick);
        };
        DrawerButton.prototype.onUnmount = function () {
            this.off("click", this.onClick);
            _super.prototype.onUnmount.call(this);
        };
        DrawerButton.prototype.onInsertChildView = function (childView, targetView) {
            _super.prototype.onInsertChildView.call(this, childView, targetView);
            var childKey = childView.key;
            if (childKey === "icon" && (childView instanceof view.SvgView || childView instanceof view.HtmlView)) {
                this.onInsertIcon(childView);
            }
        };
        DrawerButton.prototype.onRemoveChildView = function (childView) {
            var childKey = childView.key;
            if (childKey === "icon" && (childView instanceof view.SvgView || childView instanceof view.HtmlView)) {
                this.onRemoveIcon(childView);
            }
            _super.prototype.onRemoveChildView.call(this, childView);
        };
        DrawerButton.prototype.onInsertIcon = function (icon) {
        };
        DrawerButton.prototype.onRemoveIcon = function (icon) {
        };
        DrawerButton.prototype.onClick = function (event) {
            event.stopPropagation();
            var drawerView = this._drawerView;
            if (drawerView !== null) {
                drawerView.toggle();
            }
        };
        return DrawerButton;
    }(view.HtmlView));

    var AppView = (function (_super) {
        __extends(AppView, _super);
        function AppView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(AppView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        AppView.prototype.createTheme = function () {
            var colorScheme = this.viewport.colorScheme;
            if (colorScheme === "dark") {
                return Theme.dark;
            }
            else {
                return Theme.light;
            }
        };
        AppView.prototype.onResize = function (viewContext) {
            _super.prototype.onResize.call(this, viewContext);
            this.updateViewIdiom(viewContext.viewport);
        };
        AppView.prototype.updateViewIdiom = function (viewport) {
            if (viewport.width < 960 || viewport.height < 480) {
                this.setViewIdiom("mobile");
            }
            else {
                this.setViewIdiom("desktop");
            }
        };
        __decorate([
            view.ViewScope({
                init: function () {
                    return this.createTheme();
                },
            })
        ], AppView.prototype, "theme", void 0);
        return AppView;
    }(view.UiView));

    var AppViewController = (function (_super) {
        __extends(AppViewController, _super);
        function AppViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return AppViewController;
    }(view.UiViewController));

    var ActionButton = (function (_super) {
        __extends(ActionButton, _super);
        function ActionButton(node) {
            return _super.call(this, node) || this;
        }
        ActionButton.prototype.initNode = function (node) {
            _super.prototype.initNode.call(this, node);
            this.addClass("action-button")
                .position("relative")
                .display("flex")
                .justifyContent("center")
                .alignItems("center")
                .width(56)
                .height(56)
                .borderRadius("50%")
                .overflow("hidden")
                .userSelect("none")
                .cursor("pointer");
        };
        Object.defineProperty(ActionButton.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ActionButton.prototype, "iconContainer", {
            get: function () {
                var childView = this.getChildView("iconContainer");
                return childView instanceof view.HtmlView ? childView : null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ActionButton.prototype, "icon", {
            get: function () {
                var iconContainer = this.iconContainer;
                var childView = iconContainer !== null ? iconContainer.getChildView("icon") : null;
                return childView instanceof view.SvgView || childView instanceof view.HtmlView ? childView : null;
            },
            enumerable: false,
            configurable: true
        });
        ActionButton.prototype.setIcon = function (icon, tween, ccw) {
            if (tween === void 0) { tween = null; }
            if (ccw === void 0) { ccw = false; }
            tween = transition.Transition.forTween(tween);
            var oldIconContainer = this.getChildView("iconContainer");
            if (oldIconContainer instanceof view.HtmlView) {
                this.removeChildViewMap(oldIconContainer);
                oldIconContainer.setKey(null);
                if (tween !== null) {
                    oldIconContainer.opacity(0, tween.onEnd(oldIconContainer.remove.bind(oldIconContainer)))
                        .transform(transform.Transform.rotate(angle.Angle.deg(ccw ? -90 : 90)), tween);
                }
                else {
                    oldIconContainer.remove();
                }
            }
            var newIconContainer = this.createIconContainer(icon)
                .opacity(0)
                .opacity(1, tween)
                .transform(transform.Transform.rotate(angle.Angle.deg(ccw ? 90 : -90)))
                .transform(transform.Transform.rotate(angle.Angle.deg(0)), tween);
            this.appendChildView(newIconContainer, "iconContainer");
        };
        ActionButton.prototype.createIconContainer = function (icon) {
            var iconContainer = view.HtmlView.create("div")
                .addClass("action-icon")
                .position("absolute")
                .display("flex")
                .justifyContent("center")
                .alignItems("center")
                .width(56)
                .height(56)
                .pointerEvents("none");
            if (icon !== null) {
                iconContainer.appendChildView(icon, "icon");
            }
            return iconContainer;
        };
        ActionButton.prototype.setTheme = function (theme) {
            this.backgroundColor.setAutoState(theme.primary.fillColor);
            this.boxShadow.setAutoState(theme.floating.shadow);
            var icon = this.icon;
            if (icon instanceof view.SvgView) {
                icon.fill.setAutoState(theme.primary.iconColor);
            }
        };
        ActionButton.prototype.onMount = function () {
            _super.prototype.onMount.call(this);
            this.requireUpdate(view.View.NeedsDerive);
        };
        ActionButton.prototype.onDerive = function (viewContext) {
            _super.prototype.onDerive.call(this, viewContext);
            var theme = this.theme.state;
            if (theme !== void 0) {
                this.setTheme(theme);
            }
        };
        ActionButton.prototype.onInsertChildView = function (childView, targetView) {
            _super.prototype.onInsertChildView.call(this, childView, targetView);
            var childKey = childView.key;
            if (childKey === "iconContainer" && childView instanceof view.HtmlView) {
                this.onInsertIconContainer(childView);
            }
        };
        ActionButton.prototype.onRemoveChildView = function (childView) {
            var childKey = childView.key;
            if (childKey === "iconContainer" && childView instanceof view.HtmlView) {
                this.onRemoveIconContainer(childView);
            }
            _super.prototype.onRemoveChildView.call(this, childView);
        };
        ActionButton.prototype.onInsertIconContainer = function (iconContainer) {
        };
        ActionButton.prototype.onRemoveIconContainer = function (iconContainer) {
        };
        ActionButton.prototype.onStartHovering = function () {
            var theme = this.theme.state;
            if (theme !== void 0) {
                this.backgroundColor.setAutoState(theme.primary.fillColor.darker(0.5), this.tactileTransition);
            }
        };
        ActionButton.prototype.onStopHovering = function () {
            var theme = this.theme.state;
            if (theme !== void 0) {
                this.backgroundColor.setAutoState(theme.primary.fillColor, this.tactileTransition);
            }
        };
        ActionButton.prototype.onMoveTrack = function (track, event) {
        };
        __decorate([
            view.ViewScope({ inherit: true })
        ], ActionButton.prototype, "theme", void 0);
        return ActionButton;
    }(TactileView));

    var ActionItem = (function (_super) {
        __extends(ActionItem, _super);
        function ActionItem(node) {
            return _super.call(this, node) || this;
        }
        ActionItem.prototype.initNode = function (node) {
            this.addClass("action-item")
                .position("relative")
                .display("flex")
                .justifyContent("center")
                .alignItems("center")
                .width(48)
                .height(48)
                .borderRadius("50%")
                .userSelect("none")
                .cursor("pointer");
        };
        Object.defineProperty(ActionItem.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ActionItem.prototype, "icon", {
            get: function () {
                var childView = this.getChildView("icon");
                return childView instanceof view.SvgView || childView instanceof view.HtmlView ? childView : null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ActionItem.prototype, "label", {
            get: function () {
                var childView = this.getChildView("label");
                return childView instanceof view.HtmlView ? childView : null;
            },
            enumerable: false,
            configurable: true
        });
        ActionItem.prototype.setTheme = function (theme) {
            this.backgroundColor.setAutoState(theme.secondary.fillColor);
            this.boxShadow.setAutoState(theme.floating.shadow);
            this.hoverColor.setAutoState(theme.secondary.fillColor.darker(0.5));
            var icon = this.icon;
            if (icon instanceof view.SvgView) {
                icon.fill.setAutoState(theme.secondary.iconColor);
            }
        };
        ActionItem.prototype.onMount = function () {
            this.requireUpdate(view.View.NeedsDerive);
        };
        ActionItem.prototype.modifyUpdate = function (updateFlags) {
            var additionalFlags = 0;
            if ((updateFlags & view.View.NeedsAnimate) !== 0) {
                additionalFlags |= view.View.NeedsLayout;
            }
            additionalFlags |= _super.prototype.modifyUpdate.call(this, updateFlags | additionalFlags);
            return additionalFlags;
        };
        ActionItem.prototype.onDerive = function (viewContext) {
            _super.prototype.onDerive.call(this, viewContext);
            var theme = this.theme.state;
            if (theme !== void 0) {
                this.setTheme(theme);
            }
        };
        ActionItem.prototype.onLayout = function (viewContext) {
            _super.prototype.onLayout.call(this, viewContext);
            var label = this.label;
            if (label !== null) {
                label.opacity(this.stackPhase.value);
            }
        };
        ActionItem.prototype.onInsertChildView = function (childView, targetView) {
            _super.prototype.onInsertChildView.call(this, childView, targetView);
            var childKey = childView.key;
            if (childKey === "icon" && (childView instanceof view.SvgView || childView instanceof view.HtmlView)) {
                this.onInsertIcon(childView);
            }
            else if (childKey === "label" && childView instanceof view.HtmlView) {
                this.onInsertLabel(childView);
            }
        };
        ActionItem.prototype.onRemoveChildView = function (childView) {
            var childKey = childView.key;
            if (childKey === "icon" && (childView instanceof view.SvgView || childView instanceof view.HtmlView)) {
                this.onRemoveIcon(childView);
            }
            else if (childKey === "label" && childView instanceof view.HtmlView) {
                this.onRemoveLabel(childView);
            }
            _super.prototype.onRemoveChildView.call(this, childView);
        };
        ActionItem.prototype.onInsertIcon = function (icon) {
        };
        ActionItem.prototype.onRemoveIcon = function (icon) {
        };
        ActionItem.prototype.onInsertLabel = function (label) {
            label.display.setAutoState("block");
            label.position("absolute")
                .top(0)
                .right(48 + 12)
                .bottom(0)
                .fontSize(17)
                .fontWeight("500")
                .lineHeight("48px")
                .whiteSpace("nowrap")
                .color("#cccccc");
        };
        ActionItem.prototype.onRemoveLabel = function (label) {
        };
        __decorate([
            view.ViewScope({ inherit: true })
        ], ActionItem.prototype, "theme", void 0);
        __decorate([
            view.MemberAnimator(Number, { inherit: true })
        ], ActionItem.prototype, "stackPhase", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], ActionItem.prototype, "hoverColor", void 0);
        return ActionItem;
    }(view.HtmlView));

    var ActionStackGestureController = (function () {
        function ActionStackGestureController(actionStack) {
            this._actionStack = actionStack;
        }
        ActionStackGestureController.prototype.viewDidBeginTrack = function (track, event, view) {
        };
        ActionStackGestureController.prototype.viewDidHoldTrack = function (track, view) {
            this._actionStack.toggle();
            track.preventDefault();
        };
        ActionStackGestureController.prototype.viewDidMoveTrack = function (track, event, view$1) {
            if (!track.defaultPrevented) {
                var actionStack = this._actionStack;
                if (actionStack.isCollapsed()) {
                    var stackPhase = Math.min(Math.max(0, -track.dy / 100), 1);
                    actionStack.stackPhase.setState(stackPhase);
                    actionStack.requireUpdate(view.View.NeedsLayout);
                    if (stackPhase > 0.1) {
                        track.clearHoldTimer();
                    }
                }
            }
        };
        ActionStackGestureController.prototype.viewDidEndTrack = function (track, event, view) {
            if (!track.defaultPrevented) {
                var actionStack = this._actionStack;
                var stackPhase = actionStack.stackPhase.value;
                if (track.dt < track.holdDelay) {
                    if (stackPhase < 0.1 || actionStack.stackState === "expanded") {
                        actionStack.collapse();
                    }
                    else {
                        actionStack.expand();
                    }
                }
                else {
                    if (stackPhase < 0.5) {
                        actionStack.collapse();
                    }
                    else if (stackPhase >= 0.5) {
                        actionStack.expand();
                    }
                }
            }
        };
        ActionStackGestureController.prototype.viewDidCancelTrack = function (track, event, view) {
            var actionStack = this._actionStack;
            if (track.buttons === 2) {
                actionStack.toggle();
            }
            else {
                var stackPhase = actionStack.stackPhase.value;
                if (stackPhase < 0.1 || actionStack.stackState === "expanded") {
                    actionStack.collapse();
                }
                else {
                    actionStack.expand();
                }
            }
        };
        return ActionStackGestureController;
    }());

    var ActionStack = (function (_super) {
        __extends(ActionStack, _super);
        function ActionStack(node) {
            var _this = _super.call(this, node) || this;
            _this.onClick = _this.onClick.bind(_this);
            _this.onContextMenu = _this.onContextMenu.bind(_this);
            _this._stackState = "collapsed";
            _this._stackTransition = transition.Transition.duration(250, transition.Ease.cubicOut);
            _this._buttonIcon = null;
            _this._buttonSpacing = 36;
            _this._itemSpacing = 20;
            _this.initChildren();
            return _this;
        }
        ActionStack.prototype.initNode = function (node) {
            this.addClass("action-stack")
                .display("block")
                .position("relative")
                .width(56)
                .height(56)
                .opacity(1)
                .userSelect("none")
                .touchAction("none");
        };
        ActionStack.prototype.initChildren = function () {
            this.append(ActionButton, "button");
        };
        Object.defineProperty(ActionStack.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ActionStack.prototype, "stackState", {
            get: function () {
                return this._stackState;
            },
            enumerable: false,
            configurable: true
        });
        ActionStack.prototype.isExpanded = function () {
            return this._stackState === "expanded" || this._stackState === "expanding";
        };
        ActionStack.prototype.isCollapsed = function () {
            return this._stackState === "collapsed" || this._stackState === "collapsing";
        };
        Object.defineProperty(ActionStack.prototype, "modalState", {
            get: function () {
                var stackState = this._stackState;
                if (stackState === "collapsed") {
                    return "hidden";
                }
                else if (stackState === "expanding") {
                    return "showing";
                }
                else if (stackState === "expanded") {
                    return "shown";
                }
                else if (stackState === "collapsing") {
                    return "hiding";
                }
                else {
                    return void 0;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ActionStack.prototype, "modalView", {
            get: function () {
                return null;
            },
            enumerable: false,
            configurable: true
        });
        ActionStack.prototype.showModal = function (tween) {
            this.expand(tween);
        };
        ActionStack.prototype.hideModal = function (tween) {
            this.collapse(tween);
        };
        Object.defineProperty(ActionStack.prototype, "button", {
            get: function () {
                var childView = this.getChildView("button");
                return childView instanceof ActionButton ? childView : null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ActionStack.prototype, "buttonIcon", {
            get: function () {
                return this._buttonIcon;
            },
            enumerable: false,
            configurable: true
        });
        ActionStack.prototype.setButtonIcon = function (buttonIcon, tween, ccw) {
            this._buttonIcon = buttonIcon;
            var button = this.button;
            if (button !== null) {
                if (tween === void 0 || tween === true) {
                    tween = this._stackTransition;
                }
                else if (tween === false) {
                    tween = void 0;
                }
                button.setIcon(buttonIcon, tween, ccw);
            }
        };
        ActionStack.prototype.createCloseIcon = function () {
            var icon = view.SvgView.create("svg").width(24).height(24).viewBox("0 0 24 24");
            icon.append("path").d("M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
            return icon;
        };
        Object.defineProperty(ActionStack.prototype, "items", {
            get: function () {
                var childNodes = this._node.childNodes;
                var childViews = [];
                for (var i = 0, n = childNodes.length; i < n; i += 1) {
                    var childView = childNodes[i].view;
                    if (childView instanceof ActionItem) {
                        childViews.push(childView);
                    }
                }
                return childViews;
            },
            enumerable: false,
            configurable: true
        });
        ActionStack.prototype.insertItem = function (item, index, key) {
            if (index === void 0) {
                index = this.node.childNodes.length - 1;
            }
            this.insertChildNode(item.node, this.node.childNodes[1 + index] || null, key);
        };
        ActionStack.prototype.removeItems = function () {
            var childNodes = this._node.childNodes;
            for (var i = childNodes.length - 1; i >= 0; i -= 1) {
                var childView = childNodes[i].view;
                if (childView instanceof ActionItem) {
                    this.removeChild(childView);
                }
            }
        };
        ActionStack.prototype.onMount = function () {
            _super.prototype.onMount.call(this);
            this.on("click", this.onClick);
            this.on("contextmenu", this.onContextMenu);
        };
        ActionStack.prototype.onUnmount = function () {
            this.off("click", this.onClick);
            this.off("contextmenu", this.onContextMenu);
            _super.prototype.onUnmount.call(this);
        };
        ActionStack.prototype.modifyUpdate = function (updateFlags) {
            var additionalFlags = 0;
            if ((updateFlags & view.View.NeedsAnimate) !== 0) {
                additionalFlags |= view.View.NeedsLayout;
            }
            additionalFlags |= _super.prototype.modifyUpdate.call(this, updateFlags | additionalFlags);
            return additionalFlags;
        };
        ActionStack.prototype.onLayout = function (viewContext) {
            _super.prototype.onLayout.call(this, viewContext);
            var phase = this.stackPhase.value;
            var childNodes = this._node.childNodes;
            var childCount = childNodes.length;
            var buttonHeight = 56;
            var itemHeight = 48;
            var itemIndex = 0;
            var zIndex = childCount - 1;
            for (var i = 0; i < childCount; i += 1) {
                var childView = childNodes[i].view;
                if (childView instanceof ActionItem) {
                    var bottom = buttonHeight + this._buttonSpacing + itemIndex * (itemHeight + this._itemSpacing);
                    childView.display(phase === 0 ? "none" : "flex")
                        .bottom(phase * bottom)
                        .zIndex(zIndex);
                    itemIndex += 1;
                    zIndex -= 1;
                }
                var button = this.button;
                if (button !== null) {
                    button.zIndex(childCount);
                }
            }
        };
        ActionStack.prototype.onInsertChildView = function (childView, targetView) {
            _super.prototype.onInsertChildView.call(this, childView, targetView);
            var childKey = childView.key;
            if (childKey === "button" && childView instanceof ActionButton) {
                this.onInsertButton(childView);
            }
            else if (childView instanceof ActionItem) {
                this.onInsertItem(childView);
            }
        };
        ActionStack.prototype.onRemoveChildView = function (childView) {
            var childKey = childView.key;
            if (childKey === "button" && childView instanceof ActionButton) {
                this.onRemoveButton(childView);
            }
            else if (childView instanceof ActionItem) {
                this.onRemoveItem(childView);
            }
            _super.prototype.onRemoveChildView.call(this, childView);
        };
        ActionStack.prototype.onInsertButton = function (button) {
            if (this.isCollapsed && this._buttonIcon !== null) {
                button.setIcon(this._buttonIcon);
            }
            else if (this.isExpanded()) {
                button.setIcon(this.createCloseIcon());
            }
            button.zIndex(0);
            button.addViewObserver(new ActionStackGestureController(this));
        };
        ActionStack.prototype.onRemoveButton = function (button) {
        };
        ActionStack.prototype.onInsertItem = function (item) {
            item.position("absolute").right(4).bottom(4).left(4).zIndex(0);
        };
        ActionStack.prototype.onRemoveItem = function (item) {
        };
        ActionStack.prototype.expand = function (tween) {
            if (this.isCollapsed() || this.stackPhase.value !== 1) {
                if (tween === void 0 || tween === true) {
                    tween = this._stackTransition;
                }
                else {
                    tween = transition.Transition.forTween(tween);
                }
                this.willExpand();
                if (tween !== null) {
                    this.button.setIcon(this.createCloseIcon(), tween);
                    if (this.stackPhase.value !== 1) {
                        this.stackPhase.setState(1, tween.onEnd(this.didExpand.bind(this)));
                    }
                    else {
                        setTimeout(this.didExpand.bind(this));
                    }
                }
                else {
                    this.button.setIcon(this.createCloseIcon());
                    this.stackPhase.setState(1);
                    this.requireUpdate(view.View.NeedsLayout);
                    this.didExpand();
                }
            }
        };
        ActionStack.prototype.willExpand = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.actionStackWillExpand !== void 0) {
                    viewObserver.actionStackWillExpand(this);
                }
            });
            this._stackState = "expanding";
        };
        ActionStack.prototype.didExpand = function () {
            this._stackState = "expanded";
            this.didObserve(function (viewObserver) {
                if (viewObserver.actionStackDidExpand !== void 0) {
                    viewObserver.actionStackDidExpand(this);
                }
            });
        };
        ActionStack.prototype.collapse = function (tween) {
            if (this.isExpanded() || this.stackPhase.value !== 0) {
                if (tween === void 0 || tween === true) {
                    tween = this._stackTransition;
                }
                else {
                    tween = transition.Transition.forTween(tween);
                }
                this.willCollapse();
                if (tween !== null) {
                    this.button.setIcon(this._buttonIcon, tween, true);
                    if (this.stackPhase.value !== 0) {
                        this.stackPhase.setState(0, tween.onEnd(this.didCollapse.bind(this)));
                    }
                    else {
                        setTimeout(this.didCollapse.bind(this));
                    }
                }
                else {
                    this.button.setIcon(this._buttonIcon);
                    this.stackPhase.setState(0);
                    this.requireUpdate(view.View.NeedsLayout);
                    this.didCollapse();
                }
            }
        };
        ActionStack.prototype.willCollapse = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.actionStackWillCollapse !== void 0) {
                    viewObserver.actionStackWillCollapse(this);
                }
            });
            this._stackState = "collapsing";
        };
        ActionStack.prototype.didCollapse = function () {
            this._stackState = "collapsed";
            this.didObserve(function (viewObserver) {
                if (viewObserver.actionStackDidCollapse !== void 0) {
                    viewObserver.actionStackDidCollapse(this);
                }
            });
        };
        ActionStack.prototype.toggle = function (tween) {
            var stackState = this._stackState;
            if (stackState === "collapsed" || stackState === "collapsing") {
                this.expand(tween);
            }
            else if (stackState === "expanded" || stackState === "expanding") {
                this.collapse(tween);
            }
        };
        ActionStack.prototype.show = function (tween) {
            if (this.opacity.state !== 1) {
                if (tween === void 0 || tween === true) {
                    tween = this._stackTransition;
                }
                else {
                    tween = transition.Transition.forTween(tween);
                }
                this.willShow();
                if (tween !== null) {
                    this.opacity(1, tween.onEnd(this.didShow.bind(this)));
                }
                else {
                    this.opacity(1);
                    this.requireUpdate(view.View.NeedsLayout);
                    this.didShow();
                }
            }
        };
        ActionStack.prototype.willShow = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.actionStackWillShow !== void 0) {
                    viewObserver.actionStackWillShow(this);
                }
            });
            this.display("block");
        };
        ActionStack.prototype.didShow = function () {
            this.didObserve(function (viewObserver) {
                if (viewObserver.actionStackDidShow !== void 0) {
                    viewObserver.actionStackDidShow(this);
                }
            });
        };
        ActionStack.prototype.hide = function (tween) {
            if (this.opacity.state !== 0) {
                if (tween === void 0 || tween === true) {
                    tween = this._stackTransition;
                }
                else {
                    tween = transition.Transition.forTween(tween);
                }
                this.willHide();
                if (tween !== null) {
                    this.opacity(0, tween.onEnd(this.didHide.bind(this)));
                }
                else {
                    this.opacity(0);
                    this.requireUpdate(view.View.NeedsLayout);
                    this.didHide();
                }
            }
        };
        ActionStack.prototype.willHide = function () {
            this.willObserve(function (viewObserver) {
                if (viewObserver.actionStackWillHide !== void 0) {
                    viewObserver.actionStackWillHide(this);
                }
            });
        };
        ActionStack.prototype.didHide = function () {
            this.display("none");
            this.didObserve(function (viewObserver) {
                if (viewObserver.actionStackDidHide !== void 0) {
                    viewObserver.actionStackDidHide(this);
                }
            });
        };
        ActionStack.prototype.onClick = function (event) {
            event.stopPropagation();
        };
        ActionStack.prototype.onContextMenu = function (event) {
            event.preventDefault();
        };
        __decorate([
            view.MemberAnimator(Number, { value: 0 })
        ], ActionStack.prototype, "stackPhase", void 0);
        return ActionStack;
    }(view.HtmlView));

    var ActionStackController = (function (_super) {
        __extends(ActionStackController, _super);
        function ActionStackController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(ActionStackController.prototype, "stackState", {
            get: function () {
                return this._view !== null ? this._view.stackState : null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ActionStackController.prototype, "button", {
            get: function () {
                return this._view !== null ? this._view.button : null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ActionStackController.prototype, "items", {
            get: function () {
                return this._view !== null ? this._view.items : [];
            },
            enumerable: false,
            configurable: true
        });
        ActionStackController.prototype.removeItems = function () {
            if (this._view !== null) {
                this._view.removeItems();
            }
        };
        ActionStackController.prototype.actionStackWillExpand = function (view) {
        };
        ActionStackController.prototype.actionStackDidExpand = function (view) {
            var rootView = this.rootView;
            if (rootView !== null) {
                rootView.presentModal(view, { focus: true });
            }
        };
        ActionStackController.prototype.actionStackWillCollapse = function (view) {
        };
        ActionStackController.prototype.actionStackDidCollapse = function (view) {
            var rootView = this.rootView;
            if (rootView !== null) {
                rootView.dismissModal(view);
            }
        };
        ActionStackController.prototype.actionStackWillShow = function (view) {
        };
        ActionStackController.prototype.actionStackDidShow = function (view) {
        };
        ActionStackController.prototype.actionStackWillHide = function (view) {
        };
        ActionStackController.prototype.actionStackDidHide = function (view) {
        };
        return ActionStackController;
    }(view.HtmlViewController));

    var MenuList = (function (_super) {
        __extends(MenuList, _super);
        function MenuList(node) {
            return _super.call(this, node) || this;
        }
        MenuList.prototype.initNode = function (node) {
            this.addClass("menu-list")
                .flexGrow(1)
                .flexShrink(0)
                .marginTop(12)
                .marginBottom(12);
        };
        Object.defineProperty(MenuList.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        MenuList.prototype.onInsertChildView = function (childView, targetView) {
            _super.prototype.onInsertChildView.call(this, childView, targetView);
            if (childView instanceof MenuItem) {
                this.onInsertItem(childView);
            }
        };
        MenuList.prototype.onRemoveChildView = function (childView) {
            if (childView instanceof MenuItem) {
                this.onRemoveItem(childView);
            }
            _super.prototype.onRemoveChildView.call(this, childView);
        };
        MenuList.prototype.onInsertItem = function (item) {
        };
        MenuList.prototype.onRemoveItem = function (item) {
        };
        MenuList.prototype.onPressItem = function (item) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.menuDidPressItem !== void 0) {
                    viewObserver.menuDidPressItem(item, this);
                }
            });
        };
        return MenuList;
    }(view.HtmlView));

    var MenuItem = (function (_super) {
        __extends(MenuItem, _super);
        function MenuItem(node) {
            var _this = _super.call(this, node) || this;
            _this.onClick = _this.onClick.bind(_this);
            _this.normalFillColor.setState(color.Color.parse("#9a9a9a"));
            _this.highlightFillColor.setState(color.Color.parse("#d8d8d8"));
            _this.highlightCellColor.setState(color.Color.parse("#0a1215"));
            _this.hoverColor.setState(color.Color.rgb(255, 255, 255, 0.05));
            _this.backgroundColor.setAutoState(_this.hoverColor.value.alpha(0));
            _this._highlighted = false;
            return _this;
        }
        MenuItem.prototype.initNode = function (node) {
            this.addClass("memu-item")
                .position("relative")
                .display("flex")
                .flexShrink(0)
                .height(44)
                .boxSizing("border-box")
                .lineHeight(44)
                .overflow("hidden")
                .userSelect("none")
                .cursor("pointer");
            this.paddingLeft.setAutoState(length.Length.px(4));
            this.paddingRight.setAutoState(length.Length.px(4));
        };
        Object.defineProperty(MenuItem.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MenuItem.prototype, "highlighted", {
            get: function () {
                return this._highlighted;
            },
            enumerable: false,
            configurable: true
        });
        MenuItem.prototype.createIconView = function (icon) {
            var view$1 = view.HtmlView.create("div")
                .display("flex")
                .justifyContent("center")
                .alignItems("center")
                .width(36)
                .height(44);
            if (icon !== void 0) {
                icon.fill(this.normalFillColor.value);
                view$1.append(icon, "icon");
            }
            return view$1;
        };
        MenuItem.prototype.createTitleView = function (text) {
            var view$1 = view.HtmlView.create("span")
                .display("block")
                .fontFamily("system-ui, 'Open Sans', sans-serif")
                .fontSize(17)
                .whiteSpace("nowrap")
                .textOverflow("ellipsis")
                .overflow("hidden")
                .color(this.normalFillColor.value);
            if (text !== void 0) {
                view$1.text(text);
            }
            return view$1;
        };
        MenuItem.prototype.iconView = function (newIconView) {
            var childView = this.getChildView("icon");
            var oldIconView = childView instanceof view.HtmlView ? childView : null;
            if (newIconView === void 0) {
                return oldIconView;
            }
            else {
                if (newIconView instanceof view.SvgView) {
                    if (oldIconView === null) {
                        newIconView = this.createIconView(newIconView);
                        this.appendChildView(newIconView, "icon");
                    }
                    else {
                        oldIconView.removeAll();
                        oldIconView.append(newIconView);
                        newIconView = oldIconView;
                    }
                }
                else if (newIconView !== null) {
                    if (oldIconView === null) {
                        this.appendChildView(newIconView, "icon");
                    }
                    else {
                        this.setChildView("icon", newIconView);
                    }
                }
                else if (oldIconView !== null) {
                    oldIconView.remove();
                }
                return this;
            }
        };
        MenuItem.prototype.titleView = function (newTitleView) {
            var childView = this.getChildView("title");
            var oldTitleView = childView instanceof view.HtmlView ? childView : null;
            if (newTitleView === void 0) {
                return oldTitleView;
            }
            else {
                if (typeof newTitleView === "string") {
                    if (oldTitleView === null) {
                        newTitleView = this.createTitleView(newTitleView);
                        this.appendChildView(newTitleView, "title");
                    }
                    else {
                        oldTitleView.text(newTitleView);
                        newTitleView = oldTitleView;
                    }
                }
                else if (newTitleView !== null) {
                    if (oldTitleView === null) {
                        this.appendChildView(newTitleView, "title");
                    }
                    else {
                        this.setChildView("title", newTitleView);
                    }
                }
                else if (oldTitleView !== null) {
                    oldTitleView.remove();
                }
                return this;
            }
        };
        MenuItem.prototype.onMount = function () {
            _super.prototype.onMount.call(this);
            this.on("click", this.onClick);
        };
        MenuItem.prototype.onUnmount = function () {
            this.off("click", this.onClick);
            _super.prototype.onUnmount.call(this);
        };
        MenuItem.prototype.onAnimate = function (viewContext) {
            _super.prototype.onAnimate.call(this, viewContext);
            var drawerStretch = this.drawerStretch.value;
            if (typeof drawerStretch === "number") {
                var titleView = this.titleView();
                titleView.display(drawerStretch === 0 ? "none" : "block")
                    .opacity(drawerStretch);
            }
        };
        MenuItem.prototype.onLayout = function (viewContext) {
            _super.prototype.onLayout.call(this, viewContext);
            var edgeInsets = this.edgeInsets.state;
            if (edgeInsets !== void 0) {
                this.paddingLeft.setAutoState(length.Length.px(Math.max(4, edgeInsets.insetLeft)));
                this.paddingRight.setAutoState(length.Length.px(Math.max(4, edgeInsets.insetRight)));
            }
        };
        MenuItem.prototype.onInsertChildView = function (childView, targetView) {
            _super.prototype.onInsertChildView.call(this, childView, targetView);
            var childKey = childView.key;
            if (childKey === "icon" && childView instanceof view.HtmlView) {
                this.onInsertIcon(childView);
            }
            else if (childKey === "title" && childView instanceof view.HtmlView) {
                this.onInsertTitle(childView);
            }
        };
        MenuItem.prototype.onRemoveChildView = function (childView) {
            var childKey = childView.key;
            if (childKey === "icon" && childView instanceof view.HtmlView) {
                this.onRemoveIcon(childView);
            }
            else if (childKey === "title" && childView instanceof view.HtmlView) {
                this.onRemoveTitle(childView);
            }
            _super.prototype.onRemoveChildView.call(this, childView);
        };
        MenuItem.prototype.onInsertIcon = function (icon) {
            icon.flexShrink(0)
                .marginLeft(8)
                .marginRight(8);
        };
        MenuItem.prototype.onRemoveIcon = function (icon) {
        };
        MenuItem.prototype.onInsertTitle = function (title) {
            title.flexShrink(0)
                .marginLeft(4)
                .marginRight(4);
        };
        MenuItem.prototype.onRemoveTitle = function (title) {
        };
        MenuItem.prototype.onStartHovering = function () {
            var hoverColor = this.hoverColor.value;
            if (hoverColor !== void 0 && this.backgroundColor.isAuto()) {
                if (this.backgroundColor.value === void 0) {
                    this.backgroundColor.setAutoState(hoverColor.alpha(0), false);
                }
                this.backgroundColor.setAutoState(hoverColor, this.tactileTransition);
            }
        };
        MenuItem.prototype.onStopHovering = function () {
            var hoverColor = this.hoverColor.value;
            if (hoverColor !== void 0 && this.backgroundColor.isAuto()) {
                this.backgroundColor.setAutoState(hoverColor.alpha(0), this.tactileTransition);
            }
        };
        MenuItem.prototype.highlight = function (tween) {
            if (!this._highlighted) {
                this._highlighted = true;
                if (tween === true) {
                    tween = this.tactileTransition;
                }
                this.backgroundColor.setAutoState(this.highlightCellColor.value.alpha(1), tween);
                var iconView = this.iconView();
                if (iconView !== null) {
                    var icon = iconView.getChildView("icon");
                    if (icon instanceof view.SvgView) {
                        icon.fill(this.highlightFillColor.value, tween);
                    }
                }
                var titleView = this.titleView();
                if (titleView !== null) {
                    titleView.color(this.highlightFillColor.value, tween);
                }
            }
            return this;
        };
        MenuItem.prototype.unhighlight = function (tween) {
            if (this._highlighted) {
                this._highlighted = false;
                if (tween === true) {
                    tween = this.tactileTransition;
                }
                this.backgroundColor.setAutoState(this.highlightCellColor.value.alpha(0), tween);
                var iconView = this.iconView();
                if (iconView !== null) {
                    var icon = iconView.getChildView("icon");
                    if (icon instanceof view.SvgView) {
                        icon.fill(this.normalFillColor.value, tween);
                    }
                }
                var titleView = this.titleView();
                if (titleView !== null) {
                    titleView.color(this.normalFillColor.value, tween);
                }
            }
            return this;
        };
        MenuItem.prototype.onClick = function (event) {
            event.stopPropagation();
            var parentView = this.parentView;
            if (parentView instanceof MenuList) {
                parentView.onPressItem(this);
            }
        };
        __decorate([
            view.MemberAnimator(Number, { inherit: true })
        ], MenuItem.prototype, "drawerStretch", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], MenuItem.prototype, "normalFillColor", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], MenuItem.prototype, "highlightFillColor", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], MenuItem.prototype, "highlightCellColor", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], MenuItem.prototype, "hoverColor", void 0);
        __decorate([
            view.ViewScope({ inherit: true })
        ], MenuItem.prototype, "edgeInsets", void 0);
        return MenuItem;
    }(TactileView));

    var MenuListController = (function (_super) {
        __extends(MenuListController, _super);
        function MenuListController() {
            var _this = _super.call(this) || this;
            _this._selectedItem = null;
            return _this;
        }
        Object.defineProperty(MenuListController.prototype, "selectedItem", {
            get: function () {
                return this._selectedItem;
            },
            enumerable: false,
            configurable: true
        });
        MenuListController.prototype.selectItem = function (newItem) {
            var oldItem = this._selectedItem;
            if (oldItem !== newItem) {
                this.willSelectItem(newItem, oldItem);
                this._selectedItem = newItem;
                this.onSelectItem(newItem, oldItem);
                this.didSelectItem(newItem, oldItem);
            }
        };
        MenuListController.prototype.willSelectItem = function (newItem, oldItem) {
        };
        MenuListController.prototype.onSelectItem = function (newItem, oldItem) {
            if (oldItem !== null) {
                oldItem.unhighlight(true);
            }
            if (newItem !== null) {
                newItem.highlight(false);
            }
        };
        MenuListController.prototype.didSelectItem = function (newItem, oldItem) {
        };
        MenuListController.prototype.menuDidPressItem = function (item, view) {
            this.selectItem(item);
        };
        return MenuListController;
    }(view.HtmlViewController));

    var RegionMapPopoverView = (function (_super) {
        __extends(RegionMapPopoverView, _super);
        function RegionMapPopoverView(nodeRef) {
            var _this = _super.call(this) || this;
            _this._nodeRef = nodeRef;
            _this._infoLink = null;
            _this._statusLink = null;
            _this._alertsLink = null;
            _this.initPopover();
            return _this;
        }
        RegionMapPopoverView.prototype.initPopover = function () {
            this.width(320)
                .height(480)
                .borderRadius(16)
                .boxShadow(ui.BoxShadow.of(0, 2, 4, 0, ui.Color.rgb(0, 0, 0, 0.5)))
                .backgroundColor(ui.Color.parse("#1e2022").alpha(0.9));
            var content = this.append("div")
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
        };
        RegionMapPopoverView.prototype.didSetInfo = function (newInfo) {
            this._titleView.text(newInfo.get("name").stringValue(null));
            newInfo.forEach(function (item) {
                var key = item.key.stringValue(void 0);
                if (key !== void 0 && key !== "name") {
                    var tableRow = this._infoTable.getChildView(key);
                    var valueCell = void 0;
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
                    }
                    else {
                        valueCell = tableRow.getChildView("value");
                    }
                    var value = item.toValue();
                    if (value instanceof core.Record) {
                        valueCell.text(JSON.stringify(value.toAny()));
                    }
                    else {
                        valueCell.text(value.stringValue(null));
                    }
                }
            }, this);
        };
        RegionMapPopoverView.prototype.didSetStatus = function (newStatus) {
            newStatus.forEach(function (item) {
                var key = item.key.stringValue(void 0);
                if (key !== void 0) {
                    var tableRow = this._statusTable.getChildView(key);
                    var valueCell = void 0;
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
                    }
                    else {
                        valueCell = tableRow.getChildView("value");
                    }
                    var value = item.toValue();
                    if (value instanceof core.Record) {
                        valueCell.text(JSON.stringify(value.toAny()));
                    }
                    else {
                        valueCell.text(value.stringValue(null));
                    }
                }
            }, this);
        };
        RegionMapPopoverView.prototype.didUpdateAlert = function (key, newAlert) {
            var siteNodeUri = key.stringValue(void 0);
            if (siteNodeUri !== void 0) {
                var tableRow = this._alertsTable.getChildView(siteNodeUri);
                var valueCell = void 0;
                if (tableRow === null) {
                    tableRow = this._alertsTable.append("tr", siteNodeUri)
                        .color("#cccccc");
                    var coordinates = newAlert.get("coordinates").toAny();
                    if (coordinates !== void 0) {
                        tableRow.cursor("pointer");
                        tableRow.on("click", this.onAlertClick.bind(this, siteNodeUri, map.GeoPoint.fromAny(coordinates)));
                    }
                    tableRow.append("th", "key")
                        .width("50%")
                        .padding([2, 4, 2, 0])
                        .textAlign("left")
                        .text(siteNodeUri);
                    valueCell = tableRow.append("td", "value")
                        .width("50%")
                        .padding([2, 0, 2, 4]);
                }
                else {
                    valueCell = tableRow.getChildView("value");
                }
                if (newAlert instanceof core.Record) {
                    var value = newAlert.deleted("coordinates");
                    if (value.length === 1 && value.get("severity").isDefined()) {
                        valueCell.text(value.get("severity").numberValue(0).toFixed(2));
                    }
                    else {
                        valueCell.text(JSON.stringify(value.toAny()));
                    }
                }
                else {
                    valueCell.text(newAlert.stringValue(null));
                }
            }
        };
        RegionMapPopoverView.prototype.didRemoveAlert = function (key, oldAlert) {
            var siteNodeUri = key.stringValue(void 0);
            if (siteNodeUri !== void 0) {
                this._alertsTable.removeChildView(siteNodeUri);
            }
        };
        RegionMapPopoverView.prototype.onAlertClick = function (siteNodeUri, geoPoint, event) {
            var mapboxView = this.mapboxView;
            if (mapboxView !== null) {
                mapboxView.map.flyTo({
                    center: geoPoint.toAny(),
                    zoom: 12,
                });
            }
        };
        Object.defineProperty(RegionMapPopoverView.prototype, "mapboxView", {
            get: function () {
                var view = this.source;
                while (view !== null) {
                    if (view instanceof map.MapboxView) {
                        return view;
                    }
                    view = view.parentView;
                }
                return null;
            },
            enumerable: false,
            configurable: true
        });
        RegionMapPopoverView.prototype.didHide = function () {
            _super.prototype.didHide.call(this);
            this.remove();
        };
        RegionMapPopoverView.prototype.onMount = function () {
            _super.prototype.onMount.call(this);
            this.linkInfo();
            this.linkStatus();
            this.linkAlerts();
        };
        RegionMapPopoverView.prototype.onUnmount = function () {
            this.unlinkInfo();
            this.unlinkStatus();
            this.unlinkAlerts();
            _super.prototype.onUnmount.call(this);
        };
        RegionMapPopoverView.prototype.linkInfo = function () {
            if (this._infoLink === null) {
                this._infoLink = this._nodeRef.downlinkValue()
                    .laneUri("info")
                    .didSet(this.didSetInfo.bind(this))
                    .open();
            }
        };
        RegionMapPopoverView.prototype.unlinkInfo = function () {
            if (this._infoLink !== null) {
                this._infoLink.close();
                this._infoLink = null;
            }
        };
        RegionMapPopoverView.prototype.linkStatus = function () {
            if (this._statusLink === null) {
                this._statusLink = this._nodeRef.downlinkValue()
                    .laneUri("status")
                    .didSet(this.didSetStatus.bind(this))
                    .open();
            }
        };
        RegionMapPopoverView.prototype.unlinkStatus = function () {
            if (this._statusLink !== null) {
                this._statusLink.close();
                this._statusLink = null;
            }
        };
        RegionMapPopoverView.prototype.linkAlerts = function () {
            if (this._alertsLink === null) {
                this._alertsLink = this._nodeRef.downlinkMap()
                    .laneUri("alerts")
                    .didUpdate(this.didUpdateAlert.bind(this))
                    .didRemove(this.didRemoveAlert.bind(this))
                    .open();
            }
        };
        RegionMapPopoverView.prototype.unlinkAlerts = function () {
            if (this._alertsLink !== null) {
                this._alertsLink.close();
                this._alertsLink = null;
            }
        };
        return RegionMapPopoverView;
    }(PopoverView));

    var SiteMapPopoverView = (function (_super) {
        __extends(SiteMapPopoverView, _super);
        function SiteMapPopoverView(nodeRef) {
            var _this = _super.call(this) || this;
            _this._nodeRef = nodeRef;
            _this._infoLink = null;
            _this._statusLink = null;
            _this._kpisLink = null;
            _this._historyLink = null;
            _this.initPopover();
            return _this;
        }
        SiteMapPopoverView.prototype.initPopover = function () {
            this.width(320)
                .height(480)
                .borderRadius(16)
                .boxShadow(ui.BoxShadow.of(0, 2, 4, 0, ui.Color.rgb(0, 0, 0, 0.5)))
                .backgroundColor(ui.Color.parse("#1e2022").alpha(0.9));
            var content = this.append("div")
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
            var historyContainer = content.append("div")
                .position("relative")
                .height(120)
                .marginBottom(16);
            var historyCanvas = historyContainer.append("canvas");
            this._historyChart = new gauge.ChartView()
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
        };
        SiteMapPopoverView.prototype.didSetInfo = function (newInfo) {
            this._titleView.text(newInfo.get("node").stringValue(null));
            newInfo.forEach(function (item) {
                var key = item.key.stringValue(void 0);
                if (key !== void 0 && key !== "node" && key !== "coordinates") {
                    var tableRow = this._infoTable.getChildView(key);
                    var valueCell = void 0;
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
                    }
                    else {
                        valueCell = tableRow.getChildView("value");
                    }
                    var value = item.toValue();
                    if (value instanceof core.Record) {
                        valueCell.text(JSON.stringify(value.toAny()));
                    }
                    else {
                        valueCell.text(value.stringValue(null));
                    }
                }
            }, this);
        };
        SiteMapPopoverView.prototype.didSetStatus = function (newStatus) {
            newStatus.forEach(function (item) {
                var key = item.key.stringValue(void 0);
                if (key !== void 0 && key !== "coordinates") {
                    var tableRow = this._statusTable.getChildView(key);
                    var valueCell = void 0;
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
                    }
                    else {
                        valueCell = tableRow.getChildView("value");
                    }
                    var value = item.toValue();
                    if (value instanceof core.Record) {
                        valueCell.text(JSON.stringify(value.toAny()));
                    }
                    else {
                        valueCell.text(value.stringValue(null));
                    }
                }
            }, this);
        };
        SiteMapPopoverView.prototype.didSetKpis = function (newKpis) {
            newKpis.forEach(function (item) {
                var key = item.key.stringValue(void 0);
                if (key !== void 0) {
                    var tableRow = this._kpisTable.getChildView(key);
                    var valueCell = void 0;
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
                    }
                    else {
                        valueCell = tableRow.getChildView("value");
                    }
                    var value = item.toValue();
                    if (value instanceof core.Record) {
                        valueCell.text(JSON.stringify(value.toAny()));
                    }
                    else {
                        valueCell.text(value.stringValue(null));
                    }
                }
            }, this);
        };
        SiteMapPopoverView.prototype.didUpdateHistory = function (key, newSample) {
            var t = new core.DateTime(key.numberValue(0));
            newSample.forEach(function (item) {
                var key = item.key.stringValue(void 0);
                var value = item.numberValue(void 0);
                if (key !== void 0 && key !== "recorded_time" && value !== void 0) {
                    var historyPlot = this._historyChart.getChildView(key);
                    if (historyPlot === null) {
                        historyPlot = new gauge.LineGraphView()
                            .hitMode("data")
                            .stroke("#ffffff")
                            .strokeWidth(2)
                            .on("mouseover", function (event) {
                            var datum = event.targetView;
                            var y = datum.y.value;
                            datum.label(ui.TextRunView.fromAny({
                                text: y.toFixed(2) + "  " + key,
                            }));
                        })
                            .on("mouseout", function (event) {
                            var datum = event.targetView;
                            datum.label(null);
                        });
                        this._historyChart.setChildView(key, historyPlot);
                    }
                    historyPlot.insertDatum({ x: t, y: value });
                    var futureKey = key + "-future";
                    var futurePlot = this._historyChart.getChildView(futureKey);
                    if (futurePlot === null) {
                        futurePlot = new gauge.LineGraphView()
                            .hitMode("data")
                            .stroke("#ffffff")
                            .strokeWidth(2);
                        this._historyChart.setChildView(futureKey, futurePlot);
                    }
                    futurePlot.removeAll();
                    var prevDatum = historyPlot._data.previousValue(t);
                    if (prevDatum !== void 0) {
                        futurePlot.insertDatum({ x: t, y: value, opacity: 1 });
                        var nextValue = (prevDatum.y.value + value) / 2;
                        futurePlot.insertDatum({ x: new core.DateTime(t.time() + 60000), y: nextValue, opacity: 0 });
                    }
                }
            }, this);
        };
        SiteMapPopoverView.prototype.didRemoveHistory = function (key, oldSample) {
            var t = new core.DateTime(key.numberValue(0));
            oldSample.forEach(function (item) {
                var key = item.key.stringValue(void 0);
                var value = item.numberValue(void 0);
                if (key !== void 0 && key !== "recorded_time" && value !== void 0) {
                    var historyPlot = this._historyChart.getChildView(key);
                    if (historyPlot !== null) {
                        historyPlot.removeDatum(t);
                    }
                }
            }, this);
        };
        SiteMapPopoverView.prototype.onMount = function () {
            _super.prototype.onMount.call(this);
            this.linkInfo();
            this.linkStatus();
            this.linkKpis();
            this.linkHistory();
        };
        SiteMapPopoverView.prototype.onUnmount = function () {
            this.unlinkInfo();
            this.unlinkStatus();
            this.unlinkKpis();
            this.unlinkHistory();
            _super.prototype.onUnmount.call(this);
        };
        SiteMapPopoverView.prototype.didHide = function () {
            _super.prototype.didHide.call(this);
            this.remove();
        };
        SiteMapPopoverView.prototype.linkInfo = function () {
            if (this._infoLink === null) {
                this._infoLink = this._nodeRef.downlinkValue()
                    .laneUri("info")
                    .didSet(this.didSetInfo.bind(this))
                    .open();
            }
        };
        SiteMapPopoverView.prototype.unlinkInfo = function () {
            if (this._infoLink !== null) {
                this._infoLink.close();
                this._infoLink = null;
            }
        };
        SiteMapPopoverView.prototype.linkStatus = function () {
            if (this._statusLink === null) {
                this._statusLink = this._nodeRef.downlinkValue()
                    .laneUri("status")
                    .didSet(this.didSetStatus.bind(this))
                    .open();
            }
        };
        SiteMapPopoverView.prototype.unlinkStatus = function () {
            if (this._statusLink !== null) {
                this._statusLink.close();
                this._statusLink = null;
            }
        };
        SiteMapPopoverView.prototype.linkKpis = function () {
            if (this._kpisLink === null) {
                this._kpisLink = this._nodeRef.downlinkValue()
                    .laneUri("kpis")
                    .didSet(this.didSetKpis.bind(this))
                    .open();
            }
        };
        SiteMapPopoverView.prototype.unlinkKpis = function () {
            if (this._kpisLink !== null) {
                this._kpisLink.close();
                this._kpisLink = null;
            }
        };
        SiteMapPopoverView.prototype.linkHistory = function () {
            if (this._historyLink === null) {
                this._historyLink = this._nodeRef.downlinkMap()
                    .laneUri("ranHistory")
                    .didUpdate(this.didUpdateHistory.bind(this))
                    .didRemove(this.didRemoveHistory.bind(this))
                    .open();
            }
        };
        SiteMapPopoverView.prototype.unlinkHistory = function () {
            if (this._historyLink !== null) {
                this._historyLink.close();
                this._historyLink = null;
            }
        };
        return SiteMapPopoverView;
    }(PopoverView));

    var SectorMapPopoverView = (function (_super) {
        __extends(SectorMapPopoverView, _super);
        function SectorMapPopoverView(nodeRef) {
            var _this = _super.call(this) || this;
            _this._nodeRef = nodeRef;
            _this._infoLink = null;
            _this._statusLink = null;
            _this.initPopover();
            return _this;
        }
        SectorMapPopoverView.prototype.initPopover = function () {
            this.width(320)
                .height(480)
                .borderRadius(16)
                .boxShadow(ui.BoxShadow.of(0, 2, 4, 0, ui.Color.rgb(0, 0, 0, 0.5)))
                .backgroundColor(ui.Color.parse("#1e2022").alpha(0.9));
            var content = this.append("div")
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
        };
        SectorMapPopoverView.prototype.didSetInfo = function (newInfo) {
            newInfo.forEach(function (item) {
                var key = item.key.stringValue(void 0);
                if (key !== void 0) {
                    var tableRow = this._infoTable.getChildView(key);
                    var valueCell = void 0;
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
                    }
                    else {
                        valueCell = tableRow.getChildView("value");
                    }
                    var value = item.toValue();
                    if (value instanceof core.Record) {
                        valueCell.text(JSON.stringify(value.toAny()));
                    }
                    else {
                        valueCell.text(value.stringValue(null));
                    }
                }
            }, this);
        };
        SectorMapPopoverView.prototype.didSetStatus = function (newStatus) {
            newStatus.forEach(function (item) {
                var key = item.key.stringValue(void 0);
                if (key !== void 0 && key !== "coordinates") {
                    var tableRow = this._statusTable.getChildView(key);
                    var valueCell = void 0;
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
                    }
                    else {
                        valueCell = tableRow.getChildView("value");
                    }
                    var value = item.toValue();
                    if (value instanceof core.Record) {
                        valueCell.text(JSON.stringify(value.toAny()));
                    }
                    else {
                        valueCell.text(value.stringValue(null));
                    }
                }
            }, this);
        };
        SectorMapPopoverView.prototype.onMount = function () {
            _super.prototype.onMount.call(this);
            this.linkInfo();
            this.linkStatus();
        };
        SectorMapPopoverView.prototype.onUnmount = function () {
            this.unlinkInfo();
            this.unlinkStatus();
            _super.prototype.onUnmount.call(this);
        };
        SectorMapPopoverView.prototype.didHide = function () {
            _super.prototype.didHide.call(this);
            this.remove();
        };
        SectorMapPopoverView.prototype.linkInfo = function () {
            if (this._infoLink === null) {
                this._infoLink = this._nodeRef.downlinkValue()
                    .laneUri("info")
                    .didSet(this.didSetInfo.bind(this))
                    .open();
            }
        };
        SectorMapPopoverView.prototype.unlinkInfo = function () {
            if (this._infoLink !== null) {
                this._infoLink.close();
                this._infoLink = null;
            }
        };
        SectorMapPopoverView.prototype.linkStatus = function () {
            if (this._statusLink === null) {
                this._statusLink = this._nodeRef.downlinkValue()
                    .laneUri("status")
                    .didSet(this.didSetStatus.bind(this))
                    .open();
            }
        };
        SectorMapPopoverView.prototype.unlinkStatus = function () {
            if (this._statusLink !== null) {
                this._statusLink.close();
                this._statusLink = null;
            }
        };
        return SectorMapPopoverView;
    }(PopoverView));

    var STATUS_TWEEN = ui.Transition.duration(500, ui.Ease.cubicOut);
    var SectorMapView = (function (_super) {
        __extends(SectorMapView, _super);
        function SectorMapView(nodeRef) {
            var _this = _super.call(this) || this;
            _this.onClick = _this.onClick.bind(_this);
            _this._nodeRef = nodeRef;
            _this._status = core.Value.absent();
            _this._popoverView = null;
            return _this;
        }
        SectorMapView.prototype.didSetStatus = function (newStatus, tween) {
            if (tween === void 0) { tween = STATUS_TWEEN; }
            this._status = newStatus;
            if (this._popoverView !== null) {
                this._popoverView.backgroundColor(this.fill.value.darker(2).alpha(0.9), tween);
            }
            this.requireUpdate(ui.View.NeedsProject);
        };
        SectorMapView.prototype.onMount = function () {
            _super.prototype.onMount.call(this);
            this.on("click", this.onClick);
        };
        SectorMapView.prototype.onUnmount = function () {
            _super.prototype.onUnmount.call(this);
            this.off("click", this.onClick);
        };
        SectorMapView.prototype.onProject = function (viewContext) {
            _super.prototype.onProject.call(this, viewContext);
            var index = this.parentView.childViews.indexOf(this);
            var azimuth = this._status.get("azimuth").numberValue();
            var sweep = this._status.get("sweep").numberValue();
            this.startAngle(ui.Angle.deg(azimuth - sweep / 2 - viewContext.mapHeading))
                .sweepAngle(ui.Angle.deg(sweep))
                .innerRadius(6 + 6 * index)
                .outerRadius(6 + 6 * index + 4);
        };
        SectorMapView.prototype.onClick = function (event) {
            event.stopPropagation();
            var popoverView = this._popoverView;
            if (popoverView === null) {
                popoverView = new SectorMapPopoverView(this._nodeRef);
                popoverView.setSource(this);
                popoverView.hideModal();
                popoverView.backgroundColor.didUpdate = function () {
                    popoverView.place();
                };
                this._popoverView = popoverView;
            }
            popoverView.backgroundColor(this.fill.value.darker(2).alpha(0.9));
            this.rootView.toggleModal(popoverView, { multi: event.altKey });
        };
        return SectorMapView;
    }(map.MapArcView));

    var INFO_COLOR = ui.Color.parse("#44d7b6");
    var WARN_COLOR = ui.Color.parse("#f9f070");
    var ALERT_COLOR = ui.Color.parse("#f6511d");
    var WARN_INTERPOLATOR = ui.ColorInterpolator.between(INFO_COLOR, WARN_COLOR);
    var ALERT_INTERPOLATOR = ui.ColorInterpolator.between(WARN_COLOR, ALERT_COLOR);
    var STATUS_TWEEN$1 = ui.Transition.duration(500, ui.Ease.cubicOut);
    var MIN_SECTOR_ZOOM = 10;
    var SiteMapView = (function (_super) {
        __extends(SiteMapView, _super);
        function SiteMapView(nodeRef) {
            var _this = _super.call(this) || this;
            _this.onClick = _this.onClick.bind(_this);
            _this._nodeRef = nodeRef;
            _this._sectorsLink = null;
            _this._statusColor = INFO_COLOR;
            _this._popoverView = null;
            return _this;
        }
        SiteMapView.prototype.didSetStatus = function (newStatus, tween) {
            if (tween === void 0) { tween = STATUS_TWEEN$1; }
            var marker = this.getChildView("marker");
            if (marker === null) {
                var coordinates = newStatus.get("coordinates").toAny();
                marker = new map.MapCircleView().geoCenter(coordinates).radius(4);
                this.setChildView("marker", marker);
            }
            var color;
            var severity = newStatus.get("severity").numberValue(0);
            if (severity > 1) {
                color = ALERT_INTERPOLATOR.interpolate(severity - 1);
                this.fill(color, tween);
                if (tween !== false) {
                    this.ripple(color, 2, 5000);
                }
            }
            else if (severity > 0) {
                color = WARN_INTERPOLATOR.interpolate(severity);
                this.fill(color, tween);
                if (tween !== false) {
                    this.ripple(color, 1, 2500);
                }
            }
            else {
                color = INFO_COLOR;
                this.fill(INFO_COLOR, tween);
            }
            if (this._popoverView !== null) {
                this._popoverView.backgroundColor(color.darker(2).alpha(0.9), tween);
            }
            this._statusColor = color;
        };
        SiteMapView.prototype.ripple = function (color, width, duration) {
            var rootMapView = this.rootMapView;
            if (!this.isHidden() && !this.isCulled() && !document.hidden && this.geoBounds.intersects(rootMapView.geoFrame)) {
                var marker = this.getChildView("marker");
                var ripple_1 = new map.MapCircleView()
                    .geoCenter(marker.geoCenter.value)
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
        SiteMapView.prototype.didUpdateSector = function (key, newSectorStatus) {
            var sectorNodeUri = key.stringValue();
            var azimuth = newSectorStatus.get("azimuth").stringValue();
            var azimuthView = this.getChildView(azimuth);
            if (azimuthView === null) {
                azimuthView = new map.MapGroupView();
                this.setChildView(azimuth, azimuthView);
            }
            var sectorMapView = azimuthView.getChildView(sectorNodeUri);
            if (sectorMapView === null) {
                var marker = this.getChildView("marker");
                var sectorNodeRef = this._nodeRef.nodeRef(sectorNodeUri);
                sectorMapView = new SectorMapView(sectorNodeRef)
                    .geoCenter(marker.geoCenter.value);
                sectorMapView.didSetStatus(newSectorStatus, false);
                azimuthView.setChildView(sectorNodeUri, sectorMapView);
            }
            else {
                sectorMapView.didSetStatus(newSectorStatus);
            }
        };
        SiteMapView.prototype.didRemoveSector = function (key, oldSectorStatus) {
            var sectorNodeUri = key.stringValue();
            var azimuth = oldSectorStatus.get("azimuth").stringValue();
            var azimuthView = this.getChildView(azimuth);
            if (azimuthView !== null) {
                azimuthView.removeChildView(sectorNodeUri);
                if (azimuthView.childViews.length === 0) {
                    this.removeChildView(azimuthView);
                }
            }
        };
        SiteMapView.prototype.onMount = function () {
            _super.prototype.onMount.call(this);
        };
        SiteMapView.prototype.onUnmount = function () {
            _super.prototype.onUnmount.call(this);
            this.unlinkSectors();
        };
        SiteMapView.prototype.onInsertChildView = function (childView, targetView) {
            _super.prototype.onInsertChildView.call(this, childView, targetView);
            if (childView.key === "marker") {
                childView.on("click", this.onClick);
            }
        };
        SiteMapView.prototype.onRemoveChildView = function (childView) {
            _super.prototype.onRemoveChildView.call(this, childView);
            if (childView.key === "marker") {
                childView.off("click", this.onClick);
            }
        };
        SiteMapView.prototype.didProject = function (viewContext) {
            if (viewContext.mapZoom >= MIN_SECTOR_ZOOM && this.geoBounds.intersects(viewContext.geoFrame)) {
                this.linkSectors();
            }
            else {
                if (this._sectorsLink !== null) {
                    this.rootView.dismissModals();
                }
                this.unlinkSectors();
            }
            _super.prototype.didProject.call(this, viewContext);
        };
        SiteMapView.prototype.onClick = function (event) {
            event.stopPropagation();
            var popoverView = this._popoverView;
            if (popoverView === null) {
                popoverView = new SiteMapPopoverView(this._nodeRef);
                popoverView.setSource(this.getChildView("marker"));
                popoverView.hideModal();
                popoverView.backgroundColor.didUpdate = function () {
                    popoverView.place();
                };
                this._popoverView = popoverView;
            }
            popoverView.backgroundColor(this._statusColor.darker(2).alpha(0.9));
            this.rootView.toggleModal(popoverView, { multi: event.altKey });
        };
        SiteMapView.prototype.linkSectors = function () {
            if (this._sectorsLink === null) {
                this._sectorsLink = this._nodeRef.downlinkMap()
                    .laneUri("sectors")
                    .didUpdate(this.didUpdateSector.bind(this))
                    .didRemove(this.didRemoveSector.bind(this))
                    .open();
            }
        };
        SiteMapView.prototype.unlinkSectors = function () {
            if (this._sectorsLink !== null) {
                this._sectorsLink.close();
                this._sectorsLink = null;
                var i = 0;
                while (i < this._childViews.length) {
                    var childView = this._childViews[i];
                    if (childView instanceof map.MapGroupView) {
                        childView.remove();
                    }
                    else {
                        i += 1;
                    }
                }
            }
        };
        __decorate([
            ui.MemberAnimator(ui.Color)
        ], SiteMapView.prototype, "fill", void 0);
        __decorate([
            ui.MemberAnimator(ui.Color)
        ], SiteMapView.prototype, "stroke", void 0);
        __decorate([
            ui.MemberAnimator(Number)
        ], SiteMapView.prototype, "strokeWidth", void 0);
        return SiteMapView;
    }(map.MapGroupView));

    var INFO_COLOR$1 = ui.Color.parse("#44d7b6");
    var WARN_COLOR$1 = ui.Color.parse("#f9f070");
    var ALERT_COLOR$1 = ui.Color.parse("#f6511d");
    var WARN_INTERPOLATOR$1 = ui.ColorInterpolator.between(INFO_COLOR$1, WARN_COLOR$1);
    var ALERT_INTERPOLATOR$1 = ui.ColorInterpolator.between(WARN_COLOR$1, ALERT_COLOR$1);
    var STATUS_TWEEN$2 = ui.Transition.duration(5000, ui.Ease.cubicOut);
    var RegionMapView = (function (_super) {
        __extends(RegionMapView, _super);
        function RegionMapView(nodeRef) {
            var _this = _super.call(this) || this;
            _this.onClick = _this.onClick.bind(_this);
            _this._nodeRef = nodeRef;
            _this._minZoom = -Infinity;
            _this._maxZoom = Infinity;
            _this._minSubRegionZoom = Infinity;
            _this._minSiteZoom = Infinity;
            _this._geoCentroid = map.GeoPoint.origin();
            _this._viewCentroid = core.PointR2.origin();
            _this._statusColor = INFO_COLOR$1;
            _this._statusPhase = 1;
            _this._popoverView = null;
            _this._statusLink = null;
            _this._geometryLink = null;
            _this._subRegionsLink = null;
            _this._sitesLink = null;
            return _this;
        }
        RegionMapView.prototype.didSetStatus = function (newStatus, tween) {
            if (tween === void 0) { tween = STATUS_TWEEN$2; }
            var siteCount = newStatus.get("siteCount").numberValue(0);
            var warnCount = newStatus.get("warnCount").numberValue(0);
            var alertCount = newStatus.get("alertCount").numberValue(0);
            var warnRatio = warnCount / siteCount;
            var alertRatio = alertCount / siteCount;
            var color;
            var phase;
            if (alertRatio > 0.015) {
                phase = Math.min((1 / 0.015) * (alertRatio - 0.015), 1);
                color = ALERT_INTERPOLATOR$1.interpolate(phase);
                this.fill(color.alpha(0.25 + 0.25 * phase), tween)
                    .stroke(color.alpha(0.5 + 0.25 * phase), tween)
                    .strokeWidth(1 + phase, tween);
            }
            else if (warnRatio > 0.15) {
                phase = Math.min((1 / 0.15) * (warnRatio - 0.15), 1);
                color = WARN_INTERPOLATOR$1.interpolate(phase);
                this.fill(color.alpha(0.1 + 0.15 * phase), tween)
                    .stroke(color.alpha(0.2 + 0.3 * phase), tween)
                    .strokeWidth(1, tween);
            }
            else {
                phase = 1;
                color = INFO_COLOR$1;
                this.fill(color.alpha(0.1), tween)
                    .stroke(color.alpha(0.2), tween)
                    .strokeWidth(1, tween);
            }
            if (this._popoverView !== null) {
                this._popoverView.backgroundColor(color.darker(2).alpha(0.9), tween);
            }
            this._statusColor = color;
            this._statusPhase = phase;
        };
        RegionMapView.prototype.didSetGeometry = function (newGeometry) {
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
                    geometryView.on("click", this.onClick);
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
            var centroid = newGeometry.get("centroid").toAny();
            if (centroid !== void 0) {
                this._geoCentroid = map.GeoPoint.fromAny(centroid);
            }
        };
        RegionMapView.prototype.didUpdateSubRegion = function (key, newSubRegionStatus) {
            var subRegionNodeUri = key.stringValue();
            var subRegionMapView = this.getChildView(subRegionNodeUri);
            if (subRegionMapView === null) {
                var subRegionNodeRef = this._nodeRef.nodeRef(subRegionNodeUri);
                subRegionMapView = new RegionMapView(subRegionNodeRef);
                subRegionMapView.didSetStatus(newSubRegionStatus, false);
                this.setChildView(subRegionNodeUri, subRegionMapView);
            }
            else {
                subRegionMapView.didSetStatus(newSubRegionStatus);
            }
        };
        RegionMapView.prototype.didRemoveSubRegion = function (key, oldSubRegionStatus) {
            var subRegionNodeUri = key.stringValue();
            this.removeChildView(subRegionNodeUri);
        };
        RegionMapView.prototype.didUpdateSite = function (key, newSiteStatus) {
            var siteNodeUri = key.stringValue();
            var siteMapView = this.getChildView(siteNodeUri);
            if (siteMapView === null) {
                var siteNodeRef = this._nodeRef.nodeRef(siteNodeUri);
                siteMapView = new SiteMapView(siteNodeRef);
                siteMapView.didSetStatus(newSiteStatus, false);
                this.setChildView(siteNodeUri, siteMapView);
            }
            else {
                siteMapView.didSetStatus(newSiteStatus);
            }
        };
        RegionMapView.prototype.didRemoveSite = function (key, oldSiteStatus) {
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
                if (this._sitesLink !== null) {
                    this.rootView.dismissModals();
                }
                this.unlinkSites();
            }
            this._viewCentroid = viewContext.geoProjection.project(this._geoCentroid);
            if (viewContext.mapZoom >= this._maxZoom && this._popoverView !== null) {
                this.rootView.dismissModal(this._popoverView);
                this._popoverView.setSource(null);
                this._popoverView = null;
            }
            _super.prototype.didProject.call(this, viewContext);
        };
        Object.defineProperty(RegionMapView.prototype, "popoverFrame", {
            get: function () {
                var inversePageTransform = this.pageTransform.inverse();
                var centroid = this._viewCentroid;
                var _a = inversePageTransform.transform(centroid.x, centroid.y), px = _a[0], py = _a[1];
                px = Math.round(px);
                py = Math.round(py);
                return new core.BoxR2(px, py, px, py);
            },
            enumerable: false,
            configurable: true
        });
        RegionMapView.prototype.onClick = function (event) {
            event.stopPropagation();
            var popoverView = this._popoverView;
            if (popoverView === null) {
                popoverView = new RegionMapPopoverView(this._nodeRef);
                popoverView.setSource(this);
                popoverView.hideModal();
                popoverView.backgroundColor.didUpdate = function () {
                    popoverView.place();
                };
                this._popoverView = popoverView;
            }
            popoverView.backgroundColor(this._statusColor.darker(2).alpha(0.9));
            this.rootView.toggleModal(popoverView, { multi: event.altKey });
        };
        RegionMapView.prototype.linkStatus = function () {
            if (this._statusLink === null) {
                this._statusLink = this._nodeRef.downlinkValue()
                    .laneUri("status")
                    .didSet(this.didSetStatus.bind(this))
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
                    .didSet(this.didSetGeometry.bind(this))
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
                    .didUpdate(this.didUpdateSubRegion.bind(this))
                    .didRemove(this.didRemoveSubRegion.bind(this))
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
                    .didUpdate(this.didUpdateSite.bind(this))
                    .didRemove(this.didRemoveSite.bind(this))
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

    exports.RegionMapPopoverView = RegionMapPopoverView;
    exports.RegionMapView = RegionMapView;
    exports.SectorMapPopoverView = SectorMapPopoverView;
    exports.SectorMapView = SectorMapView;
    exports.SiteMapPopoverView = SiteMapPopoverView;
    exports.SiteMapView = SiteMapView;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=swim-cellular.js.map
