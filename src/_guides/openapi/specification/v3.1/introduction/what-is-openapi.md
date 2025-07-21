---
title: What is OpenAPI?
authors: phil
excerpt: OpenAPI describes how an Application Programming Interface (API) works, how a sequence of APIs work together, generate client code, create tests, apply design standards, deploy documentation, and much more.
date: 2024-07-25
---

- TOC
{:toc}

OpenAPI (the "OpenAPI Specification") is a standard for describing an API. OpenAPI is managed by the [OpenAPI Initiative](https://www.openapis.org/) (OAI). The [OpenAPI Specification](https://spec.openapis.org/oas/v3.1.0) (OAS) defines an open and independent description format for HTTP API services, which allows both humans and computers to discover and understand how an API works and how to interact with it, without the need to look at the source code.

OpenAPI provides a machine-readable structured data format which can be also be read and written by people, allowing for tooling to help API developers, API product managers, technical writers, and governance teams, all the way through the API lifecycle.

![A flow diagram showing Requirements > Design > Configure / Publish / Develop, then Deploy and Test.](/images/guides/openapi/specification/What-is-OpenAPI-Simple-API-Lifecycle-Vertical.png)

_Diagram created by [OpenAPI Initiative](https://www.openapis.org/)._

## Concepts

As with many things in computing, the terminology can be dense. Some definitions overlap, others vary, and it’s easy to get confused. Here’s a quick refresher to help clarify each concept and keep things straight.

## OpenAPI structure

Your OpenAPI documents lets you describe your REST API:

* Define general information about your API: description, terms of use, license, contact, etc…
* Authentication methods `HTTP`, `API keys`, `OAuth 2`, `OpenID`, etc…
* Available endpoints `/users`, etc…
* Since OpenAPI 3.1, [available webhooks](https://bump.sh/blog/changes-in-openapi-3-1#webhooks-support)
* Available operations on each endpoint: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, etc…
* Input and output parameters for each operation

## Format

OpenAPI documents can be written in [YAML](https://yaml.org/spec/1.2.2/) or [JSON](https://www.json.org/json-en.html) formats.

These formats were chosen because they are easy for a human to read and write, and easy for machines to parse. In practice, YAML is the most used format adopted to write OpenAPI documents. Like it or not, YAML is easier to read than JSON mainly because it reduces the use of markup tags. Also, it is a format that is widely used to write any sort of software configuration.

Here is an example of a partial OpenAPI document covering one endpoint, written in YAML:

```yaml
/previews:
  post:
    summary: Create a preview
    description: |
      Create a preview for a given documentation file. The preview will have a unique
      temporary URL, and will be active for 30 minutes.
    security: []
    requestBody:
      $ref: "#/components/requestBodies/Preview"
    responses:
      "201":
        description: "Success"
        content:
          "application/json":
            schema:
              $ref: "#/components/schemas/Preview"
```

### OpenAPI Specification

Also known as OpenAPI spec / OAS, the "OpenAPI Specification" refers to the [official specification](https://github.com/OAI/OpenAPI-Specification) developed and maintained by the [OpenAPI Initiative](https://openapis.org/), and published at [spec.openapis.org](https://spec.openapis.org/). It’s a technical standard designed to ensure consistency for OpenAPI users and tooling providers, defining how things are expected to work.

### OpenAPI Document

Also known as OpenAPI documents / OpenAPI file / OpenAPI description / OpenAPI contract, an OpenAPI document outlines how your API behaves—or how it’s intended to behave once implemented—and is written according to the OpenAPI Specification. It serves as the blueprint for your API. While "API description" can be a broad term, an OpenAPI Document is specific: it’s the actual file, usually named openapi.yaml or openapi.json, that defines your API.

### OpenAPI Documentation

Also known as API Reference, one of the most common uses of an OpenAPI document is to generate API documentation—specifically, "API Reference Documentation". This is human-readable technical content that presents all the key details about your API’s endpoints, parameters, requests, and responses. It can be automatically generated from your OpenAPI document, saving you from manually writing it all out.