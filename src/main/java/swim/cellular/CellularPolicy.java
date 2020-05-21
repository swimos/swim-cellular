package swim.cellular;

import swim.api.auth.Identity;
import swim.api.plane.PlaneContext;
import swim.api.policy.AbstractPolicy;
import swim.api.policy.PolicyDirective;
import swim.http.HttpMessage;
import swim.http.HttpRequest;
import swim.http.HttpResponse;
import swim.uri.Uri;
import swim.warp.CommandMessage;
import swim.warp.EventMessage;
import swim.warp.LinkRequest;
import swim.warp.SyncRequest;

public class CellularPolicy extends AbstractPolicy {
  final PlaneContext plane;

  CellularPolicy(PlaneContext plane) {
    this.plane = plane;
  }

  @Override
  public PolicyDirective<Object> canConnect(Uri requestUri) {
    return allow();
  }

  @Override
  public PolicyDirective<LinkRequest> canLink(LinkRequest request, Identity identity) {
    return allow();
  }

  @Override
  public PolicyDirective<SyncRequest> canSync(SyncRequest request, Identity identity) {
    return allow();
  }

  @Override
  public PolicyDirective<EventMessage> canUplink(EventMessage message, Identity identity) {
    return allow();
  }

  @Override
  public PolicyDirective<CommandMessage> canDownlink(CommandMessage message, Identity identity) {
    return allow();
  }

  @Override
  public PolicyDirective<HttpMessage<?>> canRequest(HttpRequest<?> request) {
    return allow();
  }

  @Override
  public PolicyDirective<HttpResponse<?>> canRespond(HttpRequest<?> request, HttpResponse<?> response) {
    return allow();
  }

}
