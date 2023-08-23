---
title: Polymorphism
---

- TOC
{:toc}

Bump.sh fully supports polymorphism for OpenAPI and AsyncAPI, commonly called anyOf, oneOf and allOf.
More details on these combinators can be found on each specification documentation:

- [OpenAPI](https://spec.openapis.org/oas/v3.1.0#discriminator-object)
- [AsyncAPI](https://www.asyncapi.com/docs/reference/specification/v2.5.0#schemaComposition)

To ease readability, we strongly recommend to give titles to your alternatives: it will help to identify and search them, specifically if you use this feature extensively.

Here's an [example of polymorphism](https://bump.sh/bump/doc/petstore-alternatives#operation-post-pets-body-animal-cat-species-species-alternative) in action:

![](/images/help/anyOf-discriminator.gif)

# Discriminator

Both OpenAPI and AsyncAPI specifications provide support of a `discriminator` field,
to easily identify which schema is used.

In our generated API documentation, this `discriminator` property is identified
with a specific flag, and allowed value is explicit.

In example provided above:
* `type` is the discriminator property between alternatives 'Human' or 'Pet'. Value has to be either `human` or `pet`.
* `kind` is the discriminator property between alternatives 'Dog' or 'Cat'. Value has to be either `🐕` or `🐈`.
