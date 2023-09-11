# JSON Schema support

Both OpenAPI and AsyncAPI specifications supports JSON Schema to define input and output data types, identified as a Schema Object:
Most of the time, a Schema Object is defined with keyword `schema`, and each child property can also be defined as a Schema object (as per definition of the JSON Schema specification).

```json
"schema": { // this property is a Schema Object
  "type": "object",
  "properties": {
    "hello": {
      // this property named 'hello' is defined by Schema Object
      "type": "string"
    },
    "world": {
      // this property named 'world' is also defined by Schema Object
      "type": "string"
    }
  }
}
```

[Here a documentation we love about JSON Schema](https://json-schema.org/)

Thus, JSON schema is supported by Bump.sh, for both AsyncAPI ond OpenAPI Specification.

## readOnly and writeOnly properties

JSON Schema provides the possibility to declare a property as read or write only, with boolean fields `writeOnly` and `readOnly` (cf [JSON Schema documentation](https://json-schema.org/draft-07/json-schema-validation.html#rfc.section.10.3)).

Thus, it becomes easy to use the same `Schema Object` in different contexts, for example as seen below:

```json
"schema": {
  "type": "object",
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
