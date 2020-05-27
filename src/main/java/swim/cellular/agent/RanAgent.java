package swim.cellular.agent;

import java.util.Iterator;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.JoinValueLane;
import swim.api.lane.MapLane;
import swim.api.lane.ValueLane;
import swim.cellular.CellularResources;
import swim.structure.Item;
import swim.structure.Record;
import swim.structure.Slot;
import swim.structure.Value;
import swim.uri.Uri;

/**
 * A Web Agent that represents a Radio Access Network, and acts as a container
 * for multiple cell sites.
 */
public class RanAgent extends AbstractAgent {

  /**
   * Infrequently changing information about the radio access network.
   */
  @SwimLane("info")
  ValueLane<Value> info;

  /**
   * Frequently changing real-time status of the radio access network.
   */
  @SwimLane("status")
  ValueLane<Value> status;

  /**
   * Streaming aggregation of the live status of all cell sites within this
   * radio access network.  Each entry in the map manages a downlink to the
   * {@code status} lane of the remote cell site agent.
   */
  @SwimLane("sites")
  JoinValueLane<Value, Value> sites = this.<Value, Value>joinValueLane()
    .didUpdate(this::didUpdateSiteStatus);

  /**
   * A real-time map of the status of all cell sites within this radio access
   * network that are currently in an alert state.
   */
  @SwimLane("alerts")
  MapLane<Value, Value> alerts;

  /**
   * Invoked every time the status of <em>any</em> cell site in the radio
   * access network changes.  This callback is triggered by real-time state
   * changes observed by downlinks in the {@code sites} join-value lane.
   */
  void didUpdateSiteStatus(Value key, Value newSiteStatus, Value oldSiteStatus) {
    // Mutate the alerts map to reflect the observed change to the cell site's status.
    final double newSeverity = newSiteStatus.get("severity").doubleValue(0.0);
    final double oldSeverity = oldSiteStatus.get("severity").doubleValue(0.0);
    if (newSeverity > 1.0) {
      this.alerts.put(key, newSiteStatus);
    } else if (oldSeverity > 1.0) {
      this.alerts.remove(key);
    }

    // Throttle analysis updates to 1Hz.
    if (System.currentTimeMillis() - this.lastAnalyzeTime > 1000L) {
      analyzeRanStatus();
    }
  }

  /**
   * Timestamp of the most recent invocation of {@code analyzeRanStatus}.
   * Used to throttle the rate of re-analysis.
   */
  long lastAnalyzeTime;

  /**
   * Analyze the current state of all cell sites in this radio access network.
   */
  protected void analyzeRanStatus() {
    // Update the invocation timestamp;
    this.lastAnalyzeTime = System.currentTimeMillis();

    // Count up all the cell sites with warnings and alerts.
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

    // Update the status of the radio access network with the newly computed values.
    final Value oldStatus = this.status.get();
    final Value newStatus = oldStatus
      .updated("siteCount", siteCount)
      .updated("warnCount", warnCount)
      .updated("alertCount", alertCount);
    this.status.set(newStatus);
  }

  /**
   * Invoked when the SwimOS Kernel begins executing this Web Agent process.
   */
  @Override
  public void didStart() {
    System.out.println(nodeUri() + " didStart ran");
    seed();
  }

  /**
   * Seeds the state of this radio access network from a configuration resource.
   */
  void seed() {
    final String seedResource = getProp("seed").stringValue(null);
    if (seedResource != null) {
      final Value seedValue = CellularResources.loadReconResource(seedResource);

      // Seed the cell sites in this radio access network, and join the status
      // lane of each cell site into the sites join-value lane.
      final Value seedSites = seedValue.get("sites");
      seedSites.forEach((Item seedSite) -> {
        final Value key = seedSite.get("node");
        final Uri nodeUri = key.cast(Uri.form());
        final Uri infoLaneUri = Uri.parse("info");
        final Uri statusLaneUri = Uri.parse("status");

        // Seed the cell site info.
        command(nodeUri, infoLaneUri, seedSite.toValue());
        // Seed the cell site status with the location of the cell site
        // (for convenient use by the UI).
        command(nodeUri, statusLaneUri, Record.of(Slot.of("coordinates", seedSite.get("coordinates"))));

        // Join the cell site status.
        this.sites.downlink(key)
            .nodeUri(nodeUri)
            .laneUri(statusLaneUri)
            //.didConnect(() -> {
            //  info(this.nodeUri() + " connected to site " + nodeUri);
            //})
            //.didDisconnect(() -> {
            //  info(this.nodeUri() + " disconnected from site " + nodeUri);
            //})
            .open();
      });
    }
  }

}
