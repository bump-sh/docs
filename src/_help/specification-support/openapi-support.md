---
title: OpenAPI support
---

- TOC
{:toc}

We support all major versions from Swagger (OpenAPI v2) to OpenAPI 3.2. This page describes some specificities related to our support for this specification.

## Minimal mandatory fields

Bump.sh needs to receive at least these fields to generate a REST documentation

| field                  | description                                                                                                                                 |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `openapi` or `swagger` | define which version of the specification you want to use. Use the `swagger` key for v2 and `openapi` for the v3+. E.g. `openapi: "3.2.0"`. |
| `info`                 | General information about your API                                                                                                          |
| `info.title`           | The title of the API                                                                                                                        |
| `info.version`         | The version of the API document                                                                                                             |

## Partially supported: `securitySchemes (V3)` / `securityDefinitions (V2)`

We support OpenAPI `securitySchemes` property (`securityDefinitions` with openAPI v2) with these authentication type values:

- `http`
- `apiKey`
- `oauth2`
- `openIdConnect`

We do not support `mutualTLS`. To describe a `mutualTLS` authentication method, please use the [`x-topics` property](/help/enhance-documentation-content/topics/) for now.

## Partially supported: XML generated examples

We currently generate request or response examples in both JSON and
XML format if none are provided in your Schema object
definitions. However we don't yet support [the `xml:` attribute on
Schema objects](https://spec.openapis.org/oas/v3.1.0#xml-object).

## readOnly and writeOnly properties

JSON Schema provides the possibility to declare a property as read or write only. Read more in [the JSON Schema section of this documentation](/help/specification-support/json-schema#readonly-and-writeonly-properties).

## Webhooks support

You can use the `webhooks` field (introduced in OpenAPI 3.1) to define the API webhook payloads. Please read to the [dedicated documentation page](/help/specification-support/openapi-support/webhooks/) for more information.

## Overlays support

The [Overlay specification of OpenAPI](https://github.com/OAI/Overlay-Specification/) makes it possible to modify the content of an OpenAPI document by adding a layer on top of it. That layer helps adding, removing or changing some or all of the content of the original file. Please read to the [dedicated documentation page](/help/specification-support/overlays/) for more information.

## OpenAPI 3.2

> New to OpenAPI 3.2? Read our [OpenAPI 3.2 complete guide](/openapi/v3.2/).
{: .info}

OpenAPI 3.2 is fully supported. To use it, set the version in your API document:

```yaml
openapi: "3.2.0"
```

The features introduced by this version are handled as follows:

| Feature | Bump.sh behaviour |
|---------|-------------------|
| Tag object: `kind: nav` | Builds the navigation. Tags without `kind` behave the same way. |
| Tag object: `parent` | Nests navigation tags: a parent tag becomes a section, and its child tags become the groups of operations it contains. Replaces the [`x-tagGroups`](/help/customization-options/sections/) vendor extension, which is ignored when a hierarchy is defined. To learn more, see [Nested tag structures](/openapi/v3.2/documentation/grouping-operations-with-tags/#nested-tag-structures). |
| Tag object: `summary` | Used as the tag display name, behaving like our [`x-displayName` vendor extension](/help/specification-support/openapi-support/x-display-name/). |
| Tag object: `kind: badge` | Displayed as a [badge](/help/specification-support/doc-badges/#using-openapi-32-tags) on the operations and webhooks carrying the tag. Never displayed in the navigation. |
| Media Type object: `itemSchema` | Describes each item of a streaming response, for `application/jsonl`, `application/x-ndjson`, `application/json-seq`, `text/event-stream` and `multipart/mixed` content types. To learn more, see [JSON streaming](/openapi/v3.2/advanced/json-streaming/). |
| `QUERY` method | Rendered in the documentation and available in the API Explorer. |
| Path Item object: `additionalOperations` | Operations using any custom HTTP method are rendered like the others, with their method written as defined. |
| Example object: `dataValue` | Displayed in request and response examples. |
| Example object: `serializedValue` | Displayed in request and response examples without reformatting, and used in cURL samples for path, query and header parameters. |
| Response object: `summary` | Displayed alongside the response. |
| Server object: `name` | Displayed in the [Servers section](/help/specification-support/multiple-servers/). |
| Security Requirement object: reference by URI | Security schemes can be referenced by their path, not only by their name. |
| Security Scheme object: `deprecated` | Displays a deprecation badge on the security scheme. |
| OAuth Flows object: `deviceAuthorization` | Displayed in the Authentication section, with its Device Authorization URL.
| Security Scheme object: `oauth2MetadataUrl` | Displayed in the Authentication section. Only HTTPS URLs are displayed. |

