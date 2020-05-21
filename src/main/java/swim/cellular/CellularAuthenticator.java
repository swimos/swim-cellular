package swim.cellular;

import swim.api.auth.AbstractAuthenticator;
import swim.api.auth.Credentials;
import swim.api.auth.Identity;
import swim.api.policy.PolicyDirective;

final class CellularAuthenticator extends AbstractAuthenticator {

  @Override
  public PolicyDirective<Identity> authenticate(Credentials credentials) {
    // Try to associate the given credentials with an identity;
    // return null to delegate to other registered authenticators.
    return null;
  }

}
