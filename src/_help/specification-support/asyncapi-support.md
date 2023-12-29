---
title: AsyncAPI Support
---

- TOC
{:toc}

We support the latest major version (v2) of [AsyncAPI specification](https://www.asyncapi.com/docs/reference/specification/v2.6.0#messageObject). This pages describes some specificities related to our support for this specification.

## Minimal mandatory fields

Bump.sh needs to receive at least these fields to generate a Message-Driven documentation

| field          | description                                                               |
|----------------|---------------------------------------------------------------------------|
| `asyncapi`     | define which version of the specification you want to use. E.g. `"2.6.0"` |
| `info`         | General information about your API                                        |
| `info.title`   | The title of the API                                                      |
| `info.version` | The version of the API document                                           |
| `channels`     | The available channels and messages for the API                           |

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

To describe these authentication types, please use our [custom `x-topics` property](/help/enhance-documentation-content/topics/) for now.

## readOnly and writeOnly properties

JSON Schema provides the possibility to declare a property as read or write only. Read more in [the JSON Schema section of this documentation](/help/specification-support/json-schema#readonly-and-writeonly-properties).

You can add extra information to your documentation by using Bump.sh custom `x-topics`.

Read more in the [Topics section of this documentation](/help/doc-topics).
