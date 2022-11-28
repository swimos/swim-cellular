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
import swim.api.lane.JoinValueLane;
import swim.api.lane.ValueLane;
import swim.cellular.map.SphericalMercator;
import swim.structure.Record;
import swim.structure.Slot;
import swim.structure.Value;
import swim.uri.Uri;
import swim.uri.UriPath;

/**
 * A Web Agent that represents a generic cell site.  This agent is intended to
 * implement logic and analytics that are common to all types of cell sites.
 */
public class SiteAgent extends AbstractAgent {

  private static final Uri MAP_ADD_SITE_LANE_URI = Uri.parse("addSite");
  private static final int MAX_ZOOM = 16;

  @SwimLane("info")
  ValueLane<Value> info;

  @SwimLane("status")
  ValueLane<Value> status = this.<Value>valueLane()
          .didSet((newValue, oldValue) -> updateMapTile(newValue));

  /**
   * Streaming aggregation of the live status of cell sectors associated with
   * this cell site.  Each entry in the map manages a downlink to the
   * {@code status} lane of the remote cell sector agent.
   */
  @SwimLane("sectors")
  JoinValueLane<Value, Value> sectors = this.<Value, Value>joinValueLane();

  /**
   * Invoked when the SwimOS Kernel begins executing this Web Agent process.
   */
  @Override
  public void didStart() {
    //System.out.println(nodeUri() + " didStart site");
    seed();

    // Launch an eNodeB agent in the same Swim Node as this agent.
    openAgent("eNodeB", ENodeBAgent.class);

    // Launch an eNodeB simulator in the same Swim Node as this agent.
    openAgent("eNodeBSim", ENodeBSimAgent.class);

    // Launch an eNodeB connector in the same Swim Node as this agent.
    //openAgent("eNodeBConnector", ENodeBConnectorAgent.class);
  }

  /**
   * Seed the state of sector-carriers associated with this cell site.
   */
  void seed() {
    final UriPath sitePath = nodeUri().path();
    final int baseAngle = (int) Math.round(360.0 * Math.random());
    // Pick a random number of sectors between 1 and 3, biased towards 3.
    final int sectorCount = (int) Math.round(1.25 + 1.75 * Math.random());
    final int sectorSweep = sectorCount == 1
                          ? (Math.random() < 0.5 ? 360 : 180)
                          : (int) (180.0 / (double) sectorCount);
    // Monotonically increasing sector ID.
    int sectorId = 0;

    // Seed the sectors in this cell site, and join the status lane of each
    // sector into the sectors join-value lane.
    for (int i = 0; i < sectorCount; i += 1) {
      // Generate a random number of carriers between 1 and 4.
      final int carrierCount = (int) Math.round(1.25 + 2.75 * Math.random());
      final int sectorAzimuth = baseAngle + 2 * sectorSweep * i;

      for (int j = 0; j < carrierCount; j += 1) {
        final Uri nodeUri = Uri.create(sitePath.appended("sector", String.valueOf(sectorId)));
        final Value key = Uri.form().mold(nodeUri).toValue();
        final Uri laneUri = Uri.parse("status");
        final String band = Character.toString('A' + (char) Math.round(26 * Math.random()));

        // Seed the cell sector status with azimuth and band information.
        command(nodeUri, laneUri, Record.of(Slot.of("azimuth", sectorAzimuth),
                                            Slot.of("sweep", sectorSweep),
                                            Slot.of("band", band)));

        // Join the cell sector status.
        this.sectors.downlink(key)
            .nodeUri(nodeUri)
            .laneUri(laneUri)
            .open();

        sectorId += 1;
      }
    }
  }

  private void updateMapTile(Value status) {
    final Value coordinates = status.get("coordinates");
    if (coordinates.isDefined()) {
      final double lng = coordinates.getItem(0).doubleValue(Long.MIN_VALUE);
      final double lat = coordinates.getItem(1).doubleValue(Long.MIN_VALUE);
      if(lat != Long.MIN_VALUE && lng != Long.MIN_VALUE) {
        final double x = SphericalMercator.projectLng(lng);
        final double y = SphericalMercator.projectLat(lat);
        final int tileX = (int) (x * (double) (1 << MAX_ZOOM));
        final int tileY = (int) (y * (double) (1 << MAX_ZOOM));
        final int tileZ = MAX_ZOOM;
        final Uri tileUri = Uri.from(UriPath.from("/", "map", "/", tileX + "," + tileY + "," + tileZ));
        command(tileUri, MAP_ADD_SITE_LANE_URI, status.updated("uri", Uri.form().mold(nodeUri()).toValue()));
      }
    }
  }

}
