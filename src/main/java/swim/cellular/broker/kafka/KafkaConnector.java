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
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.clients.producer.KafkaProducer;

import java.util.Collection;
import java.util.Collections;
import java.util.Properties;

public class KafkaConnector<K, V> {

  final Properties kafkaProps = new Properties();
  private final Collection<String> topics;

  public KafkaConnector(KafkaConfig kafkaConfig) {
    final String servers = kafkaConfig.getServers();
    final String topic = kafkaConfig.getTopic();
    if (servers.equals("") || topic.equals("")) {
      throw new RuntimeException("kafka servers and topics are required parameters");
    }
    this.kafkaProps.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, servers);
    this.kafkaProps.put(ConsumerConfig.GROUP_ID_CONFIG, kafkaConfig.getGroupId());
    this.kafkaProps.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "latest");
    this.kafkaProps.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, kafkaConfig.isAutoCommit());
    this.kafkaProps.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, kafkaConfig.getMaxPollRecords());
    this.kafkaProps.put(ConsumerConfig.FETCH_MIN_BYTES_CONFIG, kafkaConfig.getFetchMinBytes());
    this.kafkaProps.put(ConsumerConfig.FETCH_MAX_BYTES_CONFIG, kafkaConfig.getFetchMaxBytes());
    this.kafkaProps.put(ConsumerConfig.MAX_PARTITION_FETCH_BYTES_CONFIG, kafkaConfig.getMaxPartitionFetchBytes());
    this.kafkaProps.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, kafkaConfig.getKeyClass());
    this.kafkaProps.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, kafkaConfig.getValueClass());
    this.kafkaProps.put(ConsumerConfig.MAX_POLL_INTERVAL_MS_CONFIG, kafkaConfig.getMaxPollInterval());
    this.kafkaProps.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, 120000);
    this.kafkaProps.put(ConsumerConfig.HEARTBEAT_INTERVAL_MS_CONFIG, 10000);
    final String schemaRegistryUrl = kafkaConfig.getSchemaUrl();
    if (schemaRegistryUrl != null && !schemaRegistryUrl.trim().equals("")) {
      this.kafkaProps.put("schema.registry.url", schemaRegistryUrl);
    }
    this.topics = Collections.singletonList(topic);
  }

  public Consumer<K, V> subscribe() {
    final KafkaConsumer<K, V> kc = new KafkaConsumer<K, V>(this.kafkaProps);
    kc.subscribe(this.topics);
    return kc;
  }

  public KafkaProducer<K, V> produce() {
    return new KafkaProducer<K, V>(this.kafkaProps);
  }

}
