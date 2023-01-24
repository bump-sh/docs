---
sidebar_label: 'OpenAPI support'
---
# Not (yet) supported properties

## Partially supported: `securitySchemes (V3)` / `securityDefinitions (V2)`

We support OpenAPI `securitySchemes` property (`securityDefinitions` with openAPI v2) with these authentication type values:

- `http`
- `apiKey`
- `oauth2`
- `openIdConnect`

We do not support `mutualTLS`. To describe a `mutualTLS` authentication method, please use the [`x-topics` property](https://help.bump.sh/markdown-support#adding-topics-to-your-documentation) for now.

## Add topics to your documentation

As this is not supported by OpenAPI, we created a custom property to enrich your documentation. Find out more in our [dedicated section](https://help.bump.sh/markdown-support#adding-topics-to-your-documentation).

