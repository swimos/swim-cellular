package swim.cellular.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.ValueLane;
import swim.structure.Value;

public class ENodeBAgent extends AbstractAgent {

  @SwimLane("info")
  ValueLane<Value> info;

  @SwimLane("status")
  ValueLane<Value> status;

}
