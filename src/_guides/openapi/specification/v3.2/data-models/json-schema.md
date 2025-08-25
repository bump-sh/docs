---
title: JSON Schema in OpenAPI
authors: phil
excerpt: Learn how JSON Schema and OpenAPI Schema are similar and how they are different.
date: 2024-07-17
---

- TOC
{:toc}

For a long time JSON Schema and OpenAPI Schema Objects were similar but different. OpenAPI was inspired by JSON Schema, then they both evolved separately, but finally in OpenAPI v3.1 with lots of work from both teams, the specifications realigned on JSON Schema Draft 2020-12. This means you can learn more about OpenAPI Schema Objects by learning more about JSON Schema.

## JSON Schema Documentation

The best places to start learning about JSON Schema is via the documentation, which comes in a few forms.

- [JSON Schema Tutorials](https://json-schema.org/learn/getting-started-step-by-step) - Getting started guides, and tutorials focusing in on particular bits like the differences between required and optional properties, nesting schemas, using composition with anyOf, allOf, and oneOf, etc. 
- [JSON Schema Glossary](https://json-schema.org/learn/glossary) - There's a lot of terminology to wrap your head around depending on how deep you want to go, such as dialect, vocabulary, instance, subschema, composition, etc. This page explains it all and links off to more information on each.
- [Lean JSON Schema](https://www.learnjsonschema.com/2020-12/) - A mixture between specification and tutorial, with lots of examples explaining how various keywords work.

These resources are intended to help the general user not need to go and dive into the specifications straight away, as these are more technical documents aimed more at tooling developers. If you cannot find what you need to know in the documentation then you might end up reading the specifications, so where can those be found?

## JSON Schema Specifications

In OpenAPI v3.2 the [Schema Object](https://spec.openapis.org/oas/v3.2.0#schema-object) is defined as a superset of the JSON Schema specification, which is split across two relevant specifications.

- [JSON Schema Core](https://www.ietf.org/archive/id/draft-bhutton-json-schema-01.html) (IETF draft-bhutton-json-schema-01) - defines the basic foundation of JSON Schema.
- [JSON Schema Validation](https://www.ietf.org/archive/id/draft-bhutton-json-schema-validation-01.html) (IETF draft-bhutton-json-schema-validation-01) - defines the validation keywords of JSON Schema.

> Unless stated otherwise, the keyword definitions follow those of JSON Schema and do not add any additional semantics; this includes keywords such as `$schema`, `$id`, `$ref`, and `$dynamicRef` being URIs rather than URLs. Where JSON Schema indicates that behavior is defined by the application (e.g. for annotations), OAS also defers the definition of semantics to the application consuming the OpenAPI document.
> **Source: [OAS 3.2 Specification](https://spec.openapis.org/oas/v3.2.0#schema-object)**

If you end up having to read through the specification to find out something which would fit better in a tutorial, please take the time to contribute that tutorial back to the [JSON Schema website](https://github.com/json-schema-org/website) to avoid others needing to do the same.

## Extra OpenAPI-specific Properties

As mentioned above the OpenAPI Schema Object is a superset of JSON Schema Draft 2020-12, which means it supports everything and adds a few bits on top. This works because JSON Schema has the concept of [dialects](https://tools.ietf.org/html/draft-bhutton-json-schema-00#section-4.3.3), and the OpenAPI Schema Object is a new dialect, which takes the JSON Schema vocabularies that give you all the keywords defined in the core and validation specifications, then adds four more: 

- `example` - A free-form property to include an example of an instance for this schema. To represent examples that cannot be naturally represented in JSON or YAML, a string value can be used to contain the example with escaping where necessary. **Deprecated:** The example property has been deprecated in favor of the JSON Schema examples keyword. [Learn more about examples](_guides/openapi/specification/v3.2/data-models/examples.md).
- `externalDocs` - Additional documentation found elsewhere outside of the OpenAPI or generated documentation, like tutorials or blog posts.
- `xml` - Optional keyword for describing XML payloads, which does nothing on root schemas but helps describe properties where there may be wrapping tags or XML attributes.
- `discriminator` - The discriminator is an object name that is used to differentiate between other schemas which may satisfy the payload description, acting as a shortcut for `oneOf` / `anyOf`. It cannot change the validity of the schema, but it helps tools like code generators work quicker by not having to check every possible schema.

Most of this stuff can be ignored to build the majority of APIs, especially if you're JSON-only. If you do use these keywords do not worry about losing compatibility with JSON Schema tooling. JSON Schema ignores keywords it does not understand, and if any tooling gives you a hard time about these keywords, then not only is it not OpenAPI compliant, it is not JSON Schema compliant either.
