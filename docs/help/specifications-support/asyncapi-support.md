# AsyncAPI Support

## Currently supported

Bump.sh is able to extract:

- root properties (AsyncAPI Object)
- channels (with automatic grouping according to channel name or tag grouping)
- operations (subscribe and publish)
- messages (payload and headers), with examples.
- bindings (server, operation and message).

## Partially supported: message object `payload`

[Message object](https://www.asyncapi.com/docs/reference/specification/v2.6.0#messageObject) field `payload` could be of any type according to the specification, but we only support `SchemaObject` type.

## Partially supported: server `security` and `securitySchemes`

AsyncAPI `securitySchemes` property with these authentication types are supported:

- `http`
- `apiKey`
- `httpApiKey`
- `oauth2`
- `openIdConnect`

The following authentication types are **not** supported: 
- `X509`
- `symmetricEncryption`
- `asymmetricEncryption`
- `plain`
- `scramSha256`
- `scramSha512`
- `gssapi`
To describe these authentication types, please use our [custom `x-topics` property](doc-topics.md) for now.

## readOnly and writeOnly properties

:::info
Properties defined as `writeOnly` are hidden when they belong to a **subscribe operation**.
Properties defined as `readOnly` are hidden when they belong to a **publish operation**.
:::

In the AsyncAPI context, most often, a subscriber (or consumer) is an application that connects to the broker, manifests an interest in a certain type of message, and leaves the connection open so the broker can push messages from the publisher to them. (more info on that [in the AsyncAPI documentation](https://www.asyncapi.com/docs/tutorials/getting-started/event-driven-architectures))

JSON Schema provides the possibility to declare a property as read or write only, with boolean fields `writeOnly` and `readOnly` (cf [JSON Schema documentation](https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.10.3)).

Basically, in Async API context, it means that a `writeOnly` property makes sense in a **request** only (as password for example).

- `writeOnly` properties are hidden when they belong to a subscribe operation (messages produced by the application and sent to the channel).

`readOnly` makes sense in a **response** only ( `created_at`, `updated_at`, `uuid`...). Similarly, we decided to hide a property defined as readOnly when it belongs to a publish operation (messages consumed by the application from the channel).

- `readOnly` properties are hidden when they belong to a publish operation (messages consumed by the application from the channel).

:::info
Not displaying `writeOnly` properties in subscribe operations and `readOnly` properties in publish operations allows the use of same `Schema Object` everywhere it is needed, without generating  confusing informations in the documentation.
:::

Thus, it becomes easy to use the same `Schema Object` in different contexts, for example as seen below:

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

You can add extra information to your documentation by using Bump.sh custom `x-topics`.

Read more in the [Topics section of this documentation](doc-topics.md).