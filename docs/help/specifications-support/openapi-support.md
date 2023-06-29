# OpenAPI support

## Partially supported: `securitySchemes (V3)` / `securityDefinitions (V2)`

We support OpenAPI `securitySchemes` property (`securityDefinitions` with openAPI v2) with these authentication type values:

- `http`
- `apiKey`
- `oauth2`
- `openIdConnect`

We do not support `mutualTLS`. To describe a `mutualTLS` authentication method, please use the [`x-topics` property](doc-topics.md) for now.

## readOnly and writeOnly properties

JSON Schema provides the possibility to declare a property as read or write only. Read more in [the JSON Schema section of this documentation](/specifications-support/json-schema.md#readonly-and-writeonly-properties).

## Add topics to your documentation

As this is not supported by OpenAPI, we created a custom property to enrich your documentation. Find out more in our [dedicated section](doc-topics.md).

