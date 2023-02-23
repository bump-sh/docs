# AsyncAPI Support

## Current support state

Event driven APIs world is more complex than REST APIs one: there are more protocols, more tools, more different architectures. As a consequence, AsyncAPI is more complex that OpenAPI to support. We wanted to open our beta fast, so we have chosen to release it with minimal features.

## Currently supported

Bump is able to extract:

- root properties (AsyncAPI Object)
- channels (with automatic grouping according to channel name or tag grouping)
- operations (subscribe and publish)
- messages (payload and headers), with examples.
- bindings (server, operation and message).

## Partially supported: message object `payload`

Message#payload could be of any type according to the specification, but we only support `SchemaObject` type.

## Partially supported: server `security` and `securitySchemes`

We support AsyncAPI `securitySchemes` property with these authentication types:

- `http`
- `apiKey`
- `httpApiKey`
- `oauth2`
- `openIdConnect`

We do not support `X509`, `symmetricEncryption`, `asymmetricEncryption`, `plain`, `scramSha256`, `scramSha512` nor `gssapi.` To describe these authentication types, please use our [custom `x-topics` property](doc-topics.md) for now.

## readOnly and writeOnly properties

JSON Schema provide possibility to declare a property as read or write Only, with boolean fields writeOnly and readOnly (cf JSON Schema documentation).

Basically, in Async API context, it means that a writeOnly property makes sense in request only (as password for example). Thus, we decided to hide a property defined as writeOnly when it belongs to a subscribe operation (messages produced by the application and sent to the channel).

And a readOnly makes sense in response only (as created_at, updated_at, your call...). Similarly,  we decided to hide a property defined as readOnly when it belongs to a publish operation (messages consumed by the application from the channel).

Thus, it becomes easy to use the same Schema Object in different context, for example as seen below:

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

As this is not supported by AsyncAPI, we created a custom property to enrich your documentation. Find out more in our [dedicated section](doc-topics.md).

