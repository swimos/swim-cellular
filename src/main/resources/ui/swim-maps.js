(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@swim/util'), require('@swim/codec'), require('@swim/interpolate'), require('@swim/math'), require('@swim/view'), require('@swim/color'), require('@swim/transform'), require('@swim/render'), require('@swim/length'), require('@swim/font'), require('@swim/typeset'), require('@swim/angle'), require('@swim/shape'), require('mapbox-gl')) :
    typeof define === 'function' && define.amd ? define(['exports', '@swim/util', '@swim/codec', '@swim/interpolate', '@swim/math', '@swim/view', '@swim/color', '@swim/transform', '@swim/render', '@swim/length', '@swim/font', '@swim/typeset', '@swim/angle', '@swim/shape', 'mapbox-gl'], factory) :
    (global = global || self, factory(global.swim = global.swim || {}, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.swim, global.mapboxgl));
}(this, (function (exports, util, codec, interpolate, math, view, color, transform, render, length, font, typeset, angle, shape, mapboxgl) { 'use strict';

    var GeoPoint = (function () {
        function GeoPoint(lng, lat) {
            this._lng = lng;
            this._lat = lat;
        }
        Object.defineProperty(GeoPoint.prototype, "lng", {
            get: function () {
                return this._lng;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GeoPoint.prototype, "lat", {
            get: function () {
                return this._lat;
            },
            enumerable: false,
            configurable: true
        });
        GeoPoint.prototype.project = function (projection) {
            return projection.project(this);
        };
        GeoPoint.prototype.toAny = function () {
            return {
                lng: this._lng,
                lat: this._lat,
            };
        };
        GeoPoint.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof GeoPoint) {
                return this._lng === that._lng && this._lat === that._lat;
            }
            return false;
        };
        GeoPoint.prototype.hashCode = function () {
            if (GeoPoint._hashSeed === void 0) {
                GeoPoint._hashSeed = util.Murmur3.seed(GeoPoint);
            }
            return util.Murmur3.mash(util.Murmur3.mix(util.Murmur3.mix(GeoPoint._hashSeed, util.Murmur3.hash(this._lng)), util.Murmur3.hash(this._lat)));
        };
        GeoPoint.prototype.debug = function (output) {
            output = output.write("GeoPoint").write(46).write("from").write(40)
                .debug(this._lng).write(", ").debug(this._lat).write(41);
        };
        GeoPoint.prototype.toString = function () {
            return codec.Format.debug(this);
        };
        GeoPoint.origin = function () {
            if (GeoPoint._origin === void 0) {
                GeoPoint._origin = new GeoPoint(0, 0);
            }
            return GeoPoint._origin;
        };
        GeoPoint.from = function (lng, lat) {
            return new GeoPoint(lng, lat);
        };
        GeoPoint.fromInit = function (value) {
            return new GeoPoint(value.lng, value.lat);
        };
        GeoPoint.fromTuple = function (value) {
            return new GeoPoint(value[0], value[1]);
        };
        GeoPoint.fromAny = function (value) {
            if (value instanceof GeoPoint) {
                return value;
            }
            else if (GeoPoint.isInit(value)) {
                return GeoPoint.fromInit(value);
            }
            else if (GeoPoint.isTuple(value)) {
                return GeoPoint.fromTuple(value);
            }
            throw new TypeError("" + value);
        };
        GeoPoint.isInit = function (value) {
            if (typeof value === "object" && value !== null) {
                var init = value;
                return typeof init.lng === "number"
                    && typeof init.lat === "number";
            }
            return false;
        };
        GeoPoint.isTuple = function (value) {
            return Array.isArray(value)
                && value.length === 2
                && typeof value[0] === "number"
                && typeof value[1] === "number";
        };
        GeoPoint.isAny = function (value) {
            return value instanceof GeoPoint
                || GeoPoint.isInit(value)
                || GeoPoint.isTuple(value);
        };
        return GeoPoint;
    }());

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

    var GeoPointInterpolator = (function (_super) {
        __extends(GeoPointInterpolator, _super);
        function GeoPointInterpolator(p0, p1) {
            var _this = _super.call(this) || this;
            _this.x = p0.lng;
            _this.dx = p1.lng - _this.x;
            _this.y = p0.lat;
            _this.dy = p1.lat - _this.y;
            return _this;
        }
        GeoPointInterpolator.prototype.interpolate = function (u) {
            var lng = this.x + this.dx * u;
            var lat = this.y + this.dy * u;
            return new GeoPoint(lng, lat);
        };
        GeoPointInterpolator.prototype.deinterpolate = function (p) {
            p = GeoPoint.fromAny(p);
            var x = p.lng - this.x;
            var y = p.lat - this.y;
            var dp = x * this.dx + y * this.dy;
            var l = Math.sqrt(x * x + y * y);
            return l !== 0 ? dp / l : l;
        };
        GeoPointInterpolator.prototype.range = function (p0, p1) {
            if (p0 === void 0) {
                return [this.interpolate(0), this.interpolate(1)];
            }
            else if (p1 === void 0) {
                p0 = p0;
                return GeoPointInterpolator.between(p0[0], p0[1]);
            }
            else {
                return GeoPointInterpolator.between(p0, p1);
            }
        };
        GeoPointInterpolator.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof GeoPointInterpolator) {
                return this.x === that.x && this.dx === that.dx
                    && this.y === that.y && this.dy === that.dy;
            }
            return false;
        };
        GeoPointInterpolator.between = function (a, b) {
            if (a instanceof GeoPoint && b instanceof GeoPoint) {
                return new GeoPointInterpolator(a, b);
            }
            else if (GeoPoint.isAny(a) && GeoPoint.isAny(b)) {
                return new GeoPointInterpolator(GeoPoint.fromAny(a), GeoPoint.fromAny(b));
            }
            return interpolate.Interpolator.between(a, b);
        };
        GeoPointInterpolator.tryBetween = function (a, b) {
            if (a instanceof GeoPoint && b instanceof GeoPoint) {
                return new GeoPointInterpolator(a, b);
            }
            return null;
        };
        GeoPointInterpolator.tryBetweenAny = function (a, b) {
            if ((a instanceof GeoPoint || GeoPoint.isInit(a)) && (b instanceof GeoPoint || GeoPoint.isInit(b))) {
                return new GeoPointInterpolator(GeoPoint.fromAny(a), GeoPoint.fromAny(b));
            }
            return null;
        };
        return GeoPointInterpolator;
    }(interpolate.Interpolator));
    interpolate.Interpolator.registerFactory(GeoPointInterpolator);

    var GeoBox = (function () {
        function GeoBox(lngMin, latMin, lngMax, latMax) {
            this._lngMin = lngMin <= lngMax ? lngMin : lngMax;
            this._latMin = latMin <= latMax ? latMin : latMax;
            this._lngMax = lngMin <= lngMax ? lngMax : lngMin;
            this._latMax = latMin <= latMax ? latMax : latMin;
        }
        Object.defineProperty(GeoBox.prototype, "lngMin", {
            get: function () {
                return this._lngMin;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GeoBox.prototype, "latMin", {
            get: function () {
                return this._latMin;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GeoBox.prototype, "lngMax", {
            get: function () {
                return this._lngMax;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GeoBox.prototype, "latMax", {
            get: function () {
                return this._latMax;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GeoBox.prototype, "west", {
            get: function () {
                return this._lngMin;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GeoBox.prototype, "north", {
            get: function () {
                return this._latMin;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GeoBox.prototype, "east", {
            get: function () {
                return this._lngMax;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GeoBox.prototype, "south", {
            get: function () {
                return this._latMax;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GeoBox.prototype, "northWest", {
            get: function () {
                return new GeoPoint(this._lngMin, this._latMin);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GeoBox.prototype, "northEast", {
            get: function () {
                return new GeoPoint(this._lngMax, this._latMin);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GeoBox.prototype, "southEast", {
            get: function () {
                return new GeoPoint(this._lngMax, this._latMax);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GeoBox.prototype, "southWest", {
            get: function () {
                return new GeoPoint(this._lngMin, this._latMax);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(GeoBox.prototype, "center", {
            get: function () {
                return new GeoPoint((this._lngMin + this._lngMax) / 2, (this._latMin + this._latMax) / 2);
            },
            enumerable: false,
            configurable: true
        });
        GeoBox.prototype.contains = function (that, y) {
            if (typeof that === "number") {
                return this._lngMin <= that && that <= this._lngMax
                    && this._latMin <= y && y <= this._latMax;
            }
            else if (GeoPoint.isAny(that)) {
                return this.containsPoint(GeoPoint.fromAny(that));
            }
            else if (GeoBox.isAny(that)) {
                return this.containsBox(GeoBox.fromAny(that));
            }
            else {
                throw new TypeError("" + that);
            }
        };
        GeoBox.prototype.containsPoint = function (that) {
            return this._lngMin <= that._lng && that._lng <= this._lngMax
                && this._latMin <= that._lat && that._lat <= this._latMax;
        };
        GeoBox.prototype.containsBox = function (that) {
            return this._lngMin <= that._lngMin && that._lngMax <= this._lngMax
                && this._latMin <= that._latMin && that._latMax <= this._latMax;
        };
        GeoBox.prototype.intersects = function (that) {
            if (GeoPoint.isAny(that)) {
                return this.intersectsPoint(GeoPoint.fromAny(that));
            }
            else if (GeoBox.isAny(that)) {
                return this.intersectsBox(GeoBox.fromAny(that));
            }
            else {
                throw new TypeError("" + that);
            }
        };
        GeoBox.prototype.intersectsPoint = function (that) {
            return this._lngMin <= that._lng && that._lng <= this._lngMax
                && this._latMin <= that._lat && that._lat <= this._latMax;
        };
        GeoBox.prototype.intersectsBox = function (that) {
            return this._lngMin <= that._lngMax && that._lngMin <= this._lngMax
                && this._latMin <= that._latMax && that._latMin <= this._latMax;
        };
        GeoBox.prototype.union = function (that) {
            if (GeoPoint.isAny(that)) {
                return this.unionPoint(GeoPoint.fromAny(that));
            }
            else if (GeoBox.isAny(that)) {
                return this.unionBox(GeoBox.fromAny(that));
            }
            else {
                throw new TypeError("" + that);
            }
        };
        GeoBox.prototype.unionPoint = function (that) {
            return new GeoBox(Math.min(this._lngMin, that._lng), Math.min(this._latMin, that._lat), Math.max(this._lngMax, that._lng), Math.max(this._latMax, that._lat));
        };
        GeoBox.prototype.unionBox = function (that) {
            return new GeoBox(Math.min(this._lngMin, that._lngMin), Math.min(this._latMin, that._latMin), Math.max(this._lngMax, that._lngMax), Math.max(this._latMax, that._latMax));
        };
        GeoBox.prototype.project = function (projection) {
            var bottomLeft = projection.project(this._lngMin, this._latMin);
            var topRight = projection.project(this._lngMax, this._latMax);
            var xMin = bottomLeft._x;
            var yMin = bottomLeft._y;
            var xMax = topRight._x;
            var yMax = topRight._y;
            if (xMin > xMax) {
                var x = xMin;
                xMin = xMax;
                xMax = x;
            }
            if (yMin > yMax) {
                var y = yMin;
                yMin = yMax;
                yMax = y;
            }
            if (!isFinite(xMin)) {
                xMin = -Infinity;
            }
            if (!isFinite(yMin)) {
                yMin = -Infinity;
            }
            if (!isFinite(xMax)) {
                xMax = Infinity;
            }
            if (!isFinite(yMax)) {
                yMax = Infinity;
            }
            return new math.BoxR2(xMin, yMin, xMax, yMax);
        };
        GeoBox.prototype.toAny = function () {
            return {
                lngMin: this._lngMin,
                latMin: this._latMin,
                lngMax: this._lngMax,
                latMax: this._latMax,
            };
        };
        GeoBox.prototype.canEqual = function (that) {
            return true;
        };
        GeoBox.prototype.equals = function (that) {
            if (this === that) {
                return true;
            }
            else if (that instanceof GeoBox) {
                return that.canEqual(this) && this._lngMin === that._lngMin && this._latMin === that._latMin
                    && this._lngMax === that._lngMax && this._latMax === that._latMax;
            }
            return false;
        };
        GeoBox.prototype.hashCode = function () {
            if (GeoBox._hashSeed === void 0) {
                GeoBox._hashSeed = util.Murmur3.seed(GeoBox);
            }
            return util.Murmur3.mash(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.mix(util.Murmur3.mix(GeoBox._hashSeed, util.Murmur3.hash(this._lngMin)), util.Murmur3.hash(this._latMin)), util.Murmur3.hash(this._lngMax)), util.Murmur3.hash(this._latMax)));
        };
        GeoBox.prototype.debug = function (output) {
            output.write("GeoBox").write(46).write("of").write(40)
                .debug(this._lngMin).write(", ").debug(this._latMin).write(", ")
                .debug(this._lngMax).write(", ").debug(this._latMax).write(41);
        };
        GeoBox.prototype.toString = function () {
            return codec.Format.debug(this);
        };
        GeoBox.empty = function () {
            if (GeoBox._empty === void 0) {
                GeoBox._empty = new GeoBox(0, 0, 0, 0);
            }
            return GeoBox._empty;
        };
        GeoBox.globe = function () {
            if (GeoBox._globe === void 0) {
                GeoBox._globe = new GeoBox(-180, -90, 180, 90);
            }
            return GeoBox._globe;
        };
        GeoBox.from = function (lngMin, latMin, lngMax, latMax) {
            if (lngMax === void 0) {
                lngMax = lngMin;
            }
            if (latMax === void 0) {
                latMax = latMin;
            }
            return new GeoBox(lngMin, latMin, lngMax, latMax);
        };
        GeoBox.fromInit = function (value) {
            return new GeoBox(value.lngMin, value.latMin, value.lngMax, value.latMax);
        };
        GeoBox.fromAny = function (value) {
            if (value instanceof GeoBox) {
                return value;
            }
            else if (GeoBox.isInit(value)) {
                return GeoBox.fromInit(value);
            }
            throw new TypeError("" + value);
        };
        GeoBox.isInit = function (value) {
            if (typeof value === "object" && value !== null) {
                var init = value;
                return typeof init.lngMin === "number"
                    && typeof init.latMin === "number"
                    && typeof init.lngMax === "number"
                    && typeof init.latMax === "number";
            }
            return false;
        };
        GeoBox.isAny = function (value) {
            return value instanceof GeoBox
                || GeoBox.isInit(value);
        };
        return GeoBox;
    }());

    var GeoProjection = {
        is: function (object) {
            if (typeof object === "object" && object !== null) {
                var projection = object;
                return typeof projection.project === "function"
                    && typeof projection.unproject === "function";
            }
            return false;
        },
    };

    var MapGraphicsView = (function (_super) {
        __extends(MapGraphicsView, _super);
        function MapGraphicsView() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(MapGraphicsView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapGraphicsView.prototype, "geoProjection", {
            get: function () {
                var parentView = this.parentView;
                return MapView.is(parentView) ? parentView.geoProjection : null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapGraphicsView.prototype, "mapZoom", {
            get: function () {
                var parentView = this.parentView;
                return MapView.is(parentView) ? parentView.mapZoom : 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapGraphicsView.prototype, "mapHeading", {
            get: function () {
                var parentView = this.parentView;
                return MapView.is(parentView) ? parentView.mapHeading : 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapGraphicsView.prototype, "mapTilt", {
            get: function () {
                var parentView = this.parentView;
                return MapView.is(parentView) ? parentView.mapTilt : 0;
            },
            enumerable: false,
            configurable: true
        });
        MapGraphicsView.prototype.onMount = function () {
            _super.prototype.onMount.call(this);
            this.requireUpdate(view.View.NeedsProject);
        };
        MapGraphicsView.prototype.modifyUpdate = function (updateFlags) {
            var additionalFlags = 0;
            if ((updateFlags & view.View.NeedsProject) !== 0) {
                additionalFlags |= view.View.NeedsLayout;
            }
            additionalFlags |= _super.prototype.modifyUpdate.call(this, updateFlags | additionalFlags);
            return additionalFlags;
        };
        MapGraphicsView.prototype.needsProcess = function (processFlags, viewContext) {
            if ((this._viewFlags & view.View.NeedsAnimate) === 0) {
                processFlags &= ~view.View.NeedsAnimate;
            }
            return processFlags;
        };
        MapGraphicsView.prototype.doProcess = function (processFlags, viewContext) {
            var cascadeFlags = processFlags;
            this._viewFlags &= ~(view.View.NeedsProcess | view.View.NeedsResize);
            this.willProcess(viewContext);
            this._viewFlags |= view.View.ProcessingFlag;
            try {
                if (((this._viewFlags | processFlags) & view.View.NeedsScroll) !== 0) {
                    cascadeFlags |= view.View.NeedsScroll;
                    this._viewFlags &= ~view.View.NeedsScroll;
                    this.willScroll(viewContext);
                }
                if (((this._viewFlags | processFlags) & view.View.NeedsDerive) !== 0) {
                    cascadeFlags |= view.View.NeedsDerive;
                    this._viewFlags &= ~view.View.NeedsDerive;
                    this.willDerive(viewContext);
                }
                if (((this._viewFlags | processFlags) & view.View.NeedsAnimate) !== 0) {
                    cascadeFlags |= view.View.NeedsAnimate;
                    this._viewFlags &= ~view.View.NeedsAnimate;
                    this.willAnimate(viewContext);
                }
                if (((this._viewFlags | processFlags) & view.View.NeedsProject) !== 0) {
                    cascadeFlags |= view.View.NeedsProject;
                    this._viewFlags &= ~view.View.NeedsProject;
                    this.willProject(viewContext);
                }
                this.onProcess(viewContext);
                if ((cascadeFlags & view.View.NeedsScroll) !== 0) {
                    this.onScroll(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsDerive) !== 0) {
                    this.onDerive(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsAnimate) !== 0) {
                    this.onAnimate(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsProject) !== 0) {
                    this.onProject(viewContext);
                }
                this.doProcessChildViews(cascadeFlags, viewContext);
                if ((cascadeFlags & view.View.NeedsProject) !== 0) {
                    this.didProject(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsAnimate) !== 0) {
                    this.didAnimate(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsDerive) !== 0) {
                    this.didDerive(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsScroll) !== 0) {
                    this.didScroll(viewContext);
                }
            }
            finally {
                this._viewFlags &= ~view.View.ProcessingFlag;
                this.didProcess(viewContext);
            }
        };
        MapGraphicsView.prototype.willProject = function (viewContext) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillProject !== void 0) {
                    viewObserver.viewWillProject(viewContext, this);
                }
            });
        };
        MapGraphicsView.prototype.onProject = function (viewContext) {
        };
        MapGraphicsView.prototype.didProject = function (viewContext) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidProject !== void 0) {
                    viewObserver.viewDidProject(viewContext, this);
                }
            });
        };
        MapGraphicsView.prototype.cullGeoFrame = function (geoFrame) {
            if (geoFrame === void 0) { geoFrame = this.geoFrame; }
            this.setCulled(!geoFrame.intersects(this.geoBounds));
        };
        Object.defineProperty(MapGraphicsView.prototype, "geoFrame", {
            get: function () {
                var parentView = this.parentView;
                return MapView.is(parentView) ? parentView.geoFrame : GeoBox.globe();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapGraphicsView.prototype, "geoBounds", {
            get: function () {
                return this.geoFrame;
            },
            enumerable: false,
            configurable: true
        });
        MapGraphicsView.prototype.deriveGeoBounds = function () {
            var geoBounds;
            var childViews = this._childViews;
            for (var i = 0, n = childViews.length; i < n; i += 1) {
                var childView = childViews[i];
                if (MapView.is(childView) && !childView.isHidden()) {
                    var childGeoBounds = childView.geoBounds;
                    if (geoBounds === void 0) {
                        geoBounds = childGeoBounds;
                    }
                    else {
                        geoBounds = geoBounds.union(childGeoBounds);
                    }
                }
            }
            if (geoBounds === void 0) {
                geoBounds = this.geoFrame;
            }
            return geoBounds;
        };
        MapGraphicsView.prototype.didSetGeoBounds = function (newGeoBounds, oldGeoBounds) {
            var parentView = this._parentView;
            if (MapView.is(parentView)) {
                parentView.childViewDidSetGeoBounds(this, newGeoBounds, oldGeoBounds);
            }
        };
        MapGraphicsView.prototype.childViewDidSetGeoBounds = function (childView, newGeoBounds, oldGeoBounds) {
        };
        return MapGraphicsView;
    }(view.GraphicsView));

    var MapTile = (function () {
        function MapTile(depth, maxDepth, geoFrame, geoBounds, geoCenter, southWest, northWest, southEast, northEast, views, size) {
            this._depth = depth;
            this._maxDepth = maxDepth;
            this._geoFrame = geoFrame;
            this._geoBounds = geoBounds;
            this._geoCenter = geoCenter;
            this._southWest = southWest;
            this._northWest = northWest;
            this._southEast = southEast;
            this._northEast = northEast;
            this._views = views;
            this._size = size;
        }
        Object.defineProperty(MapTile.prototype, "depth", {
            get: function () {
                return this._depth;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapTile.prototype, "maxDepth", {
            get: function () {
                return this._maxDepth;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapTile.prototype, "geoFrame", {
            get: function () {
                return this._geoFrame;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapTile.prototype, "geoBounds", {
            get: function () {
                return this._geoBounds;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapTile.prototype, "geoCenter", {
            get: function () {
                return this._geoCenter;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapTile.prototype, "southWest", {
            get: function () {
                return this._southWest;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapTile.prototype, "northWest", {
            get: function () {
                return this._northWest;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapTile.prototype, "southEast", {
            get: function () {
                return this._southEast;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapTile.prototype, "northEast", {
            get: function () {
                return this._northEast;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapTile.prototype, "size", {
            get: function () {
                return this._size;
            },
            enumerable: false,
            configurable: true
        });
        MapTile.prototype.isEmpty = function () {
            return this._size === 0;
        };
        MapTile.prototype.contains = function (bounds) {
            return this._geoFrame.contains(bounds);
        };
        MapTile.prototype.intersects = function (bounds) {
            return this._geoFrame.intersects(bounds);
        };
        MapTile.prototype.getTile = function (bounds) {
            if (this._depth < this._maxDepth) {
                var geoCenter = this._geoCenter;
                var inWest = bounds.lngMin <= geoCenter.lng;
                var inSouth = bounds.latMin <= geoCenter.lat;
                var inEast = bounds.lngMax > geoCenter.lng;
                var inNorth = bounds.latMax > geoCenter.lat;
                if (inWest !== inEast && inSouth !== inNorth) {
                    if (inSouth && inWest) {
                        var southWest = this._southWest;
                        if (southWest !== null) {
                            return southWest.getTile(bounds);
                        }
                    }
                    else if (inNorth && inWest) {
                        var northWest = this._northWest;
                        if (northWest !== null) {
                            return northWest.getTile(bounds);
                        }
                    }
                    else if (inSouth && inEast) {
                        var southEast = this._southEast;
                        if (southEast !== null) {
                            return southEast.getTile(bounds);
                        }
                    }
                    else if (inNorth && inEast) {
                        var northEast = this._northEast;
                        if (northEast !== null) {
                            return northEast.getTile(bounds);
                        }
                    }
                }
            }
            return this;
        };
        MapTile.prototype.inserted = function (view, bounds) {
            if (this._depth < this._maxDepth) {
                var geoCenter = this._geoCenter;
                var inWest = bounds.lngMin <= geoCenter.lng;
                var inSouth = bounds.latMin <= geoCenter.lat;
                var inEast = bounds.lngMax > geoCenter.lng;
                var inNorth = bounds.latMax > geoCenter.lat;
                if (inWest !== inEast && inSouth !== inNorth) {
                    if (inSouth && inWest) {
                        var oldSouthWest = this._southWest;
                        var newSouthWest = oldSouthWest;
                        if (newSouthWest === null) {
                            newSouthWest = this.createTile(this._depth + 1, this._maxDepth, new GeoBox(this._geoFrame._lngMin, this._geoFrame._latMin, this._geoCenter._lng, this._geoCenter._lat));
                        }
                        newSouthWest = newSouthWest.inserted(view, bounds);
                        if (oldSouthWest !== newSouthWest) {
                            return this.createTile(this._depth, this._maxDepth, this._geoFrame, void 0, this._geoCenter, newSouthWest, this._northWest, this._southEast, this._northEast, this._views, this._size + 1);
                        }
                        else {
                            return this;
                        }
                    }
                    else if (inNorth && inWest) {
                        var oldNorthWest = this._northWest;
                        var newNorthWest = oldNorthWest;
                        if (newNorthWest === null) {
                            newNorthWest = this.createTile(this._depth + 1, this._maxDepth, new GeoBox(this._geoFrame._lngMin, this._geoCenter._lat, this._geoCenter._lng, this._geoFrame._latMax));
                        }
                        newNorthWest = newNorthWest.inserted(view, bounds);
                        if (oldNorthWest !== newNorthWest) {
                            return this.createTile(this._depth, this._maxDepth, this._geoFrame, void 0, this._geoCenter, this._southWest, newNorthWest, this._southEast, this._northEast, this._views, this._size + 1);
                        }
                        else {
                            return this;
                        }
                    }
                    else if (inSouth && inEast) {
                        var oldSouthEast = this._southEast;
                        var newSouthEast = oldSouthEast;
                        if (newSouthEast === null) {
                            newSouthEast = this.createTile(this._depth + 1, this._maxDepth, new GeoBox(this._geoCenter._lng, this._geoFrame._latMin, this._geoFrame._lngMax, this._geoCenter._lat));
                        }
                        newSouthEast = newSouthEast.inserted(view, bounds);
                        if (oldSouthEast !== newSouthEast) {
                            return this.createTile(this._depth, this._maxDepth, this._geoFrame, void 0, this._geoCenter, this._southWest, this._northWest, newSouthEast, this._northEast, this._views, this._size + 1);
                        }
                        else {
                            return this;
                        }
                    }
                    else if (inNorth && inEast) {
                        var oldNorthEast = this._northEast;
                        var newNorthEast = oldNorthEast;
                        if (newNorthEast === null) {
                            newNorthEast = this.createTile(this._depth + 1, this._maxDepth, new GeoBox(this._geoCenter._lng, this._geoCenter._lat, this._geoFrame._lngMax, this._geoFrame._latMax));
                        }
                        newNorthEast = newNorthEast.inserted(view, bounds);
                        if (oldNorthEast !== newNorthEast) {
                            return this.createTile(this._depth, this._maxDepth, this._geoFrame, void 0, this._geoCenter, this._southWest, this._northWest, this._southEast, newNorthEast, this._views, this._size + 1);
                        }
                        else {
                            return this;
                        }
                    }
                }
            }
            var oldViews = this._views;
            if (oldViews.indexOf(view) < 0) {
                var newViews = oldViews.slice(0);
                newViews.push(view);
                return this.createTile(this._depth, this._maxDepth, this._geoFrame, void 0, this._geoCenter, this._southWest, this._northWest, this._southEast, this._northEast, newViews, this._size + 1);
            }
            else {
                return this;
            }
        };
        MapTile.prototype.removed = function (view, bounds) {
            if (this._depth < this._maxDepth) {
                var geoCenter = this._geoCenter;
                var inWest = bounds.lngMin <= geoCenter.lng;
                var inSouth = bounds.latMin <= geoCenter.lat;
                var inEast = bounds.lngMax > geoCenter.lng;
                var inNorth = bounds.latMax > geoCenter.lat;
                if (inWest !== inEast && inSouth !== inNorth) {
                    if (inSouth && inWest) {
                        var oldSouthWest = this._southWest;
                        if (oldSouthWest !== null) {
                            var newSouthWest = oldSouthWest.removed(view, bounds);
                            if (newSouthWest.isEmpty()) {
                                newSouthWest = null;
                            }
                            return this.createTile(this._depth, this._maxDepth, this._geoFrame, void 0, this._geoCenter, newSouthWest, this._northWest, this._southEast, this._northEast, this._views, this._size - 1);
                        }
                        else {
                            return this;
                        }
                    }
                    else if (inNorth && inWest) {
                        var oldNorthWest = this._northWest;
                        if (oldNorthWest !== null) {
                            var newNorthWest = oldNorthWest.removed(view, bounds);
                            if (newNorthWest.isEmpty()) {
                                newNorthWest = null;
                            }
                            return this.createTile(this._depth, this._maxDepth, this._geoFrame, void 0, this._geoCenter, this._southWest, newNorthWest, this._southEast, this._northEast, this._views, this._size - 1);
                        }
                        else {
                            return this;
                        }
                    }
                    else if (inSouth && inEast) {
                        var oldSouthEast = this._southEast;
                        if (oldSouthEast !== null) {
                            var newSouthEast = oldSouthEast.removed(view, bounds);
                            if (newSouthEast.isEmpty()) {
                                newSouthEast = null;
                            }
                            return this.createTile(this._depth, this._maxDepth, this._geoFrame, void 0, this._geoCenter, this._southWest, this._northWest, newSouthEast, this._northEast, this._views, this._size - 1);
                        }
                        else {
                            return this;
                        }
                    }
                    else if (inNorth && inEast) {
                        var oldNorthEast = this._northEast;
                        if (oldNorthEast !== null) {
                            var newNorthEast = oldNorthEast.removed(view, bounds);
                            if (newNorthEast.isEmpty()) {
                                newNorthEast = null;
                            }
                            return this.createTile(this._depth, this._maxDepth, this._geoFrame, void 0, this._geoCenter, this._southWest, this._northWest, this._southEast, newNorthEast, this._views, this._size - 1);
                        }
                        else {
                            return this;
                        }
                    }
                }
            }
            var oldViews = this._views;
            var index = oldViews.indexOf(view);
            if (index >= 0) {
                var newViews = oldViews.slice(0);
                newViews.splice(index, 1);
                return this.createTile(this._depth, this._maxDepth, this._geoFrame, void 0, this._geoCenter, this._southWest, this._northWest, this._southEast, this._northEast, newViews, this._size - 1);
            }
            else {
                return this;
            }
        };
        MapTile.prototype.moved = function (view, newBounds, oldBounds) {
            if (this._depth < this._maxDepth) {
                var geoCenter = this._geoCenter;
                var newInWest = newBounds.lngMin <= geoCenter.lng;
                var newInSouth = newBounds.latMin <= geoCenter.lat;
                var newInEast = newBounds.lngMax > geoCenter.lng;
                var newInNorth = newBounds.latMax > geoCenter.lat;
                var oldInWest = oldBounds.lngMin <= geoCenter.lng;
                var oldInSouth = oldBounds.latMin <= geoCenter.lat;
                var oldInEast = oldBounds.lngMax > geoCenter.lng;
                var oldInNorth = oldBounds.latMax > geoCenter.lat;
                if (newInWest === oldInWest && newInSouth === oldInSouth && newInEast === oldInEast && newInNorth === oldInNorth) {
                    if (newInWest !== newInEast && newInSouth !== newInNorth) {
                        if (newInSouth && newInWest) {
                            var oldSouthWest = this._southWest;
                            var newSouthWest = oldSouthWest.moved(view, newBounds, oldBounds);
                            if (oldSouthWest !== newSouthWest) {
                                return this.createTile(this._depth, this._maxDepth, this._geoFrame, void 0, this._geoCenter, newSouthWest, this._northWest, this._southEast, this._northEast, this._views, this._size);
                            }
                            else {
                                return this;
                            }
                        }
                        else if (newInNorth && newInWest) {
                            var oldNorthWest = this._northWest;
                            var newNorthWest = oldNorthWest.moved(view, newBounds, oldBounds);
                            if (oldNorthWest !== newNorthWest) {
                                return this.createTile(this._depth, this._maxDepth, this._geoFrame, void 0, this._geoCenter, this._southWest, newNorthWest, this._southEast, this._northEast, this._views, this._size);
                            }
                            else {
                                return this;
                            }
                        }
                        else if (newInSouth && newInEast) {
                            var oldSouthEast = this._southEast;
                            var newSouthEast = oldSouthEast.moved(view, newBounds, oldBounds);
                            if (oldSouthEast !== newSouthEast) {
                                return this.createTile(this._depth, this._maxDepth, this._geoFrame, void 0, this._geoCenter, this._southWest, this._northWest, newSouthEast, this._northEast, this._views, this._size);
                            }
                            else {
                                return this;
                            }
                        }
                        else if (newInNorth && newInEast) {
                            var oldNorthEast = this._northEast;
                            var newNorthEast = oldNorthEast.moved(view, newBounds, oldBounds);
                            if (oldNorthEast !== newNorthEast) {
                                return this.createTile(this._depth, this._maxDepth, this._geoFrame, void 0, this._geoCenter, this._southWest, this._northWest, this._southEast, newNorthEast, this._views, this._size);
                            }
                            else {
                                return this;
                            }
                        }
                    }
                }
                else {
                    return this.removed(view, oldBounds).inserted(view, newBounds);
                }
            }
            return this;
        };
        MapTile.prototype.forEach = function (callback, thisArg) {
            if (this._southWest !== null) {
                var result = this._southWest.forEach(callback, thisArg);
                if (result !== void 0) {
                    return result;
                }
            }
            if (this._northWest !== null) {
                var result = this._northWest.forEach(callback, thisArg);
                if (result !== void 0) {
                    return result;
                }
            }
            if (this._southEast !== null) {
                var result = this._southEast.forEach(callback, thisArg);
                if (result !== void 0) {
                    return result;
                }
            }
            if (this._northEast !== null) {
                var result = this._northEast.forEach(callback, thisArg);
                if (result !== void 0) {
                    return result;
                }
            }
            var views = this._views;
            for (var i = 0; i < views.length; i += 1) {
                var result = callback.call(thisArg, views[i]);
                if (result !== void 0) {
                    return result;
                }
            }
            return void 0;
        };
        MapTile.prototype.forEachIntersecting = function (bounds, callback, thisArg) {
            if (this._geoFrame.intersects(bounds)) {
                if (this._southWest !== null) {
                    var result = this._southWest.forEachIntersecting(bounds, callback, thisArg);
                    if (result !== void 0) {
                        return result;
                    }
                }
                if (this._northWest !== null) {
                    var result = this._northWest.forEachIntersecting(bounds, callback, thisArg);
                    if (result !== void 0) {
                        return result;
                    }
                }
                if (this._southEast !== null) {
                    var result = this._southEast.forEachIntersecting(bounds, callback, thisArg);
                    if (result !== void 0) {
                        return result;
                    }
                }
                if (this._northEast !== null) {
                    var result = this._northEast.forEachIntersecting(bounds, callback, thisArg);
                    if (result !== void 0) {
                        return result;
                    }
                }
                var views = this._views;
                for (var i = 0; i < views.length; i += 1) {
                    var result = callback.call(thisArg, views[i]);
                    if (result !== void 0) {
                        return result;
                    }
                }
            }
            return void 0;
        };
        MapTile.prototype.forEachNonIntersecting = function (bounds, callback, thisArg) {
            if (!this._geoFrame.intersects(bounds)) {
                if (this._southWest !== null) {
                    var result = this._southWest.forEachNonIntersecting(bounds, callback, thisArg);
                    if (result !== void 0) {
                        return result;
                    }
                }
                if (this._northWest !== null) {
                    var result = this._northWest.forEachNonIntersecting(bounds, callback, thisArg);
                    if (result !== void 0) {
                        return result;
                    }
                }
                if (this._southEast !== null) {
                    var result = this._southEast.forEachNonIntersecting(bounds, callback, thisArg);
                    if (result !== void 0) {
                        return result;
                    }
                }
                if (this._northEast !== null) {
                    var result = this._northEast.forEachNonIntersecting(bounds, callback, thisArg);
                    if (result !== void 0) {
                        return result;
                    }
                }
                var views = this._views;
                for (var i = 0; i < views.length; i += 1) {
                    var result = callback.call(thisArg, views[i]);
                    if (result !== void 0) {
                        return result;
                    }
                }
            }
            return void 0;
        };
        MapTile.prototype.createTile = function (depth, maxDepth, geoFrame, geoBounds, geoCenter, southWest, northWest, southEast, northEast, views, size) {
            if (southWest === void 0) { southWest = null; }
            if (northWest === void 0) { northWest = null; }
            if (southEast === void 0) { southEast = null; }
            if (northEast === void 0) { northEast = null; }
            if (views === void 0) { views = []; }
            if (size === void 0) { size = 0; }
            if (geoCenter === void 0) {
                geoCenter = geoFrame.center;
            }
            if (geoBounds === void 0) {
                if (southWest !== null) {
                    geoBounds = southWest._geoBounds;
                }
                if (northWest !== null) {
                    geoBounds = geoBounds !== void 0 ? geoBounds.union(northWest._geoBounds) : northWest._geoBounds;
                }
                if (southEast !== null) {
                    geoBounds = geoBounds !== void 0 ? geoBounds.union(southEast._geoBounds) : southEast._geoBounds;
                }
                if (northEast !== null) {
                    geoBounds = geoBounds !== void 0 ? geoBounds.union(northEast._geoBounds) : northEast._geoBounds;
                }
                for (var i = 0; i < views.length; i += 1) {
                    var view = views[i];
                    geoBounds = geoBounds !== void 0 ? geoBounds.union(view.geoBounds) : view.geoBounds;
                }
                if (geoBounds === void 0) {
                    geoBounds = geoFrame;
                }
            }
            return new MapTile(depth, maxDepth, geoFrame, geoBounds, geoCenter, southWest, northWest, southEast, northEast, views, size);
        };
        MapTile.empty = function (geoFrame, depth, maxDepth) {
            if (geoFrame === void 0) {
                geoFrame = GeoBox.globe();
            }
            if (depth === void 0) {
                depth = 0;
            }
            if (maxDepth === void 0) {
                maxDepth = 10;
            }
            maxDepth = Math.max(depth, maxDepth);
            return new MapTile(depth, maxDepth, geoFrame, geoFrame, geoFrame.center, null, null, null, null, [], 0);
        };
        return MapTile;
    }());

    var MapLayerView = (function (_super) {
        __extends(MapLayerView, _super);
        function MapLayerView(geoFrame, depth, maxDepth) {
            var _this = _super.call(this) || this;
            _this._parentView = null;
            _this._childViews = MapTile.empty(geoFrame, depth, maxDepth);
            _this._viewController = null;
            _this._viewFlags = 0;
            return _this;
        }
        Object.defineProperty(MapLayerView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        MapLayerView.prototype.setViewController = function (newViewController) {
            var oldViewController = this._viewController;
            if (oldViewController !== newViewController) {
                this.willSetViewController(newViewController);
                if (oldViewController !== null) {
                    oldViewController.setView(null);
                }
                this._viewController = newViewController;
                if (newViewController !== null) {
                    newViewController.setView(this);
                }
                this.onSetViewController(newViewController);
                this.didSetViewController(newViewController);
            }
        };
        Object.defineProperty(MapLayerView.prototype, "viewObservers", {
            get: function () {
                var viewObservers = this._viewObservers;
                if (viewObservers === void 0) {
                    viewObservers = [];
                    this._viewObservers = viewObservers;
                }
                return viewObservers;
            },
            enumerable: false,
            configurable: true
        });
        MapLayerView.prototype.addViewObserver = function (viewObserver) {
            var viewObservers = this._viewObservers;
            var index;
            if (viewObservers === void 0) {
                viewObservers = [];
                this._viewObservers = viewObservers;
                index = -1;
            }
            else {
                index = viewObservers.indexOf(viewObserver);
            }
            if (index < 0) {
                this.willAddViewObserver(viewObserver);
                viewObservers.push(viewObserver);
                this.onAddViewObserver(viewObserver);
                this.didAddViewObserver(viewObserver);
            }
        };
        MapLayerView.prototype.removeViewObserver = function (viewObserver) {
            var viewObservers = this._viewObservers;
            if (viewObservers !== void 0) {
                var index = viewObservers.indexOf(viewObserver);
                if (index >= 0) {
                    this.willRemoveViewObserver(viewObserver);
                    viewObservers.splice(index, 1);
                    this.onRemoveViewObserver(viewObserver);
                    this.didRemoveViewObserver(viewObserver);
                }
            }
        };
        Object.defineProperty(MapLayerView.prototype, "geoProjection", {
            get: function () {
                var parentView = this.parentView;
                return MapView.is(parentView) ? parentView.geoProjection : null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerView.prototype, "mapZoom", {
            get: function () {
                var parentView = this.parentView;
                return MapView.is(parentView) ? parentView.mapZoom : 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerView.prototype, "mapHeading", {
            get: function () {
                var parentView = this.parentView;
                return MapView.is(parentView) ? parentView.mapHeading : 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerView.prototype, "mapTilt", {
            get: function () {
                var parentView = this.parentView;
                return MapView.is(parentView) ? parentView.mapTilt : 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerView.prototype, "canvasView", {
            get: function () {
                var parentView = this._parentView;
                return view.RenderedView.is(parentView) ? parentView.canvasView : null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerView.prototype, "key", {
            get: function () {
                var key = this._key;
                return key !== void 0 ? key : null;
            },
            enumerable: false,
            configurable: true
        });
        MapLayerView.prototype.setKey = function (key) {
            if (key !== null) {
                this._key = key;
            }
            else if (this._key !== void 0) {
                this._key = void 0;
            }
        };
        Object.defineProperty(MapLayerView.prototype, "parentView", {
            get: function () {
                return this._parentView;
            },
            enumerable: false,
            configurable: true
        });
        MapLayerView.prototype.setParentView = function (newParentView, oldParentView) {
            this.willSetParentView(newParentView, oldParentView);
            this._parentView = newParentView;
            this.onSetParentView(newParentView, oldParentView);
            this.didSetParentView(newParentView, oldParentView);
        };
        Object.defineProperty(MapLayerView.prototype, "childViews", {
            get: function () {
                var childViews = [];
                this._childViews.forEach(function (childView) {
                    childViews.push(childView);
                }, this);
                return childViews;
            },
            enumerable: false,
            configurable: true
        });
        MapLayerView.prototype.getChildView = function (key) {
            var childViewMap = this._childViewMap;
            if (childViewMap !== void 0) {
                var childView = childViewMap[key];
                if (childView !== void 0) {
                    return childView;
                }
            }
            return null;
        };
        MapLayerView.prototype.setChildView = function (key, newChildView) {
            if (newChildView !== null) {
                if (!MapView.is(newChildView)) {
                    throw new TypeError("" + newChildView);
                }
                newChildView.remove();
            }
            var oldChildView = null;
            if (this._childViewMap !== void 0) {
                var childView = this._childViewMap[key];
                if (childView !== void 0) {
                    oldChildView = childView;
                    var oldChildViewBounds = oldChildView.geoBounds;
                    this.willRemoveChildView(childView);
                    childView.setParentView(null, this);
                    this.removeChildViewMap(childView);
                    var oldGeoBounds = this._childViews._geoBounds;
                    this._childViews = this._childViews.removed(oldChildView, oldChildViewBounds);
                    var newGeoBounds = this._childViews._geoBounds;
                    if (!newGeoBounds.equals(oldGeoBounds)) {
                        this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
                    }
                    this.onRemoveChildView(childView);
                    this.didRemoveChildView(childView);
                    childView.setKey(null);
                }
            }
            if (newChildView !== null) {
                var newChildViewBounds = newChildView.geoBounds;
                newChildView.setKey(key);
                var oldGeoBounds = this._childViews._geoBounds;
                this._childViews = this._childViews.inserted(newChildView, newChildViewBounds);
                var newGeoBounds = this._childViews._geoBounds;
                if (!newGeoBounds.equals(oldGeoBounds)) {
                    this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
                }
                this.insertChildViewMap(newChildView);
                newChildView.setParentView(this, null);
                this.onInsertChildView(newChildView, null);
                this.didInsertChildView(newChildView, null);
            }
            return oldChildView;
        };
        MapLayerView.prototype.insertChildViewMap = function (childView) {
            var key = childView.key;
            if (key !== null) {
                var childViewMap = this._childViewMap;
                if (childViewMap === void 0) {
                    childViewMap = {};
                    this._childViewMap = childViewMap;
                }
                childViewMap[key] = childView;
            }
        };
        MapLayerView.prototype.removeChildViewMap = function (childView) {
            var childViewMap = this._childViewMap;
            if (childViewMap !== void 0) {
                var key = childView.key;
                if (key !== null) {
                    delete childViewMap[key];
                }
            }
        };
        MapLayerView.prototype.append = function (child, key) {
            if (typeof child === "function") {
                child = view.RenderedView.create(child);
            }
            this.appendChildView(child, key);
            return child;
        };
        MapLayerView.prototype.appendChildView = function (childView, key) {
            if (!MapView.is(childView)) {
                throw new TypeError("" + childView);
            }
            childView.remove();
            if (key !== void 0) {
                this.removeChildView(key);
                childView.setKey(key);
            }
            var childViewBounds = childView.geoBounds;
            this.willInsertChildView(childView, null);
            var oldGeoBounds = this._childViews._geoBounds;
            this._childViews = this._childViews.inserted(childView, childViewBounds);
            var newGeoBounds = this._childViews._geoBounds;
            if (!newGeoBounds.equals(oldGeoBounds)) {
                this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
            }
            this.insertChildViewMap(childView);
            childView.setParentView(this, null);
            this.onInsertChildView(childView, null);
            this.didInsertChildView(childView, null);
        };
        MapLayerView.prototype.prepend = function (child, key) {
            if (typeof child === "function") {
                child = view.RenderedView.create(child);
            }
            this.prependChildView(child, key);
            return child;
        };
        MapLayerView.prototype.prependChildView = function (childView, key) {
            if (!MapView.is(childView)) {
                throw new TypeError("" + childView);
            }
            childView.remove();
            if (key !== void 0) {
                this.removeChildView(key);
                childView.setKey(key);
            }
            var childViewBounds = childView.geoBounds;
            this.willInsertChildView(childView, null);
            var oldGeoBounds = this._childViews._geoBounds;
            this._childViews = this._childViews.inserted(childView, childViewBounds);
            var newGeoBounds = this._childViews._geoBounds;
            if (!newGeoBounds.equals(oldGeoBounds)) {
                this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
            }
            this.insertChildViewMap(childView);
            childView.setParentView(this, null);
            this.onInsertChildView(childView, null);
            this.didInsertChildView(childView, null);
        };
        MapLayerView.prototype.insert = function (child, target, key) {
            if (typeof child === "function") {
                child = view.RenderedView.create(child);
            }
            this.insertChildView(child, target, key);
            return child;
        };
        MapLayerView.prototype.insertChildView = function (childView, targetView, key) {
            if (!MapView.is(childView)) {
                throw new TypeError("" + childView);
            }
            if (targetView !== null && !view.RenderedView.is(childView)) {
                throw new TypeError("" + targetView);
            }
            if (targetView !== null && targetView.parentView !== this) {
                throw new TypeError("" + targetView);
            }
            childView.remove();
            if (key !== void 0) {
                this.removeChildView(key);
                childView.setKey(key);
            }
            var childViewBounds = childView.geoBounds;
            this.willInsertChildView(childView, targetView);
            var oldGeoBounds = this._childViews._geoBounds;
            this._childViews = this._childViews.inserted(childView, childViewBounds);
            var newGeoBounds = this._childViews._geoBounds;
            if (!newGeoBounds.equals(oldGeoBounds)) {
                this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
            }
            this.insertChildViewMap(childView);
            childView.setParentView(this, null);
            this.onInsertChildView(childView, targetView);
            this.didInsertChildView(childView, targetView);
        };
        MapLayerView.prototype.removeChildView = function (key) {
            var childView;
            if (typeof key === "string") {
                childView = this.getChildView(key);
                if (childView === null) {
                    return null;
                }
            }
            else {
                childView = key;
            }
            if (!MapView.is(childView)) {
                throw new TypeError("" + childView);
            }
            if (childView.parentView !== this) {
                throw new Error("not a child view");
            }
            var childViewBounds = childView.geoBounds;
            this.willRemoveChildView(childView);
            childView.setParentView(null, this);
            this.removeChildViewMap(childView);
            var oldGeoBounds = this._childViews._geoBounds;
            this._childViews = this._childViews.removed(childView, childViewBounds);
            var newGeoBounds = this._childViews._geoBounds;
            if (!newGeoBounds.equals(oldGeoBounds)) {
                this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
            }
            this.onRemoveChildView(childView);
            this.didRemoveChildView(childView);
            childView.setKey(null);
            if (typeof key === "string") {
                return childView;
            }
        };
        MapLayerView.prototype.removeAll = function () {
            this._childViews.forEach(function (childView) {
                this.removeChildView(childView);
            }, this);
        };
        MapLayerView.prototype.remove = function () {
            var parentView = this._parentView;
            if (parentView !== null) {
                if ((this._viewFlags & view.View.UpdatingMask) === 0) {
                    parentView.removeChildView(this);
                }
                else {
                    this._viewFlags |= view.View.RemovingFlag;
                }
            }
        };
        Object.defineProperty(MapLayerView.prototype, "viewFlags", {
            get: function () {
                return this._viewFlags;
            },
            enumerable: false,
            configurable: true
        });
        MapLayerView.prototype.setViewFlags = function (viewFlags) {
            this._viewFlags = viewFlags;
        };
        MapLayerView.prototype.cascadeMount = function () {
            if ((this._viewFlags & view.View.MountedFlag) === 0) {
                this._viewFlags |= view.View.MountedFlag;
                this.willMount();
                this.onMount();
                this.doMountChildViews();
                this.didMount();
            }
            else {
                throw new Error("already mounted");
            }
        };
        MapLayerView.prototype.doMountChildViews = function () {
            this._childViews.forEach(function (childView) {
                childView.cascadeMount();
            }, this);
        };
        MapLayerView.prototype.cascadeUnmount = function () {
            if ((this._viewFlags & view.View.MountedFlag) !== 0) {
                this._viewFlags &= ~view.View.MountedFlag;
                this.willUnmount();
                this.doUnmountChildViews();
                this.onUnmount();
                this.didUnmount();
            }
            else {
                throw new Error("already unmounted");
            }
        };
        MapLayerView.prototype.doUnmountChildViews = function () {
            this._childViews.forEach(function (childView) {
                childView.cascadeUnmount();
            }, this);
        };
        MapLayerView.prototype.onMount = function () {
            _super.prototype.onMount.call(this);
            this.requireUpdate(view.View.NeedsProject);
        };
        MapLayerView.prototype.onUnmount = function () {
            this.cancelAnimators();
            this._viewFlags = 0;
        };
        MapLayerView.prototype.cascadePower = function () {
            if ((this._viewFlags & view.View.PoweredFlag) === 0) {
                this._viewFlags |= view.View.PoweredFlag;
                this.willPower();
                this.onPower();
                this.doPowerChildViews();
                this.didPower();
            }
            else {
                throw new Error("already powered");
            }
        };
        MapLayerView.prototype.doPowerChildViews = function () {
            this._childViews.forEach(function (childView) {
                childView.cascadePower();
            }, this);
        };
        MapLayerView.prototype.cascadeUnpower = function () {
            if ((this._viewFlags & view.View.PoweredFlag) !== 0) {
                this._viewFlags &= ~view.View.PoweredFlag;
                this.willUnpower();
                this.doUnpowerChildViews();
                this.onUnpower();
                this.didUnpower();
            }
            else {
                throw new Error("already unpowered");
            }
        };
        MapLayerView.prototype.doUnpowerChildViews = function () {
            this._childViews.forEach(function (childView) {
                childView.cascadeUnpower();
            }, this);
        };
        Object.defineProperty(MapLayerView.prototype, "renderer", {
            get: function () {
                var parentView = this._parentView;
                return view.RenderedView.is(parentView) ? parentView.renderer : null;
            },
            enumerable: false,
            configurable: true
        });
        MapLayerView.prototype.modifyUpdate = function (updateFlags) {
            var additionalFlags = 0;
            if ((updateFlags & view.View.NeedsProject) !== 0) {
                additionalFlags |= view.View.NeedsLayout;
            }
            additionalFlags |= _super.prototype.modifyUpdate.call(this, updateFlags | additionalFlags);
            return additionalFlags;
        };
        MapLayerView.prototype.needsProcess = function (processFlags, viewContext) {
            if ((this._viewFlags & view.View.NeedsAnimate) === 0) {
                processFlags &= ~view.View.NeedsAnimate;
            }
            return processFlags;
        };
        MapLayerView.prototype.cascadeProcess = function (processFlags, viewContext) {
            processFlags = this._viewFlags | processFlags;
            processFlags = this.needsProcess(processFlags, viewContext);
            this.doProcess(processFlags, viewContext);
        };
        MapLayerView.prototype.doProcess = function (processFlags, viewContext) {
            var cascadeFlags = processFlags;
            this._viewFlags &= ~(view.View.NeedsProcess | view.View.NeedsResize | view.View.NeedsProject);
            this.willProcess(viewContext);
            this._viewFlags |= view.View.ProcessingFlag;
            try {
                if (((this._viewFlags | processFlags) & view.View.NeedsScroll) !== 0) {
                    cascadeFlags |= view.View.NeedsScroll;
                    this._viewFlags &= ~view.View.NeedsScroll;
                    this.willScroll(viewContext);
                }
                if (((this._viewFlags | processFlags) & view.View.NeedsDerive) !== 0) {
                    cascadeFlags |= view.View.NeedsDerive;
                    this._viewFlags &= ~view.View.NeedsDerive;
                    this.willDerive(viewContext);
                }
                if (((this._viewFlags | processFlags) & view.View.NeedsAnimate) !== 0) {
                    cascadeFlags |= view.View.NeedsAnimate;
                    this._viewFlags &= ~view.View.NeedsAnimate;
                    this.willAnimate(viewContext);
                }
                if (((this._viewFlags | processFlags) & view.View.NeedsProject) !== 0) {
                    cascadeFlags |= view.View.NeedsProject;
                    this._viewFlags &= ~view.View.NeedsProject;
                    this.willProject(viewContext);
                }
                this.onProcess(viewContext);
                if ((cascadeFlags & view.View.NeedsScroll) !== 0) {
                    this.onScroll(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsDerive) !== 0) {
                    this.onDerive(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsAnimate) !== 0) {
                    this.onAnimate(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsProject) !== 0) {
                    this.onProject(viewContext);
                }
                this.doProcessChildViews(cascadeFlags, viewContext);
                if ((cascadeFlags & view.View.NeedsProject) !== 0) {
                    this.didProject(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsAnimate) !== 0) {
                    this.didAnimate(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsDerive) !== 0) {
                    this.didDerive(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsScroll) !== 0) {
                    this.didScroll(viewContext);
                }
            }
            finally {
                this._viewFlags &= ~view.View.ProcessingFlag;
                this.didProcess(viewContext);
            }
        };
        MapLayerView.prototype.willAnimate = function (viewContext) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillAnimate !== void 0) {
                    viewObserver.viewWillAnimate(viewContext, this);
                }
            });
        };
        MapLayerView.prototype.onAnimate = function (viewContext) {
            this.animateMembers(viewContext.updateTime);
        };
        MapLayerView.prototype.didAnimate = function (viewContext) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidAnimate !== void 0) {
                    viewObserver.viewDidAnimate(viewContext, this);
                }
            });
        };
        MapLayerView.prototype.willProject = function (viewContext) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillProject !== void 0) {
                    viewObserver.viewWillProject(viewContext, this);
                }
            });
        };
        MapLayerView.prototype.onProject = function (viewContext) {
        };
        MapLayerView.prototype.didProject = function (viewContext) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidProject !== void 0) {
                    viewObserver.viewDidProject(viewContext, this);
                }
            });
        };
        MapLayerView.prototype.doProcessChildViews = function (processFlags, viewContext) {
            if ((processFlags & view.View.ProcessMask) !== 0 && !this._childViews.isEmpty()) {
                this.willProcessChildViews(viewContext);
                this.doProcessTile(this._childViews, processFlags, viewContext);
                this.didProcessChildViews(viewContext);
            }
        };
        MapLayerView.prototype.doProcessTile = function (tile, processFlags, viewContext) {
            if (tile._southWest !== null && tile._southWest._geoFrame.intersects(viewContext.geoFrame)) {
                this.doProcessTile(tile._southWest, processFlags, viewContext);
            }
            if (tile._northWest !== null && tile._northWest._geoFrame.intersects(viewContext.geoFrame)) {
                this.doProcessTile(tile._northWest, processFlags, viewContext);
            }
            if (tile._southEast !== null && tile._southEast._geoFrame.intersects(viewContext.geoFrame)) {
                this.doProcessTile(tile._southEast, processFlags, viewContext);
            }
            if (tile._northEast !== null && tile._northEast._geoFrame.intersects(viewContext.geoFrame)) {
                this.doProcessTile(tile._northEast, processFlags, viewContext);
            }
            var childViews = tile._views;
            for (var i = 0; i < childViews.length; i += 1) {
                var childView = childViews[i];
                var childViewContext = this.childViewContext(childView, viewContext);
                this.doProcessChildView(childView, processFlags, childViewContext);
                if ((childView.viewFlags & view.View.RemovingFlag) !== 0) {
                    childView.setViewFlags(childView.viewFlags & ~view.View.RemovingFlag);
                    this.removeChildView(childView);
                }
            }
        };
        MapLayerView.prototype.cascadeDisplay = function (displayFlags, viewContext) {
            displayFlags = this._viewFlags | displayFlags;
            displayFlags = this.needsDisplay(displayFlags, viewContext);
            this.doDisplay(displayFlags, viewContext);
        };
        MapLayerView.prototype.doDisplay = function (displayFlags, viewContext) {
            var cascadeFlags = displayFlags;
            this._viewFlags &= ~(view.View.NeedsDisplay | view.View.NeedsComposite);
            this.willDisplay(viewContext);
            this._viewFlags |= view.View.DisplayingFlag;
            try {
                if (((this._viewFlags | displayFlags) & view.View.NeedsLayout) !== 0) {
                    cascadeFlags |= view.View.NeedsLayout;
                    this._viewFlags &= ~view.View.NeedsLayout;
                    this.willLayout(viewContext);
                }
                if (((this._viewFlags | displayFlags) & view.View.NeedsRender) !== 0) {
                    cascadeFlags |= view.View.NeedsRender;
                    this._viewFlags &= ~view.View.NeedsRender;
                    this.willRender(viewContext);
                }
                this.onDisplay(viewContext);
                if ((cascadeFlags & view.View.NeedsLayout) !== 0) {
                    this.onLayout(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsRender) !== 0) {
                    this.onRender(viewContext);
                }
                this.doDisplayChildViews(cascadeFlags, viewContext);
                if ((cascadeFlags & view.View.NeedsRender) !== 0) {
                    this.didRender(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsLayout) !== 0) {
                    this.didLayout(viewContext);
                }
            }
            finally {
                this._viewFlags &= ~view.View.DisplayingFlag;
                this.didDisplay(viewContext);
            }
        };
        MapLayerView.prototype.willRender = function (viewContext) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillRender !== void 0) {
                    viewObserver.viewWillRender(viewContext, this);
                }
            });
        };
        MapLayerView.prototype.onRender = function (viewContext) {
            var outlineColor = this.getMemberAnimator("tileOutlineColor");
            if (outlineColor !== null && outlineColor.value !== void 0) {
                this.renderTiles(viewContext, outlineColor.value);
            }
        };
        MapLayerView.prototype.renderTiles = function (viewContext, outlineColor) {
            var renderer = viewContext.renderer;
            if (renderer instanceof render.CanvasRenderer && !this.isHidden() && !this.isCulled()) {
                var context = renderer.context;
                context.save();
                this.renderTile(this._childViews, context, viewContext.geoProjection, outlineColor);
                context.restore();
            }
        };
        MapLayerView.prototype.renderTile = function (tile, context, geoProjection, outlineColor) {
            if (tile._southWest !== null) {
                this.renderTile(tile._southWest, context, geoProjection, outlineColor);
            }
            if (tile._northWest !== null) {
                this.renderTile(tile._northWest, context, geoProjection, outlineColor);
            }
            if (tile._southEast !== null) {
                this.renderTile(tile._southEast, context, geoProjection, outlineColor);
            }
            if (tile._northEast !== null) {
                this.renderTile(tile._northEast, context, geoProjection, outlineColor);
            }
            var minDepth = 2;
            if (tile.depth >= minDepth) {
                var southWest = geoProjection.project(tile._geoFrame.southWest);
                var northWest = geoProjection.project(tile._geoFrame.northWest);
                var northEast = geoProjection.project(tile._geoFrame.northEast);
                var southEast = geoProjection.project(tile._geoFrame.southEast);
                context.beginPath();
                context.moveTo(southWest._x, southWest._y);
                context.lineTo(northWest._x, northWest._y);
                context.lineTo(northEast._x, northEast._y);
                context.lineTo(southEast._x, southEast._y);
                context.closePath();
                var u = (tile._depth - minDepth) / (tile._maxDepth - minDepth);
                context.lineWidth = 4 * (1 - u) + 0.5 * u;
                context.strokeStyle = outlineColor.toString();
                context.stroke();
            }
        };
        MapLayerView.prototype.didRender = function (viewContext) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidRender !== void 0) {
                    viewObserver.viewDidRender(viewContext, this);
                }
            });
        };
        MapLayerView.prototype.doDisplayChildViews = function (displayFlags, viewContext) {
            if ((displayFlags & view.View.DisplayMask) !== 0 && !this._childViews.isEmpty() && !this.isHidden() && !this.isCulled()) {
                this.willDisplayChildViews(viewContext);
                this.doDisplayTile(this._childViews, displayFlags, viewContext);
                this.didDisplayChildViews(viewContext);
            }
        };
        MapLayerView.prototype.doDisplayTile = function (tile, displayFlags, viewContext) {
            if (tile._southWest !== null && tile._southWest._geoFrame.intersects(viewContext.geoFrame)) {
                this.doDisplayTile(tile._southWest, displayFlags, viewContext);
            }
            if (tile._northWest !== null && tile._northWest._geoFrame.intersects(viewContext.geoFrame)) {
                this.doDisplayTile(tile._northWest, displayFlags, viewContext);
            }
            if (tile._southEast !== null && tile._southEast._geoFrame.intersects(viewContext.geoFrame)) {
                this.doDisplayTile(tile._southEast, displayFlags, viewContext);
            }
            if (tile._northEast !== null && tile._northEast._geoFrame.intersects(viewContext.geoFrame)) {
                this.doDisplayTile(tile._northEast, displayFlags, viewContext);
            }
            var childViews = tile._views;
            for (var i = 0; i < childViews.length; i += 1) {
                var childView = childViews[i];
                var childViewContext = this.childViewContext(childView, viewContext);
                this.doDisplayChildView(childView, displayFlags, childViewContext);
                if ((childView.viewFlags & view.View.RemovingFlag) !== 0) {
                    childView.setViewFlags(childView.viewFlags & ~view.View.RemovingFlag);
                    this.removeChildView(childView);
                }
            }
        };
        MapLayerView.prototype.childViewContext = function (childView, viewContext) {
            return viewContext;
        };
        MapLayerView.prototype.didSetGeoBounds = function (newGeoBounds, oldGeoBounds) {
            var parentView = this._parentView;
            if (MapView.is(parentView)) {
                parentView.childViewDidSetGeoBounds(this, newGeoBounds, oldGeoBounds);
            }
        };
        MapLayerView.prototype.childViewDidSetGeoBounds = function (childView, newChildViewGeoBounds, oldChildViewGeoBounds) {
            var oldGeoBounds = this._childViews._geoBounds;
            this._childViews = this._childViews.moved(childView, newChildViewGeoBounds, oldChildViewGeoBounds);
            var newGeoBounds = this._childViews._geoBounds;
            if (!newGeoBounds.equals(oldGeoBounds)) {
                this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
            }
        };
        MapLayerView.prototype.hasViewScope = function (scopeName) {
            var viewScopes = this._viewScopes;
            return viewScopes !== void 0 && viewScopes[scopeName] !== void 0;
        };
        MapLayerView.prototype.getViewScope = function (scopeName) {
            var viewScopes = this._viewScopes;
            return viewScopes !== void 0 ? viewScopes[scopeName] || null : null;
        };
        MapLayerView.prototype.setViewScope = function (scopeName, viewScope) {
            var viewScopes = this._viewScopes;
            if (viewScopes === void 0) {
                viewScopes = {};
                this._viewScopes = viewScopes;
            }
            if (viewScope !== null) {
                viewScopes[scopeName] = viewScope;
            }
            else {
                delete viewScopes[scopeName];
            }
        };
        MapLayerView.prototype.hasLayoutAnchor = function (anchorName) {
            var layoutAnchors = this._layoutAnchors;
            return layoutAnchors !== void 0 && layoutAnchors[anchorName] !== void 0;
        };
        MapLayerView.prototype.getLayoutAnchor = function (anchorName) {
            var layoutAnchors = this._layoutAnchors;
            return layoutAnchors !== void 0 ? layoutAnchors[anchorName] || null : null;
        };
        MapLayerView.prototype.setLayoutAnchor = function (anchorName, layoutAnchor) {
            var layoutAnchors = this._layoutAnchors;
            if (layoutAnchors === void 0) {
                layoutAnchors = {};
                this._layoutAnchors = layoutAnchors;
            }
            if (layoutAnchor !== null) {
                layoutAnchors[anchorName] = layoutAnchor;
            }
            else {
                delete layoutAnchors[anchorName];
            }
        };
        MapLayerView.prototype.hasMemberAnimator = function (animatorName) {
            var memberAnimators = this._memberAnimators;
            return memberAnimators !== void 0 && memberAnimators[animatorName] !== void 0;
        };
        MapLayerView.prototype.getMemberAnimator = function (animatorName) {
            var memberAnimators = this._memberAnimators;
            return memberAnimators !== void 0 ? memberAnimators[animatorName] || null : null;
        };
        MapLayerView.prototype.setMemberAnimator = function (animatorName, animator) {
            var memberAnimators = this._memberAnimators;
            if (memberAnimators === void 0) {
                memberAnimators = {};
                this._memberAnimators = memberAnimators;
            }
            if (animator !== null) {
                memberAnimators[animatorName] = animator;
            }
            else {
                delete memberAnimators[animatorName];
            }
        };
        MapLayerView.prototype.getLazyMemberAnimator = function (animatorName) {
            var memberAnimator = this.getMemberAnimator(animatorName);
            if (memberAnimator === null) {
                var viewClass = this.__proto__;
                var descriptor = view.AnimatedView.getMemberAnimatorDescriptor(animatorName, viewClass);
                if (descriptor !== null && descriptor.animatorType !== void 0) {
                    memberAnimator = view.AnimatedView.initMemberAnimator(descriptor.animatorType, this, animatorName, descriptor);
                    this.setMemberAnimator(animatorName, memberAnimator);
                }
            }
            return memberAnimator;
        };
        MapLayerView.prototype.animatorDidSetAuto = function (animator, auto) {
            if (animator instanceof view.MemberAnimator) {
                this.requireUpdate(view.View.NeedsDerive);
            }
        };
        MapLayerView.prototype.animateMembers = function (t) {
            var memberAnimators = this._memberAnimators;
            if (memberAnimators !== void 0) {
                for (var animatorName in memberAnimators) {
                    var animator = memberAnimators[animatorName];
                    animator.onFrame(t);
                }
            }
        };
        MapLayerView.prototype.animate = function (animator) {
            this.requireUpdate(view.View.NeedsAnimate);
        };
        MapLayerView.prototype.cancelAnimators = function () {
            this.cancelMemberAnimators();
        };
        MapLayerView.prototype.cancelMemberAnimators = function () {
            var memberAnimators = this._memberAnimators;
            if (memberAnimators !== void 0) {
                for (var animatorName in memberAnimators) {
                    var animator = memberAnimators[animatorName];
                    animator.cancel();
                }
            }
        };
        MapLayerView.prototype.isHidden = function () {
            if ((this._viewFlags & view.View.HiddenFlag) !== 0) {
                return true;
            }
            else {
                var parentView = this._parentView;
                return view.RenderedView.is(parentView) ? parentView.isHidden() : false;
            }
        };
        MapLayerView.prototype.setHidden = function (newHidden) {
            var oldHidden = (this._viewFlags & view.View.HiddenFlag) !== 0;
            if (oldHidden !== newHidden) {
                this.willSetHidden(newHidden);
                if (newHidden) {
                    this._viewFlags |= view.View.HiddenFlag;
                }
                else {
                    this._viewFlags &= ~view.View.HiddenFlag;
                }
                this.onSetHidden(newHidden);
                this.didSetHidden(newHidden);
            }
        };
        MapLayerView.prototype.willSetHidden = function (hidden) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillSetHidden !== void 0) {
                    viewObserver.viewWillSetHidden(hidden, this);
                }
            });
        };
        MapLayerView.prototype.onSetHidden = function (hidden) {
            this.requireUpdate(view.View.NeedsLayout);
        };
        MapLayerView.prototype.didSetHidden = function (hidden) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetHidden !== void 0) {
                    viewObserver.viewDidSetHidden(hidden, this);
                }
            });
        };
        MapLayerView.prototype.isCulled = function () {
            if ((this._viewFlags & view.View.CulledFlag) !== 0) {
                return true;
            }
            else {
                var parentView = this._parentView;
                return view.RenderedView.is(parentView) ? parentView.isCulled() : false;
            }
        };
        MapLayerView.prototype.setCulled = function (newCulled) {
            var oldCulled = (this._viewFlags & view.View.CulledFlag) !== 0;
            if (oldCulled !== newCulled) {
                this.willSetCulled(newCulled);
                if (newCulled) {
                    this._viewFlags |= view.View.CulledFlag;
                }
                else {
                    this._viewFlags &= ~view.View.CulledFlag;
                }
                this.onSetCulled(newCulled);
                this.didSetCulled(newCulled);
            }
        };
        MapLayerView.prototype.willSetCulled = function (culled) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillSetCulled !== void 0) {
                    viewObserver.viewWillSetCulled(culled, this);
                }
            });
        };
        MapLayerView.prototype.onSetCulled = function (culled) {
            if (!culled) {
                this.requireUpdate(view.View.NeedsLayout);
            }
        };
        MapLayerView.prototype.didSetCulled = function (culled) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetCulled !== void 0) {
                    viewObserver.viewDidSetCulled(culled, this);
                }
            });
        };
        MapLayerView.prototype.cullViewFrame = function (viewFrame) {
            if (viewFrame === void 0) { viewFrame = this.viewFrame; }
            this.setCulled(!viewFrame.intersects(this.viewBounds));
        };
        Object.defineProperty(MapLayerView.prototype, "viewFrame", {
            get: function () {
                var viewFrame = this._viewFrame;
                if (viewFrame === void 0) {
                    var parentView = this._parentView;
                    viewFrame = view.RenderedView.is(parentView) ? parentView.viewFrame : math.BoxR2.empty();
                }
                return viewFrame;
            },
            enumerable: false,
            configurable: true
        });
        MapLayerView.prototype.setViewFrame = function (viewFrame) {
            if (viewFrame !== null) {
                this._viewFrame = viewFrame;
            }
            else if (this._viewFrame !== void 0) {
                this._viewFrame = void 0;
            }
        };
        Object.defineProperty(MapLayerView.prototype, "viewBounds", {
            get: function () {
                return this.viewFrame;
            },
            enumerable: false,
            configurable: true
        });
        MapLayerView.prototype.cullGeoFrame = function (geoFrame) {
            if (geoFrame === void 0) { geoFrame = this.geoFrame; }
            this.setCulled(!geoFrame.intersects(this.geoBounds));
        };
        Object.defineProperty(MapLayerView.prototype, "geoFrame", {
            get: function () {
                var parentView = this.parentView;
                return MapView.is(parentView) ? parentView.geoFrame : GeoBox.globe();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerView.prototype, "geoBounds", {
            get: function () {
                return this._childViews._geoBounds;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerView.prototype, "hitBounds", {
            get: function () {
                return this.viewBounds;
            },
            enumerable: false,
            configurable: true
        });
        MapLayerView.prototype.hitTest = function (x, y, viewContext) {
            var geoPoint = viewContext.geoProjection.unproject(x, y);
            return this.hitTestTile(this._childViews, x, y, geoPoint, viewContext);
        };
        MapLayerView.prototype.hitTestTile = function (tile, x, y, geoPoint, viewContext) {
            var hit = null;
            if (tile._southWest !== null && tile._southWest._geoFrame.contains(geoPoint)) {
                hit = this.hitTestTile(tile._southWest, x, y, geoPoint, viewContext);
            }
            if (hit === null && tile._northWest !== null && tile._northWest._geoFrame.contains(geoPoint)) {
                hit = this.hitTestTile(tile._northWest, x, y, geoPoint, viewContext);
            }
            if (hit === null && tile._southEast !== null && tile._southEast._geoFrame.contains(geoPoint)) {
                hit = this.hitTestTile(tile._southEast, x, y, geoPoint, viewContext);
            }
            if (hit === null && tile._northEast !== null && tile._northEast._geoFrame.contains(geoPoint)) {
                hit = this.hitTestTile(tile._northEast, x, y, geoPoint, viewContext);
            }
            if (hit === null) {
                var childViews = tile._views;
                for (var i = 0; i < childViews.length; i += 1) {
                    var childView = childViews[i];
                    if (childView.hitBounds.contains(x, y)) {
                        hit = childView.hitTest(x, y, viewContext);
                        if (hit !== null) {
                            break;
                        }
                    }
                }
            }
            return hit;
        };
        Object.defineProperty(MapLayerView.prototype, "parentTransform", {
            get: function () {
                return transform.Transform.identity();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerView.prototype, "clientBounds", {
            get: function () {
                var inverseClientTransform = this.clientTransform.inverse();
                return this.viewBounds.transform(inverseClientTransform);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerView.prototype, "popoverFrame", {
            get: function () {
                var inversePageTransform = this.pageTransform.inverse();
                return this.viewBounds.transform(inversePageTransform);
            },
            enumerable: false,
            configurable: true
        });
        MapLayerView.prototype.on = function (type, listener, options) {
            var eventHandlers = this._eventHandlers;
            if (eventHandlers === void 0) {
                eventHandlers = {};
                this._eventHandlers = eventHandlers;
            }
            var handlers = eventHandlers[type];
            var capture = typeof options === "boolean" ? options : typeof options === "object" && options !== null && options.capture || false;
            var passive = options && typeof options === "object" && options.passive || false;
            var once = options && typeof options === "object" && options.once || false;
            var handler;
            if (handlers === void 0) {
                handler = { listener: listener, capture: capture, passive: passive, once: once };
                handlers = [handler];
                eventHandlers[type] = handlers;
            }
            else {
                var n = handlers.length;
                var i = 0;
                while (i < n) {
                    handler = handlers[i];
                    if (handler.listener === listener && handler.capture === capture) {
                        break;
                    }
                    i += 1;
                }
                if (i < n) {
                    handler.passive = passive;
                    handler.once = once;
                }
                else {
                    handler = { listener: listener, capture: capture, passive: passive, once: once };
                    handlers.push(handler);
                }
            }
            return this;
        };
        MapLayerView.prototype.off = function (type, listener, options) {
            var eventHandlers = this._eventHandlers;
            if (eventHandlers !== void 0) {
                var handlers = eventHandlers[type];
                if (handlers !== void 0) {
                    var capture = typeof options === "boolean" ? options : typeof options === "object" && options !== null && options.capture || false;
                    var n = handlers.length;
                    var i = 0;
                    while (i < n) {
                        var handler = handlers[i];
                        if (handler.listener === listener && handler.capture === capture) {
                            handlers.splice(i, 1);
                            if (handlers.length === 0) {
                                delete eventHandlers[type];
                            }
                            break;
                        }
                        i += 1;
                    }
                }
            }
            return this;
        };
        MapLayerView.prototype.handleEvent = function (event) {
            var type = event.type;
            var eventHandlers = this._eventHandlers;
            if (eventHandlers !== void 0) {
                var handlers = eventHandlers[type];
                if (handlers !== void 0) {
                    var i = 0;
                    while (i < handlers.length) {
                        var handler = handlers[i];
                        if (!handler.capture) {
                            var listener = handler.listener;
                            if (typeof listener === "function") {
                                listener(event);
                            }
                            else if (typeof listener === "object" && listener !== null) {
                                listener.handleEvent(event);
                            }
                            if (handler.once) {
                                handlers.splice(i, 1);
                                continue;
                            }
                        }
                        i += 1;
                    }
                    if (handlers.length === 0) {
                        delete eventHandlers[type];
                    }
                }
            }
            if (type === "mouseover") {
                this.onMouseOver(event);
            }
            else if (type === "mouseout") {
                this.onMouseOut(event);
            }
        };
        MapLayerView.prototype.bubbleEvent = function (event) {
            this.handleEvent(event);
            if (event.bubbles && !event.cancelBubble) {
                var parentView = this._parentView;
                if (view.RenderedView.is(parentView)) {
                    return parentView.bubbleEvent(event);
                }
                else {
                    return parentView;
                }
            }
            else {
                return null;
            }
        };
        MapLayerView.prototype.dispatchEvent = function (event) {
            event.targetView = this;
            var next = this.bubbleEvent(event);
            if (next !== null) {
                return next.dispatchEvent(event);
            }
            else {
                return !event.cancelBubble;
            }
        };
        MapLayerView.prototype.isHovering = function () {
            return (this._viewFlags & view.View.HoveringFlag) !== 0;
        };
        MapLayerView.prototype.onMouseOver = function (event) {
            if ((this._viewFlags & view.View.HoveringFlag) === 0) {
                this._viewFlags |= view.View.HoveringFlag;
                var eventHandlers = this._eventHandlers;
                if (eventHandlers !== void 0 && eventHandlers.mouseenter !== void 0) {
                    var enterEvent = new MouseEvent("mouseenter", {
                        clientX: event.clientX,
                        clientY: event.clientY,
                        screenX: event.screenX,
                        screenY: event.screenY,
                        bubbles: false,
                    });
                    enterEvent.targetView = this;
                    enterEvent.relatedTargetView = event.relatedTargetView;
                    this.handleEvent(enterEvent);
                }
            }
        };
        MapLayerView.prototype.onMouseOut = function (event) {
            if ((this._viewFlags & view.View.HoveringFlag) !== 0) {
                this._viewFlags &= ~view.View.HoveringFlag;
                var eventHandlers = this._eventHandlers;
                if (eventHandlers !== void 0 && eventHandlers.mouseleave !== void 0) {
                    var leaveEvent = new MouseEvent("mouseleave", {
                        clientX: event.clientX,
                        clientY: event.clientY,
                        screenX: event.screenX,
                        screenY: event.screenY,
                        bubbles: false,
                    });
                    leaveEvent.targetView = this;
                    leaveEvent.relatedTargetView = event.relatedTargetView;
                    this.handleEvent(leaveEvent);
                }
            }
        };
        __decorate([
            view.MemberAnimator(color.Color)
        ], MapLayerView.prototype, "tileOutlineColor", void 0);
        return MapLayerView;
    }(view.View));

    var MapView = {
        is: function (object) {
            if (typeof object === "object" && object !== null) {
                var view$1 = object;
                return view$1 instanceof MapGraphicsView
                    || view$1 instanceof MapLayerView
                    || view.RenderedView.is(view$1) && "geoProjection" in view$1;
            }
            return false;
        },
    };

    var MapGraphicsViewController = (function (_super) {
        __extends(MapGraphicsViewController, _super);
        function MapGraphicsViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(MapGraphicsViewController.prototype, "geoProjection", {
            get: function () {
                var view = this._view;
                return view !== null ? view.geoProjection : null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapGraphicsViewController.prototype, "mapZoom", {
            get: function () {
                var view = this._view;
                return view !== null ? view.mapZoom : 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapGraphicsViewController.prototype, "mapHeading", {
            get: function () {
                var view = this._view;
                return view !== null ? view.mapHeading : 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapGraphicsViewController.prototype, "mapTilt", {
            get: function () {
                var view = this._view;
                return view !== null ? view.mapTilt : 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapGraphicsViewController.prototype, "geoFrame", {
            get: function () {
                var view = this._view;
                return view !== null ? view.geoFrame : GeoBox.globe();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapGraphicsViewController.prototype, "geoBounds", {
            get: function () {
                var view = this._view;
                return view !== null ? view.geoBounds : GeoBox.empty();
            },
            enumerable: false,
            configurable: true
        });
        MapGraphicsViewController.prototype.viewWillProject = function (viewContext, view) {
        };
        MapGraphicsViewController.prototype.viewDidProject = function (viewContext, view) {
        };
        return MapGraphicsViewController;
    }(view.GraphicsViewController));

    var MapRasterView = (function (_super) {
        __extends(MapRasterView, _super);
        function MapRasterView() {
            var _this = _super.call(this) || this;
            _this._canvas = _this.createCanvas();
            _this._renderer = void 0;
            _this._rasterFrame = math.BoxR2.empty();
            return _this;
        }
        Object.defineProperty(MapRasterView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapRasterView.prototype, "pixelRatio", {
            get: function () {
                return window.devicePixelRatio || 1;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapRasterView.prototype, "canvas", {
            get: function () {
                return this._canvas;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapRasterView.prototype, "compositor", {
            get: function () {
                var parentView = this.parentView;
                return view.RenderedView.is(parentView) ? parentView.renderer : null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapRasterView.prototype, "renderer", {
            get: function () {
                var renderer = this._renderer;
                if (renderer === void 0) {
                    renderer = this.createRenderer();
                    this._renderer = renderer;
                }
                return renderer;
            },
            enumerable: false,
            configurable: true
        });
        MapRasterView.prototype.setRenderer = function (renderer) {
            if (typeof renderer === "string") {
                renderer = this.createRenderer(renderer);
            }
            this._renderer = renderer;
            this.resetRenderer();
        };
        MapRasterView.prototype.createRenderer = function (rendererType) {
            if (rendererType === void 0) { rendererType = "canvas"; }
            if (rendererType === "canvas") {
                var context = this._canvas.getContext("2d");
                if (context !== null) {
                    return new render.CanvasRenderer(context, this.pixelRatio);
                }
                else {
                    throw new Error("Failed to create canvas rendering context");
                }
            }
            else if (rendererType === "webgl") {
                var context = this._canvas.getContext("webgl");
                if (context !== null) {
                    return new render.WebGLRenderer(context, this.pixelRatio);
                }
                else {
                    throw new Error("Failed to create webgl rendering context");
                }
            }
            else {
                throw new Error("Failed to create " + rendererType + " renderer");
            }
        };
        MapRasterView.prototype.modifyUpdate = function (updateFlags) {
            var additionalFlags = 0;
            if ((updateFlags & view.View.UpdateMask) !== 0) {
                if ((updateFlags & view.View.ProcessMask) !== 0) {
                    additionalFlags |= view.View.NeedsProcess;
                }
                if ((updateFlags & view.View.DisplayMask) !== 0) {
                    additionalFlags |= view.View.NeedsDisplay;
                }
                additionalFlags |= view.View.NeedsRender | view.View.NeedsComposite;
            }
            return additionalFlags;
        };
        MapRasterView.prototype.cascadeProcess = function (processFlags, viewContext) {
            viewContext = this.rasterViewContext(viewContext);
            _super.prototype.cascadeProcess.call(this, processFlags, viewContext);
        };
        MapRasterView.prototype.cascadeDisplay = function (displayFlags, viewContext) {
            viewContext = this.rasterViewContext(viewContext);
            _super.prototype.cascadeDisplay.call(this, displayFlags, viewContext);
        };
        MapRasterView.prototype.doDisplay = function (displayFlags, viewContext) {
            var cascadeFlags = displayFlags;
            this.willDisplay(viewContext);
            this._viewFlags |= view.View.DisplayingFlag;
            try {
                if (((this._viewFlags | displayFlags) & view.View.NeedsLayout) !== 0) {
                    cascadeFlags |= view.View.NeedsLayout;
                    this._viewFlags &= ~view.View.NeedsLayout;
                    this.willLayout(viewContext);
                }
                if (((this._viewFlags | displayFlags) & view.View.NeedsRender) !== 0) {
                    cascadeFlags |= view.View.NeedsRender;
                    this._viewFlags &= ~view.View.NeedsRender;
                    this.willRender(viewContext);
                }
                if (((this._viewFlags | displayFlags) & view.View.NeedsComposite) !== 0) {
                    cascadeFlags |= view.View.NeedsComposite;
                    this._viewFlags &= ~view.View.NeedsComposite;
                    this.willComposite(viewContext);
                }
                this.onDisplay(viewContext);
                if ((cascadeFlags & view.View.NeedsLayout) !== 0) {
                    this.onLayout(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsRender) !== 0) {
                    this.onRender(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsComposite) !== 0) {
                    this.onComposite(viewContext);
                }
                this.doDisplayChildViews(cascadeFlags, viewContext);
                if ((cascadeFlags & view.View.NeedsComposite) !== 0) {
                    this.didComposite(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsRender) !== 0) {
                    this.didRender(viewContext);
                }
                if ((cascadeFlags & view.View.NeedsLayout) !== 0) {
                    this.didLayout(viewContext);
                }
            }
            finally {
                this._viewFlags &= ~view.View.DisplayingFlag;
                this.didDisplay(viewContext);
            }
        };
        MapRasterView.prototype.onLayout = function (viewContext) {
            _super.prototype.onLayout.call(this, viewContext);
            this.resizeCanvas(this._canvas);
            this.resetRenderer();
        };
        MapRasterView.prototype.onRender = function (viewContext) {
            _super.prototype.onRender.call(this, viewContext);
            this.clearCanvas();
        };
        MapRasterView.prototype.willComposite = function (viewContext) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillRender !== void 0) {
                    viewObserver.viewWillRender(viewContext, this);
                }
            });
        };
        MapRasterView.prototype.onComposite = function (viewContext) {
            this.compositeImage(viewContext);
        };
        MapRasterView.prototype.didComposite = function (viewContext) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidRender !== void 0) {
                    viewObserver.viewDidRender(viewContext, this);
                }
            });
        };
        MapRasterView.prototype.childViewContext = function (childView, viewContext) {
            return viewContext;
        };
        MapRasterView.prototype.rasterViewContext = function (viewContext) {
            var rasterViewContext = Object.create(viewContext);
            rasterViewContext.compositor = viewContext.renderer;
            rasterViewContext.renderer = this.renderer;
            return rasterViewContext;
        };
        Object.defineProperty(MapRasterView.prototype, "compositeFrame", {
            get: function () {
                var viewFrame = this._viewFrame;
                if (viewFrame === void 0) {
                    var parentView = this._parentView;
                    viewFrame = view.RenderedView.is(parentView) ? parentView.viewFrame : math.BoxR2.empty();
                }
                return viewFrame;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapRasterView.prototype, "viewFrame", {
            get: function () {
                return this._rasterFrame;
            },
            enumerable: false,
            configurable: true
        });
        MapRasterView.prototype.setViewFrame = function (viewFrame) {
            if (viewFrame !== null) {
                this._viewFrame = viewFrame;
            }
            else if (this._viewFrame !== void 0) {
                this._viewFrame = void 0;
            }
        };
        MapRasterView.prototype.hitTest = function (x, y, viewContext) {
            var rasterViewContext = this.rasterViewContext(viewContext);
            var compositeFrame = this.compositeFrame;
            x -= Math.floor(compositeFrame.xMin);
            y -= Math.floor(compositeFrame.yMin);
            var hit = null;
            var childViews = this._childViews;
            for (var i = childViews.length - 1; i >= 0; i -= 1) {
                var childView = childViews[i];
                if (view.RenderedView.is(childView) && !childView.isHidden() && !childView.isCulled()) {
                    var hitBounds = childView.hitBounds;
                    if (hitBounds.contains(x, y)) {
                        hit = childView.hitTest(x, y, rasterViewContext);
                        if (hit !== null) {
                            break;
                        }
                    }
                }
            }
            return hit;
        };
        Object.defineProperty(MapRasterView.prototype, "parentTransform", {
            get: function () {
                var compositeFrame = this.compositeFrame;
                var dx = Math.floor(compositeFrame.xMin);
                var dy = Math.floor(compositeFrame.yMin);
                if (dx !== 0 || dy !== 0) {
                    return transform.Transform.translate(-dx, -dy);
                }
                return transform.Transform.identity();
            },
            enumerable: false,
            configurable: true
        });
        MapRasterView.prototype.createCanvas = function () {
            return document.createElement("canvas");
        };
        MapRasterView.prototype.resizeCanvas = function (node) {
            var compositeFrame = this.compositeFrame;
            var xMin = compositeFrame.xMin - Math.floor(compositeFrame.xMin);
            var yMin = compositeFrame.yMin - Math.floor(compositeFrame.yMin);
            var xMax = Math.ceil(xMin + compositeFrame.width);
            var yMax = Math.ceil(yMin + compositeFrame.height);
            var rasterFrame = new math.BoxR2(xMin, yMin, xMax, yMax);
            if (!this._rasterFrame.equals(rasterFrame)) {
                var pixelRatio = this.pixelRatio;
                node.width = xMax * pixelRatio;
                node.height = yMax * pixelRatio;
                node.style.width = xMax + "px";
                node.style.height = yMax + "px";
                this._rasterFrame = rasterFrame;
            }
        };
        MapRasterView.prototype.clearCanvas = function () {
            var renderer = this.renderer;
            if (renderer instanceof render.CanvasRenderer) {
                var rasterFrame = this._rasterFrame;
                renderer.context.clearRect(0, 0, rasterFrame.xMax, rasterFrame.yMax);
            }
            else if (renderer instanceof render.WebGLRenderer) {
                var context = renderer.context;
                context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
            }
        };
        MapRasterView.prototype.resetRenderer = function () {
            var renderer = this.renderer;
            if (renderer instanceof render.CanvasRenderer) {
                var pixelRatio = this.pixelRatio;
                renderer.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            }
            else if (renderer instanceof render.WebGLRenderer) {
                var rasterFrame = this._rasterFrame;
                renderer.context.viewport(0, 0, rasterFrame.xMax, rasterFrame.yMax);
            }
        };
        MapRasterView.prototype.compositeImage = function (viewContext) {
            var compositor = viewContext.compositor;
            var renderer = viewContext.renderer;
            if (compositor instanceof render.CanvasRenderer && renderer instanceof render.CanvasRenderer) {
                var imageData = renderer.context.getImageData(0, 0, this._canvas.width, this._canvas.height);
                var compositeFrame = this.compositeFrame;
                var pixelRatio = compositor.pixelRatio;
                var context = compositor.context;
                context.save();
                context.globalAlpha = this.opacity.value;
                context.globalCompositeOperation = this.compositeOperation.value;
                var x = Math.floor(compositeFrame.xMin) * pixelRatio;
                var y = Math.floor(compositeFrame.yMin) * pixelRatio;
                context.putImageData(imageData, x, y);
                context.restore();
            }
        };
        __decorate([
            view.MemberAnimator(Number, { value: 1 })
        ], MapRasterView.prototype, "opacity", void 0);
        __decorate([
            view.MemberAnimator(String, { value: "source-over" })
        ], MapRasterView.prototype, "compositeOperation", void 0);
        return MapRasterView;
    }(MapGraphicsView));

    var CompositedMapView = {
        is: function (object) {
            if (typeof object === "object" && object !== null) {
                var view$1 = object;
                return view$1 instanceof MapRasterView
                    || view.CompositedView.is(view$1) && MapView.is(view$1);
            }
            return false;
        },
    };

    var MapRasterViewController = (function (_super) {
        __extends(MapRasterViewController, _super);
        function MapRasterViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MapRasterViewController.prototype.viewWillComposite = function (viewContext, view) {
        };
        MapRasterViewController.prototype.viewDidComposite = function (viewContext, view) {
        };
        return MapRasterViewController;
    }(MapGraphicsViewController));

    var MapLayerViewController = (function (_super) {
        __extends(MapLayerViewController, _super);
        function MapLayerViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Object.defineProperty(MapLayerViewController.prototype, "canvasView", {
            get: function () {
                var view = this._view;
                return view !== null ? view.canvasView : null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerViewController.prototype, "geoProjection", {
            get: function () {
                var view = this._view;
                return view !== null ? view.geoProjection : null;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerViewController.prototype, "mapZoom", {
            get: function () {
                var view = this._view;
                return view !== null ? view.mapZoom : 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerViewController.prototype, "mapHeading", {
            get: function () {
                var view = this._view;
                return view !== null ? view.mapHeading : 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerViewController.prototype, "mapTilt", {
            get: function () {
                var view = this._view;
                return view !== null ? view.mapTilt : 0;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerViewController.prototype, "geoFrame", {
            get: function () {
                var view = this._view;
                return view !== null ? view.geoFrame : GeoBox.globe();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerViewController.prototype, "geoBounds", {
            get: function () {
                var view = this._view;
                return view !== null ? view.geoBounds : GeoBox.empty();
            },
            enumerable: false,
            configurable: true
        });
        MapLayerViewController.prototype.viewWillAnimate = function (viewContext, view) {
        };
        MapLayerViewController.prototype.viewDidAnimate = function (viewContext, view) {
        };
        MapLayerViewController.prototype.viewWillProject = function (viewContext, view) {
        };
        MapLayerViewController.prototype.viewDidProject = function (viewContext, view) {
        };
        MapLayerViewController.prototype.viewWillRender = function (viewContext, view) {
        };
        MapLayerViewController.prototype.viewDidRender = function (viewContext, view) {
        };
        MapLayerViewController.prototype.isHidden = function () {
            var view = this._view;
            return view !== null && view.isHidden();
        };
        MapLayerViewController.prototype.viewWillSetHidden = function (hidden, view) {
        };
        MapLayerViewController.prototype.viewDidSetHidden = function (hidden, view) {
        };
        MapLayerViewController.prototype.isCulled = function () {
            var view = this._view;
            return view !== null && view.isCulled();
        };
        MapLayerViewController.prototype.viewWillSetCulled = function (culled, view) {
        };
        MapLayerViewController.prototype.viewDidSetCulled = function (culled, view) {
        };
        Object.defineProperty(MapLayerViewController.prototype, "viewFrame", {
            get: function () {
                var view = this._view;
                return view !== null ? view.viewFrame : math.BoxR2.empty();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerViewController.prototype, "viewBounds", {
            get: function () {
                var view = this._view;
                return view !== null ? view.viewBounds : math.BoxR2.empty();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLayerViewController.prototype, "hitBounds", {
            get: function () {
                var view = this._view;
                return view !== null ? view.hitBounds : math.BoxR2.empty();
            },
            enumerable: false,
            configurable: true
        });
        return MapLayerViewController;
    }(view.ViewController));

    var MapGroupView = (function (_super) {
        __extends(MapGroupView, _super);
        function MapGroupView() {
            var _this = _super.call(this) || this;
            _this._geoBounds = GeoBox.globe();
            return _this;
        }
        MapGroupView.prototype.didInsertChildView = function (childView, targetView) {
            this.doUpdateGeoBounds();
            _super.prototype.didInsertChildView.call(this, childView, targetView);
        };
        MapGroupView.prototype.didRemoveChildVIew = function (childView) {
            this.doUpdateGeoBounds();
            _super.prototype.didRemoveChildView.call(this, childView);
        };
        MapGroupView.prototype.childViewDidSetGeoBounds = function (childView, newGeoBounds, oldGeoBounds) {
            this.doUpdateGeoBounds();
        };
        MapGroupView.prototype.doUpdateGeoBounds = function () {
            var oldGeoBounds = this._geoBounds;
            var newGeoBounds = this.deriveGeoBounds();
            if (!oldGeoBounds.equals(newGeoBounds)) {
                this._geoBounds = newGeoBounds;
                this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
            }
        };
        Object.defineProperty(MapGroupView.prototype, "geoBounds", {
            get: function () {
                return this._geoBounds;
            },
            enumerable: false,
            configurable: true
        });
        return MapGroupView;
    }(MapGraphicsView));

    var MapPointView = (function (_super) {
        __extends(MapPointView, _super);
        function MapPointView() {
            var _this = _super.call(this) || this;
            _this._geoBounds = GeoBox.empty();
            _this.geoPoint.onUpdate = _this.onSetGeoPoint.bind(_this);
            return _this;
        }
        Object.defineProperty(MapPointView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        MapPointView.prototype.hitRadius = function (hitRadius) {
            if (hitRadius === void 0) {
                return this._hitRadius !== void 0 ? this._hitRadius : null;
            }
            else {
                if (hitRadius !== null) {
                    this._hitRadius = hitRadius;
                }
                else if (this._hitRadius !== void 0) {
                    this._hitRadius = void 0;
                }
                return this;
            }
        };
        MapPointView.prototype.label = function (label) {
            if (label === void 0) {
                return this.getChildView("label");
            }
            else {
                if (label !== null && !(label instanceof view.View)) {
                    label = typeset.TextRunView.fromAny(label);
                }
                this.setChildView("label", label);
                return this;
            }
        };
        MapPointView.prototype.labelPlacement = function (labelPlacement) {
            if (labelPlacement === void 0) {
                return this._labelPlacement !== void 0 ? this._labelPlacement : "auto";
            }
            else {
                this._labelPlacement = labelPlacement;
                return this;
            }
        };
        MapPointView.prototype.isGradientStop = function () {
            return !!this.color.value || typeof this.opacity.value === "number";
        };
        MapPointView.prototype.setState = function (point, tween) {
            var init;
            if (point instanceof MapPointView) {
                init = point.toAny();
            }
            else if (point instanceof GeoPoint) {
                init = point.toAny();
            }
            else if (GeoPoint.isTuple(point)) {
                init = { lng: point[0], lat: point[1] };
            }
            else {
                init = point;
            }
            if (init.lng !== void 0 && init.lat !== void 0) {
                this.geoPoint(new GeoPoint(init.lng, init.lat), tween);
            }
            else if (init.x !== void 0 && init.y !== void 0) {
                this.viewPoint(new math.PointR2(init.x, init.y), tween);
            }
            if (init.radius !== void 0) {
                this.radius(init.radius, tween);
            }
            if (init.hitRadius !== void 0) {
                this.hitRadius(init.hitRadius);
            }
            if (init.color !== void 0) {
                this.color(init.color, tween);
            }
            if (init.opacity !== void 0) {
                this.opacity(init.opacity, tween);
            }
            if (init.labelPadding !== void 0) {
                this.labelPadding(init.labelPadding, tween);
            }
            if (init.labelPlacement !== void 0) {
                this.labelPlacement(init.labelPlacement);
            }
            if (init.font !== void 0) {
                this.font(init.font, tween);
            }
            if (init.textColor !== void 0) {
                this.textColor(init.textColor, tween);
            }
            if (init.label !== void 0) {
                this.label(init.label);
            }
            if (init.hidden !== void 0) {
                this.setHidden(init.hidden);
            }
            if (init.culled !== void 0) {
                this.setCulled(init.culled);
            }
        };
        MapPointView.prototype.onSetGeoPoint = function (newGeoPoint, oldGeoPoint) {
            if (newGeoPoint !== void 0) {
                var oldGeoBounds = this._geoBounds;
                var newGeoBounds = new GeoBox(newGeoPoint._lng, newGeoPoint._lat, newGeoPoint._lng, newGeoPoint._lat);
                this._geoBounds = newGeoBounds;
                this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
            }
            this.requireUpdate(view.View.NeedsProject);
        };
        MapPointView.prototype.modifyUpdate = function (updateFlags) {
            var additionalFlags = 0;
            if ((updateFlags & view.View.NeedsProject) !== 0 && this.label() !== null) {
                additionalFlags |= view.View.NeedsLayout;
            }
            additionalFlags |= _super.prototype.modifyUpdate.call(this, updateFlags | additionalFlags);
            return additionalFlags;
        };
        MapPointView.prototype.onProject = function (viewContext) {
            _super.prototype.onProject.call(this, viewContext);
            if (this.viewPoint.isAuto()) {
                var viewPoint = viewContext.geoProjection.project(this.geoPoint.value);
                this.viewPoint._value = viewPoint;
                this.viewPoint._state = viewPoint;
            }
        };
        MapPointView.prototype.onLayout = function (viewContext) {
            _super.prototype.onLayout.call(this, viewContext);
            var label = this.label();
            if (view.RenderedView.is(label)) {
                this.layoutLabel(label, this.viewFrame);
            }
        };
        MapPointView.prototype.layoutLabel = function (label, frame) {
            var placement = this._labelPlacement !== void 0 ? this._labelPlacement : "auto";
            var size = Math.min(frame.width, frame.height);
            var padding = this.labelPadding.value.pxValue(size);
            var _a = this.viewPoint.value, x = _a.x, y = _a.y;
            var y1 = y;
            if (placement === "top") {
                y1 -= padding;
            }
            else if (placement === "bottom") {
                y1 += padding;
            }
            if (view.TypesetView.is(label)) {
                label.textAlign.setAutoState("center");
                label.textBaseline.setAutoState("bottom");
                label.textOrigin.setAutoState(new math.PointR2(x, y1));
            }
        };
        Object.defineProperty(MapPointView.prototype, "viewBounds", {
            get: function () {
                var _a = this.viewPoint.value, x = _a.x, y = _a.y;
                return new math.BoxR2(x, y, x, y);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPointView.prototype, "hitBounds", {
            get: function () {
                var _a = this.viewPoint.value, x = _a.x, y = _a.y;
                var hitRadius = this._hitRadius !== void 0 ? this._hitRadius : 0;
                return new math.BoxR2(x - hitRadius, y - hitRadius, x + hitRadius, y + hitRadius);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPointView.prototype, "geoBounds", {
            get: function () {
                return this._geoBounds;
            },
            enumerable: false,
            configurable: true
        });
        MapPointView.prototype.hitTest = function (x, y, viewContext) {
            var hit = _super.prototype.hitTest.call(this, x, y, viewContext);
            if (hit === null) {
                var renderer = viewContext.renderer;
                if (renderer instanceof render.CanvasRenderer) {
                    var context = renderer.context;
                    hit = this.hitTestPoint(x, y, context, this.viewFrame);
                }
            }
            return hit;
        };
        MapPointView.prototype.hitTestPoint = function (hx, hy, context, frame) {
            var _a = this.viewPoint.value, x = _a.x, y = _a.y;
            var radius = this.radius.value;
            var hitRadius = this._hitRadius !== void 0 ? this._hitRadius : 0;
            if (radius !== void 0) {
                var size = Math.min(frame.width, frame.height);
                hitRadius = Math.max(hitRadius, radius.pxValue(size));
            }
            var dx = x - hx;
            var dy = y - hy;
            if (dx * dx + dy * dy < hitRadius * hitRadius) {
                return this;
            }
            return null;
        };
        MapPointView.prototype.toAny = function () {
            var init = {};
            if (this.geoPoint.value !== void 0) {
                init.lng = this.geoPoint.value.lng;
                init.lat = this.geoPoint.value.lat;
            }
            if (this.viewPoint.value !== void 0 && !this.viewPoint.isAuto()) {
                init.x = this.viewPoint.value.x;
                init.y = this.viewPoint.value.y;
            }
            if (this.radius.value !== void 0) {
                init.radius = this.radius.value;
            }
            if (this._hitRadius !== null) {
                init.hitRadius = this._hitRadius;
            }
            if (this.color.value !== void 0) {
                init.color = this.color.value;
            }
            if (this.opacity.value !== void 0) {
                init.opacity = this.opacity.value;
            }
            if (this.labelPadding.value !== void 0) {
                init.labelPadding = this.labelPadding.value;
            }
            if (this._labelPlacement !== void 0) {
                init.labelPlacement = this._labelPlacement;
            }
            return init;
        };
        MapPointView.fromAny = function (point) {
            if (point instanceof MapPointView) {
                return point;
            }
            else if (typeof point === "object" && point !== null) {
                var view = new MapPointView();
                view.setState(point);
                return view;
            }
            throw new TypeError("" + point);
        };
        __decorate([
            view.MemberAnimator(GeoPoint, { value: GeoPoint.origin() })
        ], MapPointView.prototype, "geoPoint", void 0);
        __decorate([
            view.MemberAnimator(math.PointR2, { value: math.PointR2.origin() })
        ], MapPointView.prototype, "viewPoint", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], MapPointView.prototype, "radius", void 0);
        __decorate([
            view.MemberAnimator(color.Color)
        ], MapPointView.prototype, "color", void 0);
        __decorate([
            view.MemberAnimator(Number)
        ], MapPointView.prototype, "opacity", void 0);
        __decorate([
            view.MemberAnimator(length.Length)
        ], MapPointView.prototype, "labelPadding", void 0);
        __decorate([
            view.MemberAnimator(font.Font, { inherit: true })
        ], MapPointView.prototype, "font", void 0);
        __decorate([
            view.MemberAnimator(color.Color, { inherit: true })
        ], MapPointView.prototype, "textColor", void 0);
        return MapPointView;
    }(MapGraphicsView));

    var MapCircleView = (function (_super) {
        __extends(MapCircleView, _super);
        function MapCircleView() {
            var _this = _super.call(this) || this;
            _this._geoBounds = GeoBox.empty();
            _this.geoCenter.onUpdate = _this.onSetGeoCenter.bind(_this);
            return _this;
        }
        Object.defineProperty(MapCircleView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        MapCircleView.prototype.hitRadius = function (hitRadius) {
            if (hitRadius === void 0) {
                return this._hitRadius !== void 0 ? this._hitRadius : null;
            }
            else {
                if (hitRadius !== null) {
                    this._hitRadius = hitRadius;
                }
                else if (this._hitRadius !== void 0) {
                    this._hitRadius = void 0;
                }
                return this;
            }
        };
        MapCircleView.prototype.onSetGeoCenter = function (newGeoCenter, oldGeoCenter) {
            if (newGeoCenter !== void 0) {
                var oldGeoBounds = this._geoBounds;
                var newGeoBounds = new GeoBox(newGeoCenter._lng, newGeoCenter._lat, newGeoCenter._lng, newGeoCenter._lat);
                this._geoBounds = newGeoBounds;
                this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
            }
            this.requireUpdate(view.View.NeedsProject);
        };
        MapCircleView.prototype.onProject = function (viewContext) {
            _super.prototype.onProject.call(this, viewContext);
            var viewCenter;
            if (this.viewCenter.isAuto()) {
                var geoProjection = viewContext.geoProjection;
                viewCenter = geoProjection.project(this.geoCenter.value);
                this.viewCenter.setAutoState(viewCenter);
            }
            else {
                viewCenter = this.viewCenter.value;
            }
            var frame = this.viewFrame;
            var size = Math.min(frame.width, frame.height);
            var radius = this.radius.value.pxValue(size);
            var invalid = !isFinite(viewCenter.x) || !isFinite(viewCenter.y) || !isFinite(radius);
            var culled = invalid || !frame.intersectsCircle(new math.CircleR2(viewCenter.x, viewCenter.y, radius));
            this.setCulled(culled);
        };
        MapCircleView.prototype.onRender = function (viewContext) {
            _super.prototype.onRender.call(this, viewContext);
            var renderer = viewContext.renderer;
            if (renderer instanceof render.CanvasRenderer && !this.isHidden() && !this.isCulled()) {
                var context = renderer.context;
                context.save();
                this.renderCircle(renderer.context, this.viewFrame);
                context.restore();
            }
        };
        MapCircleView.prototype.renderCircle = function (context, frame) {
            var size = Math.min(frame.width, frame.height);
            var viewCenter = this.viewCenter.value;
            var radius = this.radius.value.pxValue(size);
            context.beginPath();
            context.arc(viewCenter.x, viewCenter.y, radius, 0, 2 * Math.PI);
            var fill = this.fill.value;
            if (fill !== void 0) {
                context.fillStyle = fill.toString();
                context.fill();
            }
            var stroke = this.stroke.value;
            if (stroke !== void 0) {
                var strokeWidth = this.strokeWidth.value;
                if (strokeWidth !== void 0) {
                    context.lineWidth = strokeWidth.pxValue(size);
                }
                context.strokeStyle = stroke.toString();
                context.stroke();
            }
        };
        Object.defineProperty(MapCircleView.prototype, "popoverFrame", {
            get: function () {
                var frame = this.viewFrame;
                var size = Math.min(frame.width, frame.height);
                var inversePageTransform = this.pageTransform.inverse();
                var viewCenter = this.viewCenter.value;
                var _a = inversePageTransform.transform(viewCenter.x, viewCenter.y), px = _a[0], py = _a[1];
                var radius = this.radius.value.pxValue(size);
                return new math.BoxR2(px - radius, py - radius, px + radius, py + radius);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapCircleView.prototype, "viewBounds", {
            get: function () {
                var frame = this.viewFrame;
                var size = Math.min(frame.width, frame.height);
                var viewCenter = this.viewCenter.value;
                var radius = this.radius.value.pxValue(size);
                return new math.BoxR2(viewCenter.x - radius, viewCenter.y - radius, viewCenter.x + radius, viewCenter.y + radius);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapCircleView.prototype, "hitBounds", {
            get: function () {
                var frame = this.viewFrame;
                var size = Math.min(frame.width, frame.height);
                var viewCenter = this.viewCenter.value;
                var radius = this.radius.value.pxValue(size);
                var hitRadius = this._hitRadius !== void 0 ? Math.max(this._hitRadius, radius) : radius;
                return new math.BoxR2(viewCenter.x - hitRadius, viewCenter.y - hitRadius, viewCenter.x + hitRadius, viewCenter.y + hitRadius);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapCircleView.prototype, "geoBounds", {
            get: function () {
                return this._geoBounds;
            },
            enumerable: false,
            configurable: true
        });
        MapCircleView.prototype.hitTest = function (x, y, viewContext) {
            var hit = _super.prototype.hitTest.call(this, x, y, viewContext);
            if (hit === null) {
                var renderer = viewContext.renderer;
                if (renderer instanceof render.CanvasRenderer) {
                    var context = renderer.context;
                    hit = this.hitTestCircle(x, y, context, this.viewFrame, renderer.pixelRatio);
                }
            }
            return hit;
        };
        MapCircleView.prototype.hitTestCircle = function (x, y, context, frame, pixelRatio) {
            var size = Math.min(frame.width, frame.height);
            var viewCenter = this.viewCenter.value;
            var radius = this.radius.value.pxValue(size);
            if (this.fill.value !== void 0) {
                var hitRadius = this._hitRadius !== void 0 ? Math.max(this._hitRadius, radius) : radius;
                var dx = viewCenter.x - x;
                var dy = viewCenter.y - y;
                if (dx * dx + dy * dy < hitRadius * hitRadius) {
                    return this;
                }
            }
            var strokeWidth = this.strokeWidth.value;
            if (this.stroke.value !== void 0 && strokeWidth !== void 0) {
                x *= pixelRatio;
                y *= pixelRatio;
                context.save();
                context.beginPath();
                context.arc(viewCenter.x, viewCenter.y, radius, 0, 2 * Math.PI);
                context.lineWidth = strokeWidth.pxValue(size);
                if (context.isPointInStroke(x, y)) {
                    context.restore();
                    return this;
                }
                else {
                    context.restore();
                }
            }
            return null;
        };
        MapCircleView.fromAny = function (circle) {
            if (circle instanceof MapCircleView) {
                return circle;
            }
            else if (typeof circle === "object" && circle !== null) {
                var view = new MapCircleView();
                if (circle.geoCenter !== void 0) {
                    view.geoCenter(circle.geoCenter);
                }
                if (circle.viewCenter !== void 0) {
                    view.viewCenter(circle.viewCenter);
                }
                if (circle.radius !== void 0) {
                    view.radius(circle.radius);
                }
                if (circle.hitRadius !== void 0) {
                    view.hitRadius(circle.hitRadius);
                }
                if (circle.fill !== void 0) {
                    view.fill(circle.fill);
                }
                if (circle.stroke !== void 0) {
                    view.stroke(circle.stroke);
                }
                if (circle.strokeWidth !== void 0) {
                    view.strokeWidth(circle.strokeWidth);
                }
                if (circle.hidden !== void 0) {
                    view.setHidden(circle.hidden);
                }
                if (circle.culled !== void 0) {
                    view.setCulled(circle.culled);
                }
                return view;
            }
            throw new TypeError("" + circle);
        };
        __decorate([
            view.MemberAnimator(GeoPoint, { value: GeoPoint.origin() })
        ], MapCircleView.prototype, "geoCenter", void 0);
        __decorate([
            view.MemberAnimator(math.PointR2, { value: math.PointR2.origin() })
        ], MapCircleView.prototype, "viewCenter", void 0);
        __decorate([
            view.MemberAnimator(length.Length, { value: 0 })
        ], MapCircleView.prototype, "radius", void 0);
        __decorate([
            view.MemberAnimator(color.Color, { inherit: true })
        ], MapCircleView.prototype, "fill", void 0);
        __decorate([
            view.MemberAnimator(color.Color, { inherit: true })
        ], MapCircleView.prototype, "stroke", void 0);
        __decorate([
            view.MemberAnimator(length.Length, { inherit: true })
        ], MapCircleView.prototype, "strokeWidth", void 0);
        return MapCircleView;
    }(MapGraphicsView));

    var MapArcView = (function (_super) {
        __extends(MapArcView, _super);
        function MapArcView() {
            var _this = _super.call(this) || this;
            _this._geoBounds = GeoBox.empty();
            _this.geoCenter.onUpdate = _this.onSetGeoCenter.bind(_this);
            return _this;
        }
        Object.defineProperty(MapArcView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapArcView.prototype, "value", {
            get: function () {
                return new shape.Arc(this.viewCenter.value, this.innerRadius.value, this.outerRadius.value, this.startAngle.value, this.sweepAngle.value, this.padAngle.value, this.padRadius.value, this.cornerRadius.value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapArcView.prototype, "state", {
            get: function () {
                return new shape.Arc(this.viewCenter.state, this.innerRadius.state, this.outerRadius.state, this.startAngle.state, this.sweepAngle.state, this.padAngle.state, this.padRadius.state, this.cornerRadius.state);
            },
            enumerable: false,
            configurable: true
        });
        MapArcView.prototype.onSetGeoCenter = function (newGeoCenter, oldGeoCenter) {
            if (newGeoCenter !== void 0) {
                var oldGeoBounds = this._geoBounds;
                var newGeoBounds = new GeoBox(newGeoCenter._lng, newGeoCenter._lat, newGeoCenter._lng, newGeoCenter._lat);
                this._geoBounds = newGeoBounds;
                this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
            }
            this.requireUpdate(view.View.NeedsProject);
        };
        MapArcView.prototype.onProject = function (viewContext) {
            _super.prototype.onProject.call(this, viewContext);
            var viewCenter;
            if (this.viewCenter.isAuto()) {
                var geoProjection = viewContext.geoProjection;
                viewCenter = geoProjection.project(this.geoCenter.value);
                this.viewCenter.setAutoState(viewCenter);
            }
            else {
                viewCenter = this.viewCenter.value;
            }
            var frame = this.viewFrame;
            var size = Math.min(frame.width, frame.height);
            var radius = this.outerRadius.value.pxValue(size);
            var invalid = !isFinite(viewCenter.x) || !isFinite(viewCenter.y) || !isFinite(radius);
            var culled = invalid || !frame.intersectsCircle(new math.CircleR2(viewCenter.x, viewCenter.y, radius));
            this.setCulled(culled);
        };
        MapArcView.prototype.onRender = function (viewContext) {
            _super.prototype.onRender.call(this, viewContext);
            var renderer = viewContext.renderer;
            if (renderer instanceof render.CanvasRenderer && !this.isHidden() && !this.isCulled()) {
                var context = renderer.context;
                context.save();
                this.renderArc(renderer.context, this.viewFrame);
                context.restore();
            }
        };
        MapArcView.prototype.renderArc = function (context, frame) {
            var arc = this.value;
            arc.draw(context, frame);
            var fill = this.fill.value;
            if (fill !== void 0) {
                context.fillStyle = fill.toString();
                context.fill();
            }
            var stroke = this.stroke.value;
            if (stroke !== void 0) {
                var strokeWidth = this.strokeWidth.value;
                if (strokeWidth !== void 0) {
                    var size = Math.min(frame.width, frame.height);
                    context.lineWidth = strokeWidth.pxValue(size);
                }
                context.strokeStyle = stroke.toString();
                context.stroke();
            }
        };
        Object.defineProperty(MapArcView.prototype, "popoverFrame", {
            get: function () {
                var frame = this.viewFrame;
                var size = Math.min(frame.width, frame.height);
                var inversePageTransform = this.pageTransform.inverse();
                var viewCenter = this.viewCenter.value;
                var _a = inversePageTransform.transform(viewCenter.x, viewCenter.y), px = _a[0], py = _a[1];
                var r = (this.innerRadius.value.pxValue(size) + this.outerRadius.value.pxValue(size)) / 2;
                var a = this.startAngle.value.radValue() + this.sweepAngle.value.radValue() / 2;
                var x = px + r * Math.cos(a);
                var y = py + r * Math.sin(a);
                return new math.BoxR2(x, y, x, y);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapArcView.prototype, "viewBounds", {
            get: function () {
                var frame = this.viewFrame;
                var size = Math.min(frame.width, frame.height);
                var viewCenter = this.viewCenter.value;
                var radius = this.outerRadius.value.pxValue(size);
                return new math.BoxR2(viewCenter.x - radius, viewCenter.y - radius, viewCenter.x + radius, viewCenter.y + radius);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapArcView.prototype, "hitBounds", {
            get: function () {
                return this.viewBounds;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapArcView.prototype, "geoBounds", {
            get: function () {
                return this._geoBounds;
            },
            enumerable: false,
            configurable: true
        });
        MapArcView.prototype.hitTest = function (x, y, viewContext) {
            var hit = _super.prototype.hitTest.call(this, x, y, viewContext);
            if (hit === null) {
                var renderer = viewContext.renderer;
                if (renderer instanceof render.CanvasRenderer) {
                    var context = renderer.context;
                    context.save();
                    x *= renderer.pixelRatio;
                    y *= renderer.pixelRatio;
                    hit = this.hitTestArc(x, y, context, this.viewFrame);
                    context.restore();
                }
            }
            return hit;
        };
        MapArcView.prototype.hitTestArc = function (x, y, context, frame) {
            context.beginPath();
            var arc = this.value;
            arc.draw(context, frame);
            if (this.fill.value !== void 0 && context.isPointInPath(x, y)) {
                return this;
            }
            else if (this.stroke.value !== void 0) {
                var strokeWidth = this.strokeWidth.value;
                if (strokeWidth !== void 0) {
                    var size = Math.min(frame.width, frame.height);
                    context.lineWidth = strokeWidth.pxValue(size);
                    if (context.isPointInStroke(x, y)) {
                        return this;
                    }
                }
            }
            return null;
        };
        MapArcView.fromAny = function (arc) {
            if (arc instanceof MapArcView) {
                return arc;
            }
            else if (typeof arc === "object" && arc !== null) {
                var view = new MapArcView();
                if (arc.geoCenter !== void 0) {
                    view.geoCenter(arc.geoCenter);
                }
                if (arc.viewCenter !== void 0) {
                    view.viewCenter(arc.viewCenter);
                }
                if (arc.innerRadius !== void 0) {
                    view.innerRadius(arc.innerRadius);
                }
                if (arc.outerRadius !== void 0) {
                    view.outerRadius(arc.outerRadius);
                }
                if (arc.startAngle !== void 0) {
                    view.startAngle(arc.startAngle);
                }
                if (arc.sweepAngle !== void 0) {
                    view.sweepAngle(arc.sweepAngle);
                }
                if (arc.padAngle !== void 0) {
                    view.padAngle(arc.padAngle);
                }
                if (arc.padRadius !== void 0) {
                    view.padRadius(arc.padRadius);
                }
                if (arc.cornerRadius !== void 0) {
                    view.cornerRadius(arc.cornerRadius);
                }
                if (arc.fill !== void 0) {
                    view.fill(arc.fill);
                }
                if (arc.stroke !== void 0) {
                    view.stroke(arc.stroke);
                }
                if (arc.strokeWidth !== void 0) {
                    view.strokeWidth(arc.strokeWidth);
                }
                if (arc.hidden !== void 0) {
                    view.setHidden(arc.hidden);
                }
                if (arc.culled !== void 0) {
                    view.setCulled(arc.culled);
                }
                return view;
            }
            throw new TypeError("" + arc);
        };
        __decorate([
            view.MemberAnimator(GeoPoint, { value: GeoPoint.origin() })
        ], MapArcView.prototype, "geoCenter", void 0);
        __decorate([
            view.MemberAnimator(math.PointR2, { value: math.PointR2.origin() })
        ], MapArcView.prototype, "viewCenter", void 0);
        __decorate([
            view.MemberAnimator(length.Length, { value: length.Length.zero() })
        ], MapArcView.prototype, "innerRadius", void 0);
        __decorate([
            view.MemberAnimator(length.Length, { value: length.Length.zero() })
        ], MapArcView.prototype, "outerRadius", void 0);
        __decorate([
            view.MemberAnimator(angle.Angle, { value: angle.Angle.zero() })
        ], MapArcView.prototype, "startAngle", void 0);
        __decorate([
            view.MemberAnimator(angle.Angle, { value: angle.Angle.zero() })
        ], MapArcView.prototype, "sweepAngle", void 0);
        __decorate([
            view.MemberAnimator(angle.Angle, { value: angle.Angle.zero() })
        ], MapArcView.prototype, "padAngle", void 0);
        __decorate([
            view.MemberAnimator(length.Length, { value: null })
        ], MapArcView.prototype, "padRadius", void 0);
        __decorate([
            view.MemberAnimator(length.Length, { value: length.Length.zero() })
        ], MapArcView.prototype, "cornerRadius", void 0);
        __decorate([
            view.MemberAnimator(color.Color, { inherit: true })
        ], MapArcView.prototype, "fill", void 0);
        __decorate([
            view.MemberAnimator(color.Color, { inherit: true })
        ], MapArcView.prototype, "stroke", void 0);
        __decorate([
            view.MemberAnimator(length.Length, { inherit: true })
        ], MapArcView.prototype, "strokeWidth", void 0);
        return MapArcView;
    }(MapGraphicsView));

    var MapLineView = (function (_super) {
        __extends(MapLineView, _super);
        function MapLineView() {
            var _this = _super.call(this) || this;
            _this._geoBounds = GeoBox.empty();
            _this.geoStart.onUpdate = _this.onSetGeoStart.bind(_this);
            _this.geoEnd.onUpdate = _this.onSetGeoEnd.bind(_this);
            return _this;
        }
        Object.defineProperty(MapLineView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        MapLineView.prototype.hitWidth = function (hitWidth) {
            if (hitWidth === void 0) {
                return this._hitWidth !== void 0 ? this._hitWidth : null;
            }
            else {
                if (hitWidth !== null) {
                    this._hitWidth = hitWidth;
                }
                else if (this._hitWidth !== void 0) {
                    this._hitWidth = void 0;
                }
                return this;
            }
        };
        MapLineView.prototype.onSetGeoStart = function (newGeoStart, oldGeoStart) {
            var newGeoEnd = this.geoEnd.value;
            if (newGeoStart !== void 0 && newGeoEnd !== void 0) {
                var oldGeoBounds = this._geoBounds;
                var newGeoBounds = new GeoBox(Math.min(newGeoStart.lng, newGeoEnd.lng), Math.min(newGeoStart.lat, newGeoEnd.lat), Math.max(newGeoStart.lng, newGeoEnd.lng), Math.max(newGeoStart.lat, newGeoEnd.lat));
                this._geoBounds = newGeoBounds;
                this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
            }
            this.requireUpdate(view.View.NeedsProject);
        };
        MapLineView.prototype.onSetGeoEnd = function (newGeoEnd, oldGeoEnd) {
            var newGeoStart = this.geoEnd.value;
            if (newGeoStart !== void 0 && newGeoEnd !== void 0) {
                var oldGeoBounds = this._geoBounds;
                var newGeoBounds = new GeoBox(Math.min(newGeoStart.lng, newGeoEnd.lng), Math.min(newGeoStart.lat, newGeoEnd.lat), Math.max(newGeoStart.lng, newGeoEnd.lng), Math.max(newGeoStart.lat, newGeoEnd.lat));
                this._geoBounds = newGeoBounds;
                this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
            }
            this.requireUpdate(view.View.NeedsProject);
        };
        MapLineView.prototype.onProject = function (viewContext) {
            _super.prototype.onProject.call(this, viewContext);
            var geoProjection = viewContext.geoProjection;
            var viewStart;
            var viewEnd;
            if (this.viewStart.isAuto()) {
                viewStart = geoProjection.project(this.geoStart.value);
                this.viewStart.setAutoState(viewStart);
            }
            else {
                viewStart = this.viewStart.value;
            }
            if (this.viewEnd.isAuto()) {
                viewEnd = geoProjection.project(this.geoEnd.value);
                this.viewEnd.setAutoState(viewEnd);
            }
            else {
                viewEnd = this.viewEnd.value;
            }
            var x0 = viewStart.x;
            var y0 = viewStart.y;
            var x1 = viewEnd.x;
            var y1 = viewEnd.y;
            var invalid = !isFinite(x0) || isFinite(y0) || !isFinite(x1) || !isFinite(y1);
            var culled = invalid || !this.viewFrame.intersectsSegment(new math.SegmentR2(x0, y0, x1, y1));
            this.setCulled(culled);
        };
        MapLineView.prototype.onRender = function (viewContext) {
            _super.prototype.onRender.call(this, viewContext);
            var renderer = viewContext.renderer;
            if (renderer instanceof render.CanvasRenderer && !this.isHidden() && !this.isCulled()) {
                var context = renderer.context;
                context.save();
                this.renderLine(context, this.viewFrame);
                context.restore();
            }
        };
        MapLineView.prototype.renderLine = function (context, frame) {
            var stroke = this.stroke.value;
            if (stroke !== void 0) {
                var strokeWidth = this.strokeWidth.value;
                if (strokeWidth !== void 0) {
                    var size = Math.min(frame.width, frame.height);
                    var viewStart = this.viewStart.value;
                    var viewEnd = this.viewEnd.value;
                    context.beginPath();
                    context.moveTo(viewStart.x, viewStart.y);
                    context.lineTo(viewEnd.x, viewEnd.y);
                    context.lineWidth = strokeWidth.pxValue(size);
                    context.strokeStyle = stroke.toString();
                    context.stroke();
                }
            }
        };
        Object.defineProperty(MapLineView.prototype, "popoverFrame", {
            get: function () {
                var viewStart = this.viewStart.value;
                var viewEnd = this.viewEnd.value;
                var xMid = (viewStart.x + viewEnd.x) / 2;
                var yMid = (viewStart.y + viewEnd.y) / 2;
                var inversePageTransform = this.pageTransform.inverse();
                var _a = inversePageTransform.transform(xMid, yMid), px = _a[0], py = _a[1];
                return new math.BoxR2(px, py, px, py);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLineView.prototype, "viewBounds", {
            get: function () {
                var viewStart = this.viewStart.value;
                var x0 = viewStart.x;
                var y0 = viewStart.y;
                var viewEnd = this.viewEnd.value;
                var x1 = viewEnd.x;
                var y1 = viewEnd.y;
                return new math.BoxR2(Math.min(x0, x1), Math.min(y0, y1), Math.max(x0, x1), Math.max(y0, y1));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLineView.prototype, "hitBounds", {
            get: function () {
                return this.viewBounds;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapLineView.prototype, "geoBounds", {
            get: function () {
                return this._geoBounds;
            },
            enumerable: false,
            configurable: true
        });
        MapLineView.prototype.hitTest = function (x, y, viewContext) {
            var hit = _super.prototype.hitTest.call(this, x, y, viewContext);
            if (hit === null) {
                var renderer = viewContext.renderer;
                if (renderer instanceof render.CanvasRenderer) {
                    var context = renderer.context;
                    context.save();
                    x *= renderer.pixelRatio;
                    y *= renderer.pixelRatio;
                    hit = this.hitTestLine(x, y, context, this.viewFrame);
                    context.restore();
                }
            }
            return hit;
        };
        MapLineView.prototype.hitTestLine = function (x, y, context, frame) {
            var viewStart = this.viewStart.value;
            var viewEnd = this.viewEnd.value;
            var hitWidth = this._hitWidth !== void 0 ? this._hitWidth : 0;
            var strokeWidth = this.strokeWidth.value;
            if (strokeWidth !== void 0) {
                var size = Math.min(frame.width, frame.height);
                hitWidth = Math.max(hitWidth, strokeWidth.pxValue(size));
            }
            context.beginPath();
            context.moveTo(viewStart.x, viewStart.y);
            context.lineTo(viewEnd.x, viewEnd.y);
            context.lineWidth = hitWidth;
            if (context.isPointInStroke(x, y)) {
                return this;
            }
            return null;
        };
        MapLineView.fromAny = function (line) {
            if (line instanceof MapLineView) {
                return line;
            }
            else if (typeof line === "object" && line !== null) {
                var view = new MapLineView();
                if (line.geoStart !== void 0) {
                    view.geoStart(line.geoStart);
                }
                if (line.geoEnd !== void 0) {
                    view.geoEnd(line.geoEnd);
                }
                if (line.stroke !== void 0) {
                    view.stroke(line.stroke);
                }
                if (line.strokeWidth !== void 0) {
                    view.strokeWidth(line.strokeWidth);
                }
                if (line.hitWidth !== void 0) {
                    view.hitWidth(line.hitWidth);
                }
                if (line.hidden !== void 0) {
                    view.setHidden(line.hidden);
                }
                if (line.culled !== void 0) {
                    view.setCulled(line.culled);
                }
                return view;
            }
            throw new TypeError("" + line);
        };
        __decorate([
            view.MemberAnimator(GeoPoint, { value: GeoPoint.origin() })
        ], MapLineView.prototype, "geoStart", void 0);
        __decorate([
            view.MemberAnimator(GeoPoint, { value: GeoPoint.origin() })
        ], MapLineView.prototype, "geoEnd", void 0);
        __decorate([
            view.MemberAnimator(math.PointR2, { value: math.PointR2.origin() })
        ], MapLineView.prototype, "viewStart", void 0);
        __decorate([
            view.MemberAnimator(math.PointR2, { value: math.PointR2.origin() })
        ], MapLineView.prototype, "viewEnd", void 0);
        __decorate([
            view.MemberAnimator(color.Color, { inherit: true })
        ], MapLineView.prototype, "stroke", void 0);
        __decorate([
            view.MemberAnimator(length.Length, { inherit: true })
        ], MapLineView.prototype, "strokeWidth", void 0);
        return MapLineView;
    }(MapGraphicsView));

    var MapPolylineView = (function (_super) {
        __extends(MapPolylineView, _super);
        function MapPolylineView() {
            var _this = _super.call(this) || this;
            _this._geoCenter = GeoPoint.origin();
            _this._viewCenter = math.PointR2.origin();
            _this._gradientStops = 0;
            _this._viewBounds = math.BoxR2.empty();
            _this._geoBounds = GeoBox.empty();
            return _this;
        }
        Object.defineProperty(MapPolylineView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        MapPolylineView.prototype.points = function (points, tween) {
            var childViews = this._childViews;
            if (points === void 0) {
                points = [];
                for (var i = 0; i < childViews.length; i += 1) {
                    var childView = childViews[i];
                    if (childView instanceof MapPointView) {
                        points.push(childView);
                    }
                }
                return points;
            }
            else {
                var oldGeoBounds = this._geoBounds;
                var lngMin = Infinity;
                var latMin = Infinity;
                var lngMax = -Infinity;
                var latMax = -Infinity;
                var lngMid = 0;
                var latMid = 0;
                var invalid = false;
                var i = 0;
                var j = 0;
                while (i < childViews.length && j < points.length) {
                    var childView = childViews[i];
                    if (childView instanceof MapPointView) {
                        var point = points[j];
                        childView.setState(point);
                        var _a = childView.geoPoint.value, lng = _a.lng, lat = _a.lat;
                        lngMid += lng;
                        latMid += lat;
                        lngMin = Math.min(lngMin, lng);
                        latMin = Math.min(latMin, lat);
                        lngMax = Math.max(lng, lngMax);
                        latMax = Math.max(lat, latMax);
                        invalid = invalid || !isFinite(lng) || !isFinite(lat);
                        j += 1;
                    }
                    i += 1;
                }
                while (j < points.length) {
                    var point = MapPointView.fromAny(points[j]);
                    this.appendChildView(point);
                    var _b = point.geoPoint.value, lng = _b.lng, lat = _b.lat;
                    lngMid += lng;
                    latMid += lat;
                    lngMin = Math.min(lngMin, lng);
                    latMin = Math.min(latMin, lat);
                    lngMax = Math.max(lng, lngMax);
                    latMax = Math.max(lat, latMax);
                    invalid = invalid || !isFinite(lng) || !isFinite(lat);
                    i += 1;
                    j += 1;
                }
                while (i < childViews.length) {
                    var childView = childViews[i];
                    if (childView instanceof MapPointView) {
                        this.removeChildView(childView);
                    }
                    else {
                        i += 1;
                    }
                }
                if (!invalid && j !== 0) {
                    lngMid /= j;
                    latMid /= j;
                    this._geoCenter = new GeoPoint(lngMid, latMid);
                    this._geoBounds = new GeoBox(lngMin, latMin, lngMax, latMax);
                }
                else {
                    this._geoCenter = GeoPoint.origin();
                    this._geoBounds = GeoBox.empty();
                }
                var newGeoBounds = this._geoBounds;
                if (!oldGeoBounds.equals(newGeoBounds)) {
                    this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
                }
                return this;
            }
        };
        MapPolylineView.prototype.appendPoint = function (point, key) {
            point = MapPointView.fromAny(point);
            this.appendChildView(point, key);
            return point;
        };
        MapPolylineView.prototype.setPoint = function (key, point) {
            point = MapPointView.fromAny(point);
            this.setChildView(key, point);
            return point;
        };
        Object.defineProperty(MapPolylineView.prototype, "geoCenter", {
            get: function () {
                return this._geoCenter;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPolylineView.prototype, "viewCenter", {
            get: function () {
                return this._viewCenter;
            },
            enumerable: false,
            configurable: true
        });
        MapPolylineView.prototype.hitWidth = function (hitWidth) {
            if (hitWidth === void 0) {
                return this._hitWidth !== void 0 ? this._hitWidth : null;
            }
            else {
                if (hitWidth !== null) {
                    this._hitWidth = hitWidth;
                }
                else if (this._hitWidth !== void 0) {
                    this._hitWidth = void 0;
                }
                return this;
            }
        };
        MapPolylineView.prototype.onInsertChildView = function (childView, targetView) {
            _super.prototype.onInsertChildView.call(this, childView, targetView);
            if (childView instanceof MapPointView) {
                this.onInsertPoint(childView);
            }
        };
        MapPolylineView.prototype.onInsertPoint = function (childView) {
            childView.requireUpdate(view.View.NeedsAnimate | view.View.NeedsProject);
        };
        MapPolylineView.prototype.didProject = function (viewContext) {
            var oldGeoBounds = this._geoBounds;
            var lngMin = Infinity;
            var latMin = Infinity;
            var lngMax = -Infinity;
            var latMax = -Infinity;
            var lngMid = 0;
            var latMid = 0;
            var xMin = Infinity;
            var yMin = Infinity;
            var xMax = -Infinity;
            var yMax = -Infinity;
            var xMid = 0;
            var yMid = 0;
            var invalid = false;
            var gradientStops = 0;
            var pointCount = 0;
            var childViews = this._childViews;
            for (var i = 0; i < childViews.length; i += 1) {
                var childView = childViews[i];
                if (childView instanceof MapPointView) {
                    var _a = childView.geoPoint.value, lng = _a.lng, lat = _a.lat;
                    lngMid += lng;
                    latMid += lat;
                    lngMin = Math.min(lngMin, lng);
                    latMin = Math.min(latMin, lat);
                    lngMax = Math.max(lng, lngMax);
                    latMax = Math.max(lat, latMax);
                    invalid = invalid || !isFinite(lng) || !isFinite(lat);
                    var _b = childView.viewPoint.value, x = _b.x, y = _b.y;
                    xMin = Math.min(xMin, x);
                    yMin = Math.min(yMin, y);
                    xMax = Math.max(x, xMax);
                    yMax = Math.max(y, yMax);
                    xMid += x;
                    yMid += x;
                    invalid = invalid || !isFinite(x) || !isFinite(y);
                    if (childView.isGradientStop()) {
                        gradientStops += 1;
                    }
                    pointCount += 1;
                }
            }
            if (!invalid && pointCount !== 0) {
                lngMid /= pointCount;
                latMid /= pointCount;
                this._geoCenter = new GeoPoint(lngMid, latMid);
                this._geoBounds = new GeoBox(lngMin, latMin, lngMax, latMax);
                xMid /= pointCount;
                yMid /= pointCount;
                this._viewCenter = new math.PointR2(xMid, yMid);
                this._viewBounds = new math.BoxR2(xMin, yMin, xMax, yMax);
                this.cullGeoFrame(viewContext.geoFrame);
            }
            else {
                this._geoCenter = GeoPoint.origin();
                this._geoBounds = GeoBox.empty();
                this._viewCenter = math.PointR2.origin();
                this._viewBounds = math.BoxR2.empty();
                this.setCulled(true);
            }
            this._gradientStops = gradientStops;
            var newGeoBounds = this._geoBounds;
            if (!oldGeoBounds.equals(newGeoBounds)) {
                this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
            }
            _super.prototype.didProject.call(this, viewContext);
        };
        MapPolylineView.prototype.onRender = function (viewContext) {
            _super.prototype.onRender.call(this, viewContext);
            var renderer = viewContext.renderer;
            if (renderer instanceof render.CanvasRenderer && !this.isHidden() && !this.isCulled()) {
                var context = renderer.context;
                context.save();
                if (this._gradientStops !== 0) {
                    this.renderPolylineGradient(context, this.viewFrame);
                }
                else {
                    this.renderPolylineStroke(context, this.viewFrame);
                }
                context.restore();
            }
        };
        MapPolylineView.prototype.renderPolylineStroke = function (context, frame) {
            var childViews = this._childViews;
            var childCount = childViews.length;
            var pointCount = 0;
            context.beginPath();
            for (var i = 0; i < childCount; i += 1) {
                var childView = childViews[i];
                if (childView instanceof MapPointView) {
                    var _a = childView.viewPoint.value, x = _a.x, y = _a.y;
                    if (pointCount === 0) {
                        context.moveTo(x, y);
                    }
                    else {
                        context.lineTo(x, y);
                    }
                    pointCount += 1;
                }
            }
            if (pointCount !== 0) {
                var stroke = this.stroke.value;
                if (stroke !== void 0) {
                    var size = Math.min(frame.width, frame.height);
                    var strokeWidth = this.strokeWidth.value.pxValue(size);
                    context.strokeStyle = stroke.toString();
                    context.lineWidth = strokeWidth;
                    context.stroke();
                }
            }
        };
        MapPolylineView.prototype.renderPolylineGradient = function (context, frame) {
            var stroke = this.stroke.value;
            var size = Math.min(frame.width, frame.height);
            var strokeWidth = this.strokeWidth.value.pxValue(size);
            var childViews = this._childViews;
            var childCount = childViews.length;
            var p0;
            for (var i = 0; i < childCount; i += 1) {
                var p1 = childViews[i];
                if (p1 instanceof MapPointView) {
                    if (p0 !== void 0) {
                        var x0 = p0.viewPoint.value.x;
                        var y0 = p0.viewPoint.value.y;
                        var x1 = p1.viewPoint.value.x;
                        var y1 = p1.viewPoint.value.y;
                        var gradient = context.createLinearGradient(x0, y0, x1, y1);
                        var color = p0.color.value;
                        if (color === void 0) {
                            color = stroke;
                        }
                        var opacity = p0.opacity.value;
                        if (typeof opacity === "number") {
                            color = color.alpha(opacity);
                        }
                        gradient.addColorStop(0, color.toString());
                        color = p1.color.value;
                        if (color === void 0) {
                            color = stroke;
                        }
                        opacity = p1.opacity.value;
                        if (typeof opacity === "number") {
                            color = color.alpha(opacity);
                        }
                        gradient.addColorStop(1, color.toString());
                        context.beginPath();
                        context.moveTo(x0, y0);
                        context.lineTo(x1, y1);
                        context.strokeStyle = gradient;
                        context.lineWidth = strokeWidth;
                        context.stroke();
                    }
                    p0 = p1;
                }
            }
        };
        Object.defineProperty(MapPolylineView.prototype, "popoverFrame", {
            get: function () {
                var viewCenter = this._viewCenter;
                var inversePageTransform = this.pageTransform.inverse();
                var _a = inversePageTransform.transform(viewCenter.x, viewCenter.y), px = _a[0], py = _a[1];
                return new math.BoxR2(px, py, px, py);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPolylineView.prototype, "viewBounds", {
            get: function () {
                return this._viewBounds;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPolylineView.prototype, "hitBounds", {
            get: function () {
                return this.viewBounds;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPolylineView.prototype, "geoBounds", {
            get: function () {
                return this._geoBounds;
            },
            enumerable: false,
            configurable: true
        });
        MapPolylineView.prototype.hitTest = function (x, y, viewContext) {
            var hit = _super.prototype.hitTest.call(this, x, y, viewContext);
            if (hit === null) {
                var renderer = viewContext.renderer;
                if (renderer instanceof render.CanvasRenderer) {
                    var context = renderer.context;
                    context.save();
                    x *= renderer.pixelRatio;
                    y *= renderer.pixelRatio;
                    hit = this.hitTestPolyline(x, y, context, this.viewFrame);
                    context.restore();
                }
            }
            return hit;
        };
        MapPolylineView.prototype.hitTestPolyline = function (x, y, context, frame) {
            var childViews = this._childViews;
            var childCount = childViews.length;
            var pointCount = 0;
            context.beginPath();
            for (var i = 0; i < childCount; i += 1) {
                var childView = this._childViews[i];
                if (childView instanceof MapPointView) {
                    var _a = childView.viewPoint.value, x_1 = _a.x, y_1 = _a.y;
                    if (i === 0) {
                        context.moveTo(x_1, y_1);
                    }
                    else {
                        context.lineTo(x_1, y_1);
                    }
                    pointCount += 1;
                }
            }
            if (pointCount !== 0) {
                var hitWidth = this._hitWidth !== void 0 ? this._hitWidth : 0;
                var strokeWidth = this.strokeWidth.value;
                if (strokeWidth !== void 0) {
                    var size = Math.min(frame.width, frame.height);
                    hitWidth = Math.max(hitWidth, strokeWidth.pxValue(size));
                }
                context.lineWidth = hitWidth;
                if (context.isPointInStroke(x, y)) {
                    return this;
                }
            }
            return null;
        };
        MapPolylineView.fromAny = function (polyline) {
            if (polyline instanceof MapPolylineView) {
                return polyline;
            }
            else if (typeof polyline === "object" && polyline !== null) {
                var view = new MapPolylineView();
                if (polyline.stroke !== void 0) {
                    view.stroke(polyline.stroke);
                }
                if (polyline.strokeWidth !== void 0) {
                    view.strokeWidth(polyline.strokeWidth);
                }
                if (polyline.hitWidth !== void 0) {
                    view.hitWidth(polyline.hitWidth);
                }
                if (polyline.font !== void 0) {
                    view.font(polyline.font);
                }
                if (polyline.textColor !== void 0) {
                    view.textColor(polyline.textColor);
                }
                var points = polyline.points;
                if (points !== void 0) {
                    view.points(points);
                }
                if (polyline.hidden !== void 0) {
                    view.setHidden(polyline.hidden);
                }
                if (polyline.culled !== void 0) {
                    view.setCulled(polyline.culled);
                }
                return view;
            }
            throw new TypeError("" + polyline);
        };
        __decorate([
            view.MemberAnimator(color.Color, { inherit: true })
        ], MapPolylineView.prototype, "stroke", void 0);
        __decorate([
            view.MemberAnimator(length.Length, { inherit: true })
        ], MapPolylineView.prototype, "strokeWidth", void 0);
        __decorate([
            view.MemberAnimator(font.Font, { inherit: true })
        ], MapPolylineView.prototype, "font", void 0);
        __decorate([
            view.MemberAnimator(color.Color, { inherit: true })
        ], MapPolylineView.prototype, "textColor", void 0);
        return MapPolylineView;
    }(MapGraphicsView));

    var MapPolygonView = (function (_super) {
        __extends(MapPolygonView, _super);
        function MapPolygonView() {
            var _this = _super.call(this) || this;
            _this._geoCenter = GeoPoint.origin();
            _this._viewCenter = math.PointR2.origin();
            _this._clipViewport = true;
            _this._viewBounds = math.BoxR2.empty();
            _this._geoBounds = GeoBox.empty();
            return _this;
        }
        Object.defineProperty(MapPolygonView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        MapPolygonView.prototype.points = function (points, tween) {
            var childViews = this._childViews;
            if (points === void 0) {
                points = [];
                for (var i = 0; i < childViews.length; i += 1) {
                    var childView = childViews[i];
                    if (childView instanceof MapPointView) {
                        points.push(childView);
                    }
                }
                return points;
            }
            else {
                var oldGeoBounds = this._geoBounds;
                var lngMin = Infinity;
                var latMin = Infinity;
                var lngMax = -Infinity;
                var latMax = -Infinity;
                var lngMid = 0;
                var latMid = 0;
                var invalid = false;
                var i = 0;
                var j = 0;
                while (i < childViews.length && j < points.length) {
                    var childView = childViews[i];
                    if (childView instanceof MapPointView) {
                        var point = points[j];
                        childView.setState(point);
                        var _a = childView.geoPoint.value, lng = _a.lng, lat = _a.lat;
                        lngMid += lng;
                        latMid += lat;
                        lngMin = Math.min(lngMin, lng);
                        latMin = Math.min(latMin, lat);
                        lngMax = Math.max(lng, lngMax);
                        latMax = Math.max(lat, latMax);
                        invalid = invalid || !isFinite(lng) || !isFinite(lat);
                        j += 1;
                    }
                    i += 1;
                }
                while (j < points.length) {
                    var point = MapPointView.fromAny(points[j]);
                    this.appendChildView(point);
                    var _b = point.geoPoint.value, lng = _b.lng, lat = _b.lat;
                    lngMid += lng;
                    latMid += lat;
                    lngMin = Math.min(lngMin, lng);
                    latMin = Math.min(latMin, lat);
                    lngMax = Math.max(lng, lngMax);
                    latMax = Math.max(lat, latMax);
                    invalid = invalid || !isFinite(lng) || !isFinite(lat);
                    i += 1;
                    j += 1;
                }
                while (i < childViews.length) {
                    var childView = childViews[i];
                    if (childView instanceof MapPointView) {
                        this.removeChildView(childView);
                    }
                    else {
                        i += 1;
                    }
                }
                if (!invalid && j !== 0) {
                    lngMid /= j;
                    latMid /= j;
                    this._geoCenter = new GeoPoint(lngMid, latMid);
                    this._geoBounds = new GeoBox(lngMin, latMin, lngMax, latMax);
                }
                else {
                    this._geoCenter = GeoPoint.origin();
                    this._geoBounds = GeoBox.empty();
                }
                var newGeoBounds = this._geoBounds;
                if (!oldGeoBounds.equals(newGeoBounds)) {
                    this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
                }
                return this;
            }
        };
        MapPolygonView.prototype.appendPoint = function (point, key) {
            point = MapPointView.fromAny(point);
            this.appendChildView(point, key);
            return point;
        };
        MapPolygonView.prototype.setPoint = function (key, point) {
            point = MapPointView.fromAny(point);
            this.setChildView(key, point);
            return point;
        };
        MapPolygonView.prototype.clipViewport = function (clipViewport) {
            if (clipViewport === void 0) {
                return this._clipViewport;
            }
            else {
                this._clipViewport = clipViewport;
                return this;
            }
        };
        Object.defineProperty(MapPolygonView.prototype, "geoCenter", {
            get: function () {
                return this._geoCenter;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPolygonView.prototype, "viewCenter", {
            get: function () {
                return this._viewCenter;
            },
            enumerable: false,
            configurable: true
        });
        MapPolygonView.prototype.onInsertChildView = function (childView, targetView) {
            _super.prototype.onInsertChildView.call(this, childView, targetView);
            if (childView instanceof MapPointView) {
                this.onInsertPoint(childView);
            }
        };
        MapPolygonView.prototype.onInsertPoint = function (childView) {
            childView.requireUpdate(view.View.NeedsAnimate | view.View.NeedsProject);
        };
        MapPolygonView.prototype.didProject = function (viewContext) {
            var oldGeoBounds = this._geoBounds;
            var lngMin = Infinity;
            var latMin = Infinity;
            var lngMax = -Infinity;
            var latMax = -Infinity;
            var lngMid = 0;
            var latMid = 0;
            var xMin = Infinity;
            var yMin = Infinity;
            var xMax = -Infinity;
            var yMax = -Infinity;
            var xMid = 0;
            var yMid = 0;
            var invalid = false;
            var pointCount = 0;
            var childViews = this._childViews;
            for (var i = 0; i < childViews.length; i += 1) {
                var childView = childViews[i];
                if (childView instanceof MapPointView) {
                    var _a = childView.geoPoint.value, lng = _a.lng, lat = _a.lat;
                    lngMid += lng;
                    latMid += lat;
                    lngMin = Math.min(lngMin, lng);
                    latMin = Math.min(latMin, lat);
                    lngMax = Math.max(lng, lngMax);
                    latMax = Math.max(lat, latMax);
                    invalid = invalid || !isFinite(lng) || !isFinite(lat);
                    var _b = childView.viewPoint.value, x = _b.x, y = _b.y;
                    xMin = Math.min(xMin, x);
                    yMin = Math.min(yMin, y);
                    xMax = Math.max(x, xMax);
                    yMax = Math.max(y, yMax);
                    xMid += x;
                    yMid += x;
                    invalid = invalid || !isFinite(x) || !isFinite(y);
                    pointCount += 1;
                }
            }
            if (!invalid && pointCount !== 0) {
                lngMid /= pointCount;
                latMid /= pointCount;
                this._geoCenter = new GeoPoint(lngMid, latMid);
                this._geoBounds = new GeoBox(lngMin, latMin, lngMax, latMax);
                xMid /= pointCount;
                yMid /= pointCount;
                this._viewCenter = new math.PointR2(xMid, yMid);
                this._viewBounds = new math.BoxR2(xMin, yMin, xMax, yMax);
                if (viewContext.geoFrame.intersects(this._geoBounds)) {
                    var frame = this.viewFrame;
                    var bounds = this._viewBounds;
                    var contained = !this._clipViewport
                        || frame.xMin - 4 * frame.width <= bounds.xMin
                            && bounds.xMax <= frame.xMax + 4 * frame.width
                            && frame.yMin - 4 * frame.height <= bounds.yMin
                            && bounds.yMax <= frame.yMax + 4 * frame.height;
                    var culled = !contained || !frame.intersects(bounds);
                    this.setCulled(culled);
                }
                else {
                    this.setCulled(true);
                }
            }
            else {
                this._geoCenter = GeoPoint.origin();
                this._geoBounds = GeoBox.empty();
                this._viewCenter = math.PointR2.origin();
                this._viewBounds = math.BoxR2.empty();
                this.setCulled(true);
            }
            var newGeoBounds = this._geoBounds;
            if (!oldGeoBounds.equals(newGeoBounds)) {
                this.didSetGeoBounds(newGeoBounds, oldGeoBounds);
            }
            _super.prototype.didProject.call(this, viewContext);
        };
        MapPolygonView.prototype.onRender = function (viewContext) {
            _super.prototype.onRender.call(this, viewContext);
            var renderer = viewContext.renderer;
            if (renderer instanceof render.CanvasRenderer && !this.isHidden() && !this.isCulled()) {
                var context = renderer.context;
                context.save();
                this.renderPolygon(context, this.viewFrame);
                context.restore();
            }
        };
        MapPolygonView.prototype.renderPolygon = function (context, frame) {
            var childViews = this._childViews;
            var childCount = childViews.length;
            var pointCount = 0;
            context.beginPath();
            for (var i = 0; i < childCount; i += 1) {
                var childView = childViews[i];
                if (childView instanceof MapPointView) {
                    var _a = childView.viewPoint.value, x = _a.x, y = _a.y;
                    if (pointCount === 0) {
                        context.moveTo(x, y);
                    }
                    else {
                        context.lineTo(x, y);
                    }
                    pointCount += 1;
                }
            }
            context.closePath();
            if (pointCount !== 0) {
                var fill = this.fill.value;
                if (fill !== void 0) {
                    context.fillStyle = fill.toString();
                    context.fill();
                }
                var stroke = this.stroke.value;
                var strokeWidth = this.strokeWidth.value;
                if (stroke !== void 0 && strokeWidth !== void 0) {
                    var size = Math.min(frame.width, frame.height);
                    context.lineWidth = strokeWidth.pxValue(size);
                    context.strokeStyle = stroke.toString();
                    context.stroke();
                }
            }
        };
        Object.defineProperty(MapPolygonView.prototype, "popoverFrame", {
            get: function () {
                var viewCenter = this._viewCenter;
                var inversePageTransform = this.pageTransform.inverse();
                var _a = inversePageTransform.transform(viewCenter.x, viewCenter.y), px = _a[0], py = _a[1];
                return new math.BoxR2(px, py, px, py);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPolygonView.prototype, "viewBounds", {
            get: function () {
                return this._viewBounds;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPolygonView.prototype, "hitBounds", {
            get: function () {
                return this.viewBounds;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapPolygonView.prototype, "geoBounds", {
            get: function () {
                return this._geoBounds;
            },
            enumerable: false,
            configurable: true
        });
        MapPolygonView.prototype.hitTest = function (x, y, viewContext) {
            var hit = _super.prototype.hitTest.call(this, x, y, viewContext);
            if (hit === null) {
                var renderer = viewContext.renderer;
                if (renderer instanceof render.CanvasRenderer) {
                    var context = renderer.context;
                    context.save();
                    x *= renderer.pixelRatio;
                    y *= renderer.pixelRatio;
                    hit = this.hitTestPolygon(x, y, context, this.viewFrame);
                    context.restore();
                }
            }
            return hit;
        };
        MapPolygonView.prototype.hitTestPolygon = function (x, y, context, frame) {
            var childViews = this._childViews;
            var childCount = childViews.length;
            var pointCount = 0;
            context.beginPath();
            for (var i = 0; i < childCount; i += 1) {
                var childView = this._childViews[i];
                if (childView instanceof MapPointView) {
                    var _a = childView.viewPoint.value, x_1 = _a.x, y_1 = _a.y;
                    if (i === 0) {
                        context.moveTo(x_1, y_1);
                    }
                    else {
                        context.lineTo(x_1, y_1);
                    }
                    pointCount += 1;
                }
            }
            context.closePath();
            if (pointCount !== 0) {
                if (this.fill.value !== void 0 && context.isPointInPath(x, y)) {
                    return this;
                }
                if (this.stroke.value !== void 0) {
                    var strokeWidth = this.strokeWidth.value;
                    if (strokeWidth !== void 0) {
                        var size = Math.min(frame.width, frame.height);
                        context.lineWidth = strokeWidth.pxValue(size);
                        if (context.isPointInStroke(x, y)) {
                            return this;
                        }
                    }
                }
            }
            return null;
        };
        MapPolygonView.fromAny = function (polygon) {
            if (polygon instanceof MapPolygonView) {
                return polygon;
            }
            else if (typeof polygon === "object" && polygon !== null) {
                var view = new MapPolygonView();
                if (polygon.clipViewport !== void 0) {
                    view.clipViewport(polygon.clipViewport);
                }
                if (polygon.fill !== void 0) {
                    view.fill(polygon.fill);
                }
                if (polygon.stroke !== void 0) {
                    view.stroke(polygon.stroke);
                }
                if (polygon.strokeWidth !== void 0) {
                    view.strokeWidth(polygon.strokeWidth);
                }
                if (polygon.font !== void 0) {
                    view.font(polygon.font);
                }
                if (polygon.textColor !== void 0) {
                    view.textColor(polygon.textColor);
                }
                var points = polygon.points;
                if (points !== void 0) {
                    view.points(points);
                }
                if (polygon.hidden !== void 0) {
                    view.setHidden(polygon.hidden);
                }
                if (polygon.culled !== void 0) {
                    view.setCulled(polygon.culled);
                }
                return view;
            }
            throw new TypeError("" + polygon);
        };
        __decorate([
            view.MemberAnimator(color.Color, { inherit: true })
        ], MapPolygonView.prototype, "fill", void 0);
        __decorate([
            view.MemberAnimator(color.Color, { inherit: true })
        ], MapPolygonView.prototype, "stroke", void 0);
        __decorate([
            view.MemberAnimator(length.Length, { inherit: true })
        ], MapPolygonView.prototype, "strokeWidth", void 0);
        __decorate([
            view.MemberAnimator(font.Font, { inherit: true })
        ], MapPolygonView.prototype, "font", void 0);
        __decorate([
            view.MemberAnimator(color.Color, { inherit: true })
        ], MapPolygonView.prototype, "textColor", void 0);
        return MapPolygonView;
    }(MapGraphicsView));

    var MapboxProjection = (function () {
        function MapboxProjection(map) {
            this._map = map;
        }
        Object.defineProperty(MapboxProjection.prototype, "map", {
            get: function () {
                return this._map;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapboxProjection.prototype, "bounds", {
            get: function () {
                var bounds = this._map.getBounds();
                return new GeoBox(bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth());
            },
            enumerable: false,
            configurable: true
        });
        MapboxProjection.prototype.project = function (lng, lat) {
            var geoPoint;
            if (typeof lng === "number") {
                geoPoint = new mapboxgl.LngLat(lng, lat);
            }
            else {
                geoPoint = lng;
            }
            var point = this._map.project(geoPoint);
            return new math.PointR2(point.x, point.y);
        };
        MapboxProjection.prototype.unproject = function (x, y) {
            var viewPoint;
            if (typeof x === "number") {
                viewPoint = new mapboxgl.Point(x, y);
            }
            else if (Array.isArray(x)) {
                viewPoint = x;
            }
            else {
                viewPoint = new mapboxgl.Point(x.x, x.y);
            }
            var point = this._map.unproject(viewPoint);
            return new GeoPoint(point.lng, point.lat);
        };
        return MapboxProjection;
    }());

    var MapboxView = (function (_super) {
        __extends(MapboxView, _super);
        function MapboxView(map) {
            var _this = _super.call(this) || this;
            _this.onMapRender = _this.onMapRender.bind(_this);
            _this._map = map;
            _this._geoProjection = new MapboxProjection(_this._map);
            _this._mapZoom = map.getZoom();
            _this._mapHeading = map.getBearing();
            _this._mapTilt = map.getPitch();
            _this.initMap(_this._map);
            return _this;
        }
        Object.defineProperty(MapboxView.prototype, "map", {
            get: function () {
                return this._map;
            },
            enumerable: false,
            configurable: true
        });
        MapboxView.prototype.initMap = function (map) {
            map.on("render", this.onMapRender);
        };
        Object.defineProperty(MapboxView.prototype, "viewController", {
            get: function () {
                return this._viewController;
            },
            enumerable: false,
            configurable: true
        });
        MapboxView.prototype.project = function (lng, lat) {
            return this._geoProjection.project.apply(this._geoProjection, arguments);
        };
        MapboxView.prototype.unproject = function (x, y) {
            return this._geoProjection.unproject.apply(this._geoProjection, arguments);
        };
        Object.defineProperty(MapboxView.prototype, "geoProjection", {
            get: function () {
                return this._geoProjection;
            },
            enumerable: false,
            configurable: true
        });
        MapboxView.prototype.setGeoProjection = function (geoProjection) {
            this.willSetGeoProjection(geoProjection);
            this._geoProjection = geoProjection;
            this.onSetGeoProjection(geoProjection);
            this.didSetGeoProjection(geoProjection);
        };
        MapboxView.prototype.willSetGeoProjection = function (geoProjection) {
            this.willObserve(function (viewObserver) {
                if (viewObserver.viewWillSetGeoProjection !== void 0) {
                    viewObserver.viewWillSetGeoProjection(geoProjection, this);
                }
            });
        };
        MapboxView.prototype.onSetGeoProjection = function (geoProjection) {
            if (!this.isHidden() && !this.isCulled()) {
                this.requireUpdate(view.View.NeedsProject, true);
            }
        };
        MapboxView.prototype.didSetGeoProjection = function (geoProjection) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetGeoProjection !== void 0) {
                    viewObserver.viewDidSetGeoProjection(geoProjection, this);
                }
            });
        };
        Object.defineProperty(MapboxView.prototype, "mapZoom", {
            get: function () {
                return this._mapZoom;
            },
            enumerable: false,
            configurable: true
        });
        MapboxView.prototype.setMapZoom = function (newMapZoom) {
            var oldMapZoom = this._mapZoom;
            if (oldMapZoom !== newMapZoom) {
                this.willSetMapZoom(newMapZoom, oldMapZoom);
                this._mapZoom = newMapZoom;
                this.onSetMapZoom(newMapZoom, oldMapZoom);
                this.didSetMapZoom(newMapZoom, oldMapZoom);
            }
        };
        MapboxView.prototype.willSetMapZoom = function (newMapZoom, oldMapZoom) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewWillSetMapZoom !== void 0) {
                    viewObserver.viewWillSetMapZoom(newMapZoom, oldMapZoom, this);
                }
            });
        };
        MapboxView.prototype.onSetMapZoom = function (newZoom, oldZoom) {
        };
        MapboxView.prototype.didSetMapZoom = function (newZoom, oldZoom) {
            this.didObserve(function (viewObserver) {
                if (viewObserver.viewDidSetMapZoom !== void 0) {
                    viewObserver.viewDidSetMapZoom(newZoom, oldZoom, this);
                }
            });
        };
        Object.defineProperty(MapboxView.prototype, "mapHeading", {
            get: function () {
                return this._mapHeading;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(MapboxView.prototype, "mapTilt", {
            get: function () {
                return this._mapTilt;
            },
            enumerable: false,
            configurable: true
        });
        MapboxView.prototype.onPower = function () {
            _super.prototype.onPower.call(this);
            this.requireUpdate(view.View.NeedsProject);
        };
        MapboxView.prototype.cascadeProcess = function (processFlags, viewContext) {
            viewContext = this.mapViewContext(viewContext);
            _super.prototype.cascadeProcess.call(this, processFlags, viewContext);
        };
        MapboxView.prototype.cascadeDisplay = function (displayFlags, viewContext) {
            viewContext = this.mapViewContext(viewContext);
            _super.prototype.cascadeDisplay.call(this, displayFlags, viewContext);
        };
        MapboxView.prototype.childViewContext = function (childView, viewContext) {
            return viewContext;
        };
        MapboxView.prototype.mapViewContext = function (viewContext) {
            var mapViewContext = Object.create(viewContext);
            mapViewContext.geoProjection = this._geoProjection;
            mapViewContext.geoFrame = this.geoFrame;
            mapViewContext.mapZoom = this._mapZoom;
            mapViewContext.mapHeading = this._mapHeading;
            mapViewContext.mapTilt = this._mapTilt;
            return mapViewContext;
        };
        Object.defineProperty(MapboxView.prototype, "geoFrame", {
            get: function () {
                var bounds = this._map.getBounds();
                return new GeoBox(bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth());
            },
            enumerable: false,
            configurable: true
        });
        MapboxView.prototype.onMapRender = function () {
            this._mapHeading = this._map.getBearing();
            this._mapTilt = this._map.getPitch();
            this.setMapZoom(this._map.getZoom());
            this.setGeoProjection(this._geoProjection);
        };
        MapboxView.prototype.hitTest = function (x, y, viewContext) {
            viewContext = this.mapViewContext(viewContext);
            return _super.prototype.hitTest.call(this, x, y, viewContext);
        };
        MapboxView.prototype.overlayCanvas = function () {
            if (this._parentView !== null) {
                return this.canvasView;
            }
            else {
                var map = this._map;
                view.View.fromNode(map.getContainer());
                var canvasContainer = view.View.fromNode(map.getCanvasContainer());
                var canvas = canvasContainer.append("canvas");
                canvas.append(this);
                return canvas;
            }
        };
        return MapboxView;
    }(MapGraphicsView));

    var MapboxViewController = (function (_super) {
        __extends(MapboxViewController, _super);
        function MapboxViewController() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MapboxViewController.prototype.viewWillSetGeoProjection = function (geoProjection, view) {
        };
        MapboxViewController.prototype.viewDidSetGeoProjection = function (geoProjection, view) {
        };
        MapboxViewController.prototype.viewWillSetMapZoom = function (newMapZoom, oldMapZoom, view) {
        };
        MapboxViewController.prototype.viewDidSetMapZoom = function (newMapZoom, oldMapZoom, view) {
        };
        return MapboxViewController;
    }(MapGraphicsViewController));

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
                return new GeoBox(sw.lng(), sw.lat(), ne.lng(), ne.lat());
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
            return new GeoPoint(point.lng(), point.lat());
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
                return new GeoBox(sw.lng(), sw.lat(), ne.lng(), ne.lat());
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
    }(MapGraphicsView));

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
    }(MapGraphicsViewController));

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
    }(MapGraphicsView));

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
    }(MapGraphicsViewController));

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
                    return new GeoBox(extent.xmin, extent.ymin, extent.xmax, extent.ymax);
                }
                else {
                    return GeoBox.globe();
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
            return point !== null ? new GeoPoint(point.longitude, point.latitude) : GeoPoint.origin();
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
                    return new GeoBox(extent.xmin, extent.ymin, extent.xmax, extent.ymax);
                }
                else {
                    return GeoBox.globe();
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
                    return new GeoBox(extent.xmin, extent.ymin, extent.xmax, extent.ymax);
                }
                else {
                    return GeoBox.globe();
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
            return point !== null ? new GeoPoint(point.longitude, point.latitude) : GeoPoint.origin();
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
                    return new GeoBox(extent.xmin, extent.ymin, extent.xmax, extent.ymax);
                }
                else {
                    return GeoBox.globe();
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

    exports.CompositedMapView = CompositedMapView;
    exports.EsriMapView = EsriMapView;
    exports.EsriMapViewController = EsriMapViewController;
    exports.EsriMapViewProjection = EsriMapViewProjection;
    exports.EsriProjection = EsriProjection;
    exports.EsriSceneView = EsriSceneView;
    exports.EsriSceneViewController = EsriSceneViewController;
    exports.EsriSceneViewProjection = EsriSceneViewProjection;
    exports.EsriView = EsriView;
    exports.EsriViewController = EsriViewController;
    exports.GeoBox = GeoBox;
    exports.GeoPoint = GeoPoint;
    exports.GeoPointInterpolator = GeoPointInterpolator;
    exports.GeoProjection = GeoProjection;
    exports.GoogleMapProjection = GoogleMapProjection;
    exports.GoogleMapView = GoogleMapView;
    exports.GoogleMapViewController = GoogleMapViewController;
    exports.MapArcView = MapArcView;
    exports.MapCircleView = MapCircleView;
    exports.MapGraphicsView = MapGraphicsView;
    exports.MapGraphicsViewController = MapGraphicsViewController;
    exports.MapGroupView = MapGroupView;
    exports.MapLayerView = MapLayerView;
    exports.MapLayerViewController = MapLayerViewController;
    exports.MapLineView = MapLineView;
    exports.MapPointView = MapPointView;
    exports.MapPolygonView = MapPolygonView;
    exports.MapPolylineView = MapPolylineView;
    exports.MapRasterView = MapRasterView;
    exports.MapRasterViewController = MapRasterViewController;
    exports.MapTile = MapTile;
    exports.MapView = MapView;
    exports.MapboxProjection = MapboxProjection;
    exports.MapboxView = MapboxView;
    exports.MapboxViewController = MapboxViewController;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=swim-maps.js.map