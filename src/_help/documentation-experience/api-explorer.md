---
title: API Explorer (Beta)
---

- TOC
{:toc}

The API Explorer is a new feature in beta with limited access. You can request access by following this link.

## What is the API Explorer?

The API Explorer allows you to test an API in real-world conditions directly from its documentation. It facilitates API discovery by enabling you to try out specific API calls on any server listed in your definition file. It helps you get started quickly without a testing environment or share a specific use case for discovery, support, or debugging purposes.

## How to use the API Explorer?

The API Explorer is accessible at any time via a button at the top of your documentation (and remains visible as you scroll). Each operation also features a button that opens the API Explorer for that specific operation.

[screenshot of the button]

If you haven’t opened the API Explorer from a specific operation, you can select one from the corresponding menu.

[screenshot of the API Explorer]

We identify the required fields directly from the definition file, making it easier for you to fill out the request, detecting whether it’s a boolean, date, etc. Fill in the expected information to execute the request and receive a response.

[screenshot of a response]

### Sharing

It’s possible to share a request setup, which is useful for showing an example in a demo or for support purposes. The share button generates a URL that includes the pre-filled request parameters.

> This URL will never share your authentication parameters or the response.
{: .info}

[screenshot of sharing]

If the API documentation has been updated after the share URL was generated, you will be notified when attempting to use it. You will then have the option to switch to an updated version of the operation. Note that in this case, new elements will no longer be pre-filled.

> The curl commands generated when filling out the form are copyable.
{: .tip}

## Security

> To ensure maximum security and confidentiality of requests, Bump.sh does not collect or store any confidential data during API Explorer use.
{: .warning}

### Proxy

To ensure optimal compatibility and total confidentiality, we chose to let the user’s browser process the requests rather than our main servers. Despite the obvious advantages, requests sent from a browser are sometimes poorly received by servers and result in what are known as CORS errors.

To avoid this situation, we created our own proxy, designed to ensure that requests sent from a browser are processed without error by an API’s servers, all while maintaining confidentiality and security: **cors toujours**.

This proxy is hosted outside our infrastructure to ensure data security. Its open-source code is available via this GitHub repository: [link to the repo].

For more on our approach and the decisions behind its creation, we’ve prepared a more detailed article: [link to the blog post].

### Authentication

We support authentication for APIs that require prior authentication. Two options are available: via HTTP (Basic/Bearer) or via API keys.

[screenshot of the button and field to fill in]

> When sharing a request, this authentication information is never transmitted.
{: .info}

## Known Limitations of the Beta

The API Explorer is currently in closed beta. As such, not all features are yet available. Here is a non-exhaustive list of its current limitations:

- Branches are not yet supported: it works from the default branch of your documentation.
- When multiple servers are mentioned in the definition file, all of them are accessible via the API Explorer (and the user can choose which one to use for their requests). It is not possible to hide some of them.
- Rich responses are not yet supported: responses will display text only.