package swim.cellular.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.JoinValueLane;
import swim.api.lane.ValueLane;
import swim.cellular.CellularResources;
import swim.structure.Item;
import swim.structure.Value;
import swim.uri.Uri;

public class RegionAgent extends AbstractAgent {

  @SwimLane("info")
  ValueLane<Value> info;

  @SwimLane("status")
  ValueLane<Value> status;

  @SwimLane("geometry")
  ValueLane<Value> geometry;

  @SwimLane("subRegions")
  JoinValueLane<Value, Value> subRegions;

  @Override
  public void didStart() {
    System.out.println(nodeUri() + " didStart region");
    seed();
  }

  void seed() {
    final String seedResource = getProp("seed").stringValue(null);
    if (seedResource != null) {
      final Value seedValue = CellularResources.loadReconResource(seedResource);

      final Value seedInfo = seedValue.get("info");
      if (seedInfo.isDefined()) {
        this.info.set(seedInfo);
      }

      final Value seedStatus = seedValue.get("status");
      if (seedStatus.isDefined()) {
        this.status.set(seedStatus);
      }

      final Value seedGeometry = seedValue.get("geometry");
      if (seedGeometry.isDefined()) {
        this.geometry.set(seedGeometry);
      }

      final Value seedSubRegions = seedValue.get("subRegions");
      seedSubRegions.forEach((Item seedSubRegion) -> {
        final Value key = seedSubRegion.get("node");
        final Uri nodeUri = seedSubRegion.get("node").cast(Uri.form());
        final Uri laneUri = seedSubRegion.get("lane").cast(Uri.form());
        this.subRegions.downlink(key)
            .nodeUri(nodeUri)
            .laneUri(laneUri)
            .open();
      });
    }
  }

}
