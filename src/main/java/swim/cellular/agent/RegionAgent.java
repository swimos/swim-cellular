package swim.cellular.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.JoinValueLane;
import swim.api.lane.ValueLane;
import swim.cellular.CellularResources;
import swim.structure.Item;
import swim.structure.Value;
import swim.uri.Uri;

/**
 * A Web Agent that represents a geographic region, and participates in a
 * hierarchical tree of nested regions.
 *
 * Region agents can cohabitate in the same Swim Node as other specialized
 * agents.  For example, the Swim Node with URI {@code /country/US/state/CA}
 * might run both a region agent and a RAN agent.  Think of a Swim Node like
 * an ultra lightweight Docker container, addressed by a URI.  And think of
 * Web Agents like hyper-virtualized processes that run in that container.
 *
 * Continuing the analogy, you can think of a Swim Node as having its own
 * sandboxed file system.  The &quot;files&quot; in a Swim Node container
 * are called Swim Lanes.  Swim Lanes, like OS files, can store data, and
 * be used as communication channels.  But unlike OS files, Swim Lanes have
 * strong cache coherence semantics.
 *
 * A Swim Downlink is a cache coherent handle to particular Swim Lane of some
 * other Swim Node.  Think of a Swim Link kind of like an open file descriptor
 * that can be coherently accessed and modified by remote agents.
 *
 * Swim Downlinks expose a locally materialized view of the remote state of
 * the linked-to lane.  Think of this behavior as similar to how a CPU mirrors
 * a subset of main memory into its L1 cache, with an asynchronous cache
 * coherency protocol that keeps the local cache eventually consistent with
 * main memory (i.e. the remote state of the linked-to lane).
 */
public class RegionAgent extends AbstractAgent {

  /**
   * A structured &quot;file&quot; containing infrequently changing
   * information about this region.  This Swim Lane (&quot;file&quot;)
   * is coherently shared by other agents executing in the same Swim Node,
   * and by all clients downlinked to the lane.
   */
  @SwimLane("info")
  ValueLane<Value> info;

  /**
   * A structured value lane containing frequently changing status information.
   */
  @SwimLane("status")
  ValueLane<Value> status;

  /**
   * A Geo-JSON compatible feature representing the geometry of this region.
   */
  @SwimLane("geometry")
  ValueLane<Value> geometry;

  /**
   * A key-value map representing the <b>live</b> status of all sub-regions.
   * A join-value lane is a streaming aggregation that binds a Swim Downlink
   * to each key in the map.  Whenever a joined downlink updates, the key in
   * the map associated with that downlink is changed to reflect the latest
   * state of the joined lane.
   *
   * Join-value lanes work bi-directionally. An update to a key in the map
   * changes the state of the remotely joined lane.
   */
  @SwimLane("subRegions")
  JoinValueLane<Value, Value> subRegions;

  /**
   * Invoked when the SwimOS Kernel begins executing this Web Agent process.
   */
  @Override
  public void didStart() {
    System.out.println(nodeUri() + " didStart region");
    seed();
  }

  /**
   * Seeds the state of this region from a configuration resource.
   */
  void seed() {
    // Check if this particular agent has been configured with a seed resource
    // in the application's server.recon file.
    final String seedResource = getProp("seed").stringValue(null);
    if (seedResource != null) {
      final Value seedValue = CellularResources.loadReconResource(seedResource);

      // Seed the state of the info lane.
      final Value seedInfo = seedValue.get("info");
      if (seedInfo.isDefined()) {
        this.info.set(seedInfo);
      }

      // Seed the state of the status lane.
      final Value seedStatus = seedValue.get("status");
      if (seedStatus.isDefined()) {
        this.status.set(seedStatus);
      }

      // Seed the state of the geometry lane.
      final Value seedGeometry = seedValue.get("geometry");
      if (seedGeometry.isDefined()) {
        this.geometry.set(seedGeometry);
      }

      // Seed the links in the sub-regions join lane.
      final Value seedSubRegions = seedValue.get("subRegions");
      seedSubRegions.forEach((Item seedSubRegion) -> {
        final Value key = seedSubRegion.get("node");
        final Uri nodeUri = seedSubRegion.get("node").cast(Uri.form());
        final Uri laneUri = seedSubRegion.get("lane").cast(Uri.form());

        // Join the sub-region's status.
        this.subRegions.downlink(key)
            .nodeUri(nodeUri)
            .laneUri(laneUri)
            .open();
      });
    }
  }

}
