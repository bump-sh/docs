---
title: Defining API Servers
authors: phil
excerpt: Learn about the API Servers section of the OpenAPI Specification.
date: 2024-07-02
---

The servers section in an OpenAPI specification serves as a roadmap, detailing the various environments your API is accessible from. It's a straightforward yet powerful way to communicate the base URLs of your API across different stages of its lifecycle, or in different environments the end-users might be interested in like a mocking server, or a sandbox for interacting with the API without real-world consequences. 

Here is an example of how you can define API servers in your OpenAPI specification:

```yaml
openapi: 3.1.0
info:
  title: Example API
  version: 1.0.0

servers:
  - url: http://localhost:8088/api
    description: Development
    x-internal: true

  - url: https://staging.example.com/api
    description: Staging
    x-internal: true

  - url: https://example.com/api
    description: Production
    x-internal: false
```

This example shows three API servers, for the common dev, staging, and production environments. Perhaps the local environment is on localhost and perhaps its a virtual machine on the cloud somewhere, but the idea is that same, you have all the different places an API might be. 

> info
> The `x-internal` is not strictly part of the specification, but it is a commonly used extension, which will help hide these servers from most tools when publishing your documentation, so you can keep those URLs hidden from documentation views to avoid confusing end-users with details about your internal setups.
