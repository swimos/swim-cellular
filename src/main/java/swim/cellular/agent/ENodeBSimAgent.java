package swim.cellular.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.ValueLane;
import swim.concurrent.TimerRef;
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
