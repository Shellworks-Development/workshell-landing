# Single sign-on

Your team can sign in to Workshell with an OpenID Connect provider (Google, Microsoft Entra ID, Okta, Authentik, Keycloak and others) or through Cloudflare Access. Turn on either one, or both, with environment variables.

## Who can sign in

SSO signs a person in only when their provider confirms their email address, and only if one of these is true:

- **They already have an account.** An admin added them under **Team → Add member**. With SSO on, the password is optional, so you can add someone by email alone.
- **Their email domain is allowed.** List your domains in `WORKSHELL_SSO_ALLOWED_DOMAINS` and anyone with a verified email on them gets an account (not an admin) the first time they sign in.

Everyone else sees "There's no Workshell account for … Ask an admin to add you."

SSO never creates the first account. Create the admin account with a password first; if your provider confirms the same email, you can use SSO for it afterwards.

::: warning Trust your provider
An identity is linked to the account with the same email the first time it signs in. Anyone your provider vouches for with an email you've added, including an admin's, can sign in as that account. Use a provider and tenant you control.
:::

## OpenID Connect

Register Workshell as a web application with your provider, with this redirect URI:

```
https://workshell.example.com/api/auth/oidc/callback
```

Then set:

| Variable | |
| --- | --- |
| `WORKSHELL_OIDC_ISSUER` | The issuer URL, for example `https://accounts.google.com` |
| `WORKSHELL_OIDC_CLIENT_ID` | The client ID |
| `WORKSHELL_OIDC_CLIENT_SECRET` | The client secret |
| `WORKSHELL_OIDC_NAME` | The button label: "Continue with *name*". Default `SSO` |
| `WORKSHELL_SSO_ALLOWED_DOMAINS` | Optional, comma-separated, for example `shellworks.dev,studio.gg` |

`WORKSHELL_PUBLIC_URL` must be set, because Workshell builds the redirect URI from it.

The sign-in page shows a **Continue with *name*** button. Workshell uses the authorization code flow with PKCE, a one-time state and nonce, and checks the ID token's signature (RS256 or ES256), issuer, audience and expiry.

### Provider notes

| Provider | Issuer | |
| --- | --- | --- |
| Google | `https://accounts.google.com` | Create an OAuth client of type "Web application" |
| Microsoft Entra ID | `https://login.microsoftonline.com/<tenant-id>/v2.0` | Entra doesn't send `email_verified`; set `WORKSHELL_OIDC_TRUST_EMAIL=true`. Use a single-tenant app only |
| Okta | `https://<your-org>.okta.com` | |
| Authentik | `https://auth.example.com/application/o/<slug>/` | |
| Keycloak | `https://auth.example.com/realms/<realm>` | |

## Cloudflare Access

If Workshell already sits behind a [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) application, people who pass Access are signed in to Workshell automatically, with no second login.

1. In Cloudflare Zero Trust, open the Access application for your Workshell hostname and copy its **Application Audience (AUD) tag**.
2. Set:

| Variable | |
| --- | --- |
| `WORKSHELL_CF_ACCESS_TEAM` | Your team name, like `shellworks`, or the full `shellworks.cloudflareaccess.com` |
| `WORKSHELL_CF_ACCESS_AUD` | The AUD tag |

Workshell verifies the `Cf-Access-Jwt-Assertion` header against your team's signing keys on every sign-in, so a request that skips Cloudflare can't fake it. Service tokens have no email and can't sign in.

::: danger Let game servers through
Roblox game servers can't pass an Access login. Add a **Bypass** policy, or a separate Access application with one, for these paths, or no data will arrive:

- `/api/v1/*` (ingest, releases and Roblox webhooks)
- `/healthz`, if you monitor it

Everything there is authenticated by the project's ingest key, signing secret or webhook secret instead.
:::

After **Sign out**, Workshell stays signed out in that browser until the person clicks **Continue with Cloudflare Access**.

### Access in a different Cloudflare account

An Access application can only guard a hostname on a domain in its own Cloudflare account. If your Zero Trust team lives in another account, use it as an OpenID Connect provider instead:

1. In that team, add an Access application of type **SaaS** with **OIDC** as the protocol.
2. Set the redirect URL to `https://workshell.example.com/api/auth/oidc/callback` and allow the `openid`, `email` and `profile` scopes.
3. Copy its client ID, client secret and issuer into the [OpenID Connect](#openid-connect) variables.

Your Access policies then decide who can sign in, and game servers aren't affected because nothing guards the hostname. If sign-in reports that no verified email was shared, set `WORKSHELL_OIDC_TRUST_EMAIL=true`; only your team issues these tokens.

## Turn off passwords

Once everyone signs in with SSO, set `WORKSHELL_PASSWORD_LOGIN=false` to hide the password form and refuse password sign-ins. Make sure an admin can sign in with SSO first.

People who joined through SSO can still set a password under **Profile** while password sign-in is on.
