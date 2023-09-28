---
title: JSON Schema support
---

- TOC
{:toc}

Both OpenAPI and AsyncAPI specifications supports JSON Schema to define input and output data types, identified as a Schema Object:
Most of the time, a Schema Object is defined with keyword `schema`, and each child property can also be defined as a Schema object (as per definition of the JSON Schema specification).

```javascript
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

```javascript
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

> - `writeOnly` properties **are hidden** when they belong to a `subscribe` operation in AsyncAPI or a `response` in OpenAPI.
>
> - `readOnly` properties **are hidden** when they belong to a `publish` operation in AsyncAPI or a `request` in OpenAPI.
{: .warning}

> Not displaying `writeOnly` properties in subscribe operations and `readOnly` properties in publish operations allows the use of the same `Schema Object` everywhere it is needed, without generating  confusing informations in the documentation.
{: .info}


## Enumerated or constant values

It's frequent to have to restrict possible value(s) for a given property, and two keywords
are available in JSON schema to do this:

When several values are possible, good practice is to use keyword `enum`,
as mentioned in [Enumerated values documentation](https://json-schema.org/understanding-json-schema/reference/generic.html?highlight=const#enumerated-values).

Keyword `enum` is used, it has to declare an array of all possible values.
In your documentation, you'll see a sentence:
> Values are `foo` and `bar`.

When only one value is possible, instead of `enum` with one-item array,
you should consider keyword `const`, used to declare a single allowed value,
as mentioned in [Constant values documentation](https://json-schema.org/understanding-json-schema/reference/generic.html?highlight=const#constant-values).

In this case, property description in your documentation will look like that:
> Value is 42.

> ** `enum` and `const`?**
>
> When both `enum` and `const` fields are provided, allowed values is not easy to deduce.
> 
> `foo`, `bar`, 42?
>
> In this case, only `const` field is extracted, and you should be warned about in your deployment logs.
{: .info}
