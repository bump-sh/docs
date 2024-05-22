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

The [Overlay specification of OpenAPI](https://github.com/OAI/Overlay-Specification/) makes it possible to modify the content of an OpenAPI definition file by adding a layer on top of it. That layer helps adding, removing or changing some or all of the content of the original file. Please read to the [dedicated documentation page](/help/specification-support/overlays/) for more information.
