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
import swim.concurrent.TimerRef;
import swim.structure.Record;
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
   * Latest RAN data for a cell site updated by the simulation, shared
   * with the cell site and eNodeB agents running in the same Swim Node as
   * this sim agent.
   */
  @SwimLane("ranLatest")
  ValueLane<Value> ranLatest;

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

    // Update this eNodeB's status with the newly computed alert severity.
    final Value oldStatus = this.status.get();
    final Value newStatus = oldStatus.updated("severity", severity);
    this.status.set(newStatus);

    // Generate a random mean ul sinr value between 0 and 40.
    final int meanUlSinr = (int) Math.round(Math.random() * 40);

    // Generate a random rrc re-establishment failure count between 1 and 9.
    final long rrcReestablishmentFailures = (long) (1 + Math.random() * 9);

    // Update this eNodeB's ranLatest lane with the simulated data.
    final Value oldRanLatest = this.ranLatest.get();
    final Value newRanLatest = oldRanLatest
        .updated("mean_ul_sinr", meanUlSinr)
        .updated("rrc_re_establishment_failures", rrcReestablishmentFailures)
        .updated("recorded_time", System.currentTimeMillis());
    this.ranLatest.set(newRanLatest);
    trace(Record.of("simulated RAN sample", newRanLatest));
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
