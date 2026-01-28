---
title: How to use and document polymorphism in APIs
authors: polo
image: blog/document-polymorphism-api.png
canonical_url: https://bump.sh/blog/api-architecture-diagrams
excerpt: Learn how to use `oneOf`, `anyOf` and `allOf` when writing an OpenAPI or AsyncAPI definition.
date: 2023-11-10
---

Don't Repeat Yourself. Be DRY! Anyone who ever had to manually correct thousand of flyers printed for an event,
with an obvious typo in date or location, could confirm it.
It would have been easier to review the original file before running the presses.

Every developer knows this rule (or should, at least).

> Asserting that code should be easy to change is akin to stating that children
> should be polite; the statement is impossible to disagree with.
> _(Source: Practical Object-Oriented design, Sandi Metz)_


As described in this very interesting book, _easy to change_ code
can be defined with:
_small changes in requirements require correspondingly small changes in code_.

And to do so, Single Responsibility, Don't Repeat Yourself and Single Source of Truth
are very important design patterns to develop smart applications, easy to use, easy to develop, easy to maintain, and thus improve the Developer Experience.

On this page, I'll do my best to explain and illustrate how polymorphism can be used in API development to help achieve these big objectives.
And I'm glad to share with this post a synthesis of what I learned for months about polymorphism, composition and inheritance support in API documentations, based on OpenAPI and AsyncAPI specifications.

## Polymorphism concept

We don't want to have two different behaviors for very similar objects, some parts of code
and logic would be duplicated.
Point about polymorphism is to extract what is common by nature, and what is specific to this instance.

For the following, we'll need an example to illustrate all these situations.

Let's consider a real estate agency application, whose purpose is to offer accommodations for rent.
We can consider that the main object for this agency is accommodation.

But what type of accommodation?

- House, with a garden, a tiled roof, a total size, monthly rent and an address.
- Apartment, with a specific floor, maybe parking slots and elevator, a total size, monthly rent and an address.

Wait… _Déjà-vu_, right?

House and Apartment have many shared informations, that are related to what they are by nature:
_A place where people live by giving some money._

Indeed, both house and apartment have shared information: a monthly rent, an address,
information about total area.

But only an apartment has a specific floor. And we don't usually care about
roof tiles unless you live in a house.

![polymorphism diagram](/images/guides/polymorphism_accomodation.png)

There are many solutions for implementing that into your codebase,
based on your team, language, framework, architecture, opinions about typed VS object oriented language…

But as said someone wise about API:

“Do what the hell you want with your backend, but expose a simple and documented API”

## Polymorphism in API

Polymorphism in API refers to the possibility to use the same endpoint for
similar but different objects. Indeed, it's a good practice
to avoid different endpoints to do somehow the same action.

For example, in a request body, we should favor a single endpoint to handle requests for different data types or structures.
And for a Response, it's practical to allow a single endpoint to return different representations of a resource, based on the request made by the client.

This gives a more flexible and scalable API design, as well as reducing the amount of endpoint duplications.

In our example, without polymorphism, we could imagine two different endpoints to add
a new accommodation to the real estate agency database.

- `POST /house`
- `POST /apartment`

Both would require a request body, with a lot of fields regarding house or apartment.
But we know that there are some shared information between these two object,
because they have something in common by nature: both are a place to live for (at least) humans.

A good practice here is to expose only one endpoint for this:
- `POST /accommodation`

Regarding the data provided to the request body, result would be to create
either a House, or an Apartment.

The request body for creating an apartment might look like this:

```json
{
  "type": "apartment",
  "size": 17,
  "rent": 707,
  "address": "rue de Clery, 75002 Paris, France",
  "floor": 4,
  "elevator": true
}
```

While the request body for creating a house might look like that:

```json
{
  "type": "house",
  "size": 149,
  "rent": 500,
  "address": "chemin du haut Pertuzou, 38160 Saint-Verand, France",
  "garden_size": 5000,
  "roof_tiles_type": "Clay",
  "solar_panels_power": 800
}
```

We can see here property `type` is used to find out what kind of accommodation has to be created.
It can be very well documented for REST or Event-Driven APIs, we'll come to this later.

In this way, polymorphism in REST APIs allows for a more flexible and scalable API design, as well as reducing the amount of endpoint duplications.

But API is consumed. And API consumers have to be very aware of this polymorphism.
At Bump.sh, we are convinced that the best solution is to have a very nice documentation for your API.

![new house request](/images/guides/house_without_discriminator.png)

source: https://bump.sh/demo/hub/support/doc/accommodation-polymorphism

Now, let's see how to properly document polymorphic resources with OpenAPI
or AsyncAPI specifications, based on JSON Schema.

## Polymorphism in API documentation

### JSON schema

Polymorphism is natively supported by JSON Schema, to handle schema composition.

As described in [JSON schema documentation](https://json-schema.org/understanding-json-schema/reference/combining.html)

> JSON Schema includes a few keywords for combining schemas together (…)
> The keywords used to combine schemas are:
> - allOf: (AND) Must be valid against all of the subschemas
> - anyOf: (OR) Must be valid against any of the subschemas
> - oneOf: (XOR) Must be valid against exactly one of the subschemas

First combinator `allOf` is not really concerned by this article.
Indeed, in our example, it's difficult to imagine an accommodation being
both a house _and_ an apartment. Currently, it can be summarized as a merge
between schemas described behind `allOf` list.

What is concerned by polymorphism are alternatives, `anyOf` (OR) or `oneOf` (XOR).

Now let's see how to document alternatives, with JSON schema, in OpenAPI and AsyncAPI
specifications. Good news, since both are based on JSON schema, same rules
can be applied (except about `discriminator`, we'll handle it very soon).

We could imagine an OpenAPI request body, or response content,
or even AsyncAPI message payload or headers, each schema is described with a
`Schema Object`. Alternatives could be inserted in a lot of places:

```yaml
# OpenAPI
paths:
  /accommodations:
    post:
      summary: Create an accommodation
      requestBody:
        content:
          application/json:
            schema:
              # insert schemas alternatives here
      responses:
        200:
          description: Accommodation has been created.
          content:
            application/json:
              schema:
                # insert schemas alternatives here

# AsyncAPI
channels:
  accommodations:
    subscribe:
      description: Accommodation creation
      message:
        payload:
          # insert schemas alternatives here
        headers:
          # insert schemas alternatives here
```

Next, we'll consider the OpenAPI request body to create an accommodation.
Either house, either apartment.

### OpenAPI example

Please see below the complete example of `POST /accommodation` request body,
used for [this documentation](https://bump.sh/demo/hub/support/doc/accommodation-polymorphism).

```yaml
paths:
  /accommodation:
    post:
      summary: Create an accommodation
      description: |
        Example about polymorphism in API.
        This endpoint 'POST /accommodation' can be used to
        create either apartment, either house.
      requestBody:
        content:
          application/json:
            schema:
              oneOf:
                - $ref: "#/components/schemas/House"
                - $ref: "#/components/schemas/Apartment"

components:
  schemas:
    Accommodation:
      type: object
      required:
        - type
        - size
        - monthly_rent
        - address
      properties:
        type:
          type: string
        size:
          type: integer
        monthly_rent:
          type: number
        address:
          type: string
    Apartment:
      allOf:
        - $ref: "#/components/schemas/Accommodation"
        - type: object
          required:
            - floor
          properties:
            floor:
              type: integer
            collective_heating_system:
              type: boolean
            elevator:
              type: boolean
            parking_spots:
              type: integer
    House:
      allOf:
        - $ref: "#/components/schemas/Accommodation"
        - type: object
          properties:
            garden_size:
              type: integer
              description: Area, in square meters (m²).
            roof_tiles_type:
              type: string
              description: Multiple types exist for roof tiles.
            solar_panels_power:
              type: integer
              description: Installed photovoltaic power, in Watt (Wc). _Yes, modern house should have solar panels_
            basement_size:
              type: integer

```

Combinators `anyOf` or `oneOf` have to be used at first level,
with an array of related schemas, here `House` and `Apartment`.

### Inheritance & DRY

Here, there are three different schemas listed in `/components/schemas/*` list:

- `Accommodation`, with every properties shared by House and Apartment, as accommodation.
- `Apartment`,  with every properties specific to an apartment
- `House`,  with every properties specific to a house.

Indeed, we know that both House and Apartment share a lot of details, by inheriting
from parent object `Accommodation`.

We can see it in each schema `House` and `Apartment`, with the merging combinator
`allOf`.

House has every properties from Accommodation (type, size, monthly rent, and address),
and some specific house properties: garden size, roof tiles type or solar panels power…
And same for Apartment.

This usage of parent object, and `allOf` combinator is a useful
solution to avoid code duplication here, and apply Inheritance pattern in JSON schema.

### Extract title

In both OpenAPI and AsyncAPI documentation, it's strongly recommended to avoid
inline schemas, _ie_ to favor schemas described behind an internal reference `$ref`.

What is crucial is the ability to extract a title for each alternative.
With `$ref`, title is defined from last element of path:

- `$ref: "#/components/schemas/House"`: extracted title is `House`
- `$ref: "#/components/schemas/Apartment"`: extracted title is `Apartment`

But we can also favor to extract this title from the explicit `title` field, if provided in the schema object.

For example if third and very lightweight alternative accommodation was added
without reference:

```yaml
requestBody:
  content:
    application/json:
      schema:
        oneOf:
          - $ref: "#/components/schemas/House"
          - $ref: "#/components/schemas/Apartment"
          - type: object
            title: Yurt
            required:
              - type
            properties:
              type:
                type: string
              weight:
                type: integer

```

This alternative would be named `Yurt`.
If we had omitted the `title: Yurt` attribute, Bump.sh would have to generate a title based on type and index
(here it would be `'object-2'`)

### Discriminator

Note: for this section, every alternative has to be object, or array of objects,
a schema with properties. If no properties, no discriminator.

Now's the time to clarify this required `type` property, used on purpose for
every schemas inheriting from `Accommodation` object.

It's a good practice to use a specific property to distinct which schema
has to be used.

This can be considered as a hint for the API. If `type` is explicit,
there is no need for backend to validate if provided data are compliant
with `House` or `Apartment` . Indeed, it would be weird (and costly)
to detect `garden_size` or `parking_slots` and implicitly guess accommodation type.

Because this is missing in JSON schema support, both OpenAPI and AsyncAPI
have introduced a specific keyword for this, `discriminator`:

cf documentations:
- [AsyncAPI 2.x discriminator](https://www.asyncapi.com/docs/reference/specification/v2.5.0#schemaComposition) (as String)
- [OpenAPI 2.0 discriminator](https://spec.openapis.org/oas/v2.0.html#fixed-fields-12) (as String)
- [OpenAPI 3.x discriminator](https://spec.openapis.org/oas/v3.1.0.html#discriminator-object) (as Object)

First solution is to use string format (supported by OpenAPI 2.x, aka Swagger,
and AsyncAPI).

In every alternative with properties, one property is identified as the discriminator.
This property has to be required, and of course, it has to be shared between all alternatives, so
with our example, it's relevant to use shared `Accommodation` schema:


```yaml
Accommodation:
  type: object
  discriminator: type
  required:
    - type
    - size
    - monthly_rent
    - address
  properties:
    type:
      type: string
    # …
```

Thus, correct alternative is chosen by matching provided value for `type`
with each alternative title:
- `House` value for `type` clarifies that `House` schema will be used
- `Apartment` value for `type` clarifies that `Apartment` schema will be used
- `Flat` value for `type` clarifies that `Apartment` schema will… wait, what??

You read it well. Sometime, API maintainers could expect an other value instead of
alternative title to ensure schemas matching.

And that's why `discriminator` support is different for OpenAPI 3.1:

In this case, `discriminator` is an object, with two fields:
- `propertyName`, string value of the property used as discriminator
- `mapping`, a hash to give explicit values

And in this case, it has to be defined at the same level as the combinator.

In our example:

```yaml
requestBody:
  content:
    application/json:
      schema:
        oneOf:
          - $ref: "#/components/schemas/House"
          - $ref: "#/components/schemas/Apartment"
        discriminator:
          propertyName: type
          mapping:
            house: "#/components/schemas/House"
            flat: "#/components/schemas/Apartment"
```

This is visible in generated documentation, where allowed value is explicitly
defined as either `flat`, either `house`.

![new flat request](/images/guides/apartment-with-discriminator.png)

[See it live](https://bump.sh/demo/hub/support/doc/accommodation-polymorphism/with-discriminator/operation/operation-post-accommodation#operation-post-accommodation-body)


## Conclusion

Polymorphism and inheritance are essential patterns to improve your API design and
avoid code duplication (no Single Source of Truth when your code is duplicated).

Both OpenAPI and AsyncAPI have nice tools to support them, you just need to choose `oneOf` these specifications.

I hope this post/article/guide/tutorial/page (`anyOf` these formats) did help you on your _polymorphism in API_ journey.

Writing this article was not easy, but I can assure you that implementing all the support for all these polymorphism concept
in both OpenAPI and AsyncAPI was not a long, quiet river.
That's why I'm very glad to reveal that these combinators `anyOf` and `oneOf` are now fully supported in every documentation hosted on Bump.sh, as
detailed [in our changelog](/product-updates/2022/11/14/polymorphism/).

Happy polymorphism,

PS: About Single Source of Truth, Sébastien would be very happy if I could also mention here it's what we do at Bump.sh, help API developers team to have a single source of truth for all their API contracts and avoid duplication… but that's not the point here, sorry Seb 😉

Oh wait… I did it again?
