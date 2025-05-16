---
title: Extending OpenAPI Documents with Overlays
authors: phil
excerpt: Use OpenAPI Overlays to enrich you API descriptions without creating conflicts in the source code.
date: 2024-03-20
---

- TOC
{:toc}

However you make OpenAPI descriptions for your APIs, there are all sorts of scenarios where you might want to customize it for different audiences. Perhaps your tech writers want to add amazing longer descriptions but they are locked out of the source code, or you want to hide some internal endpoints from your OpenAPI before publishing. Is it possible to do all this without awkwardly managing multiple similar-but-different OpenAPI documents?

The OpenAPI Initiative have released a new concept called "Overlays". This is [separate specification](https://github.com/OAI/Overlay-Specification) but compatible with OpenAPI, and while it's labelled "experimental" its a v1.0.0, with support in a variety of tooling including [Bump.sh](https://bump.sh). 

```yaml
# overlays.yaml
overlay: 1.0.0
info:
  title: Improve Descriptions
  version: 0.0.1
actions:
  - target: '$.info.description'
    description: Provide a better introduction for our end users than this techno babble.
    update: >-
      Protect Earth's Tree Tracker API will let you see what we've been planting and restoring all
      around the UK, and help support our work by directly funding the trees we plant or the sites
      we restore.
      To get involved [contact us and ask for an access token](https://protect.earth/contact) then
      [check out the API documentation](https://protect.earth/api).
```

Using OpenAPI Overlays you can effectively “patch” an OpenAPI description, pointing to parts of the original document with [JSONPath](/guides/openapi/jsonpath), then adding or updating your content in. You can add as many actions to these overlays as you like, or make multiple overlays.

To work with Overlays you’ll need a tool that understands them, and that’s not all OpenAPI tools as the concept is still very new. Regardless of what API documentation tool you are using, you can use the [Bump CLI](https://github.com/bump-sh/cli) to apply these overlays, and this will produce a new user-facing document.

```shell
bump overlay openapi.yaml overlays.yaml > openapi.public.yaml
```

You can run these commands in continuous integration, and whatever you would have done with the original you can now do with the new `openapi.public.yaml` (or whatever you decide to name it).

When deploying a document to Bump.sh using the GitHub Action or the CLI, you can skip a step and point the deploy command at the overlay.

```yaml
name: Deploy documentation

on:
  push:
    branches:
      - main

jobs:
  deploy-doc:
    name: Deploy API doc on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: partner-api
          token: ${{secrets.BUMP_TOKEN}}
          file: api/openapi.bundle.yaml
          overlay: api/overlays.yaml
```

**Learn more about [Overlays](_guides/openapi/augmenting-generated-openapi.md)** and using them within Bump.sh.

## Adding more context with Overlays

Engineers will often focus very much on the “how”, but leave out some of the “why”, or really explain the “what”, so if you have an existing OpenAPI document you cannot edit directly, try adding in some of these things with overlays.

### Tags

Tags are a really useful place to explain some of the concepts being used. For example an Order and an Organization might seem fairly obvious what it is to the engineers working on it, but you could add context to them.

Here’s an example of an overlay you could use to expand the tag, adding human-readable summaries to improve navigation in documentation, and adding descriptions with a whole bunch of Markdown to help people find out more information.

```yaml
# overlays.yaml
overlay: 1.0.0
info:
  title: Expand Tag Display Names & Descriptions
  version: 0.0.1
actions:
  - target: '$.tags[?(@.name=="order")]'
    description: Provide more information for order tag.
    update:
      summary: Order
      description: >
        The Order resource represents a single order for trees, which can be fulfilled by one or more
        deliveries. Orders are created by the [Protect Earth team](https://protect.earth/contact) and
        are used to track the progress of your order from creation to delivery.
  - target: '$.tags[?(@.name=="organization")]'
    description: Provide more information for organization tag.
    update:
      summary: Organization
      description: >
        The Organization resource represents a single organization, which can be a charity, business,
        or other entity. Organizations are created by the [Protect Earth team](https://protect.earth/contact)
        and are connected to each of your Orders.
```

These descriptions (which can be much longer and full of even more Markdown) will then show up in API Documentation, pride of place, ready to explain the concepts to the user before they get stuck into what specific endpoints are about.

![A screenshot of Bump.sh generated API documentation on the Operations tag page, with the Markdown from the above example rendered as HTML including a link to the contact us page.](/images/guides/efficient-tech-writing-process/bump-tag-description.png)

Here’s the tag description rendered in Bump.sh.

### Introductory Topics

There are quite a few handy “vendor extensions” around which you can add more power to any tooling that knows how to respond to them. One particularly useful one is `x-topics`, which allows tech writers (or anyone else messing with this sort of work known as “doc ops” or “spec ops”) to expand on just the API Reference Documentation, and start introducing end-users to other guides and content.

```yaml
openapi: 3.1.0

x-topics:
  - title: Getting started
    content:
      $ref: ./docs/getting-started.md
```

In [Bump.sh](http://Bump.sh) this will create a new navigation entry, and insert the Markdown content from the reference guide right into the main documentation.

![Untitled](/images/guides/efficient-tech-writing-process/bump-x-topics.png)

Whether you inject `x-topics` with Overlays or directly into OpenAPI in the source code, the result is the same.

### Code Samples

There’s countless other improvements you can make to the source OpenAPI given to you by the engineering teams who have other things to be worrying about, like [adding client-side code samples](/help/specification-support/doc-code-samples/) with `x-codeSamples`.

```yaml
paths:
  /users:
    get:
      summary: Retrieve a user
      operationId: getUserPath
      responses: [...]
      parameters: [...]
      x-codeSamples:
        - lang: ruby
          label: Ruby library
          source: |
            require "http"
             
            request = HTTP
              .basic_auth(:user => "name", :pass => "password")
              .headers(:accept => "application/json")
             
            response = request.get("https://api.example.com/v1/users")
            if response.status.success?
              # Work with the response.body
            else
              # Handle error cases
            end
```

### External Documentation

You could add `externalDocs` to point them to tutorials hosted elsewhere.

```yaml
tags:
  - name: stations
    summary: Train Stations
    description: Train Stations all over Europe, using a bunch of standards defined elsewhere.
    externalDocs:
      url: https://train-travel.example.com/docs/stations
```

Filter out anything that shouldn’t be there, like beta endpoints that are not ready for public use. There’s a few ways to do this.

[Bump.sh](http://Bump.sh) users can do this with the `x-beta` property:

```yaml
paths:
  /diffs:
    post:
      description: Create a diff between any two given API definitions
      x-beta: true # Beta flag at the operation level
      requestBody:
        description: The diff creation request object
        content:
          application/json:
            schema:
              type: object
              x-beta: true # Beta flag at the top-level schema object
              properties:
                url:
                  type: string
                  format: uri
                  x-beta: true # Beta flag at the object property level
                  description: |
                    **Required** if `definition` is not present.
                    Current definition URL. It should be accessible through HTTP by Bump.sh servers.
```

Or you can filter them out with overlays:

```yaml
overlay: 1.0.0
info:
  title: Remove beta flags
  version: 0.0.1
actions:
  - target: "$..[?(@['x-beta'] == true)]^"
    description: Remove anything beta
    remove: true
```

> Learn more about working with JSONPath to write powerful targets for your overlays using our guide [How to work with JSONPath](/guides/openapi/jsonpath).
{: .info}

## Summary

Overlays are powerful, advanced, and standardized across the toolchain, so you can rely on them to help you with any modifications you need to do.

Being able to change things however you like, then publish the changed versions off seamlessly is really handy, and will hopefully be the last time you need to do awkward JSON/YAML hacking on other peoples documents. JSONPath is a tricky thing to learn, but if you can master regex you can master JSONPath, then the world is your oyster.
