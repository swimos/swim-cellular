package swim.cellular;

import swim.api.plane.AbstractPlane;
import swim.api.space.Space;
import swim.kernel.Kernel;
import swim.server.ServerLoader;

/**
 * Entry point for the distributed application.  A Swim plane represents a
 * distributed application as a holistic unit.  Each server in a cluster
 * represents a &quot;point&quot; in the distributed application plane.
 */
public class CellularPlane extends AbstractPlane {

  public static void main(String[] args) {
    // Load the SwimOS kernel, loading its configuration from the
    // `server.recon` Java resource.
    final Kernel kernel = ServerLoader.loadServer();
    // Get a handle to the configured application plane.
    final Space space = kernel.getSpace("cellular");

    // Boot the SwimOS kernel.
    kernel.start();
    System.out.println("Running CellularPlane ...");

    // Park the main thread while the application concurrently runs.
    kernel.run();
  }

}
