---
title: Introducing the API Explorer
tags: [New]
image: /images/changelog/api-explorer.png
---
![api-explorer.png](/images/changelog/api-explorer.png)

We are happy to announce the launch of our API Explorer, our clients' most requested feature.

Sending a first request is the last mile of an API discovery. As setting up an API client or using cURL in a CLI can be an endeavour for API users, we made things easier, by integrating the API Explorer into your documentation portal. 

With the API Explorer, enable your users to go from API discovery to API usage, in a single place.

## Send requests, right next to the API documentation
It can be difficult for API consumers to understand the complete behavior of an API, that’s one of the reasons we make documentation. To ease the API’s discoverability in the Explorer, the request form is automatically generated with the right field types, based on the OpenAPI definition. No more Lorem Ipsum inside a date picker.

Readability is key in a context of discovery. A dedicated view for the API Explorer next to the documentation means focusing on what’s important: the customer’s request, and the API’s response, while keeping the documentation just one click away. 

![api-explorer-request.png](/images/changelog/api-explorer-request.png)

## Deep support of OpenAPI
Your [API definition file is a contract](https://bump.sh/blog/how-openapi-ensures-reliable-api-communication) between you and your users. That's why we went all-in on supporting the OpenAPI specification in our API Explorer. From simple properties such as strings and booleans, to more complex ones such as arrays of objects or oneOf/anyOf, try any sort of request, based on any API design.

## Request sharing
Pre-defining and sharing a request can be really valuable for API maintainers, to: 
- onboard new clients with a ready-to-play getting started,
- facilitate customer support,
- detect inconsistencies between the API definition and the live API,
- help debugging, …

API Explorer users have a one-click sharing option, providing a unique link that will autofill the request form with the shared values. Let people reproduce the exact behavior you wanted to show them.

Only the request is shared (the authentication method and the response are not).

When your API evolves, [Bump.sh](http://bump.sh) automatically detects if a shared request has become obsolete, alerts your users of possible field changes, and provides them with a diff summary comparing the two versions.

![api-explorer-share.png](/images/changelog/api-explorer-share.png)

## Secure by design
Testing requests sometimes involves using sensitive or confidential information. That’s why we built it safe from the ground up: we will never see any information about your APIs. Requests, execution and sharing are handled 100% client side.

For APIs that don’t allow [CORS requests](https://developer.mozilla.org/fr/docs/Web/HTTP/CORS/Errors), we built a proxy that makes it work without any specific configuration on your side. This proxy called [cors-toujours](https://github.com/bump-sh/cors-toujours) is 100% open source, and hosted on a different server with no logs or data access.

Everything remains between the API consumer and the API itself.

## Help your users discover your APIs with mock servers
[Our freshly announced partnership with Microcks](https://bump.sh/blog/microcks-bump-sh-testing-mocking-docs) gives a hint about our next focus: we are looking into ways of enhancing the discovery experience by streamlining mocking capabilities. 

A mocking server creates a playground to deeply play with the API, without the hassle of setting up a demo server or impacting the production server.

Interested in setting up mock servers for your APIs? [Contact us!](mailto:hello@bump.sh)

## What it means for us
We are really proud of the first version of the API Explorer. It’s a new pillar in our vision: to create a next generation documentation platform that brings multiple tools together with one goal: to provide the smoothest API adoption possible for API consumers.

The API Explorer is currently in beta. [You can request access here.](https://survey.typeform.com/to/RRACql9G)

And last, but not least, you can discover it now with [our demo API!](https://bump.sh/demo/doc/api-explorer/explorer/operation/operation-adduser) 

## Live demo
Yoan Gross, our Product Manager/Designer, made a demo to explain our vision and approach.

[![api-explorer-demo.png](/images/changelog/api-explorer-demo.png)](https://youtu.be/mNnNbumbz08)