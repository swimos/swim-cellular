open module swim.cellular {
  requires transitive swim.api;
  requires swim.server;

  exports swim.cellular;

  provides swim.api.plane.Plane with swim.cellular.CellularPlane;
  provides swim.kernel.Kernel with swim.cellular.CellularUiRouter;
}
