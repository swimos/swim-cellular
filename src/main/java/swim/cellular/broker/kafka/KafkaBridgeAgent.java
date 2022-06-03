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

import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import swim.cellular.broker.MessageBrokerAgent;
import swim.recon.Recon;
import swim.structure.Record;
import swim.structure.Value;
import swim.warp.CommandMessage;

import java.time.Duration;
import java.util.concurrent.atomic.AtomicLong;

public abstract class KafkaBridgeAgent<K, V> extends MessageBrokerAgent {

  private Consumer<K, V> consumer;

  private boolean autoCommit = false;
  protected AtomicLong messageCount = new AtomicLong(0);
  protected AtomicLong messageCumulativeCount = new AtomicLong(0);

  private final AtomicLong start = new AtomicLong(System.currentTimeMillis());

  protected void connect(Value value) {
    disconnect();
    final KafkaConfig kafkaConfig = KafkaConfig.load();
    this.autoCommit = kafkaConfig.isAutoCommit();
    info(logMessage("CONNECT", kafkaConfig.toString()));

    try {
      final KafkaConnector<K, V> kafkaConnector = new KafkaConnector<>(kafkaConfig);
      this.consumer = kafkaConnector.subscribe();
      poll();
    } catch (Throwable t) {
      t.printStackTrace();
      final String errorMessage = Recon.toString(
          Record.create(2)
              .slot("error subscribing to Kafka topic", t.getMessage())
              .slot("Kafka config:", kafkaConfig.toString())
      );
      error(logMessage("CONNECT", errorMessage));
    }
  }

  protected void poll() {
    asyncStage().execute(() -> {
      while (true) {
        try {
          final ConsumerRecords<K, V> records = this.consumer.poll(Duration.ofMillis(1000));
          for (ConsumerRecord<K, V> rec : records) {
            asyncStage().execute(() -> {
              try {
                final CommandMessage command = makeCommand(rec.key(), rec.value());
                if (!command.equals(EMPTY_COMMAND)) {
                  command(command.nodeUri(), command.laneUri(), command.body());
                }
              } catch (Throwable t) {
                error(logMessage("MESSAGE-PROCESS-ERROR", t.getMessage()));
              }
              this.messageCount.incrementAndGet();
              this.messageCumulativeCount.incrementAndGet();
            });
          }
        } catch (Throwable t) {
          error(logMessage("MESSAGE-PROCESS-ERROR", t.getMessage()));
        }
        if (!this.autoCommit) {
          this.consumer.commitSync();
        }
      }
    });
  }

  protected abstract CommandMessage makeCommand(K k, V v);

  protected void logMetrics() {
    final long count = this.messageCount.get();
    final long now = System.currentTimeMillis();
    final long prevStart = this.start.get();
    final long rate = (count * 1000) / (now - prevStart);
    final String message = Recon.toString(
          Record.create(6)
          .slot("lastMessage", Recon.toString(lastMessage()))
          .slot("cumulativeCount", this.messageCumulativeCount.longValue())
          .slot("countSinceLastPoll", count)
          .slot("rate", rate)
    );

    info(logMessage("MESSAGE_METRICS", message));
    this.messageCount.set(0);
    this.start.set(System.currentTimeMillis());
  }

  protected Value lastMessage() {
    return Value.absent();
  }

  private String logMessage(String prefix, String message) {
    return nodeUri() + "- " + prefix + ": "  + message;
  }

  protected void disconnect() {
    if (this.consumer != null) {
      info("Closing pulsar connector");
      try {
        this.consumer.close();
      } catch (Exception e) {
        e.printStackTrace();
      }
    }
  }

}
