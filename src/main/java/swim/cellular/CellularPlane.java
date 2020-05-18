package swim.cellular;

import swim.api.plane.AbstractPlane;
import swim.api.space.Space;
import swim.kernel.Kernel;
import swim.server.ServerLoader;

public class CellularPlane extends AbstractPlane {

  public static void main(String[] args) {
    final Kernel kernel = ServerLoader.loadServer();
    final Space space = kernel.getSpace("cellular");

    kernel.start();
    System.out.println("Running CellularPlane ...");

    kernel.run(); // blocks until termination
  }

}
