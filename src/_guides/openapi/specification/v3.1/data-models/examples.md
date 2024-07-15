---
title: Examples
authors: phil
excerpt: Examples of OpenAPI Examples so you can add Examples for your APIs.
date: 2024-07-10
---

Examples are a change to demonstrate some potential values for a parameter, header, request, response, and various other bits of OpenAPI. Examples are handy for creating API documentation, but they can also be read by tools and libraries for other purposes. For example, an API mocking tool can use sample values to generate mock requests.

There are three main types of examples.

- Schema Examples
- Media Type Examples
- Parameter Examples

## Schema Examples

The [schema object](schema-and-data-types.md) is used all over in OpenAPI, for requests and responses, parameters, and headers. A schema in OpenAPI 3.1 can have an example for an entire object, part of an object, or a single specific property inside that object.

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

Here's an example of the same JSON Schema `examples` keyword being used to provide an example for an entire object. 

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

Same exact concept, but instead of being put on the property it's being put on the entire schema object. 

You can mix and match property and object examples as much as you like, and most tooling will know how to pick the ost appropriate examples for any given scenario.

## Media Type Examples

The [Media Type Object](https://spec.openapis.org/oas/v3.1.0#media-type-object) is the same object that defines the request body and each response underneath the `application/json` or whichever other mime type is being defined. 

This type of example allows you to create an entire request or response example. You could show a few different types of success, and if you support polymorphism you could create a Cat and a Dog with different cat or dog related properties.

There are two keywords to create examples for Media Types: `example` or
`examples`. There is more than just an `s` difference between these keywords, they're different shapes too. `example` is singular example which just contains the actual example value.

```
# OpenAPI v3 

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

`examples` is an array of objects, which have an arbitrary string which acts as a nickname for that example, 
and that property is another object which contains several optional properties including a
`value` property, which then contains the actual example.

```yaml
# OpenAPI v3.0

responses:
  "200":
    content:
      application/json:
        examples:
          Incomplete Task:
            value:
              id: 1
              name: get food
              completed: false
          Complete Task:
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

In OAS3, the example names like "Incomplete Task" or "Complete Task" are arbitrary, and most documentation tooling will show it to help users pick which example they'd like to see.  Github uses it to show various responses when repository contents are requested by path: it could be a file, directory, symlink, or submodule, so they've got different examples for each:

```yaml
# OpenAPI v3.0

responses:
  '200':
    description: response
    content:
      application/vnd.github.v3.object:
        schema:
          "$ref": "#/components/schemas/content-tree"
      application/json:
        schema:
          oneOf:
          - "$ref": "#/components/schemas/content-directory"
          - "$ref": "#/components/schemas/content-file"
          - "$ref": "#/components/schemas/content-symlink"
          - "$ref": "#/components/schemas/content-submodule"
        examples:
          response-if-content-is-a-file:
            "$ref": "#/components/examples/content-file-response-if-content-is-a-file"
          response-if-content-is-a-directory:
            "$ref": "#/components/examples/content-file-response-if-content-is-a-directory"
          response-if-content-is-a-symlink:
            "$ref": "#/components/examples/content-file-response-if-content-is-a-symlink"
          response-if-content-is-a-submodule:
            "$ref": "#/components/examples/content-file-response-if-content-is-a-submodule"
```



Having these two different types of examples which have a rather different shape can be confusing for some people, but it gets even more confusing if you look at OAS2.

```yaml
# OpenAPI v2.0

responses:
  '200':
    description: 'OK'
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
      required:
        - id
        - name
        - completed
    examples:
      application/json:
        id: 2
        name: get cider
        completed: true
        completed_at: 2020-08-23T13:22:52.685Z
```

Despite both using the `examples` keyword, OAS2 and OAS3 differ in how they handle this keyword, with OAS2 only handling one single example for each mime type the API is defined as producing/consuming, and with OAS3 allowing multiple examples with arbitrary names.

Notice that these examples are all defined next to the `schema` keyword, not inside it. If an example is defined inside the [Schema Object](http://spec.openapis.org/oas/v3.0.3.html#schema-object), there are completely different rules...

## AGH

Yeah. This has been causing confusion over at [Stoplight](https://stoplight.io/) for a while, and came to a head recently when we tried to make sure [Spectral](https://stoplight.io/open-source/spectral) is [validating all examples properly](https://github.com/stoplightio/spectral/pull/1284). We were mainly supporting Schema Examples, and even then mostly only the property example approach, but we've put a whole pile of effort into supporting all of them so that coming versions of Spectral, and the Stoplight Studio, will be able to let you know if you failed to navigate this minefield successfully. 

OpenAPI v3.1 is also partially solving this problem, and adding some more fuel to he file, as JSON Schema has it's own `examples` keyword. This multiple examples keyword has nothing to do with any of the `examples` in OAS2 or OAS3, and it's just bare array of possible values for a schema or property.

```yaml
schema:
    properties:
        coordinates:
            description: We couldn't pick a format for coordinates so we support
            pretty much all of them.
            examples: 
            - "52.3667° N, 4.8945° E"
            - "52.377956, 4.897070"
            - [52.377956, 4.897070]
            - { lat: 52.377956, lon: 4.897070 }
```

If this was the same as the Media Type or Parameter `examples` keywords, you'd need to give it a mime type key, or a arbitrary key and nest the value inside `value`, but its a third totally different type of `examples`...

You can't use this approach in OAS2 or OAS3, but you'll be able to use it in OpenAPI v3.1 when it is release, because it [solves the JSON Schema divergence](https://apisyouwonthate.com/blog/openapi-v31-and-json-schema-2019-09) properly now. So yay for full JSON Schema support, but... agh for having _yet another_ way to handle examples.

These are all valid, and various combinations can and do exist. 

```yaml
/infinite-examples:
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
                  # OpenAPI Schema Object Example
                  example: stowford
                coordinates:
                  description: We couldn't pick a format for coordinates so we support
                  pretty much all of them.
                  # JSON Schema Examples from 2019-09
                  examples:
                  - "52.377956, 4.897070"
                  - [52.377956, 4.897070]
                  - { lat: 52.377956, lon: 4.897070 }
              required:
                - name
                - coordinates
              
              # OpenAPI Schema Object Example (but for an object)
              example:
                name: freddy
                coordinates: "52.377956, 4.897070"

            # OpenAPI Media Type Example
            example:
              name: finn
              coordinates: "52.377956, 4.897070"

            # OpenAPI Media Type Examples
            # cannot have this and the OpenAPI Media Type Example together
            examples:
              arbitrary example name:
                value:
                  name: finns evil twin
                  coordinates: "52.377956, 4.897070"                  
```

If we're going to dig our way out of this mess, we need end users and tooling people to pitch in.

1. Upgrade your OpenAPI descriptions to OpenAPI v3.0 right now, and switch to more modern OpenAPI tooling if your old tools don't support it. This way we can all hopefully burn Ye Olden OAS2 with fire, and get away from vendor extension hacks.

<iframe width="560" height="315" src="https://www.youtube.com/embed/7cUP50qRyTA"
frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope;
picture-in-picture" allowfullscreen></iframe>

2. Let's simplify OAS3.1 but removing some of these excess example approaches. Maybe deprecating `example` and `examples` from the Parameter Object for OAS3.1, to let the schema example tak over? or maybe remove `example` from everywhere so all that's left is the OpenAPI `examples` and JSON Schema `examples`? 

3. If you maintain tooling please add support for OAS 3.1 whilst it is still a [Release Candidate](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md). Start using other OAS 3.1 tooling to make sure it's working, which will speed up everyone's migration when its final.

4. Eventually OAS2 and OAS3 will be a distant memory and nobody will need to figure this mess out, users or tooling vendors.

If you'd like to mess around with more examples of examples for both OAS2 and OAS3 for any reason, take a look at this [sample repository](https://github.com/philsturgeon/examples-examples). 

If you'd like to never have to think about any of this, download [Stoplight Studio](https://stoplight.io/studio/), or any other [visual OpenAPI editor](https://openapi.tools/#gui-editors) which can abstract these problems away. We spend months figuring all this nonsense out, so you don't have to. 😅
