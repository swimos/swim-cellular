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

import swim.recon.Recon;
import swim.structure.Record;

public class KafkaConfig {

  private final String servers;
  private final String topic;
  private final String schemaUrl;
  private final String groupId;
  private final String keyClass;
  private final String valueClass;
  private final int maxPollRecords;
  private final int fetchMinBytes;
  private final int fetchMaxBytes;
  private final int maxPartitionFetchBytes;
  private final int maxPollInterval;
  private final boolean autoCommit;

  private KafkaConfig(String servers, String topic, String schemaUrl, String groupId,
                      String keyClass, String valueClass, int maxPollRecords, int fetchMinBytes,
                      int fetchMaxBytes, int maxPartitionFetchBytes, int maxPollInterval, boolean autoCommit) {
    this.servers = servers;
    this.topic = topic;
    this.schemaUrl = schemaUrl;
    this.groupId = groupId;
    this.keyClass = keyClass;
    this.valueClass = valueClass;
    this.maxPollRecords = maxPollRecords;
    this.fetchMinBytes = fetchMinBytes;
    this.fetchMaxBytes = fetchMaxBytes;
    this.maxPartitionFetchBytes = maxPartitionFetchBytes;
    this.maxPollInterval = maxPollInterval;
    this.autoCommit = autoCommit;
  }

  public String getServers() {
    return servers;
  }

  public String getTopic() {
    return topic;
  }

  public String getSchemaUrl() {
    return schemaUrl;
  }

  public String getGroupId() {
    return groupId;
  }

  public String getKeyClass() {
    return keyClass;
  }

  public String getValueClass() {
    return valueClass;
  }

  public int getMaxPollRecords() {
    return maxPollRecords;
  }

  public int getFetchMinBytes() {
    return fetchMinBytes;
  }

  public int getFetchMaxBytes() {
    return fetchMaxBytes;
  }

  public int getMaxPartitionFetchBytes() {
    return maxPartitionFetchBytes;
  }

  public int getMaxPollInterval() {
    return maxPollInterval;
  }

  public boolean isAutoCommit() {
    return autoCommit;
  }

  public String toString() {
    final String message = Recon.toString(
        Record.create(11)
            .slot("Kafka Servers:", servers)
            .slot("Kafka topic:", topic)
            .slot("Kafka groupId:", groupId)
            .slot("Kafka autoCommit:", autoCommit)
            .slot("Kafka keyClass:", keyClass)
            .slot("Kafka valueClass:", valueClass)
            .slot("Kafka maxPollRecords:", maxPollRecords)
            .slot("Kafka fetchMinBytes:", fetchMinBytes)
            .slot("Kafka fetchMaxBytes:", fetchMaxBytes)
            .slot("Kafka maxPartitionFetchBytes:", maxPartitionFetchBytes)
            .slot("Kafka maxPollInterval:", maxPollInterval)
    );
    return message;
  }

  public static KafkaConfig load() {
    final String servers = stringProp("servers");
    final String topic = stringProp("topic");
    final String schemaUrl = stringProp("schemaUrl");
    final String groupId = stringProp("groupId");
    final String keyClass = stringProp("keyClass");
    final String valueClass = stringProp("valueClass");
    final int maxPollRecords = intProp("maxPollRecords", 500);
    final int fetchMinBytes = intProp("fetchMinBytes", 10240);
    final int fetchMaxBytes = intProp("fetchMaxBytes", 10485760);
    final int maxPartitionFetchBytes = intProp("maxPartitionFetchBytes", 10485760);
    final int maxPollInterval = intProp("maxPollInterval", 120000);
    final boolean autoCommit = boolProp("autoCommit", "false");
    return new KafkaConfig(servers, topic, schemaUrl, groupId, keyClass, valueClass, maxPollRecords, fetchMinBytes,
        fetchMaxBytes, maxPartitionFetchBytes, maxPollInterval, autoCommit);
  }

  private static String stringProp(String property) {
    return System.getProperty(property, "");
  }

  private static int intProp(String property, int def) {
    final String value = System.getProperty(property, "");
    try {
      return Integer.parseInt(value);
    } catch (NumberFormatException e) {
      return def;
    }
  }

  private static boolean boolProp(String property, String def) {
    final String value = System.getProperty(property, def);
    return Boolean.parseBoolean(value);
  }

}
