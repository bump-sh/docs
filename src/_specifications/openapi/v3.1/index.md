---
title: "OpenAPI 3.1 Specification Complete Guide"
excerpt: "The complete guide to the OpenAPI 3.1 specification. Learn how to describe REST APIs, define endpoints, schemas, security, and more with the industry standard for API description."
canonical_url: https://docs.bump.sh/openapi/v3.2/
date: 2024-07-25
display_authors: false
---

OpenAPI is the industry standard for describing HTTP APIs. Maintained by the [OpenAPI Initiative](https://www.openapis.org/) under the Linux Foundation, it provides a structured, machine-readable format that tools can use to generate documentation, client libraries, tests, mock servers, and more.

This guide covers every aspect of the OpenAPI 3.1 specification, from the basics of document structure to advanced topics like security, webhooks, and overlays. A [3.2 version of this guide](/openapi/v3.2/) is also available.

## Introduction

- [**What is OpenAPI?**](/openapi/v3.1/introduction/what-is-openapi/): what the specification is, what an OpenAPI document looks like, and the key concepts (documents, operations, schemas, security).
- [**History and evolution**](/openapi/v3.1/introduction/history/): from Swagger to OpenAPI 3.0 and 3.1 with its full JSON Schema alignment.
- [**Benefits of using OpenAPI**](/openapi/v3.1/introduction/benefits/): how OpenAPI accelerates documentation, testing, SDK generation, onboarding, and collaboration across teams.

## Understanding OpenAPI structure

The core building blocks of every OpenAPI document.

- [**Basic structure**](/openapi/v3.1/understanding-structure/basic-structure/): the main sections of an OpenAPI document: version, info, servers, paths, components, security, webhooks, and tags.
- [**API servers**](/openapi/v3.1/understanding-structure/api-servers/): defining base URLs for different environments with server variables.
- [**Paths and operations**](/openapi/v3.1/understanding-structure/paths-operations/): describing endpoints and HTTP methods with request bodies and responses.
- [**Parameters**](/openapi/v3.1/understanding-structure/parameters/): path, query, header, and cookie parameters with types and validation.
- [**Parameter serialization**](/openapi/v3.1/understanding-structure/parameter-serialization/): how arrays and objects are encoded in URLs using styles like form, spaceDelimited, and deepObject.
- [**HTTP requests**](/openapi/v3.1/understanding-structure/http-requests/): defining request bodies with content types and schemas.
- [**HTTP responses**](/openapi/v3.1/understanding-structure/http-responses/): documenting status codes, response headers, and content types.
- [**Components**](/openapi/v3.1/understanding-structure/components/): reusable schemas, parameters, responses, and security schemes referenced with `$ref`.

## Defining data models

- [**Schemas and data types**](/openapi/v3.1/data-models/schema-and-data-types/): types, formats, validation keywords (enum, minimum, maximum, pattern), and readOnly/writeOnly.
- [**JSON Schema in OpenAPI**](/openapi/v3.1/data-models/json-schema/): the relationship between OpenAPI 3.1 and JSON Schema Draft 2020-12.
- [**Examples and defaults**](/openapi/v3.1/data-models/examples/): providing sample values at schema, media type, and parameter levels.
- [**Schema composition**](/openapi/v3.1/data-models/schema-composition/): combining schemas with allOf, anyOf, and oneOf for polymorphism and inheritance.
- [**Representing XML**](/openapi/v3.1/data-models/representing-xml/): customizing XML element names, attributes, and namespaces.

## Advanced topics

- [**Multiple content types**](/openapi/v3.1/advanced/multiple-content-types/): serving JSON, XML, CSV, and other formats from a single endpoint.
- [**Multipart form data**](/openapi/v3.1/advanced/multipart-form-data/): describing form submissions that combine text fields and files.
- [**File uploads**](/openapi/v3.1/advanced/file-uploads/): direct binary uploads and multipart uploads with encoding.
- [**Error formats**](/openapi/v3.1/advanced/error-formats/): standardized error responses with RFC 9457 Problem Details and JSON:API.
- [**Security**](/openapi/v3.1/advanced/security/): authentication schemes (API keys, HTTP bearer, OAuth2, OpenID Connect, mutual TLS) with scopes.
- [**Callbacks and webhooks**](/openapi/v3.1/advanced/callbacks-webhooks/): describing asynchronous events sent by the API to clients.
- [**Splitting documents with $ref**](/openapi/v3.1/advanced/splitting-documents-with-ref/): managing large API definitions across multiple files for better collaboration.

## Documenting APIs

- [**Descriptions and summaries**](/openapi/v3.1/documentation/descriptions-and-summaries/): writing clear summaries and descriptions that improve developer experience.
- [**Grouping with tags**](/openapi/v3.1/documentation/grouping-operations-with-tags/): organizing endpoints into logical sections with descriptions and ordering.
- [**External documentation**](/openapi/v3.1/documentation/external-documentation/): linking to tutorials and guides from operations, tags, and schemas.

## Extending OpenAPI

- [**Specification extensions**](/openapi/v3.1/extending/extensions/): adding custom x-* properties for vendor-specific features.
- [**Overlays**](/openapi/v3.1/extending/overlays/): non-destructively modifying OpenAPI documents using JSONPath targeting.

## Workflow and best practices

- [**The perfect modern OpenAPI workflow**](/openapi/v3.1/the-perfect-modern-openapi-workflow/): using OpenAPI as a single source of truth with automated linting, testing, documentation, and SDK generation.

## Quick reference

- [**The Cheat Sheet**](/openapi/v3.1/cheatsheet/): a downloadable one-page visual reference of the specification.
