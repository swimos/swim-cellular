// Copyright 2015-2022 Swim.inc
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package swim.cellular.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.downlink.EventDownlink;
import swim.api.downlink.ValueDownlink;
import swim.api.http.HttpLane;
import swim.api.lane.ValueLane;
import swim.codec.Output;
import swim.http.HttpChunked;
import swim.http.HttpRequest;
import swim.http.HttpResponse;
import swim.http.HttpStatus;
import swim.http.MediaType;
import swim.json.Json;
import swim.observable.function.DidSet;
import swim.structure.Value;

/**
 * A Web Agent that represents a sector-carrier associated with a cell site.
 */
public class SectorAgent extends AbstractAgent {

  @SwimLane("info")
  ValueLane<Value> info;

  @SwimLane("status")
  ValueLane<Value> status;

  @SwimLane("summary")
  HttpLane<Value> summary = this.<Value>httpLane()
      .doRespond(this::onRequestSummary);

  ValueDownlink<Value> dl;

  private HttpResponse<?> onRequestSummary(HttpRequest<Value> valueHttpRequest) {
    Value payload = this.status.get();
    if (dl != null) {
      payload = payload.concat(dl.get());
    }
    // Construct the response entity by incrementally serializing and encoding
    // the response payload as JSON.
    final HttpChunked<?> entity = HttpChunked.create(Json.write(Output.full(), payload),
        MediaType.applicationJson());
    // Return the HTTP response.
    return HttpResponse.create(HttpStatus.OK).content(entity);
  }

  /**
   * Invoked when the SwimOS Kernel begins executing this Web Agent process.
   */
  @Override
  public void didStart() {
    // construct the site uri here which is of the form: /site/:id
    final String siteId = "/site/" + getProp("id").stringValue();
    dl = downlinkValue().nodeUri(siteId).laneUri("info").open();
  }

}
