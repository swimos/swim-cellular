package swim.cellular.broker.pulsar;

import org.apache.pulsar.client.api.MessageListener;
import org.apache.pulsar.client.api.PulsarClientException;
import swim.cellular.broker.MessageBrokerAgent;
import swim.recon.Recon;
import swim.structure.Record;
import swim.structure.Value;
import swim.warp.CommandMessage;

import java.io.PrintWriter;
import java.io.StringWriter;


public abstract class PulsarAgent extends MessageBrokerAgent {

  private PulsarConnector pulsarConnector;
  private boolean isPersistent;

  protected void connect(Value value) {
    disconnect();
    final String url = stringProp("site.pulsar.url", value, "url");
    final String topic = stringProp("site.pulsar.topic", value, "topic");
    final String subscription = stringProp("site.pulsar.subscription", value, "subscription");
    final String token = stringProp("site.pulsar.token", value, "token");
    this.isPersistent = !topic.contains("non-persistent");
    final String message = Recon.toString(
        Record.create(2)
          .slot("Pulsar URL:", url)
          .slot("Pulsar topic:", topic)
    );
    info(nodeUri() + ": CONNECT- " + message);

    if (url.equals("") || topic.equals("") || subscription.equals("")) {
      error(nodeUri()+ ": CONNECT- " + Recon.toString(value));
    } else {
      try {
        if (url.contains("ssl")) {
          this.pulsarConnector = new PulsarConnector(url, token);
        } else {
          this.pulsarConnector = new PulsarConnector(url);
        }

        this.pulsarConnector.subscribeListener(topic, subscription, messageListener());
      } catch (PulsarClientException e) {
        final String errorMessage = Recon.toString(
            Record.create(3)
              .slot("error connection to Pulsar topic:", e.getMessage())
              .slot("Pulsar URL:", url)
              .slot("Pulsar topic:", topic)
        );
        error(nodeUri() +  ": CONNECT- " + errorMessage);
      }
    }
  }

  private MessageListener<byte[]> messageListener() {
    final MessageListener<byte[]> messageListener = (consumer, msg) -> {
      asyncStage().execute(() -> {
        try {
          if (isPersistent) {
            consumer.acknowledgeAsync(msg);
          }
          final String strMsg = new String(msg.getData());
          final CommandMessage command = makeCommand(strMsg);
          if (!command.equals(EMPTY_COMMAND)) {
            command(command.nodeUri(), command.laneUri(), command.body());
          }
        } catch (Throwable t) {
          PrintWriter pw = null;
          try {
            final StringWriter sw = new StringWriter();
            pw = new PrintWriter(sw);
            t.printStackTrace(pw);
            error(nodeUri() + ": MESSAGE-PROCESS- " + sw);
          } finally {
            try {
              if (pw != null) {
                pw.close();
              }
            } catch (Exception e) {
              e.printStackTrace();
            }
          }
        }
        this.messageCount.incrementAndGet();
      });
    };
    return messageListener;
  }

  protected abstract CommandMessage makeCommand(String strMsg);

  protected Value lastMessage() {
    return Value.absent();
  }

  protected void disconnect() {
    if (this.pulsarConnector != null) {
      info("Closing pulsar connector");
      this.pulsarConnector.close();
    }
  }

  private String stringProp(String property, Value config, String key) {
    return System.getProperty(property, config.get(key).stringValue(""));
  }

}
