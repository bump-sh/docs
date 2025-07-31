---
title: API Explorer (Beta)
---

- TOC
{:toc}

> The API Explorer is a new feature in beta with limited access. You can request access by [contacting our team](mailto:hello@bump.sh).
{: .info}

## What is the API Explorer?

The API Explorer allows you to test an API in real-world conditions directly from its documentation. It facilitates API discovery by enabling you to try out specific API calls on any server listed in your definition file. It helps you get started quickly without a testing environment or share a specific use case for discovery, support, or debugging purposes.

## How to use the API Explorer?

The API Explorer is accessible at any time via a button at the top of your documentation (and remains visible as you scroll). Each operation also features a button that opens the API Explorer for that specific operation.

![](/images/help/explorer/explorer-button.png)

If you haven’t opened the API Explorer from a specific operation, you can select one from the corresponding menu.

![](/images/help/explorer/explorer-operation-selection.png)

We identify the required fields directly from the definition file, making it easier for you to fill out the request, detecting whether it’s a boolean, date, etc. Fill in the expected information to execute the request and receive a response.

![](/images/help/explorer/explorer-response.png)

### Sharing

It’s possible to share a request setup, which is useful for showing an example in a demo or for support purposes. The share button generates a URL that includes the pre-filled request parameters.

> This URL will never share your authentication parameters or the response.
{: .info}

![](/images/help/explorer/explorer-share.png)

If the API documentation has been updated after the share URL was generated, the Explorer will notify you that the pre-filled fields may have changed and display a link to the API changelog for a more detailed review of the changes.

> The curl commands generated when filling out the form are copyable.
{: .tip}

## Security

> To ensure maximum security and confidentiality of requests, Bump.sh does not collect or store any confidential data during API Explorer use.
{: .warning}

### Proxy

To ensure optimal compatibility and total confidentiality, we chose to let the user’s browser process the requests rather than our main servers. Despite the obvious advantages, requests sent from a browser are sometimes poorly received by servers and result in what are known as CORS errors.

To avoid this situation, we created our own proxy, designed to ensure that requests sent from a browser are processed without error by an API’s servers, all while maintaining confidentiality and security: **cors toujours**.

This proxy is hosted outside our infrastructure to ensure data security. Its open-source code will soon be made available to the community.

### Authentication

We support authentication for APIs that require prior authentication. Three options are available: via **HTTP authorization** (Basic or Bearer tokens), via **API key** (In header, query param or cookie) or via **OAuth2** flows. These are the most common [security schemes available in OpenAPI](https://spec.openapis.org/oas/v3.1.0#security-scheme-object) and AsyncAPI.

![](/images/help/explorer/explorer-auth.png)

> When sharing a request, this authentication information is never transmitted.
{: .info}

#### Details about OAuth2 flows

For now we partially support the “Implicit” OAuth2 grant type for automatic access token retrieval. To enable this feature you will need to include an `x-client-id` vendor extension in the API definition file, in the OAuth2 implicit flow object. This value should be the ID of a dedicated OAuth client application created on your Authorization server to identify your API consumers.

E.g. for example:
```yaml
components:
  securitySchemes:
    "OAuth2 implicit flow":
      type: oauth2
      flows:
        implicit:
          authorizationUrl: "https://auth.example.org/oauth"
          scopes: {}
          x-client-id: "123456abcdef"
```

![Image of the authorization box with an implicit oauth2 flow and the “Get token” button](/images/help/explorer/oauth-automatic-implicit-flow.png)

All other OAuth2 flows are partially supported and will display an input field for the user to enter an access token manually (similarly to the **HTTP authorization** security scheme).

![Image of the authorization box with a partially supported oauth2 flow and the access token field](/images/help/explorer/oauth-access-token-field.png)

## Known Limitations of the Beta

The API Explorer is currently in closed beta. As such, not all features are yet available. Here is a non-exhaustive list of its current limitations:

- Branches are not yet supported: it works from the default branch of your documentation.
- When multiple servers are mentioned in the definition file, all of them are accessible via the API Explorer (and the user can choose which one to use for their requests). It is not possible to hide some of them.
- Rich responses are not yet supported: responses will display text only.
