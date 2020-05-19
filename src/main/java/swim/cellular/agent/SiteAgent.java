package swim.cellular.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.ValueLane;
import swim.structure.Value;

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
   * Invoked when the SwimOS Kernel begins executing this Web Agent process.
   */
  @Override
  public void didStart() {
    // Launch an eNodeB agent in the same Swim Node as this agent.
    openAgent("eNodeB", ENodeBAgent.class);
    // Launch an eNodeB simulator in the same Swim Node as this agent.
    openAgent("eNodeBSim", ENodeBSimAgent.class);
  }

}
