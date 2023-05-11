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
import swim.api.lane.ValueLane;
import swim.structure.Value;

import java.util.logging.Logger;

/**
 * A Web Agent that represents a sector-carrier associated with a cell site.
 */
public class SectorAgent extends AbstractAgent {
  private static final Logger log = Logger.getLogger(SectorAgent.class.getName());
  @SwimLane("info")
  ValueLane<Value> info;

  @SwimLane("status")
  ValueLane<Value> status;

  /**
   * Invoked when the SwimOS Kernel begins executing this Web Agent process.
   */
  @Override
  public void didStart() {
    log.fine(()-> String.format("%s didStart", nodeUri()));
  }

}
