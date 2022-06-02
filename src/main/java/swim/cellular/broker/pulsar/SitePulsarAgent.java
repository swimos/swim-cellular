package swim.cellular.broker.pulsar;

import swim.structure.Record;
import swim.structure.Value;
import swim.uri.Uri;
import swim.uri.UriPath;
import swim.warp.CommandMessage;

public class SitePulsarAgent extends  PulsarAgent {

  private static final Uri SITE_PUBLISH_LANE_URI = Uri.parse("publish");

  private Value lastMessage = Value.absent();

  @Override
  protected CommandMessage makeCommand(String strMsg) {
    // assume payload here is a csv format like this: "$id,$severity,$mean_ul_sinr,$rrc_re_establishment_failures";
    final String csvFields[] = strMsg.split(",");
    int id = intValue(csvFields[0]);
    if (id != 0) {
      Record body = Record.create(4)
          .slot("id", id)
          .slot("severity", doubleValue(csvFields[1]))
          .slot("mean_ul_sinr", intValue(csvFields[2]))
          .slot("rrc_re_establishment_failures", intValue(csvFields[3]));

      final String siteId = body.get("id").stringValue("");
      this.lastMessage = body;
      return new CommandMessage(Uri.create(UriPath.of("/", "site", "/", siteId)), SITE_PUBLISH_LANE_URI, body);
    } else {
      return EMPTY_COMMAND;
    }
  }

  private double doubleValue(String csvField) {
    try {
      return Double.parseDouble(csvField);
    } catch (NumberFormatException e) {
      return 0.0d;
    }
  }

  private int intValue(String csvField) {
    try {
      return Integer.parseInt(csvField);
    } catch (NumberFormatException e) {
      return 0;
    }
  }

  @Override
  protected Value lastMessage() {
    return lastMessage;
  }

}
