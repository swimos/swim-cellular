package swim.cellular.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.downlink.ValueDownlink;
import swim.api.lane.ValueLane;
import swim.structure.Value;
import swim.uri.Uri;

public class ENodeBConnectorAgent extends AbstractAgent {

  /**
   * A downlink to the status lane of the EnodeBAgent (whose uri is the
   * same as this agent) hosted on cellular.swim.services. The downlink updates
   * whenever the status lane of the EnodeBAgent hosted on
   * cellular.swim.services is updated
   */
  private ValueDownlink<Value> statusDownlink;

  /**
   * A downlink to the ranLatest lane of the EnodeBAgent (whose uri is the
   * same as this agent) hosted on cellular.swim.services. The downlink updates
   * whenever the ranLatest lane of the EnodeBAgent hosted on
   * cellular.swim.services is updated
   */
  private ValueDownlink<Value> ranLatestDownlink;

  /**
   * Cell site status lane updated by the downlink to the status lane
   * of the EnodeBAgent hosted on cellular.swim.services, shared with the cell
   * site and eNodeB agents running in the same Swim Node as this connector
   * agent
   */
  @SwimLane("status")
  ValueLane<Value> status;

  /**
   * Latest RAN data for a cell site updated by the downlink to the
   * ranLatest lane of the EnodeBAgent hosted on cellular.swim.services,
   * shared with the cell site and eNodeB agents running in the same Swim Node
   * as this connector agent.
   */
  @SwimLane("ranLatest")
  ValueLane<Value> ranLatest;

  /**
   * Invoked when new new status data is received from the remote agent
   */
  private void didUpdateStatus(Value newStatus, Value oldStatus) {
    this.status.set(newStatus);
  }

  /**
   * Invoked when new new ran sample data is received from the remote agent
   */
  private void didUpdateRanLatest(Value newSample, Value oldSample) {
    this.ranLatest.set(newSample);
  }

  /**
   * Invoked when the SwimOS Kernel begins executing this Web Agent process.
   */
  @Override
  public void didStart() {
    //System.out.println(nodeUri() + " didStart");

    // Instantiate the statusDownlink
    statusDownlink = downlinkValue()
        .hostUri(REMOTE_HOST_URI)
        .nodeUri(nodeUri()) // convenience method to get the current agent's URI
        .laneUri("status")
        .open()
        .didSet(this::didUpdateStatus);

    // Instantiate the ranLatestDownlink
    ranLatestDownlink = downlinkValue()
        .hostUri(REMOTE_HOST_URI)
        .nodeUri(nodeUri()) // convenience method to get the current agent's URI
        .laneUri("ranLatest")
        .open()
        .didSet(this::didUpdateRanLatest);
  }

  /**
   * Invoked when the SwimOS Kernel stops this Web Agent process.
   */
  @Override
  public void willStop() {
    // close the statusDownlink
    if (statusDownlink != null) {
      statusDownlink.close();
    }

    // close the ranLatestDownlink
    if (ranLatest != null) {
      ranLatest.close();
    }
  }

  private static Uri REMOTE_HOST_URI = Uri.parse("warps://cellular.swim.services");

}
