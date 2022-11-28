// Copyright 2015-2022 Swim.inc
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
