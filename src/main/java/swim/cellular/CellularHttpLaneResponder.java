package swim.cellular;

import swim.api.auth.Identity;
import swim.codec.Decoder;
import swim.http.HttpRequest;
import swim.http.HttpResponse;
import swim.io.IpSocket;
import swim.io.http.HttpResponder;
import swim.io.http.HttpResponderContext;
import swim.structure.Value;
import swim.system.CellAddress;
import swim.system.CellContext;
import swim.system.DownlinkAddress;
import swim.system.HttpBinding;
import swim.system.HttpContext;
import swim.system.LinkAddress;
import swim.system.LinkBinding;
import swim.system.LinkContext;
import swim.system.NodeBinding;
import swim.uri.Uri;

import java.net.InetSocketAddress;
import java.security.Principal;
import java.security.cert.Certificate;
import java.util.Collection;

public class CellularHttpLaneResponder implements HttpBinding, HttpResponder<Object> {

  final Uri meshUri;
  Uri hostUri;
  Uri nodeUri;
  final Uri laneUri;
  final HttpRequest<?> request;

  HttpContext linkContext;
  HttpResponderContext httpResponderContext;

  CellularHttpLaneResponder(Uri meshUri, Uri hostUri, Uri nodeUri, Uri laneUri, HttpRequest<?> request) {
    this.meshUri = meshUri;
    this.hostUri = hostUri;
    this.nodeUri = nodeUri;
    this.laneUri = laneUri;
    this.request = request;
  }

  @Override
  public HttpBinding linkWrapper() {
    return this;
  }

  @Override
  public HttpContext linkContext() {
    return this.linkContext;
  }

  @Override
  public void setLinkContext(LinkContext linkContext) {
    this.linkContext = (HttpContext) linkContext;
  }

  @Override
  public CellContext cellContext() {
    return null;
  }

  @Override
  public void setCellContext(CellContext cellContext) {
    // nop
  }

  @Override
  public HttpResponderContext httpResponderContext() {
    return this.httpResponderContext;
  }

  @Override
  public void setHttpResponderContext(HttpResponderContext httpResponderContext) {
    this.httpResponderContext = httpResponderContext;
  }

  @SuppressWarnings("unchecked")
  @Override
  public <T> T unwrapLink(Class<T> linkClass) {
    if (linkClass.isAssignableFrom(getClass())) {
      return (T) this;
    } else {
      return this.linkContext.unwrapLink(linkClass);
    }
  }

  @SuppressWarnings("unchecked")
  @Override
  public <T> T bottomLink(Class<T> linkClass) {
    T link = this.linkContext.bottomLink(linkClass);
    if (link == null && linkClass.isAssignableFrom(getClass())) {
      link = (T) this;
    }
    return link;
  }

  @Override
  public Uri meshUri() {
    return this.meshUri;
  }

  @Override
  public Uri hostUri() {
    return this.hostUri;
  }

  @Override
  public void setHostUri(Uri hostUri) {
    this.hostUri = hostUri;
  }

  @Override
  public Uri nodeUri() {
    return this.nodeUri;
  }

  @Override
  public void setNodeUri(Uri nodeUri) {
    this.nodeUri = nodeUri;
  }

  @Override
  public Uri laneUri() {
    return this.laneUri;
  }

  @Override
  public Value linkKey() {
    return this.linkContext.linkKey();
  }

  @Override
  public LinkAddress cellAddressDown() {
    final CellContext cellContext = cellContext();
    final CellAddress cellAddress = cellContext != null ? cellContext.cellAddress() : null;
    return new DownlinkAddress(cellAddress, linkKey());
  }

  @Override
  public Uri requestUri() {
    return this.request.uri();
  }

  @Override
  public HttpRequest<?> request() {
    return this.request;
  }

  @Override
  public boolean isConnectedDown() {
    return this.httpResponderContext.isConnected();
  }

  @Override
  public boolean isRemoteDown() {
    return true;
  }

  @Override
  public boolean isSecureDown() {
    return this.httpResponderContext.isSecure();
  }

  @Override
  public String securityProtocolDown() {
    return this.httpResponderContext.securityProtocol();
  }

  @Override
  public String cipherSuiteDown() {
    return this.httpResponderContext.cipherSuite();
  }

  @Override
  public InetSocketAddress localAddressDown() {
    return this.httpResponderContext.localAddress();
  }

  @Override
  public Identity localIdentityDown() {
    return null; // TODO
  }

  @Override
  public Principal localPrincipalDown() {
    return this.httpResponderContext.localPrincipal();
  }

  @Override
  public Collection<Certificate> localCertificatesDown() {
    return this.httpResponderContext.localCertificates();
  }

  @Override
  public InetSocketAddress remoteAddressDown() {
    return this.httpResponderContext.remoteAddress();
  }

  @Override
  public Identity remoteIdentityDown() {
    return null; // TODO
  }

  @Override
  public Principal remotePrincipalDown() {
    return this.httpResponderContext.remotePrincipal();
  }

  @Override
  public Collection<Certificate> remoteCertificatesDown() {
    return this.httpResponderContext.remoteCertificates();
  }

  @Override
  public HttpRequest<?> doRequest() {
    return this.request;
  }

  @SuppressWarnings("unchecked")
  @Override
  public Decoder<Object> contentDecoder(HttpRequest<?> request) {
    return this.linkContext.decodeRequest(request);
  }

  @Override
  public void willRequest(HttpRequest<?> request) {
    this.linkContext.willRequest(request);
  }

  @Override
  public void didRequest(HttpRequest<Object> request) {
    this.linkContext.didRequest(request);
  }

  @Override
  public void doRespond(HttpRequest<Object> request) {
    this.linkContext.doRespond(request);
  }

  @Override
  public void writeResponse(HttpResponse<?> response) {
    this.httpResponderContext.writeResponse(response);
  }

  @Override
  public void willRespond(HttpResponse<?> response) {
    this.linkContext.willRespond(response);
  }

  @Override
  public void didRespond(HttpResponse<?> response) {
    this.linkContext.didRespond(response);
  }

  @Override
  public void openMetaDownlink(LinkBinding downlink, NodeBinding metaDownlink) {
    this.linkContext.openMetaUplink(downlink, metaDownlink); // always an uplink
  }

  @Override
  public void willBecome(IpSocket socket) {
    // nop
  }

  @Override
  public void didBecome(IpSocket socket) {
    // nop
  }

  @Override
  public void didTimeout() {
    // nop
  }

  @Override
  public void didConnect() {
    // nop
  }

  @Override
  public void didDisconnect() {
    // nop
  }

  @Override
  public void reopen() {
    // nop
  }

  @Override
  public void openDown() {
    // nop
  }

  @Override
  public void closeDown() {
    this.httpResponderContext.close();
  }

  @Override
  public void didCloseUp() {
    // nop
  }

  @Override
  public void didFailUp(Throwable error) {
    didFail(error);
  }

  @Override
  public void didFail(Throwable error) {
    this.linkContext.closeUp();
    closeDown();
  }

  @Override
  public void traceDown(Object message) {
    // nop
  }

  @Override
  public void debugDown(Object message) {
    // nop
  }

  @Override
  public void infoDown(Object message) {
    // nop
  }

  @Override
  public void warnDown(Object message) {
    // nop
  }

  @Override
  public void errorDown(Object message) {
    // nop
  }

  @Override
  public void failDown(Object message) {
    // nop
  }

}
