---
title: Schemas and Data Types
authors: phil
excerpt: "Learn about the most important part of OpenAPI: schemas, and data types."
date: 2024-07-18
---

One of the most important parts of OpenAPI is the `schema` object. Schema objects are used to describe HTTP request and response bodies, parameters, headers, and all sorts of other data, whether its JSON, XML, or primitive types like integers and strings. 

> If you're familiar with JSON Schema, you'll be right at home here, because OpenAPI v3.1 uses JSON Schema (draft 2020-12). For those who have not used JSON Schema before, that's ok, follow along.
{: .info }

The first thing to learn about a schema is the `type` keyword, which can be one or more of the following types:

- null
- boolean
- object
- array
- number
- string
- integer (matches any number with a zero fractional part)

A schema object looks like this:

```
type: string
```

It can also define multiple types, for instance making a property nullable:

```
type: [string, null]
```

It also allows you to support properties that could be either a number or a numeric string.

```
type: [number, string]
```

Describing an object will often involve the use of `properties` to define what each of the objects properties should look like, and each of those properties will have a "subschema" that describes it. 

```yaml
type: object
required:
- name
properties:
  name:
    type: string
  age:
    type: integer
```

Arrays work in a similar way, with an `items` keyword allowing each item in the array to be described.

```yaml
type: array
items:
  type: string
```

Arrays of objects can be described by combining the two concepts:

```yaml
type: array
items:
  type: object
  required:
  - name
  properties:
    name:
      type: string
    age:
      type: integer
```

## Data Formats

The `type` keyword sets out the basic data type, but knowing something is a string or an integer is just the first step to understanding what that data is all about.

First of all there's the `format` keyword, which covers a predefined set of common formats:

```yaml
type: array
items:
  type: object
  required:
  - name
  properties:
    name:
      type: string
    email:
      type: string
      format: email
    age:
      type: integer
      format: int32
```

The full list of formats defined in the JSON Schema Validation that OpenAPI v3.1 relies upon:

- date-time:  A string instance is valid against this attribute if it is a valid representation according to the "date-time" production as defined in [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339).

- date:  A string instance is valid against this attribute if it is a valid representation according to the "full-date" production as defined in [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339).

- time:  A string instance is valid against this attribute if it is a valid representation according to the "full-time" production as defined in [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339).

- duration:  A string instance is valid against this attribute if it is a valid representation according to the "duration" production as defined in [RFC3339](https://datatracker.ietf.org/doc/html/rfc3339).

- email:  As defined by the "Mailbox" ABNF rule in RFC 5321, section 4.1.2 [RFC5321](https://datatracker.ietf.org/doc/html/rfc5321).

- idn-email:  As defined by the extended "Mailbox" ABNF rule in RFC 6531, section 3.3 [RFC6531](https://datatracker.ietf.org/doc/html/rfc6531).

- hostname:  As defined by RFC 1123, section 2.1 [RFC1123](https://datatracker.ietf.org/doc/html/rfc1123), including host names produced using the Punycode algorithm specified in RFC 5891, section 4.4 [RFC5891](https://datatracker.ietf.org/doc/html/rfc5891).

- idn-hostname:  As defined by either [RFC 1123](https://datatracker.ietf.org/doc/html/rfc1123) as for hostname, or an internationalized hostname as defined by RFC 5890, section 2.3.2.3 [RFC5890](https://datatracker.ietf.org/doc/html/rfc5890).


- ipv4:  An IPv4 address according to the "dotted-quad" ABNF syntax as defined in RFC 2673, section 3.2 [RFC2673](https://datatracker.ietf.org/doc/html/rfc2673).
      
- ipv6:  An IPv6 address as defined in RFC 4291, section 2.2 [RFC4291](https://datatracker.ietf.org/doc/html/rfc4291).
      
- uri:  A string instance is valid against this attribute if it is a valid URI, according to [RFC3986](https://datatracker.ietf.org/doc/html/rfc3986).
      
- uri-reference:  A string instance is valid against this attribute if it is a valid URI Reference (either a URI or a relative- reference), according to [RFC3986](https://datatracker.ietf.org/doc/html/rfc3986).
      
- iri:  A string instance is valid against this attribute if it is a valid IRI, according to [RFC3987](https://datatracker.ietf.org/doc/html/rfc3987).
      
- iri-reference:  A string instance is valid against this attribute if it is a valid IRI Reference (either an IRI or a relative- reference), according to [RFC3987](https://datatracker.ietf.org/doc/html/rfc3987).
 
- uuid:  A string instance is valid against this attribute if it is a valid string representation of a UUID, according to [RFC4122](https://datatracker.ietf.org/doc/html/rfc4122).

- uri-template: A string instance is valid against this attribute if it is a valid URI Template (of any level), according to [RFC6570](https://datatracker.ietf.org/doc/html/rfc6570).

- json-pointer:  A string instance is valid against this attribute if it is a valid JSON string representation of a JSON Pointer, according to RFC 6901, section 5 [RFC6901](https://datatracker.ietf.org/doc/html/rfc6901).

- relative-json-pointer: A string instance is valid against this attribute if it is a valid Relative JSON Pointer [relative-json-pointer](https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#ref-relative-json-pointer).

- regex - A regular expression, which SHOULD be valid according to the ECMA-262 ecma262 regular expression dialect

You can also define your own custom formats, which tooling will not understand, but that doesn't matter as the specification tells tooling to ignore unknown formats.

## Validation

In addition to defining data types and formats, [JSON Schema](_guides/openapi/specification/v3.1/data-models/json-schema.md) provides several validation keywords to enforce specific constraints on the data. Here are a few popular validation keywords:

## const & enum

Restricting a value down to one or more potential values can be done with the `const` or `enum` keywords. 

First, a look at `enum`, as that keyword has been around longer and is more used:

```yaml
type: string
enum:
  - pending
  - fulfilled
  - archived
```

This says the string can't just be any old string, it has to be one of the approved values listed in `enum`.

> Learn more about const on [JSON-Schema.org: Enumerated Values](https://json-schema.org/understanding-json-schema/reference/enum).
{: .info }

OpenAPI v3.1 gained the `const` keyword added in modern JSON Schema, which helps with describing something that can only ever be one value.

The JSON Schema tutorial uses the example of having a country field where you only support shipping to the United States for export reasons:

```yaml
properties:
  country:
    const: United States of America
```

That's one way to use it, but another is to act as a switch in a `oneOf`.

```yaml
oneOf:
  - title: Card
    properties:
      object:
        type: string
        const: card
      number:
        type: string
      cvc:
        type: integer
      exp_month:
        type: integer
      exp_year:
        type: integer
  
  - title: Bank Account
    type: object
    properties:
      object:
        const: bank_account
        type: string
      number:
        type: string
      sort_code:
        type: string
```

In this example the `object` could be `card` or `bank_account`, but instead of defining that as an enum and the other properties all have to figure out whether they relate to cards or bank accounts, we use the `const` to help match the subschema.

> Learn more about `const` on [JSON-Schema.org: Constant Values](https://json-schema.org/understanding-json-schema/reference/const), and read our guide on [Schema Composition](_guides/openapi/specification/v3.1/data-models/schema-composition.md) to learn more about `oneOf`.
{: .info }


## default 

Setting a `default` lets people and code know what to do when a value has not been provided. 

```
type: string
enum:
  - pending
  - fulfilled
  - archived
```




### minimum and maximum

The `minimum` and `maximum` keywords allow you to specify the minimum and maximum values for numeric properties. For example:

```yaml
type: number
minimum: 0
maximum: 100
```

This schema ensures that the value of the property falls within the range of 0 to 100.

### enum

The `enum` keyword allows you to define a list of acceptable values for a property. For example:

```yaml
type: string
enum:
  - apple
  - banana
  - orange
```

This schema restricts the property value to be one of the specified options: "apple", "banana", or "orange".

### pattern

The `pattern` keyword allows you to enforce a specific regular expression pattern for string properties. For example:

```yaml
type: string
pattern: ^[A-Za-z]+$
```

This schema ensures that the property value consists of only alphabetic characters.

### required

The `required` keyword is used to specify the required properties within an object. For example:

```yaml
type: object
required:
  - name
  - age
```

This schema mandates that the properties "name" and "age" must be present in the object.

For more information on JSON Schema validation keywords, you can refer to the [JSON Schema Validation documentation](https://json-schema.org/learn/validation.html).


### Learn more about JSON Schema

There is a lot more to JSON Schema and OpenAPI Schema Objects than we've covered here, but this will hopefully get you off to a good start. If you need to learn more, you can read our guide on [JSON Schema in OpenAPI](_guides/openapi/specification/v3.1/data-models/json-schema.md).
