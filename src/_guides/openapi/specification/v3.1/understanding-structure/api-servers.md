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

> The `x-internal` is not strictly part of the specification, but it is a popular [extension](../extending/extensions.md). Any tools that support it will hide these servers, removing them from user facing documentation for example. This lets you can keep handy development and testing information in OpenAPI, but avoid confusing end-users with details about your internal setup.
{: .info}

## Server Variables

Server variables offer a convenient way to modify server URLs, covering simple patterns such as environment names, geographical regions, or covering wildcards like user-generated subdomains. These variables are part of the server object, and allow for more flexible API configurations without hardcoding every possible server option.

For instance, consider an API that is deployed across multiple regions, such as the United States, Europe, and Asia. Instead of listing each server URL separately, you can use a server variable to represent the region. 

```yaml
servers:
  - url: "https://{region}.api.example.com"
    description: Regional Production Server
    variables:
      region:
        default: eu
        description: Regions
        enum:
          - us
          - eu
          - asia
```

In this example, `{region}` is a server variable, and the `enum` restricts this to three possible values: `us`, `eu`, and `asia`. The default value is `eu`, which means if the region is not specified, tooling can know which value to use. This setup allows clients to dynamically select the appropriate regional server by substituting the `{region}` variable in the URL template, resulting in `https://asia.api.example.com`.

> Some people try to use server variables for handling API Versions (v1, v2, v3) in a single OpenAPI document. This is a poor fit for server variables, because far more than the server URL will change between major versions. Server variables help when just the server is changing, but the other operations and components are the same.
{: .warning}
