---
title: Examples
authors: phil
excerpt: Examples of OpenAPI Examples so you can add Examples for your APIs.
date: 2024-07-10
---

Examples are a change to demonstrate some potential values for a parameter, header, request, response, and various other bits of OpenAPI. Examples are handy for creating API documentation, because tools can pop those examples into requests/response samples like you can imagine in the classic Stripe-like API documentation. They can also be read by tools and libraries for other purposes, like an [API mocking tool][microcks] can use sample values to generate mock requests.

There are three main types of examples.

- Schema Examples
- Media Type Examples
- Parameter Examples

## Schema Examples

The [schema object](schema-and-data-types.md) is used all over in OpenAPI, for requests and responses, parameters, and headers. A schema in OpenAPI v3.1 can add an example for an entire schema, part of a schema, or a single specific property, which is either confusing or flexible, depending on how you see the world.

Here's an example of the `examples` keyword being used for specific properties inside an object.


```yaml
responses:
  '200':
    description: 'OK'
    content:
      application/json:
        schema:
          properties: 
          id:
            type: integer
          name:
            type: string
            examples: 
            - Dave
          completed: 
            type: boolean
            examples: 
            - false
          completed_at:
            type: ['string', 'null']
            format: date-time
            examples: 
            - '2024-04-23T13:22:52.685Z'
          required:
          - id
          - name
          - completed
```

This uses the JSON Schema keyword `examples` to provide an examples. Seeing as these examples are an array of values, the YAML `-` syntax is used as an array of one, but you can provide multiple examples if you like.

> In OpenAPI v3.0 you may have used the `example` keyword with a single value, but this was deprecated in OpenAPI v3.1 and whilst it is generally still supported it is recommended you use the `examples` keyword and make it a list with one value.
{: .warning }

Here's an example of the same schema `examples` keyword being used to provide an example for an entire object. 

```yaml
responses:
  "200":
    description: OK
    content:
      application/json:
        schema:
          properties:
            id:
              type: integer
            name:
              type: string
            completed:
              type: boolean
            completed_at:
              type: ['string', 'null']
              format: date-time
          required:
            - id
            - name
            - completed
          examples:
            - id: 2
              name: Dave
              completed: true
              completed_at: 2024-04-23T13:22:52.685Z
```

Same exact concept, but instead of being put on the property it's being put on the entire object at the root of the schema. 

You can mix and match property and object examples as much as you like, and most tooling will know how to pick the most appropriate example for any given scenario.

For more on these schema examples, head over to the [Learn JSON Schema: Examples](https://www.learnjsonschema.com/2020-12/meta-data/examples/).

## Media Type Examples

The [Media Type Object](https://spec.openapis.org/oas/v3.1.0#media-type-object) is the same object that defines the request body and each response underneath the `application/json` or whichever other content type is being defined. 

This type of example allows you to create an entire request or response example, and you have a choice between two two keywords: `example` or `examples`. There is more than just an `s` difference between these keywords, they're different shapes too. `example` is singular example which just contains the actual example value.

```yaml
responses:
  "200":
    description: OK
    content:
      application/json:
        example:
          id: 1
          name: get food
          completed: false
        schema:
          properties:
            id:
              type: integer
            name:
              type: string
            completed:
              type: boolean
            completed_at:
              type: string
              format: date-time
              nullable: true
          required:
            - id
            - name
            - completed
```

However, `examples` is an array of objects, which have an arbitrary string which acts as a variable name for that example, and that property is another object which contains several optional properties including a `value` property, which then contains the actual example.

```yaml
responses:
  "200":
    content:
      application/json:
        examples:
          incompleteTask:
            summary: Incomplete Task
            value:
              id: 1
              name: get food
              completed: false
          completeTask:
            summary: Complete Task
            value:
              id: 2
              name: get cider
              completed: true
              completed_at: 2020-08-23T13:22:52.685Z
        schema:
          properties:
            id:
              type: integer
            name:
              type: string
            completed:
              type: boolean
            completed_at:
              type: string
              format: date-time
              nullable: true
          required:
            - id
            - name
            - completed
```

Using named examples like this allows for more clarity when certain combinations of parameters might be grouped together. For example if you support polymorphism for different types of objects for a payment accepting both a Bank Account and Credit Card, you could show how requests and responses look for those and let the user pick between them in documentation. 

The example names are entirely arbitrary, and casing does not matter, but it's best to use something more like a variable name with no special characters as these names are used in the URL for docs, and used in various programmatic ways for docs. 

The summary name is optional, but is a great place to put human readable names in that can then show up in API documentation tools.

![](/images/changelog/multiple_examples.jpg)

Notice that these examples are all defined _next_ to the `schema` keyword, not _inside_ it. Examples outside the schema object are an object with names, examples inside the schema object are just a list (array) which have no names. For clarity you can check the OpenAPI v3.1 Specification, looking at the [Media Type Object](https://spec.openapis.org/oas/v3.1.0#media-type-object) and the [Schema Object](https://spec.openapis.org/oas/v3.1.0#schema-object).

Here's a quick example of all the examples so you know where to start.

```
requestBody:
  content:
    application/json:
      schema:      # schema object
        examples:  # schema examples
          # ...

      example:     # media type example
        # ...
    
      examples:    # media type examples
        someName:
          summary: ...
          value:
            # ...
```

## Parameter Examples

The OpenAPI v3.1 Parameter Object describes path parameters, query parameters, headers, etc. Since OpenAPI v3.0 They can have `examples` or an `example`, which work the same as the media type examples. They can also have a `schema`, which means they can have schema `examples` just like we talked about above.

```yaml
/params:
  get:
    parameters:
      - name: single-example-good
        description: Valid to its schema
        in: query
        schema: 
          type: string
          enum: [foo, bar]
        example: foo

      - name: single-schema-example-good
        description: Valid to its schema
        in: query
        schema: 
          type: string
          enum: [foo, bar]
          example: foo

      - name: multiple-examples
        description: Some valid to its schema some not
        in: query
        schema: 
          type: string
          enum: [foo, bar]
        examples: 
          the-good:
            summary: The Good
            value: foo
          the-bad:
            summary: The Bad
            value: 123
          the-ugly:
            summary: The Ugly
            value: [an, array]
```

This is a lot of different types of example to think about, so how can we break it down?

## When to use which

When you get the hang of when to use what sort of examples they can be really powerful. Here are a few tips: 

1. Schema examples on properties can be really helpful to make sure that wherever a schema is referenced it is going to make some sense.
2. Media Type examples can then optionally be added to help with mocking, and documenting more complex APIs if the computed schema examples are not good enough.
3. Parameter examples don't particularly matter how you do it, especially if its all being defined inline (not using $ref) so do whichever. 

Some mocking tools [like Microcks][microcks] might prefer you use named examples, and match up your parameters, requests, and responses to help match up expected inputs with matching outputs, but that is not something you need to think about unless you are planning to use those tools.

## Example of All Examples

Let's go on an adventure through all the types of examples available in OpenAPI v3.1, with a bunch of Adventure Time characters with random coordinates of their last known locations.

```yaml
openapi: 3.1.0
info:
  title: Example of All Examples
  version: 1.0.0
paths:
  /all-the-examples:
      get:
        operationId: infinite-examples
        responses:
          "200":
            description: OK
            content:
              application/json:
                schema:
                  properties:
                    name:
                      type: string
                      # Schema Object Example (Deprecated)
                      example: Finn
                    coordinates:
                      description: We couldn't pick a format for coordinates so we support
                      pretty much all of them.
                      # Schema Object Examples
                      examples:
                      - "52.378091, 4.899207"
                      - [52.378091, 4.899207]
                      - { lat: 52.378091,, lon: 4.899207 }
                  required:
                    - name
                    - coordinates
                  
                  # Schema Object Example (for an object)
                  example:
                    name: Jake
                    coordinates: "52.378082, 4.899218"

                # Media Type Example
                example:
                  name: Princess Bubblegum
                  coordinates: "51.20180, 3.22488"

                # Media Type Examples
                # cannot have this and the OpenAPI Media Type Example together
                examples:
                  ice-king:
                    value:
                      name: Ice King
                      coordinates: "78.21757, 15.63699"
```

Hopefully this will help you create useful examples that can be used by all sorts of tooling. 

> If you are working with generated OpenAPI documents that you cannot edit, you can use [Overlays to add the examples in later](../../../augmenting-generated-openapi.md).
{: .info }

[microcks]: ../../../../bump-sh-tutorials/mocking-with-microcks.md
