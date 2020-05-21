package swim.cellular;

import swim.api.auth.Authenticator;
import swim.api.plane.AbstractPlane;
import swim.api.plane.PlaneContext;
import swim.api.policy.PlanePolicy;
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
    final PlaneContext plane = (PlaneContext) kernel.getSpace("cellular");

    // Instantiate a custom authenticator.
    final Authenticator authenticator = new CellularAuthenticator();
    plane.addAuthenticator("test", authenticator);

    // Initialize the access control policy.
    final PlanePolicy policy = new CellularPolicy(plane);
    plane.setPolicy(policy);

    // Boot the SwimOS kernel.
    kernel.start();
    System.out.println("Running CellularPlane ...");

    // Park the main thread while the application concurrently runs.
    kernel.run();
  }

}
