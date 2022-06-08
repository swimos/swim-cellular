// Copyright 2015-2022 SWIM.AI inc.
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

package swim.cellular.broker.kafka;

import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashSet;
import java.util.Scanner;
import java.util.Set;

public class SiteKafkaProducer {

  private static final String CSV_PATTERN = "%d,%f,%d,%d";

  public static void main(String[] args) throws IOException, InterruptedException {
    final String kafkaConfigFile = System.getProperty("kafka-config", "kafka-config.properties");
    final KafkaConnector<Integer, String> kafkaConnector = new KafkaConnector<>(kafkaConfigFile);
    final KafkaProducer<Integer, String> producer = kafkaConnector.producer();
    generate(producer, System.getProperty("topic"));

    Runtime.getRuntime().addShutdownHook(new Thread(() -> {
      try {
        producer.close();
      } catch (Throwable e) {
      }
    }));
  }

  private static void generate(KafkaProducer<Integer, String> producer, String topic) throws InterruptedException {
    Set<Integer> ids = readIds();
    final int maxRate = 400;
    while (true) {
      int count = 0;
      for (int id : ids) {
        publishSiteData(id, producer, topic);
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

  private static void publishSiteData(int id, KafkaProducer<Integer, String> producer, String topic) {
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
    producer.send(new ProducerRecord<>(topic, id, payload));
  }

  private static Set<Integer> readIds() {
    InputStream fis = SiteKafkaProducer.class.getResourceAsStream("/site-ids.csv");
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
