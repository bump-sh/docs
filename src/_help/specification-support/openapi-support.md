---
title: OpenAPI support
---

- TOC
{:toc}

We support all major versions from Swagger (OpenAPI v2), OpenAPI v3 and OpenAPI v3.1. This pages describes some specificities related to our support for this specification.

## Minimal mandatory fields

Bump.sh needs to receive at least these fields to generate a REST documentation

| field                  | description                                                                                                                                 |
|------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `openapi` or `swagger` | define which version of the specification you want to use. Use the `swagger` key for v2 and `openapi` for the v3+. E.g. `openapi: "3.1.0"`. |
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

## readOnly and writeOnly properties

JSON Schema provides the possibility to declare a property as read or write only. Read more in [the JSON Schema section of this documentation](/help/specification-support/json-schema#readonly-and-writeonly-properties).

## Webhooks support

You can use the `webhooks` field (introduced in OpenAPI 3.1) to define the API webhook payloads. Please read to the [dedicated documentation page](/help/specification-support/openapi-support/webhooks/) for more information.

## Expose your beta features (`x-beta`)

This custom property allows you to identify some components of your documentation as beta. Find out more in our [dedicated section](/help/specification-support/doc-beta).
