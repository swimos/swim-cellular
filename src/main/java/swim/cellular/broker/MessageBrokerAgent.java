package swim.cellular.broker;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.ValueLane;
import swim.concurrent.TimerRef;
import swim.recon.Recon;
import swim.structure.Record;
import swim.structure.Value;
import swim.uri.Uri;
import swim.warp.CommandMessage;

import java.util.concurrent.atomic.AtomicLong;

public abstract class MessageBrokerAgent extends AbstractAgent {

  protected static final CommandMessage EMPTY_COMMAND = new CommandMessage(Uri.empty(), Uri.empty());
  static final long WATCHDOG_TIMER_RATE = 60L * 1000L; // every minute

  private AtomicLong start = new AtomicLong(System.currentTimeMillis());
  protected AtomicLong messageCount = new AtomicLong(0);

  private TimerRef watchdogTimer;

  @SwimLane("info")
  protected ValueLane<Value> info = this.<Value>valueLane().didSet((newValue, oldValue) -> {
    scheduleWatchdog();
    connect(newValue);
  });

  private void scheduleWatchdog() {
    this.watchdogTimer = setTimer(WATCHDOG_TIMER_RATE, () -> {
      logMetrics();
      scheduleWatchdog();
    });
  }

  @SwimLane("metrics")
  protected ValueLane<Value> metrics = valueLane();

  protected void logMetrics() {
    final long count = this.messageCount.get();
    final long now = System.currentTimeMillis();
    final long prevStart = this.start.get();
    final long rate = (count * 1000) / (now - prevStart);
    final Value metrics = Record.create(2)
        .slot("countSinceLastPoll", count)
        .slot("rate", rate);

    info(nodeUri() + ": MESSAGE_METRICS- " + Recon.toString(metrics));
    this.metrics.set(metrics);

    this.messageCount.set(0);
    this.start.set(System.currentTimeMillis());
  }

  @SwimLane("disconnect")
  protected CommandLane<Value> close = this.<Value>commandLane().onCommand(value -> {
    disconnect();
  });

  public void didStart() {
    info(Record.create(2)
            .slot("nodeUri", nodeUri().toString())
            .slot("didStart"));
    final Value config = getProp("config");
    this.info.set(config);
  }


  @Override
  public void willStop() {
    disconnect();
    super.willStop();
  }

  protected long addExactOrReset(long current, long increment) {
    final long sum = current + increment;
    return sum < 0 ? increment : sum;
  }

  @Override
  public void didFail(Throwable error) {
    error(error);
  }

  protected abstract void connect(Value value);

  protected abstract void disconnect();

}
