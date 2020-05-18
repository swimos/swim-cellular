package swim.cellular.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.ValueLane;
import swim.concurrent.TimerRef;
import swim.structure.Value;

public class ENodeBSimAgent extends AbstractAgent {

  TimerRef simTicker;

  @SwimLane("status")
  ValueLane<Value> status;

  void onSimTick() {
    //System.out.println(nodeUri() + " onSimTick");
    this.simTicker.reschedule(Math.round(60000L * Math.random()));

    final Value oldStatus = this.status.get();
    final int category = Math.random() < 0.1 ? Math.random() < 0.1 ? 2 : 1 : 0;
    final double severity = category == 0 ? 0.0 : (category - 1) + Math.random();
    final Value newStatus = oldStatus.updated("severity", severity);
    this.status.set(newStatus);
  }

  @Override
  public void didStart() {
    //System.out.println(nodeUri() + " didStart");
    this.simTicker = setTimer(0, this::onSimTick);
  }

}
