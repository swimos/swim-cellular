package swim.cellular.broker.pulsar;

import org.apache.pulsar.client.api.Authentication;
import org.apache.pulsar.client.api.AuthenticationFactory;
import org.apache.pulsar.client.api.BatchReceivePolicy;
import org.apache.pulsar.client.api.CompressionType;
import org.apache.pulsar.client.api.Consumer;
import org.apache.pulsar.client.api.ConsumerBuilder;
import org.apache.pulsar.client.api.CryptoKeyReader;
import org.apache.pulsar.client.api.EncryptionKeyInfo;
import org.apache.pulsar.client.api.MessageListener;
import org.apache.pulsar.client.api.Producer;
import org.apache.pulsar.client.api.ProducerBuilder;
import org.apache.pulsar.client.api.PulsarClient;
import org.apache.pulsar.client.api.PulsarClientException;
import org.apache.pulsar.client.api.Schema;
import org.apache.pulsar.client.api.SubscriptionType;
import org.apache.pulsar.client.impl.auth.AuthenticationTls;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

public class PulsarConnector {

  private final PulsarClient client;

  public PulsarConnector(String url) {
    try {
      this.client = PulsarClient.builder()
          .serviceUrl(url)
          .connectionsPerBroker(1)
          .maxConcurrentLookupRequests(2)
          .build();
    } catch (PulsarClientException e) {
      e.printStackTrace();
      throw new RuntimeException(e);
    }
  }

  public PulsarConnector(String url, String tlsCertFile, String tlsKeyFile,
                         String tlsTrustCertsFile, int numConnections) {
    final Map<String, String> authParams = new HashMap<>();
    authParams.put("tlsCertFile", tlsCertFile);
    authParams.put("tlsKeyFile", tlsKeyFile);

    try {
      final Authentication tlsAuth = AuthenticationFactory
          .create(AuthenticationTls.class.getName(), authParams);

      this.client = PulsarClient.builder()
          .serviceUrl(url)
          .tlsTrustCertsFilePath(tlsTrustCertsFile)
          .authentication(tlsAuth)
          .connectionsPerBroker(numConnections)
          .statsInterval(0, TimeUnit.SECONDS)
          .maxConcurrentLookupRequests(2)
          .build();
    } catch (PulsarClientException e) {
      e.printStackTrace();
      throw new RuntimeException(e);
    }
  }

  public PulsarConnector(String url, String token) {
    try {
      this.client = PulsarClient.builder()
          .serviceUrl(url)
          .authentication(AuthenticationFactory.token(token))
          .build();
    } catch (PulsarClientException e) {
      e.printStackTrace();
      throw new RuntimeException(e);
    }
  }

  public Consumer<byte[]> subscribeAsync(String topic, String subscription,
                                         String publicKeyFile, String privateKeyFile) throws PulsarClientException {
    if (!privateKeyFile.equals("") && !publicKeyFile.equals("")) {
      return consumerBuilder(topic, subscription, publicKeyFile, privateKeyFile).subscribe();
    } else {
      return consumerBuilder(topic, subscription).subscribe();
    }
  }

  public void subscribeListener(String topic, String subscription, MessageListener<byte[]> messageListener) throws PulsarClientException {
    consumerBuilder(topic, subscription)
        .messageListener(messageListener)
        .subscribeAsync();
  }

  public Consumer<byte[]> subscribeBatch(String topic, String subscription) throws PulsarClientException {
    return batchConsumerBuilder(topic, subscription).subscribe();
  }

  public Producer<byte[]> createProducer(String topic) throws PulsarClientException {
    return producerBuilder(topic).create();
  }

  private ConsumerBuilder<byte[]> consumerBuilder(String topic, String subscription) {
    return this.client.newConsumer()
        .topic(topic)
        .subscriptionName(subscription)
        .subscriptionType(SubscriptionType.Shared)
        .ackTimeout(2, TimeUnit.SECONDS)
        .receiverQueueSize(32768);
  }

  private ConsumerBuilder<byte[]> consumerBuilder(String topic, String subscription,
                                                  String publicKeyFile, String privateKeyFile) {
    return this.client.newConsumer()
          .topic(topic)
          .subscriptionName(subscription)
          .subscriptionType(SubscriptionType.Shared)
          .ackTimeout(2, TimeUnit.SECONDS)
          .cryptoKeyReader(new RawFileKeyReader(publicKeyFile, privateKeyFile))
          .receiverQueueSize(32768);
  }
  
  private ConsumerBuilder<byte[]> batchConsumerBuilder(String topic, String subscription) {
    final BatchReceivePolicy batchReceivePolicy =
        BatchReceivePolicy.builder().maxNumBytes(100 * 1024 * 1024).timeout(1000, TimeUnit.MILLISECONDS).build();
    return this.client.newConsumer()
        .topic(topic)
        .subscriptionName(subscription)
        .subscriptionType(SubscriptionType.Shared)
        .ackTimeout(2, TimeUnit.SECONDS)
        .receiverQueueSize(50000)
        .maxTotalReceiverQueueSizeAcrossPartitions(3000000) // ensure min(receiverQueSize, maxTotalReceiverQueueSizeAcrossPartitions) is a high number
        .batchReceivePolicy(batchReceivePolicy);
  }

  private ProducerBuilder<byte[]> producerBuilder(String topic) {
    return this.client.newProducer(Schema.BYTES)
        .topic(topic);
  }

  private ProducerBuilder<byte[]> batchProducerBuilder(String topic) {
    return this.client.newProducer(Schema.BYTES)
        .enableBatching(true)
        .blockIfQueueFull(true)
        .batchingMaxMessages(2000)
        .maxPendingMessages(2000)
        .batchingMaxPublishDelay(10, TimeUnit.MILLISECONDS)
        .compressionType(CompressionType.LZ4)
        .topic(topic);
  }

  public void close() {
    try {
      this.client.close();
    } catch (PulsarClientException e) {

    }
  }

}

class RawFileKeyReader implements CryptoKeyReader {

  static final long serialVersionUID = 1L;

  final String publicKeyFile;
  final String privateKeyFile;

  RawFileKeyReader(String publicKeyFile, String privateKeyFile) {
    this.publicKeyFile = publicKeyFile;
    this.privateKeyFile = privateKeyFile;
  }

  @Override
  public EncryptionKeyInfo getPublicKey(String keyName, Map<String, String> keyMeta) {
    final EncryptionKeyInfo keyInfo = new EncryptionKeyInfo();
    try {
      keyInfo.setKey(Files.readAllBytes(Paths.get(publicKeyFile)));
      System.out.println("Read public key from file " + publicKeyFile);
    } catch (IOException e) {
      System.out.println("ERROR: Failed to read public key from file " + publicKeyFile);
      e.printStackTrace();
    }
    return keyInfo;
  }

  @Override
  public EncryptionKeyInfo getPrivateKey(String keyName, Map<String, String> keyMeta) {
    final EncryptionKeyInfo keyInfo = new EncryptionKeyInfo();
    try {
      keyInfo.setKey(Files.readAllBytes(Paths.get(privateKeyFile)));
      System.out.println("Read private key from file " + privateKeyFile);
    } catch (IOException e) {
      System.out.println("ERROR: Failed to read private key from file " + privateKeyFile);
      e.printStackTrace();
    }
    return keyInfo;
  }

}
