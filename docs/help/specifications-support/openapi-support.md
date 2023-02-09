# OpenAPI support

## Partially supported: `securitySchemes (V3)` / `securityDefinitions (V2)`

We support OpenAPI `securitySchemes` property (`securityDefinitions` with openAPI v2) with these authentication type values:

- `http`
- `apiKey`
- `oauth2`
- `openIdConnect`

We do not support `mutualTLS`. To describe a `mutualTLS` authentication method, please use the [`x-topics` property](https://help.bump.sh/markdown-support#adding-topics-to-your-documentation) for now.

## readOnly and writeOnly properties

JSON Schema provides possibility to declare a property as read or write Only, with boolean fields writeOnly and readOnly (cf OpenAPI 3.0.3 or JSON Schema documentation).

Basically, in REST API context, it means that a writeOnly property makes sense in request only (as password for example). Thus, we decided to hide a property defined as writeOnly when it belongs to a response.

And a readOnly makes sense in response only (as created_at, updated_at, your call...). Similarly,  we decided to hide a property defined as readOnly when it belongs to a request body.

Thus, it becomes easy to use the same Schema Object in different contexts, for example as seen below:

```json
"schema": {
  "properties": {
    "password": {
      "type": "string",
      "format": "password",
      "writeOnly": true
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "readOnly": true
    }
  }
}
```

## Add topics to your documentation

As this is not supported by OpenAPI, we created a custom property to enrich your documentation. Find out more in our [dedicated section](help/doc-topics.md).

