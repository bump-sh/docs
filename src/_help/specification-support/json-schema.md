---
title: JSON Schema support
---

- TOC
{:toc}

JSON schema is supported by Bump.sh

## readOnly and writeOnly properties

JSON Schema provides the possibility to declare a property as read or write only, with boolean fields `writeOnly` and `readOnly` (cf [JSON Schema documentation](https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.10.3)).

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

:::warning
- `writeOnly` properties **are hidden** when they belong to a `subscribe` operation in AsyncAPI or a `response` in OpenAPI.

- `readOnly` properties **are hidden** when they belong to a `publish` operation in AsyncAPI or a `request` in OpenAPI.
:::

:::info
Not displaying `writeOnly` properties in subscribe operations and `readOnly` properties in publish operations allows the use of the same `Schema Object` everywhere it is needed, without generating  confusing informations in the documentation.
:::
