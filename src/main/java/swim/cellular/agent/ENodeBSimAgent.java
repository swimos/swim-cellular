package swim.cellular.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.MapLane;
import swim.api.lane.ValueLane;
import swim.concurrent.TimerRef;
import swim.observable.function.DidUpdateKey;
import swim.structure.Value;

/**
 * A specialization of a cell site that is intended to simulate the behavior
 * of an eNodeB.
 */
public class ENodeBSimAgent extends AbstractAgent {

  /**
   * Handle to the timer that drives the simulation.
   */
  TimerRef simTicker;

  /**
   * Cell site status lane updated by the simulation, shared with the cell site
   * and eNodeB agents running in the same Swim Node as this sim agent.
   */
  @SwimLane("status")
  ValueLane<Value> status;

  /**
   * Latest trueCall data for a cell site updated by the simulation, shared with the cell site
   * and eNodeB agents running in the same Swim Node as this sim agent.
   */
  @SwimLane("trueCallLatest")
  ValueLane<Value> trueCallLatest = this.<Value>valueLane()
      .didSet((newValue, oldValue) -> { // invoked when a new value is set to this lane
    // add to history
    this.trueCallHistory.put(newValue.get("recorded_time").longValue(), newValue);
    computeKpis(newValue);
  });

  /**
   * Time series of trueCall data for a cell site (only last 10 values are retained), updated from callback function
   * in trueCallLatest lane. Shared with the cell site and eNodeB agents running in the same Swim Node as this sim agent.
   */
  @SwimLane("trueCallHistory")
  MapLane<Long, Value> trueCallHistory = this.<Long, Value>mapLane()
      .didUpdate((key, newValue, oldValue) -> { // invoked when a new (key,value) pair is added to this lane

    // check if the size of this lane is greater than 10 and drop the lower elements from the map
    final int dropCount = this.trueCallHistory.size() - 10;
    if (dropCount > 0) {
      this.trueCallHistory.drop(dropCount);
    }
  });

  /**
   * Compute running average of sinr and running total of rrc_re_establishment_failures
   * @param newValue
   */
  private void computeKpis(Value newValue) {
    final Value oldKpis = this.kpis.get();
    // get the current count of the number of items received, initialize to 0
    final int oldCount = oldKpis.get("count").intValue(0);

    // newAve = ( (oldAve * oldCount) + newValue ) / (oldCount + 1)
    final double aveSinr =
        ( (oldKpis.get("avg_mean_ul_sinr").doubleValue(0) * oldCount) + newValue.get("mean_ul_sinr").intValue(0) ) / (oldCount + 1);

    // newTotal = oldTotal + newValue
    final long totalRrcFailures =
        oldKpis.get("sum_rrc_re_establishment_failures").longValue(0) + newValue.get("rrc_re_establishment_failures").longValue(0);

    // update the kpis lane with the computed values
    final Value newKpis = oldKpis
        .updated("avg_mean_ul_sinr", Math.round(aveSinr))
        .updated("sum_rrc_re_establishment_failures", totalRrcFailures)
        .updated("count", oldCount + 1);
    this.kpis.set(newKpis);

  }

  /**
   * Computed kpis from trueCall data for a cell site, updated from callback function in trueCallLatest lane. Shared
   * with the cell site and eNodeB agents running in the same Swim Node as this sim agent.
   */
  @SwimLane("kpis")
  ValueLane<Value> kpis;


  /**
   * Runs a single step of the eNodeB simulation.
   */
  void onSimTick() {
    //System.out.println(nodeUri() + " onSimTick");

    // Reschedule the simulation timer to execute again at a random time
    // between 0 and 60 seconds from now.
    this.simTicker.reschedule(Math.round(60000L * Math.random()));

    // Generate a random alert category with a 10% chance of a warning,
    // and a 1% chance of an alert.
    final int category = Math.random() < 0.1 ? Math.random() < 0.1 ? 2 : 1 : 0;
    // Add some fuziness to the alert category to get a continuous severity
    // value between 0 and 2.  A value of 0 represents no alert or warning.
    // The interval (0, 1] represents a warning.  And the interval (1, 2]
    // represents an alert.
    final double severity = category == 0 ? 0.0 : (category - 1) + Math.random();

    // Update the status of the eNodeB with the newly computed alert severity.
    final Value oldStatus = this.status.get();
    final Value newStatus = oldStatus.updated("severity", severity);
    this.status.set(newStatus);

    // generate a random meanSinr value between 0 and 40
    final int meanSinr = (int) Math.round(Math.random() * 40);

    // generate a random rrcReestablishmentFailures value between 1 and 9
    final long rrcReestablishmentFailures = (long) (1 + Math.random() * 9);

    // Update the trueCallLatest lane of the eNodeB with the simulated data.
    final Value oldTrueCallLatest = this.trueCallLatest.get();
    final Value newTrueCallLatest = oldTrueCallLatest
        .updated("mean_ul_sinr", meanSinr)
        .updated("rrc_re_establishment_failures", rrcReestablishmentFailures)
        .updated("recorded_time", System.currentTimeMillis());
    this.trueCallLatest.set(newTrueCallLatest);
  }

  /**
   * Invoked when the SwimOS Kernel begins executing this Web Agent process.
   */
  @Override
  public void didStart() {
    //System.out.println(nodeUri() + " didStart");

    // Immediately run a simulation tick.
    this.simTicker = setTimer(0, this::onSimTick);
  }

}
