---
title: Schema Composition
authors: phil
excerpt: Use oneOf, anyOf, and allOf in OpenAPI & JSON Schema for polymorphism and composition.
date: 2024-07-24
---

In OpenAPI v3.1 and JSON Schema, you can use `oneOf`, `allOf`, and `anyOf` keywords to handle composition, which is the concept of combining multiple schemas and subschemas in various ways to handle polymorphism, or "extending" other schemas to add more criteria.

## What are oneOf, anyOf, and allOf?

- **allOf:** (AND) Must be valid against all of the subschemas.
- **anyOf:** (OR) Must be valid against any of the subschemas.
- **oneOf:** (XOR) Must be valid against exactly one of the subschemas.

All of these keywords must be an array, where each item is a schema. Be careful with recursive schemas as they can exponentially increase processing times.

### oneOf

The `oneOf` keyword is used when you want to specify that a value should match one of the given schemas exactly. It's useful when you have different possible data structures or types for a particular field, like accepting bank account or card payments, or having train tickets and tram tickets, which are similar but a little different. 

The validation will pass if the value matches exactly one of the schemas defined in `oneOf`.

This can be done for a single value:

```yaml
properties:
	timestamp:
    oneOf:
    - type: string
      format: date-time
      examples:
      - '2024-07-21T17:32:28Z'
    - type: integer
      examples: 
      - 1721820298
```

In this example the `timestamp` property could be either a RFC 3339 date time (e.g. `2017-07-21T17:32:28Z`) or a unix timestamp (e.g. `1721820298`).

That shows how it works for a single property, but `oneOf` can also be used with whole objects:

```yaml
 properties:
    source:
      oneOf:
        - title: Card
          properties:
            number:
              type: string
            cvc:
              type: integer
            exp_month:
              type: integer
              format: int64
            exp_year:
              type: integer
              format: int64
          required:
            - number
            - cvc
            - exp_month
            - exp_year
        
        - title: Bank Account
          type: object
          properties:
            number:
              type: string
            sort_code:
              type: string
            account_type:
              type: string
              enum:
                - individual
                - company
          required:
            - number
            - account_type

```

In the above example, the `source` property will be an object either way, but the properties contained within can be in one of two combinations. Either `number`, `cvc`, `exp_month`, and `exp_year` are valid and in good form (a card payment), or  `number`, `sort_code`, and `account_type` will be sent (a bank account). These are the only two outcomes which will return a valid result in a validator, because if neither subscheme match it will be invalid, and if multiple subschemas match that will also be invalid.

### anyOf

The `anyOf` keyword is very similar to `oneOf` but a little less restrictive. `oneOf` is more like a XOR in programming, where one or the other can match, but never both. anyOf is more like a regular OR, which allows one or another or both. 

Just like `oneOf`, you can use `anyOf` when you have multiple valid options for a particular field. The validation will pass if the value matches one or more of the listed subschemas.

```yaml
oneOf:
  - type: number
    multipleOf: 5
  - type: number
    multipleOf: 3
```

The values *1, 2, 4, 7, 8, 11, 13, 14* would all be rejected for not being multiples of either 3 or 5. 

The values *3, 5, 6, 9, 10, 12* would be valid for being multiples of 3 and 5.

The value *15* would be rejected because it is multiples of both 3 and 5, and `oneOf` doesn't like that.

### allOf

The `allOf` keyword is used when you want to specify that a value should match all of the given schemas. It is useful when you want to combine multiple schemas together. The validation will pass if the value matches all of the schemas defined in `allOf`.

```yaml
allOf:
  - type: object
    properties:
      name:
        type: string
  - type: object
    properties:
      age:
        type: integer
        minimum: 0
```

In the above example, the value should be an object that has both a `name` property of type string and an `age` property of type integer with a minimum value of 0.

## References in Composition

All of these keywords can contain a list of subschemas that are defined directly inside them, or a `$ref` can point to a schema defined elsewhere.

```yaml
schema:
  oneOf:
    - $ref: '#/components/schemas/Card'
    - $ref: '#/components/schemas/BankAccount'
```

This says that the schema can be either one of these schemas stored as [shared components](../understanding-structure/components.md).

Due to the way `allOf` works, you can essentially reference multiple schemas and say "I want all of the validation rules and criteria from all of these schemas to apply here", providing a sort of merge-like functionality.

```yaml
schema:
  allOf:
    - $ref: '#/components/schemas/PaymentMethod'
    - $ref: '#/components/schemas/BankAccount'
```

This basically declares a schema which has a lot of generic payment fields, then adds specific fields from the bank account type, to avoid declaring generic fields like "name" and "number" in both. 

Feel free to mix and match a `$ref` and an inline subschema, which is a handy way to pop some extra content into a generic shared schema like HATEOAS links:

```yaml
content:
  application/json:
    schema:
      allOf:
        - $ref: '#/components/schemas/Booking'
        - properties:
            links:
              $ref: '#/components/schemas/Links-Self'
```

These schema composition keywords provide flexibility and allow you to define complex data structures and validation rules in OpenAPI v3.1 and JSON Schema, which becomes more useful as you start to [improve reuse across one or more API](../advanced/splitting-documents-with-ref.md).
