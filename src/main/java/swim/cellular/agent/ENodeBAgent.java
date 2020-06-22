package swim.cellular.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.http.HttpLane;
import swim.api.lane.MapLane;
import swim.api.lane.ValueLane;
import swim.codec.Output;
import swim.http.HttpChunked;
import swim.http.HttpEntity;
import swim.http.HttpRequest;
import swim.http.HttpResponse;
import swim.http.HttpStatus;
import swim.http.MediaType;
import swim.json.Json;
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

  /**
   * Computed kpis from TrueCall data for this cell site.
   */
  @SwimLane("kpis")
  ValueLane<Value> kpis;

  /**
   * Latest TrueCall data for this cell site, updated by a simulator or other
   * driver agent running in the same Swim Node as this eNodeB agent.
   */
  @SwimLane("trueCallLatest")
  ValueLane<Value> trueCallLatest = this.<Value>valueLane()
      .didSet(this::didSetTrueCallLatest);

  /**
   * Rolling time series of historical TrueCall samples.
   */
  @SwimLane("trueCallHistory")
  MapLane<Long, Value> trueCallHistory = this.<Long, Value>mapLane()
      .didUpdate(this::didUpdateTrueCallHistory);

  @SwimLane("summary")
  HttpLane<Value> summary = this.<Value>httpLane()
      .doRespond(this::onRequestSummary);

  /**
   * REST endpoint that exposes ENodeB summary information.
   */
  HttpResponse<?> onRequestSummary(HttpRequest<Value> request) {
    // Compute the repsonse payload.
    final Value payload = this.status.get().concat(this.kpis.get());
    // Construct the response entity by incrementally serializing and encoding
    // the response payload as JSON.
    final HttpEntity<?> entity = HttpChunked.from(Json.write(payload, Output.full()),
                                                  MediaType.applicationJson());
    // Return the HTTP response.
    return HttpResponse.from(HttpStatus.OK).content(entity);
  }

  /**
   * Invoked when new TrueCall data is received.
   */
  void didSetTrueCallLatest(Value newSample, Value oldSample) {
    // Extract the recorded timestamp from the TrueCall sample.
    final long timestamp = newSample.get("recorded_time").longValue();
    // Record this sample in the TrueCall history lane.
    this.trueCallHistory.put(timestamp, newSample);
    // Update TrueCall KPIs to account foe the newly received sample.
    updateKpis(newSample);
  }

  /**
   * Invoked when a new sample is added to the TrueCall history lane.
   */
  void didUpdateTrueCallHistory(Long timestamp, Value newSample, Value oldSample) {
    // Check if the size of the TrueCall history lane exceeds 10 samples,
    // and drop the oldest excess samples.
    final int dropCount = this.trueCallHistory.size() - 10;
    if (dropCount > 0) {
      this.trueCallHistory.drop(dropCount);
    }
  }

  /**
   * Updates TrueCall KPIs with a newly received TrueCall sample.
   */
  void updateKpis(Value newSample) {
    final Value oldKpis = this.kpis.get();
    // Get the previous number of TrueCall samples received, initializing to 0.
    final int oldCount = oldKpis.get("count").intValue(0);

    // Compute running avergae of mean ul sinr;
    // newAvg = ((oldAvg * oldCount) + newValue) / (oldCount + 1)
    final double oldAvgMeanUlSinr = oldKpis.get("avg_mean_ul_sinr").doubleValue(0);
    final int newMeanUlSinr = newSample.get("mean_ul_sinr").intValue(0);
    final double newAvgMeanUlSinr = ((oldAvgMeanUlSinr * oldCount) + newMeanUlSinr) / (oldCount + 1);

    // Accumulate rrc re-establishment failures.
    final long oldSumRrcReEstablishmentFailures = oldKpis.get("sum_rrc_re_establishment_failures").longValue(0);
    final long newRrcReEstablishmentFailures = newSample.get("rrc_re_establishment_failures").longValue(0);
    final long newSumRrcReEstablishmentFailures = oldSumRrcReEstablishmentFailures + newRrcReEstablishmentFailures;

    // Update the kpis lane with the computed values.
    final Value newKpis = oldKpis
        .updated("avg_mean_ul_sinr", Math.round(newAvgMeanUlSinr))
        .updated("sum_rrc_re_establishment_failures", newSumRrcReEstablishmentFailures)
        .updated("count", oldCount + 1);
    this.kpis.set(newKpis);
  }

}
