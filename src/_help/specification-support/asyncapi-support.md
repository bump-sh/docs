---
title: AsyncAPI Support
---

- TOC
{:toc}

We support the [AsyncAPI specification](https://www.asyncapi.com/docs/reference/specification/latest) versions 2 and 3. This page describes some specificities related to our support for this specification.

## Minimal mandatory fields

Bump.sh needs to receive at least these fields to generate a Message-Driven documentation

| field          | description                                                                                       |
|----------------|---------------------------------------------------------------------------------------------------|
| `asyncapi`     | define which version of the specification you want to use. E.g. `"3.1.0"`                         |
| `info`         | General information about your API                                                                |
| `info.title`   | The title of the API                                                                              |
| `info.version` | The version of the API document                                                                   |
| `channels`     | AsyncAPI 2: the available channels and messages for the API                                     |
| `operations`   | AsyncAPI 3: the available operations for the API, each with an `action` and a `channel` `$ref` |

## Currently supported

Bump.sh is able to extract:

- root properties (AsyncAPI Object)
- channels (with automatic grouping according to channel name or tag grouping)
- operations (`subscribe` and `publish` in AsyncAPI 2, `send` and `receive` in AsyncAPI 3)
- messages (payload and headers), with examples.
- bindings (server, channel, operation and message).

## Customizing the navigation

By default, operations are displayed under a “Channels” section in AsyncAPI 2, and under an “Operations” section in AsyncAPI 3. You can replace it with your own set of sections using the [`x-tagGroups` vendor extension](/help/customization-options/sections/), which groups your tagged operations under the section names of your choice.

## AsyncAPI 3

> New to AsyncAPI 3? Read our [AsyncAPI cheat sheet](/guides/asyncapi/cheatsheet/).
{: .info}

AsyncAPI 3 is supported. To use it, set the version in your API document:

```yaml
asyncapi: "3.1.0"
```

The features introduced by this version are handled as follows:

| Feature | Bump.sh behaviour |
|---------|-------------------|
| Operation object: `action` | Displayed as a `send` or `receive` badge on the operation. |
| Operation object: `channel` | The operation displays the address, description, parameters and bindings of its channel. An operation without a valid `channel` is ignored. |
| Operation object: `messages` | Displayed on the operation. When an operation lists no `messages`, all the messages of its channel are displayed. |
| Operation object: `reply` | Displayed in a "Reply" block below the operation, showing the reply's address, messages, parameters and bindings. |
| Operation Reply Address object | Its `location` is displayed as the reply address, instead of the reply channel address. |
| Channel object: `address` | Displayed as the path of the operation. A channel without an `address` is displayed as `{dynamicAddress}`. |
| Channel and Server objects: `title` and `summary` | Displayed alongside their description. |
| Operation object: `title` and `summary` | The `title` is used as the operation title. When an operation has no `title`, its `summary` is used instead, and then its id. |
| Parameter object | Its `description`, `enum`, `default` and first item of `examples` are displayed. `location` is not displayed. |
| Server object: `host`, `pathname` and `protocol` | Used to build the server URL. Server variables are replaced by their default value. |
| Operation and Message traits | Applied following AsyncAPI 3 rules: a trait never overrides a value already defined on its target. |
| `info.tags` | Used to build the navigation. Root `tags` are used when `info.tags` is missing. |
| `externalDocs` | Displayed for the `info` object, servers, channels, operations and messages. |
| Security Scheme object: `scopes` and OAuth Flow object: `availableScopes` | Displayed in the Authentication section. Security requirements are read from the first server. |
| ROS 2 bindings (AsyncAPI 3.1) | Displayed for servers and operations. |

The following fields are not supported yet:
- Message object: `correlationId`, `contentType`, and root `defaultContentType`,
- Message object: Partial support of Multi Format Schema `payload` and
  `headers` (`schemaFormat` and `schema`). We only support it when
  `schemaFormat` is AsyncAPI Schema objects, OpenAPI schema objects or
  JSONSchema objects,
- Operation object: `security`,
- Channel object: `servers`.

## Partially supported: message object `payload`

[Message object](https://www.asyncapi.com/docs/reference/specification/latest#messageObject) field `payload` could be of any type according to the specification, but we only support `SchemaObject` type. A payload of another type is not displayed.

## Partially supported: server `security` and `securitySchemes`

AsyncAPI `securitySchemes` property with these authentication types are supported:

- `http`
- `apiKey`
- `httpApiKey`
- `oauth2`
- `openIdConnect`

The following authentication types are **not** supported:
- `userPassword`
- `X509`
- `symmetricEncryption`
- `asymmetricEncryption`
- `plain`
- `scramSha256`
- `scramSha512`
- `gssapi`

To describe these authentication types, please use our [custom `x-topics` property](/help/documentation-experience/topics/) for now.

## readOnly and writeOnly properties

JSON Schema provides the possibility to declare a property as read or write only. Read more in [the JSON Schema section of this documentation](/help/specification-support/json-schema#readonly-and-writeonly-properties).

You can add extra information to your documentation by using Bump.sh custom `x-topics`.

Read more in the [Topics section of this documentation](/help/documentation-experience/topics/).
