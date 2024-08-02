---
title: 'OpenAPI v4.0 (A.K.A "Project Moonwalk")'
authors: phil
canonical_url: https://bump.sh/blog/openapi-v4-moonwalk
excerpt: What is coming next for OpenAPI, as v4.0 of the OpenAPI Specification gets closer to being released? What major changes are coming, how easy will it be to upgrade, and how do tooling companies feel about it?
date: 2024-04-15
---

What is coming next for OpenAPI, as v4.0 of the OpenAPI Specification gets closer to being released? What major changes are coming, how easy will it be to upgrade, and how do tooling companies feel about it?

## Recent History of OpenAPI

OpenAPI has been around for a long time, but only hit the mainstream when OpenAPI v3.0 was released in 2017. It made it a whole lot easier to describe the majority of REST/RESTish APIs, and brought in major investment from tooling developers big and small who jumped at the chance to add value to the community.

OpenAPI v3.1 came out in early 2021, and focused on fixing issues that appeared with this influx of new users in v3.0. A large part of the focus was solving the subtle but problematic [differences between JSON Schema and the OpenAPI Schema Object](https://apisyouwonthate.com/blog/openapi-json-schema-divergence/). These two specifications looked similar enough that many users (and even tooling) treated them as interchangeable, but OpenAPI Schema Objects were a subset *and* a superset of JSON Schema, which caused confusion for years. OpenAPI v3.1 aligned Schema Objects to be a valid “dialect” of JSON Schema 2020-12, which not only solved this long standing issue, but brought lots of useful new keywords like `if/then/else` to replace awkward nested `allOf` > `oneOf` usage. Other useful functionality like support for Webhooks expanded the type of APIs that could be described.

So what is OpenAPI v4.0 about?

## Introducing OpenAPI Project Moonwalk

With OpenAPI v3.1 released and chugging along happily, the OpenAPI TSC spent about a year keeping an eye on feedback, patching the specification with fixes and clarifications, then started collating ideas for the next version. Would it be 3.2? Would it be 4.0? Both?

It wasn’t entirely clear for a while which would be the next step, but in late 2022 the OpenAPI Technical Steering Committee set up a Special Interest Group to start hashing out what the community needed out of a new major OpenAPI version, and that resulted in [Project Moonwalk](https://github.com/OAI/sig-moonwalk), a repository where ideas could initially be hashed out and potentially abandoned without confusing everyone with OpenAPI v4.0 being “cancelled” and forcing them to skip a version like PHP’s missing version 6… 🤣

The primary goal of Project Moonwalk is to make the next version of OpenAPI more approachable, and less complex for both humans and computers to write and understand.

### Reduce nested structures to improve readability and editability

Let’s be honest, OpenAPI v3 can sometimes feel like a confusing pile of YAML. It’s grown to add excellent functionality which is a large part of how it achieved dominance against earlier API Description Formats, but it’s got pretty complex to write by hand. This complexity has lead to a plethora of open-source and paid tooling aiming to assist the editing experience, from DSL’s to write OpenAPI in easier language, to visual editors to avoid ever needing to look at the YAML.

More recently LLMs like Copilot are helping remind users, myself included, how to write out all the right response, mime type, content, status code, schema, keywords… when core contributors of OpenAPI need to melt the ice caps with AI just to remember what keyword comes next, it might be time for a simplification.

Here’s the new structure (as it stands).

![OpenAPI v4 diagram representation](/images/guides/openapi-v4-diagram.png)

Diagrams like this can fail to convey much meaning to folks like myself, so lets create an example before (OAS3) and after (OAS4) by taking a snippet from the [Train Travel API](https://bump.sh/blog/modern-openapi-petstore-replacement) ([source on GitHub](https://github.com/bump-sh-examples/train-travel-api)).

```yaml
/bookings/{bookingId}:
  parameters:
    - name: bookingId
      in: path
      required: true
      description: The ID of the booking to retrieve.
      schema:
        type: string
        format: uuid
      example: 1725ff48-ab45-4bb5-9d02-88745177dedb
  get:
    summary: Get a booking
    description: Returns the details of a specific booking.
    operationId: get-booking
    responses:
      '200':
        description: The booking details
        headers:
          RateLimit:
            $ref: '#/components/headers/RateLimit'
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Booking'
          application/xml:
            schema:
              $ref: '#/components/schemas/Booking'
```

Now let’s try that in OpenAPI 4.0 Project Moonwalk:

```yaml
  /bookings/{bookingId}:
    parameterSchema:
      bookingId:
        description: The ID of the booking to retrieve.
        type: string
        format: uuid
        examples: [1725ff48-ab45-4bb5-9d02-88745177dedb]
    requests:
      getBooking:
        method: get
        summary: Get a booking
        description: Returns the details of a specific booking.
        responses:
          Ok:
            status: '200'
            contentType: application/json
            contentSchema:
              $ref: '#/components/schemas/Booking'
```

The nesting has been reduced by making `status` and `contentType` a new property in the response instead of another key and another level of nesting. I can remember keywords like `status` and `contentType` a lot easier than I can remember the order of that many keys and objects. Similarly the API requests definition have received the new `method` property avoiding yet another level of parent nesting.

Another nice benefit is the OAS “Parameters Object” being replaced with `parameterSchema`. This is a simple JSON Schema object, which is a lot easier for tooling developers to work with than stitch together object maps of “name” and “in”, where parameters are unique based on their location in the URL… This can be confusing for users too, when you get messages about “Parameter foo is not unique” because you had a `foo` defined in the Path’s Parameters Object, but a `foo` also defined in the query string in the Operations Parameters Object. This is just one place, with one list of parameters that can all be reasoned about together.

A handy bonus is seeing Operation ID moved from in object to being a key. Operation ID is super handy for lots of tooling, from documentation to SDK generation, but it is rarely used. This means everyone will be defining it!

### Support APIs that have different responses based on query parameters, headers and request bodies.

For starters, there is an explicit goal of allowing more types of API than only REST/REST-inspired APIs. This will now support all sorts of RPC API, which often uses fewer URLs, and sends a “method”, “action”, or “command” as a parameter in the request body or query string.

This would not have been possible in OpenAPI v3.x as a URL is expected to have one purpose only, and the shape of the response is expected to be the same regardless of what is sent.

Here’s an example of an API that sends `service.{serviceName}` as a request header to decide what to do. This is a bit of a contrived example, but the goal is to show the flexibility of the new approach, where requests and responses can be defined to work in all sorts of ways, other than REST(ish) best practice. There’s nothing wrong with RPC, and the more APIs that can be described by OpenAPI the better.

```yaml
openapi: 4.0.0
info:
  title: RPC API
  version: 1.0.0
paths:
  "/service":
    requests:
      createFoo:
        method: post
        parameterSchema:
          type: object
          properties:
            header:      ## We can either use this specially named property or create a first class headerSchema property on the Request Object
              type: object
              properties:
                path:
                  const: service.createFoo  ## path Header field used to convey the RPC method
        contentType: application/json
        contentSchema:
          $ref: "#/components/schemas/foo"
        responses:
          ok:
            status: 201
            contentType: application/json
            contentSchema:
              $ref: "#/components/schemas/foo"
      getFoo:
        method: get
        parameterSchema:
          type: object
          properties:
            header:
              type: object
              properties:
                path:
                  const: service.getFoo ## path Header field used to convey the RPC method
        responses:
          ok:
            status: 200
            contentType: application/json
            contentSchema:
              $ref: "#/components/schemas/foo"
      deleteFoo:
        method: post
        parameterSchema:
          type: object
          properties:
            header:
              type: object
              properties:
                path:
                  const: service.deleteFoo
        responses:
          ok:
            status: 200
            contentType: application/json
            contentSchema:
              $ref: "#/components/schemas/foo"
```

Here the `parameterSchema` is playing a role in deciding which method is being called, because the path property could be anything, but by defining `const` (constant value) it’s like writing a switch statement, where the case is the value of the const. Basically, if the path value matches this const value, a request will match this “operation signature” for this specific request. This can be used for data validation, documentation, SDK generation, and everything else, it’s just a bit of a different way to think about things. A more JSON Schema way.

### Support a broader range of URL design patterns

As well as being able to work with more types of API than REST(ish), there are plenty of times REST API designers have had their hands tied by limitations on the sorts of URLs and parameter structures allowed in OpenAPI.

For example, in OAS3.x all path parameters have to be required, there is no way to have optional path parameters, or multi-segment path parameters.

Neither of these sorts of URLs would be allowed in OAS3.1:

1. `/files/{mypath}/{filename}` - The `mypath` parameter would need to have slashes escaped and be considered one parameter.
2. `/reports/{reportName}/{nonDefaultFormat}` - The `nonDefaultFormat` would need to be provided every time, or two different operations would need to be defined with and without it, which can lead to a lot of duplication.

All of these things are common enough that the [RFC 6570: URI Templates](https://datatracker.ietf.org/doc/html/rfc6570) popped up back in 2012, and whilst OpenAPI paths look a bit like URI Templates they are only a subset of what it can do.

Project Moonwalk once again says “hey there’s a standard for that, let’s use it!” and defers all path logic to the URI Template RFC. Using this RFC brings loads of powerful syntax, and adds support for loads of existing tooling which can make use of it.

```yaml
paths:
  "/files/{/filepath*}":
    # filepath can contain as many URI segments as needed

  "/reports/{reportName}{/nonDefaultFormat}":
    # this last one is now optional
```

You can do all sorts of advanced stuff, like define custom server names for particular operations should you have some need to do that, or work with all sorts of complex arrays or objects in the query string without having to decypher the arcane (and rarely supported) [style/explode parameter combinations](https://spec.openapis.org/oas/v3.1.0#style-values) in OAS3.x.

```yaml
 {/list}            /red,green,blue
 {/list*}           /red/green/blue
 {/list*,path:4}    /red/green/blue/%2Ffoo
 {/keys}            /semi,%3B,dot,.,comma,%2C
 {/keys*}           /semi=%3B/dot=./comma=%2C
```

Learn more about [URI Templates](https://datatracker.ietf.org/doc/html/rfc6570).

### When will OpenAPI v4.0 Be Released?

It’s still being worked on, but the OpenAPI Initiative have set the target release date for “sometime in 2024”.

There is always a delay between a specification being released and tooling vendors adding support for it, but unlike the v2.0 to v3.0 transition, the v3.0 to v3.1 was much quicker, and much easier. Whenever a specification like this ditches a unique snowflake of a concept and replaces it with an existing battle tested standard, the tooling migration gets a lot easier, as tooling vendors can wrap a few thousand lines of their code in an if statement, and the else is an existing library that has a whole bunch of tests.

There is already a lot of tooling out there helping with migrations, and the word on the grapevine from some of the modern tooling companies is that they’re already experimenting with OAS4 to make sure they’re ready when it drops.

### Ongoing Discussions

There are still lots of ongoing discussions occurring, and things are likely to change somewhat before the final release, but now is a good time to be having a look around. Take a look at some of the [examples](https://github.com/OAI/sig-moonwalk/tree/main/doc/initial-proposals/examples), then a look at the ongoing [discussions](https://github.com/OAI/sig-moonwalk/discussions).

**Replacing $ref with “imports”**

The `$ref` keyword is [incredibly powerful](https://docs.bump.sh/guides/openapi/advanced-ref-usage/), and can be used to “include” bits of OpenAPI and JSON Schema via a filepath, or a URL. This not only helps avoid repetition in a single OpenAPI document, but can be used to share components between multiple APIs, and can enable schema reuse across an entire organization (or even be published publicly and shared to others).

Sadly `$ref` has a history of not quite doing what people expect, not quite lining up with JSON Schema, and trying to keep up with changing expectations as those communities all continue to evolve. The reliance on the filesystem structure makes it hard to share documents with $ref, and lots of tools either don’t understand them, only support some of the functionality, or implement things incorrectly…

The latests versions of JSON Schema have standardized some really useful `$ref` resolutions that work outside of the filesystem, with an approach of “assuming you’ve got all these files from a repo, zip, floppy disk, whatever, they’ll all declare their `$id` and you can `$ref` on that. This has been great for the JSON Schema community, but the OpenAPI community has struggled to see any take-up on this at all.

A new approach is being considered, conceptually referred to for now as “Moonwalk imports”.

OpenAPI users can define a document like this, which for example purposes is purely using components.

```yaml
openapi: 4.0.0
self: https://example.com/fooComponents
components:
  pathItems:
    Foos: {...}
  schemas:
    Foos: {...}
```

Then in another document they can define all the paths, and import than components document, referencing them with the `namespace` value to differentiate them from components defined in the local document.

```yaml
openapi: 4.0.0
self: https://example.com/fooPaths
components:
  pathItems:
    Bars: {...}
imports:
- namespace: foo
  href: fooComponents
paths:
  /foos: foo:Foos
  /bars: self:Bars
```

This is an interesting approach, which relies on [RFC 3987: Internationalized Resource Identifiers (IRIs)](https://www.rfc-editor.org/rfc/rfc3987.html), keeping with the theme of replacing OpenAPI-specific things with existing standards.

**Better Tags**

I am keeping a close eye on a discussion to improve Tags, because they’ve always felt a bit overloaded and confused with different tools having wildly different expectations for what they’re for and how they should be formatted.

[Better tags · OAI sig-moonwalk · Discussion #67](https://github.com/OAI/sig-moonwalk/discussions/67)

**Removing Discriminator**

Then there’s the discussion about removing discriminator entirely, because its been so poorly defined it’s been confusing people for years. It adds nothing on top of oneOf and does not exist in JSON Schema, so it’s hard to add support without custom writing an extension for specifically just that. Ditch it.

[Replace or remove discriminator · OAI sig-moonwalk · Discussion #57](https://github.com/OAI/sig-moonwalk/discussions/57)

**Improving Links**

Links, can we upgrade the OAS 3 concept of Links from a rarely used or supported “Next Step hints” idea into something a bit more useful? Being able to link backwards as well as forwards. Being able to link to other servers using a full URL not just jump around the current API. It’s a lot more HATEOAS this way.

[Proposal for links in OpenAPI v4](https://gist.github.com/mikekistler/1983a8249c0df56a46f94b4df1b7181d)

If you’re interested in Moonwalk, give it a shot. You can try out the concepts on your own OpenAPI documents to see how it looks. You’ll have to do that manually for now as tooling is waiting for the plan to settle, but [Bump.sh](https://bump.sh) will be keeping an eye on things and adding experimental support as soon as the time feels right. Until then keep getting feedback to the OAI so they can make this as good as possible.
