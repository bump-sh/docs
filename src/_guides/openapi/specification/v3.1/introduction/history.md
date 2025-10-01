---
title: "A brief history of OpenAPI"
authors: phil
excerpt: OpenAPI allows to describe how an API works, how a sequence of APIs work together, generate client code, create tests, apply design standards, deploy documentation, and much more.
canonical_url: https://docs.bump.sh/guides/openapi/specification/v3.2/introduction/history/
date: 2024-07-25
---

- TOC
{:toc}

The OpenAPI Specification started off life with another name, and this can cause a bit of confusion. Until version 3.0, the specification was still called "Swagger", before being renamed to "OpenAPI" in 2016. It's actually a "retroactive" rename, so even v2.0 and earlier are called OpenAPI now.

The OpenAPI Specification is now supervised by the [OpenAPI Initiative](https://www.openapis.org/), an open-source project under the [Linux Foundation](https://linuxfoundation.org/).

The name Swagger is still popular, and many of the tools have the word Swagger in, but generally speaking you are better off searching for "OpenAPI tools" than "Swagger tools" because those are mostly old outdated tools which don't work with modern versions of OpenAPI.

## Major differences between OpenAPI 2.0, 3.0, 3.1

### Versions

In the 2.0 specification, a property called `swagger` indicated which version of the specification you are using. In OpenAPI 3.0, this is replaced by a new `openapi` property:

- `swagger: "2.0"` line is thus transformed into `openapi: "3.0.0"`

### Structural changes

The following image sums up the main structural changes between 2.0 and 3.0. As you can see, a simplification effort has been made to group each concern in a more logical way.

![openapi 2 versus openapi 3](https://storage.googleapis.com/bump-blog-resources/what-is-openapi/OpenAPI-2-versus-OpenAPI-3.png)

If you want to get more into the details about what changed between OpenAPI 3.0 and 3.1, you can have a look at our dedicated article [here](https://bump.sh/blog/changes-in-openapi-3-1).
