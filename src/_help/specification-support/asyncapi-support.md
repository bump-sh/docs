---
title: AsyncAPI Support
---

- TOC
{:toc}

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

To describe these authentication types, please use our [custom `x-topics` property](/help/doc-topics) for now.

## readOnly and writeOnly properties

JSON Schema provides the possibility to declare a property as read or write only. Read more in [the JSON Schema section of this documentation](/help/specification-support/json-schema#readonly-and-writeonly-properties).

## Add topics to your documentation

You can add extra information to your documentation by using Bump.sh custom `x-topics`.

Read more in the [Topics section of this documentation](/help/doc-topics).
