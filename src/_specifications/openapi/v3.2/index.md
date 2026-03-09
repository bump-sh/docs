---
title: "OpenAPI 3.2 Specification Complete Guide"
excerpt: "The complete guide to the OpenAPI 3.2 specification. Learn how to describe REST APIs, define endpoints, schemas, security, and more with the industry standard for API description."
date: 2025-07-22
display_authors: false
---

OpenAPI is the industry standard for describing HTTP APIs. Maintained by the [OpenAPI Initiative](https://www.openapis.org/) under the Linux Foundation, it provides a structured, machine-readable format that tools can use to generate documentation, client libraries, tests, mock servers, and more.

This guide covers every aspect of the OpenAPI 3.2 specification, from the basics of document structure to advanced topics like streaming, pagination, and overlays.

## Introduction

- [**What is OpenAPI?**](/openapi/v3.2/introduction/what-is-openapi/): what the specification is, what an OpenAPI document looks like, and the key concepts (documents, operations, schemas, security).
- [**History and evolution**](/openapi/v3.2/introduction/history/): from Swagger to OpenAPI 3.0, 3.1 (JSON Schema alignment), and 3.2 (streaming, pagination, tag hierarchies).
- [**Benefits of using OpenAPI**](/openapi/v3.2/introduction/benefits/): how OpenAPI accelerates documentation, testing, SDK generation, onboarding, and collaboration across teams.

## Understanding OpenAPI structure

The core building blocks of every OpenAPI document.

- [**Basic structure**](/openapi/v3.2/understanding-structure/basic-structure/): the eight main sections of an OpenAPI document: version, info, servers, paths, components, security, webhooks, and tags.
- [**API servers**](/openapi/v3.2/understanding-structure/api-servers/): defining base URLs for different environments (dev, staging, production) with support for server variables and dynamic substitution.
- [**Paths and operations**](/openapi/v3.2/understanding-structure/paths-operations/): describing endpoints and HTTP methods (GET, POST, PUT, DELETE, and the new QUERY method in v3.2) with request bodies and responses.
- [**Parameters**](/openapi/v3.2/understanding-structure/parameters/): path, query, header, and cookie parameters with types, validation, and reusability via components.
- [**Parameter serialization**](/openapi/v3.2/understanding-structure/parameter-serialization/): how arrays and objects are encoded in URLs using styles like form, spaceDelimited, pipeDelimited, and deepObject.
- [**HTTP requests**](/openapi/v3.2/understanding-structure/http-requests/): defining request bodies with content types, schemas, and required/optional flags.
- [**HTTP responses**](/openapi/v3.2/understanding-structure/http-responses/): documenting status codes, response headers, content types, and empty responses.
- [**Components**](/openapi/v3.2/understanding-structure/components/): reusable schemas, parameters, responses, request bodies, headers, examples, and security schemes referenced with `$ref`.

## Defining data models

- [**Schemas and data types**](/openapi/v3.2/data-models/schema-and-data-types/): types (string, number, integer, boolean, array, object, null), formats (date-time, email, uuid), validation keywords (enum, minimum, maximum, pattern), and readOnly/writeOnly.
- [**JSON Schema in OpenAPI**](/openapi/v3.2/data-models/json-schema/): the relationship between OpenAPI and JSON Schema Draft 2020-12, and the four additional OpenAPI-specific keywords.
- [**Examples and defaults**](/openapi/v3.2/data-models/examples/): providing sample values at schema, media type, and parameter levels for documentation and mock servers.
- [**Schema composition**](/openapi/v3.2/data-models/schema-composition/): combining schemas with allOf (AND), anyOf (OR), and oneOf (XOR) for polymorphism and inheritance.
- [**Representing XML**](/openapi/v3.2/data-models/representing-xml/): customizing XML element names, attributes, namespaces, and array wrapping with the xml keyword.

## Advanced topics

- [**Splitting documents with $ref**](/openapi/v3.2/advanced/splitting-documents-with-ref/): managing large API definitions across multiple files and URLs for better collaboration and reusability.
- [**Multipart form data**](/openapi/v3.2/advanced/multipart-form-data/): describing form submissions that combine text fields, files, and metadata in a single request.
- [**Pagination**](/openapi/v3.2/advanced/pagination/): query parameters, response metadata, link-based, header-based, and cursor pagination strategies.
- [**File uploads**](/openapi/v3.2/advanced/file-uploads/): direct binary uploads and multipart uploads with base64 encoding and content type negotiation.
- [**Multiple content types**](/openapi/v3.2/advanced/multiple-content-types/): serving JSON, XML, CSV, and other formats from a single endpoint.
- [**Error formats**](/openapi/v3.2/advanced/error-formats/): standardized error responses with RFC 9457 Problem Details, JSON:API errors, and reusable error schemas.
- [**Security**](/openapi/v3.2/advanced/security/): authentication schemes (API keys, HTTP bearer, OAuth2, OpenID Connect, mutual TLS) applied globally or per-operation with scopes.
- [**Callbacks and webhooks**](/openapi/v3.2/advanced/callbacks-webhooks/): describing asynchronous events sent by the API to clients, including operation callbacks and standalone webhooks.
- [**JSON streaming**](/openapi/v3.2/advanced/json-streaming/): describing streamed responses (JSONL, NDJSON, Server-Sent Events) with the new itemSchema keyword in v3.2.

## Documenting APIs

- [**Descriptions and summaries**](/openapi/v3.2/documentation/descriptions-and-summaries/): writing clear summaries and descriptions for operations, parameters, tags, and responses that improve developer experience.
- [**Grouping with tags**](/openapi/v3.2/documentation/grouping-operations-with-tags/): organizing endpoints into logical sections with descriptions, ordering, and the new tag hierarchies in v3.2.
- [**External documentation**](/openapi/v3.2/documentation/external-documentation/): linking to tutorials, guides, and knowledge bases from operations, tags, and schemas.

## Extending OpenAPI

- [**Specification extensions**](/openapi/v3.2/extending/extensions/): adding custom x-* properties for vendor-specific features (code samples, beta flags, feedback links) without breaking compatibility.
- [**Overlays**](/openapi/v3.2/extending/overlays/): non-destructively modifying OpenAPI documents using JSONPath targeting to add descriptions, hide internal endpoints, or customize for different audiences.

## Workflow and best practices

- [**The perfect modern OpenAPI workflow**](/openapi/v3.2/the-perfect-modern-openapi-workflow/): using OpenAPI as a single source of truth in Git, with automated linting, contract testing, documentation deployment, mock servers, and SDK generation.

## Quick reference

- [**The Cheat Sheet**](/openapi/v3.2/cheatsheet/): a downloadable one-page visual reference of the entire specification for quick lookup.
