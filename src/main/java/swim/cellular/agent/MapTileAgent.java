package swim.cellular.agent;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.MapLane;
import swim.structure.Value;
import swim.uri.Uri;
import swim.uri.UriPath;

public class MapTileAgent extends AbstractAgent {

    private static final int SITE_MIN_ZOOM_LEVEL = 7;

    private static final Uri MAP_ADD_SITE_LANE_URI = Uri.parse("addSite");

    int tileX;
    int tileY;
    int tileZ;

    Uri parentTileUri;

    @SwimLane("sites")
    MapLane<Value, Value> sites = mapLane();

    @SwimLane("addSite")
    public CommandLane<Value> addSite = this.<Value>commandLane().onCommand((Value value) -> {
        if (this.tileZ > SITE_MIN_ZOOM_LEVEL) {
            sites.put(value.get("uri"), value);
            command(this.parentTileUri, MAP_ADD_SITE_LANE_URI, value);
        }
    });

    @Override
    public void didStart() {
        System.out.println("Started Agent " + nodeUri());
        final String[] coordinates = nodeUri().path().foot().toString().split(",");
        this.tileX = Integer.parseInt(coordinates[0]);
        this.tileY = Integer.parseInt(coordinates[1]);
        this.tileZ = Integer.parseInt(coordinates[2]);
        final int parentTileX = this.tileX / 2;
        final int parentTileY = this.tileY / 2;
        final int parentTileZ = this.tileZ - 1;
        this.parentTileUri = Uri.from(UriPath.from("/", "map", "/", parentTileX + "," + parentTileY + "," + parentTileZ));
        info("Started MapTileAgent x: " + this.tileX + "; y: " + this.tileY + "; z: " + this.tileZ);
    }

}
