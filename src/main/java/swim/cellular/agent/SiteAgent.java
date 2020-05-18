package swim.cellular.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.ValueLane;
import swim.structure.Value;

public class SiteAgent extends AbstractAgent {

  @SwimLane("info")
  ValueLane<Value> info;

  @SwimLane("status")
  ValueLane<Value> status;

  @Override
  public void didStart() {
    openAgent("eNodeB", ENodeBAgent.class);
    openAgent("eNodeBSim", ENodeBSimAgent.class);
  }

}
