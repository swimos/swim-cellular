package swim.cellular.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.JoinValueLane;
import swim.api.lane.ValueLane;
import swim.structure.Record;
import swim.structure.Slot;
import swim.structure.Value;
import swim.uri.Uri;
import swim.uri.UriPath;

/**
 * A Web Agent that represents a generic cell site.  This agent is intended to
 * implement logic and analytics that are common to all types of cell sites.
 */
public class SiteAgent extends AbstractAgent {

  @SwimLane("info")
  ValueLane<Value> info;

  @SwimLane("status")
  ValueLane<Value> status;

  /**
   * Streaming aggregation of the live status of cell sectors associated with
   * this cell site.  Each entry in the map manages a downlink to the
   * {@code status} lane of the remote cell sector agent.
   */
  @SwimLane("sectors")
  JoinValueLane<Value, Value> sectors = this.<Value, Value>joinValueLane();

  /**
   * Invoked when the SwimOS Kernel begins executing this Web Agent process.
   */
  @Override
  public void didStart() {
    //System.out.println(nodeUri() + " didStart site");
    seed();

    // Launch an eNodeB agent in the same Swim Node as this agent.
    openAgent("eNodeB", ENodeBAgent.class);

    // Launch an eNodeB simulator in the same Swim Node as this agent.
    openAgent("eNodeBSim", ENodeBSimAgent.class);

    // Launch an eNodeB connector in the same Swim Node as this agent.
    //openAgent("eNodeBConnector", ENodeBConnectorAgent.class);
  }

  /**
   * Seed the state of sector-carriers associated with this cell site.
   */
  void seed() {
    final UriPath sitePath = nodeUri().path();
    final int baseAngle = (int) Math.round(360.0 * Math.random());
    // Pick a random number of sectors between 1 and 3, biased towards 3.
    final int sectorCount = (int) Math.round(1.25 + 1.75 * Math.random());
    final int sectorSweep = sectorCount == 1
                          ? (Math.random() < 0.5 ? 360 : 180)
                          : (int) (180.0 / (double) sectorCount);
    // Monotonically increasing sector ID.
    int sectorId = 0;

    // Seed the sectors in this cell site, and join the status lane of each
    // sector into the sectors join-value lane.
    for (int i = 0; i < sectorCount; i += 1) {
      // Generate a random number of carriers between 1 and 4.
      final int carrierCount = (int) Math.round(1.25 + 2.75 * Math.random());
      final int sectorAzimuth = baseAngle + 2 * sectorSweep * i;

      for (int j = 0; j < carrierCount; j += 1) {
        final Uri nodeUri = Uri.from(sitePath.appended("sector", String.valueOf(sectorId)));
        final Value key = Uri.form().mold(nodeUri).toValue();
        final Uri laneUri = Uri.parse("status");
        final String band = Character.toString('A' + (char) Math.round(26 * Math.random()));

        // Seed the cell sector status with azimuth and band information.
        command(nodeUri, laneUri, Record.of(Slot.of("azimuth", sectorAzimuth),
                                            Slot.of("sweep", sectorSweep),
                                            Slot.of("band", band)));

        // Join the cell sector status.
        this.sectors.downlink(key)
            .nodeUri(nodeUri)
            .laneUri(laneUri)
            .open();

        sectorId += 1;
      }
    }
  }

}
