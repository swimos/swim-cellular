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

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collection;
import java.util.Collections;
import java.util.Properties;

public class KafkaConnector<K, V> {

  private final Properties kafkaProps;

  public KafkaConnector(String configFile) throws IOException {
    this.kafkaProps = loadConfig(configFile);
  }

  public Properties getKafkaProps() {
    return kafkaProps;
  }

  public boolean isAutoCommit() {
    return kafkaProps.getProperty(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "false").equals("true");
  }

  private Properties loadConfig(final String configFile) throws IOException {
    final Properties props = new Properties();
    try (InputStream inputStream = new FileInputStream(configFile)) {
      props.load(inputStream);
    }
    return props;
  }

  public Consumer<K, V> consumer() {
    return new KafkaConsumer<K, V>(this.kafkaProps);
  }

  public KafkaProducer<K, V> producer() {
    return new KafkaProducer<K, V>(this.kafkaProps);
  }

}
