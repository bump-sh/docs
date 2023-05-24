---
title: Enhanced Specifications Support
tags: [Improvement]
---

Over the past weeks, we have considerably enhanced our support of the specifications.

## minLength, maxLength and pattern

Wherever you need to document restrictions on string fields, OpenAPI and AsyncAPI specifications rely on JSON Schema to support this.
`minLength` and `maxLength`  are meant to constrain the length of a string.
`pattern`  restrict the string to a specific Regular Expression (regex).

Email addresses, IBANs and ZIP/Postal codes could be great examples of these features.


![minlength-example.png](/files/changelog/minlength-example.png)


## readOnly  and  writeOnly  properties

JSON Schema allows defining a property as `readOnly`  or  `writeOnly`.
Many examples can easily be imagined when used with AsyncAPI or OpenAPI : `readOnly`  timestamp, `writeOnly`  password, etc...

Our [Help Center](https://docs.bump.sh/help/specifications-support/asyncapi-support/#readonly-and-writeonly-properties) shares more details on how Bump.sh works with this feature and a few examples.
