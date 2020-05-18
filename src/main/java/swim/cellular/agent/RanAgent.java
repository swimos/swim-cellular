package swim.cellular.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.JoinValueLane;
import swim.api.lane.ValueLane;
import swim.cellular.CellularResources;
import swim.structure.Item;
import swim.structure.Record;
import swim.structure.Slot;
import swim.structure.Value;
import swim.uri.Uri;

public class RanAgent extends AbstractAgent {

  @SwimLane("info")
  ValueLane<Value> info;

  @SwimLane("sites")
  JoinValueLane<Value, Value> sites;

  @Override
  public void didStart() {
    System.out.println(nodeUri() + " didStart ran");
    seed();
  }

  void seed() {
    final String seedResource = getProp("seed").stringValue(null);
    if (seedResource != null) {
      final Value seedValue = CellularResources.loadReconResource(seedResource);

      final Value seedSites = seedValue.get("sites");
      seedSites.forEach((Item seedSite) -> {
        final Value key = seedSite.get("node");
        final Uri nodeUri = seedSite.get("node").cast(Uri.form());
        final Uri laneUri = Uri.parse("status");

        command(nodeUri, laneUri, Record.of(Slot.of("coordinates", seedSite.get("coordinates"))));

        this.sites.downlink(key)
            .nodeUri(nodeUri)
            .laneUri(laneUri)
            .open();
      });
    }
  }

}
