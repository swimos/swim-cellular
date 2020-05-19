package swim.cellular.agent;

import java.util.Iterator;

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

  long lastStatusTime;

  @SwimLane("info")
  ValueLane<Value> info;

  @SwimLane("status")
  ValueLane<Value> status;

  @SwimLane("sites")
  JoinValueLane<Value, Value> sites = this.<Value, Value>joinValueLane()
    .didUpdate(this::didUpdateSiteStatus);

  void didUpdateSiteStatus(Value key, Value newSiteStatus, Value oldSiteStatus) {
    final long t = System.currentTimeMillis();
    if (t - this.lastStatusTime > 1000L) {
      lastStatusTime = t;
    } else {
      return;
    }

    int siteCount = 0;
    int warnCount = 0;
    int alertCount = 0;
    final Iterator<Value> siteStatusIterator = this.sites.valueIterator();
    while (siteStatusIterator.hasNext()) {
      final Value siteStatus = siteStatusIterator.next();
      final double severity = siteStatus.get("severity").doubleValue(0.0);
      siteCount += 1;
      if (severity > 1.0) {
        alertCount += 1;
      } else if (severity > 0.0) {
        warnCount += 1;
      }
    }

    final Value oldStatus = this.status.get();
    final Value newStatus = oldStatus
      .updated("siteCount", siteCount)
      .updated("warnCount", warnCount)
      .updated("alertCount", alertCount);
    this.status.set(newStatus);
  }

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
