---
title: "How to use JSONPath"
authors: phil
excerpt: JSONPath is a query language that can be used to extract data from JSON documents, powering OpenAPI Overlays amongst other useful functionality in the world of APIs.
---

A few years ago most API designers, developers, and technical writers would have had very little reason to bump into JSONPath, but its starting to get more and more relevant as more tools and standards start relying on it. So what is JSONPath, what is it used for, and how can you get up to speed with using it? 

JSONPath is a query language that can be used to extract data from JSON documents, which at first might not sound very exciting, but remember... OpenAPI is just a JSON (or YAML) document, so you can use JSONPath to poke around in OpenAPI and do various things.

You can use [JSONPath for OpenAPI Overlays](https://github.com/OAI/Overlay-Specification), to patch OpenAPI documents with extra documentation content, code samples, or whatever else.

You can use [JSONPath in Spectral](https://docs.stoplight.io/docs/spectral/d3482ff0ccae9-rules#given) to write incredibly advanced linting rules which can power your [automated API Style Guides](https://apisyouwonthate.com/blog/automated-style-guides-for-rest-graphql-grpc/).

You can even use [JSONPath in AWS Step Functions](https://aws.amazon.com/blogs/compute/using-jsonpath-effectively-in-aws-step-functions/)...

JSONPath is popping up all over the the place these days, and if you work with OpenAPI it's definitely a handy tool to have on your belt.

## How does JSONPath Work?

JSONPath is one of a few query languages which will let you search, filter, and generally query through a chunk of JSON, not just to pull bits out, but to navigate complex data structures, with syntax for getting into specific array indexes, filtering through an objects properties or array values before continuing on to its children.

Here's a sample JSONPath from the RFC.

```
$.store.book[?@.price < 10].title
```

Now we need some JSON to run it against, and the RFC can help out there:

``` json
{
  "store": {
    "book": [
      {
        "category": "reference",
        "author": "Nigel Rees",
        "title": "Sayings of the Century",
        "price": 8.95
      },
      {
        "category": "fiction",
        "author": "Evelyn Waugh",
        "title": "Sword of Honour",
        "price": 12.99
      },
      {
        "category": "fiction",
        "author": "Herman Melville",
        "title": "Moby Dick",
        "isbn": "0-553-21311-3",
        "price": 8.99
      },
      {
        "category": "fiction",
        "author": "J. R. R. Tolkien",
        "title": "The Lord of the Rings",
        "isbn": "0-395-19395-8",
        "price": 22.99
      }
    ],
    "bicycle": {
      "color": "red",
      "price": 399
    }
  }
}
```

Run through any sort of JSONPath tool you'd expect to see these results.

```json
[
  'Sayings of the Century',
  'Moby Dick'
]
```

### Syntax

| Syntax            | Element Description |
|-------------------|---------------------|
| `$`               | root node identifier (Section 2.2) |
| `@`               | current node identifier (Section 2.3.5) (valid only within filter selectors) |
| `[<selectors>]`   | child segment (Section 2.5.1): selects zero or more children of a node |
| `.name`           | shorthand for ['name' ] |
| `.*`              | shorthand for [*] |
| `..⁠[<selectors>]` | descendant segment (Section 2.5.2): selects zero or more descendants of a node |
| `..name`          | shorthand for .. [' name' ] |
| `..*`             | shorthand for ..[*] |
| `'name'`          | name selector (Section 2.3.1): selects a named child of an object |
| `*`               | wildcard selector (Section 2.3.2): selects all children of a node |
| `3`               | index selector (Section 2.3.3): selects an indexed child of an array (from 0) |
| `0:100:5`         | array slice selector (Section 2.3.4): start:end:step for arrays |
| `?<logical-expr>` | filter selector (Section 2.3.5): selects particular children using a logical expression |
| `length(@.foo)`   | function extension (Section 2.4): invokes a function in a filter expression |

_Overview of JSONPath Syntax, from [RFC 9535](https://www.rfc-editor.org/rfc/rfc9535#tbl-overview)._

### Examples


| JSONPath               | Intended Result                                        |
|------------------------|--------------------------------------------------------|
| `$.store.book[*].author` | the authors of all books in the store                 |
| `$..author`              | all authors                                            |
| `$.store.*`              | all things in the store, which are some books and a red bicycle |
| `$.store..price`         | the prices of everything in the store                  |
| `$..book[2]`             | the third book                                         |
| `$..book[2].author`      | the third book's author                                |
| `$..book[2].publisher`   | empty result: the third book does not have a "publisher" member |
| `$..book[-1]`            | the last book in order                                |
| `$..book[0,1]`           | the first two books                                    |
| `$..book[:2]`            | the first two books                                    |
| `$..book[?@.isbn]`       | all books with an ISBN number                          |
| `$..book[?@.price<10]`   | all books cheaper than 10                              |
| `$..*`                   | all member values and array elements contained in the input value |

_Example JSONPath Expressions and Their Intended Results When Applied to the Example JSON Value, from [RFC 9535: 1.5. JSONPath Examples](https://www.rfc-editor.org/rfc/rfc9535#name-jsonpath-examples)._

By combining these bits of example syntax together you can do amazing and powerful things with JSONPath, so let's look at how to do those amazing things in OpenAPI.


### JSONPath & OpenAPI

Take an OpenAPI document, like the [Train Travel API](https://github.com/bump-sh-examples/train-travel-api).

```
git clone github.com/bump-sh-examples/train-travel-api

cd train-travel-api
```

Then install [jsonpath-cli](https://www.jsware.io/jsonpath-cli/) just so we can try some things out.

```
npm install -g @jsware/jsonpath-cli
```

Optional, if you're working with YAML, you might want to convert from YAML to JSON in the CLI too. 

```
brew install yq

yq eval -o=json openapi.yaml > openapi.json
```

Don't worry this is just for playing around, all of the tooling that uses JSONPath will support YAML without bodges like this. Let's just get on the same page for this guide.

### Querying OpenAPI with JSONPath

Once you have a JSON file to work with, we can use the `jpp` command, pass in a JSON/YAML document, and provide a JSONPath expression to query the document for specific parts.

``` shell
$ jpp --pretty '$.info' openapi.json

[
  {
    "title": "Train Travel API",
    "description": "API for finding and booking train trips across Europe.",
    "version": "1.0.0",
    "contact": {
      "name": "Train Support",
      "url": "https://example.com/support",
      "email": "support@example.com"
    },
    "license": {
      "name": "Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International",
      "identifier": "CC-BY-NC-SA-4.0"
    }
  }
]
```

In this example `$` refers to the root JSON document, then `.info` is using dot notation to access the `info` key in that object.

We can get a bit more advanced, and pull up a list of paths.

``` shell
$ jpp --pretty '$.paths.*~' openapi.json

[
  "/stations",
  "/trips",
  "/bookings",
  "/bookings/{bookingId}",
  "/bookings/{bookingId}/payment"
]
```

This uses the `.*` syntax which is basically grabbing all children of the paths object, then using `~` to grab the keys instead of the values.

What sort of query language would JSONPath be if we could not do queries? Let's pull up a list of paths which are a `get` or a `post`, but ignore all the `put`, `patch`, `delete`, etc.

``` shell
$ jpp --pretty '$.paths[?(@.put || @.post)]~' openapi.json

[
  "/bookings",
  "/bookings/{bookingId}/payment"
]
```

## OpenAPI Overlays powered by JSONPath

One of the main uses for JSONPath will be for working OpenAPI documents, often by technical writers or other folks in the API governance space to check or improve OpenAPI documents.

Overlays are a list of actions, which make up a "target" which is a JSONPath, and an operation of either "update" or "remove". 

Let's look at an update command.

``` yaml
# overlays.yaml 

overlay: 1.0.0
info:
  title: Overlay to customise API for Protect Earth
  version: 0.0.1
actions:
  - target: '$.info'
    description: Update description and contact for our audience.
    update:
      description: >
        A new and much more interesting long form description, which has all sorts of 
        Markdown, or more specifically [CommonMark](https://commonmark.org/) which 
        is _like_ Markdown but **better**, because it's an actual standard instead of a 
        series of sometimes vaguely consistent conventions.

        Anyway, this is a good place to write all sorts of helpful stuff, link to other
        getting started content, link to where people can find access tokens, or even
        paste some code samples for getting your first API request off the ground.

      contact:
        name: Support Team
        url: https://example.com/contact
        email: support@example.org

```

This overlays file is pointing to the JSONPath target `$.info`, then updating the object with the new bits of OpenAPI for `description` and `contact`, as per the [OpenAPI specification](https://spec.openapis.org/oas/v3.1.0). This can be handy for improving the quality of all sorts of descriptions, not just info, and for popping in support team contact information if the API developers inevitably forgot to mention that sort of thing.

Instead of using those `yq` or `jpp` tools we grabbed just to practice, we can use the [Bump.sh CLI](https://github.com/bump-sh/cli) which has support for Overlays built in, and thankfully it'll work just fine with YAML or JSON.

```
npm install -g bump-cli

bump overlay openapi.yaml overlays.yaml > openapi.new.yaml
```

If we were to run that overlay on the Train Travel API, the resulting `openapi.new.yaml` would like like this:

``` yaml
openapi: 3.1.0
info:
  title: Train Travel API
  description: >
    A new and much more interesting long form description, which has all sorts
    of  Markdown, or more specifically [CommonMark](https://commonmark.org/)
    which  is _like_ Markdown but **better**, because its an actual standard
    instead of a  series of sometimes vaguely consistent conventions.

    Anyway, this is a good place to write all sorts of helpful stuff, link to
    other getting started content, link to where people can find access tokens,
    or even paste some code samples for getting your first API request off the
    ground.
  version: 1.0.0
  contact:
    name: Support Team
    url: 'https://example.com/contact'
    email: support@example.org
  license:
    name: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
    identifier: CC-BY-NC-SA-4.0
# snipped
```

When combined with more advanced queries you can start to get really specific with bits of the OpenAPI document you'd like to update, enabling all sorts of random use cases like cleaning up the servers list for publishing an API Catalogue, removing Development and Staging servers not accessible or relevant to API consumers.

```yaml
# openapi.yaml 
openapi: 3.1.0
servers:
  - url: http://localhost:3000
    description: Development

  - url: https://api-staging.example.com
    description: Staging

  - url: https://api.example.com
    description: Production
```

An overlay can target the servers array with `$.servers` then query through them with `$.servers[?(@.description=="Development" || @.description=="Staging")]`, which is looking through objects in the array, and looking through the children for `description: Development` or `description: Staging` using basically JavaScript syntax. 

The Overlay for this would combine that JSONPath target with `remove: true` operation like this:

``` yaml
# overlays.yaml
overlay: 1.0.0
info:
  title: Overlay to customise API
  version: 0.0.1
actions:
  - target: '$.servers[?(@.description=="Development" || @.description=="Staging")]'
    description: Remove Development and Staging servers but leave anything else.
    remove: true
```

That would leave this resulting OpenAPI.

```yaml
# openapi.yaml 
openapi: 3.1.0
servers:
  - url: https://api.example.com
    description: Production
```

Then the Developer Experience folks decide to roll out a Mocking or Sandbox experience, where consumers can play around with requests without actually triggering real emails, real data, or spending real money, but how can we show everyone where that is? Do we have to go and pester all the API teams to add it? Nope, just add another action.

```yaml
# overlays.yaml
overlay: 1.0.0
info:
  title: Overlay to customise API
  version: 0.0.1
actions:
  - target: '$.servers[?(@.description=="Development" || @.description=="Staging")]'
    description: Remove Development and Staging servers but leave anything else.
    remove: true

  - target: '$.servers'
    description: Let everyone know about our amazing new hosted mocking/sandbox server.
    update:
      - description: Sandbox
        url: https://api-sandbox.example.com/
```


### Leaning more about JSONPath

JSONPath made it to IETF "proposed standard" RFC status in 2024 ([RFC 9535](https://www.rfc-editor.org/rfc/rfc9535)), but before then it was in a similar position to [Markdown in the days before CommonMark](https://philsturgeon.com/state-of-markdown/), in that there are a few different variations of JSONPath as a concept.

- [JSONPath "The Blog Post"](https://goessner.net/articles/JsonPath/) - Written by Stefan Gössner in 2007.
- [jsonpath.com](https://jsonpath.com/) - An online evaluator which as far as I can tell matches the blog post.
- [JSONPath-Plus](https://www.npmjs.com/package/jsonpath-plus) - A popular (but now abandoned) fork which expands on the original specification to add some additional operators.
- [Nimma](https://www.npmjs.com/package/nimma) - A fork of JSONPath Plus created by the Stoplight team for Spectral to handle more advanced use cases. A list of caveats can be found here.

Then to further compound this confusion, all of the implementations have different support for certain features, and have filled in the grey areas differently due to their own interpretations and community requests. The amazing [JSONPath Comparison project](https://cburgmer.github.io/json-path-comparison/) has collated all of the differences into a massive test suite and published the results, which was really helpful in shaping the new standard. Hopefully this will help tools converge, and we can forget all about this incompatibility.

For now, try to follow the RFC 9535 syntax, and use tooling which lines up with that syntax. Unfortunately that means not using `jsonpath.com`, and even the `jpp` CLI tool we used earlier is JSONPath Plus, which has a few differences to the RFC...

The Bump.sh CLI `overlays` functionality is JSONPath RFC 9535 compliant, and if you spot any valid RFC JSONPath syntax not working as expected please [create an issue on GitHub](https://github.com/bump-sh/cli/issues) so we can get that sorted out.
