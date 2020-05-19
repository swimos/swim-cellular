package swim.cellular.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.ValueLane;
import swim.structure.Value;

/**
 * A specialization of a cell site that represents an eNodeB.  This agent is
 * intended to implement logic and analytics that apply to eNodeBs, but not to
 * other types of cell sites.
 */
public class ENodeBAgent extends AbstractAgent {

  /**
   * Infrequently changing information about the eNodeB, shared with the
   * cell site agent running in the same Swim Node as this eNodeB agent.
   */
  @SwimLane("info")
  ValueLane<Value> info;

  /**
   * Frequently changing status information about the eNodeB, shared with the
   * cell site agent running in the same Swim Node as this eNodeB agent.
   */
  @SwimLane("status")
  ValueLane<Value> status;

}
