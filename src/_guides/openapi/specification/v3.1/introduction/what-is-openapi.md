---
title: What is OpenAPI?
authors: phil
excerpt: OpenAPI allows to describe how an API works, how a sequence of APIs work together, generate client code, create tests, apply design standards, deploy documentation, and much more.
date: 2024-07-25
---

OpenAPI is a standard for describing APIs (Application Programming Interfaces). The OpenAPI Specification ("OAS") defines an open and independent description format for HTTP API services and allows both humans and computers to discover and understand how an API works and how to interact with it, without the need to look at the source code. 

OpenAPI provides a machine-readable structured data format which can be also be read and written by people, allowing for tooling to help API developers, API product managers, technical writers, and governance teams, all the way through the API lifecycle.

![](/images/guides/What-is-OpenAPI-Simple-API-Lifecycle-Vertical.png)

## Concepts

As with anything in computing there's lots of terminology and some definitions vary or overlap, which can be a bit confusing. Here is a quick reminder to understand correctly every concept and call a cat a cat.

![Call a cat a cat gif](https://storage.googleapis.com/bump-blog-resources/what-is-openapi/bump-api-call.gif)

### OpenAPI Specification

*Also known as OpenAPI spec / OAS*

The "OpenAPI Specification" describes the [specification written and maintained](https://github.com/OAI/OpenAPI-Specification) by the [OpenAPI Initiative](https://openapis.org/), and published on [spec.openapis.org](https://spec.openapis.org/). This is a technical document that helps OpenAPI users and tooling vendors have one set of expectations about how things should work.

### OpenAPI Document

*Also known as OpenAPI documents / OpenAPI file / OpenAPI description / OpenAPI contract*

An OpenAPI document describes how your API works, or how it will work when it's been built, and it's written following the OpenAPI specification. Think of this like a blueprint for your API. While an "API description" is a vague concept, OpenAPI Document is pretty concrete, it's where the OpenAPI that describes your API lives, and is usually something like `openapi.yaml` or `openapi.json`. 

### OpenAPI Documentation

*Also known as API Reference*

When you have an OpenAPI document one of the main things people do with it is create API documentation, more specifically "API Reference Documentation", which is human-readable technical documentation showing an end user all the relevant information about endpoints, requests, responses, etc. Your documentation can be automatically generated from your OpenAPI description to avoid the pain of writing it by hand.
