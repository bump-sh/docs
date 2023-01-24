---
sidebar_label: 'AsyncAPI Support'
---

# Current support state

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

We do not support `X509`, `symmetricEncryption`, `asymmetricEncryption`, `plain`, `scramSha256`, `scramSha512` nor `gssapi.` To describe these authentication types, please use our [custom `x-topics` property](https://help.bump.sh/markdown-support#adding-topics-to-your-documentation) for now.

## Add topics to your documentation

As this is not supported by AsyncAPI, we created a custom property to enrich your documentation. Find out more in our [dedicated section](https://help.bump.sh/markdown-support#adding-topics-to-your-documentation).

