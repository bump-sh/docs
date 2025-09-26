---
title: Security
authors: phil
excerpt: Learn how OpenAPI describes authentication and authorization schemes for your API.
date: 2024-08-07
---

- TOC
{:toc}

OpenAPI uses the term "security scheme" to cover both authentication and authorization schemes. 

- **Authentication:** Who is this user, are they who they say they are.
- **Authorization:** What data can this user see, what actions can they take.

OpenAPI v3.1 lets you describe APIs protected using the following security schemes:

- HTTP authentication schemes (anything using the `Authorization` header)
  - Basic
  - Bearer
  - Digest
  - OAuth (1.0)
  - others defined in [RFC 7235](https://www.rfc-editor.org/rfc/rfc7235.html) and [HTTP Authentication Scheme Registry](https://www.iana.org/assignments/http-authschemes/http-authschemes.xhtml)
- API keys in headers, query string or cookies
- OAuth 2.x
- OpenID Connect Discovery
- Mutual TLS

Some of these are very niche and specific forms of security scheme, so we won't get stuck into all of them. Let's look at the most common ones for now.

```yaml
components:
  securitySchemes:
    # API Key Authentication
    ApiKeyHeader:
      type: apiKey
      in: header
      name: X-API-Key
    ApiKeyQuery:
      type: apiKey
      in: query
      name: key
    
    # HTTP Authentication
    HttpBasicAuth:
      type: http
      scheme: basic
    HttpBearerToken:
      type: http
      scheme: bearer
    JWT:
      type: http
      scheme: bearer
      bearerFormat: JWT
   
    # OAuth 2.0 Authentication
    OAuth2ReadWrite:
      type: oauth2
      flows:
        authorizationCode:
          scopes:
            read: Grants read access
            write: Grants write access
          authorizationUrl: https://example.com/oauth/authorize
          tokenUrl: https://example.com/oauth/token
          refreshUrl: https://example.com/oauth/refresh
```

This is 90% of what you'll bump into in the wild when it comes to security schemes. 

### API Keys

**in: header**

API Keys in headers are often stored in some arbitrary header name like `X-API-Key`, which is [frowned upon](https://www.mnot.net/blog/2009/02/18/x-) but is still commonly used. 

```yaml
  ApiKeyHeader:
    type: apiKey
    in: header
    name: X-API-Key
```

That would describe a request that looks like this: 

```
GET /bookings
Host: api.example.com
X-API-Key: <your-api-key>
```

> Instead of specifically using `X-` headers, you can create custom headers with your company name at the start like `Stipe-API-Key` if something is specific to you. If it's not then it's better to use the standard HTTP headers so generic tooling knows how to work with them out of the box.
{: .info }

**in: query**

API Keys in `query` are also common, but best avoided for other reasons: it's incredibly insecure.

```
GET /bookings?key=<your-api-key>
Host: api.example.com
```

The [OWASP API Security Top 10](https://owasp.org/API-Security/) lists [Broken Authentication](https://owasp.org/API-Security/editions/2023/en/0xa2-broken-authentication/) as one of the top security issues for APIs, citing specifically "Sends sensitive authentication details, such as auth tokens and passwords in the URL." 

Generally the "API Key" scheme is best used for legacy API security schemes, which are being deprecated and replaced with better security schemes.

### HTTP Authentication

HTTP Authentication is a widely used security scheme in OpenAPI. It allows you to authenticate and authorize users based on the `Authorization` header in the HTTP request.

#### Basic Authentication

One of the most common HTTP authentication schemes is Basic Authentication. It involves sending the username and password in the `Authorization` header, encoded in Base64. Here's an example:

```yaml
HttpBasicAuth:
  type: http
  scheme: basic
```

To make a request using Basic Authentication, the `Authorization` header would look like this:

```
GET /bookings
Host: api.example.com
Authorization: Basic dXNlcm5hbWU6cGFzc3dvcmQ=
```

That `dXNlcm5hbWU6cGFzc3dvcmQ=` is base64 encoded `username:password`, which is exactly why this security scheme is considered unwise for sending long-lived credentials. Short-lived frequently changing tokens might be less problematic especially if being sent over TLS.

#### Bearer Token Authentication

Bearer Token Authentication is another popular HTTP authentication scheme. It involves sending a token in the `Authorization` header, prefixed with the word `Bearer`. Here's an example:

```yaml
HttpBearerToken:
  type: http
  scheme: bearer
```

To make a request using Bearer Token Authentication, the `Authorization` header would look like this:

```
GET /bookings
Host: api.example.com
Authorization: Bearer <your-token-here>
```

This token is in plain text, but it's usually randomly generated and short lives so it's not so concerning if somebody nabs it, especially if you're using JWT or OAuth 2 which operates over bearer. 

#### JWT Authentication

Using a JWT (JSON Web Token) allows for more advanced authentication scenarios and includes additional information in the token payload. Here's an example:

```yaml
JWT:
  type: http
  scheme: bearer
  bearerFormat: JWT
```

In OpenAPI a JWT security scheme is actually just Bearer Token Authentication again, with `bearerFormat: JWT` letting documentation tools know to mention that the token is a JWT. It doesn't make much difference, its just how the token was generated before it was passed to the API.

To make a request using JWT Authentication, the `Authorization` header would look similar to Bearer Token Authentication:

```
GET /bookings
Host: api.example.com
Authorization: Bearer <your-jwt-here>
```

### OAuth 2

OAuth 2 is a widely used authorization framework that allows users to grant third-party applications access to their resources without sharing their credentials. In OpenAPI, you can describe OAuth 2 authentication using the following example:

```yaml
OAuth2ReadWrite:
  type: oauth2
  flows:
    authorizationCode:
      scopes:
        read: Grants read access
        write: Grants write access
      authorizationUrl: https://example.com/oauth/authorize
      tokenUrl: https://example.com/oauth/token
      refreshUrl: https://example.com/oauth/refresh
```

In this example, the `OAuth2ReadWrite` security scheme represents OAuth 2 authentication. It uses the `authorizationCode` flow, which is one of the most common flows in OAuth 2. The `scopes` section defines the available scopes for this security scheme, such as `read` and `write`. The `authorizationUrl` specifies the URL where users can authorize the application, the `tokenUrl` is used to obtain access tokens, and the `refreshUrl` is used to refresh expired tokens.

To apply OAuth 2 authentication to a specific operation, you can use the `security` keyword and specify the security scheme and scopes:

```yaml
paths:
  /bookings:
    get:
      security:
        - OAuth2ReadWrite: [read]
```

In this example, the `/bookings` path requires the `OAuth2ReadWrite` security scheme with the `read` scope for the `GET` operation.

### OpenID Connect

OpenID Connect is an identity layer built on top of OAuth 2.0 that allows clients to verify the identity of end-users based on the authentication performed by an authorization server. It provides a standardized way to authenticate users and obtain their identity information, such as name, email, and profile picture.

In OpenAPI v3.1, you can describe OpenID Connect authentication using the following example:

```yaml
OpenIDConnect:
  type: openIdConnect
  openIdConnectUrl: https://example.com/.well-known/openid-configuration
```

In this example, the `OpenIDConnect` security scheme represents OpenID Connect authentication. The `openIdConnectUrl` specifies the URL where the OpenID Connect provider's configuration can be found. This configuration includes important information such as the authorization endpoint, token endpoint, and public keys used for verifying ID tokens.

To apply OpenID Connect authentication to a specific operation, you can use the `security` keyword and specify the security scheme:

```yaml
paths:
  /bookings:
    get:
      security:
        - OpenIDConnect: []
```

In this example, the `/bookings` path requires the `OpenIDConnect` security scheme for the `GET` operation.

OpenID Connect is a powerful authentication mechanism that allows you to leverage existing identity providers and provide a seamless login experience for your users. It is widely adopted and supported by major identity providers such as Google, Microsoft, and Okta.


### Mutual TLS

Mutual TLS (Transport Layer Security) is an authentication type in OpenAPI that provides a secure way to authenticate both the client and the server. It involves the exchange of digital certificates between the client and the server to establish a trusted connection, meaning it's commonly used in scenarios where strong authentication and secure communication are required: banking, healthcare, and other sensitive industries.

With mutual TLS authentication, the client presents its own certificate to the server during the TLS handshake process. The server then verifies the client's certificate against its trusted certificate authority (CA) to ensure the client's identity. Similarly, the server presents its own certificate to the client, and the client verifies the server's certificate.

There's not much to it in OpenAPI v3.1.

```yaml
MutualTLS:
  type: mutualTLS
```

This is basically just a flag to let clients know they'll need to set up Mutual TLS or no connections are going to work, but the specifics of that happen outside of OpenAPI. It takes a bit of work, but this authentication method adds an extra layer of security by ensuring that both the client and the server are authenticated before any data is exchanged. It helps prevent unauthorized access and protects against man-in-the-middle attacks.

## Applying Security to Paths

The security schemes are just setting there until they are applied to paths in your OpenAPI document. You can use the `security` keyword at the path level to do this:

```yaml
openapi: 3.1.0
paths:
  /bookings:
    get:
      security:
        - HttpBearerToken: []
```

In this example, the `/bookings` path requires the `HttpBearerToken` security scheme for all requests.

```yaml
openapi: 3.1.0
paths:
  /bookings:
    get:
      security:
        - ApiKeyQuery: []
        - HttpBearerToken: []
```

In this example either the `ApiKeyHeader` or `HttpBearerToken` security schemes, meaning a client could use either. This is great when one method is being deprecated.

Security schemes can also be applied as an `AND`:

```yaml
openapi: 3.1.0
paths:
  /bookings:
    get:
      security:
        - ApiKeyHeader: []
          HttpBearerToken: []
```

This example would only pass if **both** the `ApiKeyHeader` and `HttpBearerToken` are passed.

## Applying Security Globally

To avoid needing to set similar `security` keywords on every path (and possibly missing a few) you can apply security globally. 

```yaml
openapi: 3.1.0
security:
  - HttpBearerToken: []
paths:
  /bookings:
    get:
      # ...
```

This will now be applied to all paths unless turned off. 

## Overriding Path Security

Globally applied rules can be overridden with a path-level security keyword.

```yaml
openapi: 3.1.0
security:
  - HttpBearerToken: []
paths:
  /bookings:
    get:
      security: [] # no security
```

All other paths will continue to be secured regardless of what order they're in.

## Scopes

You might have noticed the empty array showing up: `HttpBearerToken: []`. This empty array is where "scopes" go.

Scopes allow you to define fine-grained permissions within some types of security schema that support them, and in OpenAPI v3.1 that means OAuth 2 and OpenID Connect. 

Each security scheme can have its own set of scopes, which can be used to control access to specific resources or actions. 

```yaml
OAuth2ReadWrite:
  type: oauth2
  flows:
    authorizationCode:
      scopes:
        read: Grants read access
        write: Grants write access
```

In this example, the `OAuth2ReadWrite` security scheme has two scopes: `read` and `write`, which can be used to check certain actions, maybe limiting `GET` to `read` and `POST`, `PUT`, `PATCH`, and `DELETE` to write.

To apply scopes to specific operations, you can use the `security` keyword and fill in that array at the end with the relevant scopes.

```yaml
paths:
  /bookings:
    get:
      security:
        - OAuth2ReadWrite: [read]
    post:
      security:
        - OAuth2ReadWrite: [write]
```

You can get a lot more advanced with scopes than this, with some API developers breaking down the API into manageable chunks. Here are just a few from the Shopify API as an example:

```
read_orders
write_orders

read_content
write_content

read_customers
write_customers

read_customer_payment_methods
write_customer_payment_methods
```

## Deprecating Security Schemes

As APIs evolve over time and security practices change, the authorization methods and security schemes change with them. 

Creating a new major version for an API purely to ditch security schemes is heavy handed and unnecessary. Instead you can add a new security scheme as an option, then deprecate the unwanted scheme to steer new users away from it. 

OpenAPI v3.2 introduced the `deprecated` keyword for security schemes to help make this easier to document, and it works the same as other deprecatable objects like operations, headers, and parameters.

```yaml
components:
  securitySchemes:
    ApiKeyHeader:
      type: apiKey
      in: header
      name: X-API-Key
      deprecated: true

    HttpBearerToken:
      type: http
      scheme: bearer
```

This example would help steer users away from the custom `X-API-Key`, and would help returning users notice they should probably update. Other deprecation tricks exist, but this is a handy way to clearly mark it as deprecated on API documentation and other tooling.
