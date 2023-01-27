# Polymorphism

Bump fully supports polymorphism for OpenAPI and AsyncAPI, commonly called anyOf, oneOf and allOf. More details on these discriminators can be found on each specification documentation:

- [OpenAPI](https://spec.openapis.org/oas/v3.1.0#discriminator-object)
- [AsyncAPI](https://www.asyncapi.com/docs/reference/specification/v2.5.0#schemaComposition)

To ease readability, we strongly recommend to give titles to your alternatives: it will help to identify and search them, specifically if you use this feature extensively.

Here's an [example of polymorphism](https://bump.sh/bump/doc/petstore-alternatives#operation-post-pets-body-animal-cat-species-species-alternative) in action:

![](/files/anyof.gif)

