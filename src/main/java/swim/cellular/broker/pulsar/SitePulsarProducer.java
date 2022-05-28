package swim.cellular.broker.pulsar;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

import org.apache.pulsar.client.api.Producer;
import org.apache.pulsar.client.api.PulsarClientException;

public class SitePulsarProducer {

  private static final String SITE_BROKER_URL = System.getProperty("site.pulsar.url", "");
  private static final String SITE_TOPIC_NAME = System.getProperty("site.pulsar.topic", "");
  private static final String SITE_CONNECTION_TOKEN = System.getProperty("site.pulsar.token", "");

  private static final String JSON_PATTERN = "{\"id\":%d, \"severity\":%f, \"mean_ul_sinr\":%d, \"rrc_re_establishment_failures\":%d}";
  private static final String CSV_PATTERN = "%d,%f,%d,%d";

  public static void main(String[] args) throws PulsarClientException, FileNotFoundException, InterruptedException {
    final PulsarConnector pulsarConnector = new PulsarConnector(SITE_BROKER_URL, SITE_CONNECTION_TOKEN);
    final Producer<byte[]> producer = pulsarConnector.createProducer(SITE_TOPIC_NAME);
    generate(producer);

    Runtime.getRuntime().addShutdownHook(new Thread(() -> {
      try {
        producer.close();
        pulsarConnector.close();
      } catch (PulsarClientException e) {
      }
    }));
  }

  private static void generate(Producer<byte[]> producer) throws FileNotFoundException, InterruptedException {
    Set<Integer> ids = readIds();
    final int maxRate = 400;
    while (true) {
      int count = 0;
      for (int id : ids) {
        publishSiteData(id, producer);
        count += 1;
        // throttle to "maxRate" messages/sec
        if (count == maxRate) {
          System.out.println("Published date for " + count + " sites. Last id sent " + id);
          Thread.sleep(1000L);
          count = 0;
        }
      }
    }
  }

  private static void publishSiteData(int id, Producer<byte[]> producer) {
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
    //final String payload = String.format(JSON_PATTERN, id, severity, meanUlSinr, rrcReestablishmentFailures);
    final String payload = String.format(CSV_PATTERN, id, severity, meanUlSinr, rrcReestablishmentFailures);
    producer.sendAsync(payload.getBytes(StandardCharsets.UTF_8));
  }

  private static Set<Integer> readIds() {
    InputStream fis = SitePulsarProducer.class.getResourceAsStream("/site-ids.csv");
    final Scanner sc = new Scanner(fis);
    final Set<Integer> ids = new HashSet<>();
    while (sc.hasNextLine()) {
      final String line = sc.nextLine();
      ids.add(Integer.parseInt(line));
    }
    sc.close();
    if (fis != null) {
      try {
        fis.close();
      } catch (IOException e) {

      }
    }
    return ids;
  }

}
