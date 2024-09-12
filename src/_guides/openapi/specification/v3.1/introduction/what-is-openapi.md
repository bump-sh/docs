---
title: What is OpenAPI?
authors: phil
excerpt: OpenAPI allows to describe how an API works, how a sequence of APIs work together, generate client code, create tests, apply design standards, deploy documentation, and much more.
date: 2024-07-25
---

- TOC
{:toc}

OpenAPI is a standard for describing an API (Application Programming Interface). The OpenAPI Specification (OAS) defines an open and independent description format for HTTP API services, which allows both humans and computers to discover and understand how an API works and how to interact with it, without the need to look at the source code. 

OpenAPI provides a machine-readable structured data format which can be also be read and written by people, allowing for tooling to help API developers, API product managers, technical writers, and governance teams, all the way through the API lifecycle.

![](/images/guides/openapi/specification/What-is-OpenAPI-Simple-API-Lifecycle-Vertical.png)

## Concepts

As with anything in computing there's lots of terminology and some definitions vary or overlap, which can be a bit confusing. Here is a quick reminder to understand correctly every concept and call a cat a cat.

![Call a cat a cat gif](https://storage.googleapis.com/bump-blog-resources/what-is-openapi/bump-api-call.gif)

## OpenAPI structure

Your OpenAPI documents lets you describe your REST API:

* Define general information about your API: description, terms of use, license, contact, etc…
* Authentication methods `HTTP`, `API keys`, `OAuth 2`, `OpenID`, etc…
* Available endpoints `/users`, etc…
* Since OpenAPI 3.1, [available webhooks](https://bump.sh/blog/changes-in-openapi-3-1#webhooks-support) 
* Available operations on each endpoint: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, etc…
* Input and output parameters for each operation

## Format

OpenAPI documents can be written both in YAML and JSON formats.

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

*Also known as OpenAPI spec / OAS*

The "OpenAPI Specification" describes the [specification written and maintained](https://github.com/OAI/OpenAPI-Specification) by the [OpenAPI Initiative](https://openapis.org/), and published on [spec.openapis.org](https://spec.openapis.org/). This is a technical document that helps OpenAPI users and tooling vendors have one set of expectations about how things should work.

### OpenAPI Document

*Also known as OpenAPI documents / OpenAPI file / OpenAPI description / OpenAPI contract*

An OpenAPI document describes how your API works, or how it will work when it's been built, and it's written following the OpenAPI specification. Think of this like a blueprint for your API. While an "API description" is a vague concept, OpenAPI Document is pretty concrete, it's where the OpenAPI that describes your API lives, and is usually something like `openapi.yaml` or `openapi.json`. 

### OpenAPI Documentation

*Also known as API Reference*

When you have an OpenAPI document one of the main things people do with it is create API documentation, more specifically "API Reference Documentation", which is human-readable technical documentation showing an end user all the relevant information about endpoints, requests, responses, etc. Your documentation can be automatically generated from your OpenAPI document to avoid the pain of writing it by hand.
