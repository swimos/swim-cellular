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

  /*
  @Override
  protected void logMetrics() {
    int i = 0;
    while(i < 20000) {
      final int category = Math.random() < 0.1 ? Math.random() < 0.1 ? 2 : 1 : 0;
      // Add some fuzziness to the alert category to get a continuous severity
      // value between 0 and 2.  A value of 0 represents no alert or warning.
      // The interval (0, 1] represents a warning.  And the interval (1, 2]
      // represents an alert.
      final double severity = category == 0 ? 0.0 : (category - 1) + Math.random();

      // Generate a random mean ul sinr value between 0 and 40.
      final int meanUlSinr = (int) Math.round(Math.random() * 40);

      // Generate a random rrc re-establishment failure count between 1 and 9.
      final long rrcReestablishmentFailures = (long) (1 + Math.random() * 9);
      final String jsonPayload = String.format(JSON_PATTERN, i, severity, meanUlSinr, rrcReestablishmentFailures);
      makeCommand(jsonPayload);
      i += 1;
    }
    super.logMetrics();
  }

  private static final String JSON_PATTERN = "{\"id\":%d, \"severity\":%f, \"mean_ul_sinr\":%d, \"rrc_re_establishment_failures\":%d}";
  */

}
