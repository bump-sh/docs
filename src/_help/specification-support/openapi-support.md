---
title: OpenAPI support
---

- TOC
{:toc}

## Partially supported: `securitySchemes (V3)` / `securityDefinitions (V2)`

We support OpenAPI `securitySchemes` property (`securityDefinitions` with openAPI v2) with these authentication type values:

- `http`
- `apiKey`
- `oauth2`
- `openIdConnect`

We do not support `mutualTLS`. To describe a `mutualTLS` authentication method, please use the [`x-topics` property](/help/doc-topics) for now.

## readOnly and writeOnly properties

JSON Schema provides the possibility to declare a property as read or write only. Read more in [the JSON Schema section of this documentation](/help/specification-support/json-schema#readonly-and-writeonly-properties).

## Specification extensions

These are additional properties that are not specified by the OpenAPI specification but are helpful for you to be able to customize your documentation content. All those properties start with the `x-` naming convention to be identified as “eXternal” from the OpenAPI specification.

### Add topics to your documentation (`x-topics`)

As this is not supported by OpenAPI, we created a custom property to enrich your documentation. Find out more in our [dedicated section](/help/doc-topics).

### Custom code sample examples (`x-codeSamples`)

This is another unsupported property by OpenAPI, we added a custom property so you can add your own code samples in one or more programming languages to your documentation. Find out more in our [dedicated section](/help/doc-code-samples).
