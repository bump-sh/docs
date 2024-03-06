---
title: What is OpenAPI?
authors: Augmenting Generated OpenAPI Documents with Filters & Overlays
image: images/guides/what-is-openapi.png
canonical_url: 
excerpt: Enhance and enrich your OpenAPI descriptions without creating conflicts in the source code using filters and overlays.
---

However you make OpenAPI descriptions for your APIs, there are all sorts of scenarios where you might want to customize it for different audiences. Perhaps your tech writers want to add amazing longer descriptions but they are locked out of the source code, or you want to hide some internal endpoints from your OpenAPI before publishing. Is it possible to do all this without  awkwardly managing multiple similar-but-different OpenAPI documents?

This article will show you how you can slice and dice your OpenAPI descriptions in a bunch of handy ways to support complex workflows.

## Hide some endpoints you don’t want to show

How often have you had a private API that's suddenly become a partner API (used by other companies you work with) or a public API (used by literally anyone that can get their hands on it) without you really planning it? 

Good on you if you said "never", but right now I have an API exposing endpoints it shouldn't in the docs. The Protect Earth API is showing the "Upload Trees" endpoint which is exclusively used by our iOS application to upload photos of trees we planted, and nobody can do anything with it unless they have a special access token, so why even have it there?

Let's fix that right now and have Bump.sh CLI upload the result. 

First of all we're going to mark that upload with an `x-internal` extension flag. This is a common convention in OpenAPI-land, and will not cause any problems for tooling that does not support it. 

```yaml
  '/upload':
    post:
      summary: Upload a Unit
      description: 'Internal endpoint for iOS app only, to upload a unit from the field.'
      operationId: post-upload
      x-internal: true # 👈 new 
      security:
        - "ApiKey": [ ]
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Upload'
```

With that flag popped in we now have something to filter on using the sensibly named [openapi-filter](https://github.com/Mermade/openapi-filter/).

```
$ npm install --global openapi-filter

$ openapi-filter --flags x-internal -- api/openapi.yaml api/openapi.public.yaml
```

Running the NPM script will filter out anything that has the flags specified, so this should removed the whole Upload operation from the source document called `openapi.yaml`, and shove it in a new document called `openapi.public.yaml`. Now I can deploy from this filtered version and the Uploads endpoint will be gone.

```
$ bump deploy api/openapi.public.yaml -d <DOC-ID> -t <TOKEN>
* Your new documentation version will soon be ready at https://bump.sh/green-turtle/doc/tree-tracker-api

Let's deploy a new version to your <DOC-ID> documentation on Bump.sh... done
```

Take a look in there and there's no more Upload! Phew. Right, with that sorted how can I get this working on every push? I've already set up a `.github/workflows/bump.sh` which runs on any pushes to main, so I can modify that a bit to use this new command:

```yaml
name: Deploy API documentation

# snipped standard Bump deploy GitHib Action...

jobs:
  deploy-doc:
    if: ${{ github.event_name == 'push' }}
    name: Deploy API documentation on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      # added this
      - name: Setup node
        uses: actions/setup-node@v3
        with:
          node-version: lts
          cache: npm

      # and this 
      - name: Filter internal endpoints
        run: |
          npx openapi-filter -- --flags x-internal api/openapi.yaml api/openapi.public.yaml

      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: <DOC-ID>
          token: ${{secrets.BUMP_TOKEN}}
          file: api/openapi.public.yaml # 👈 updated this
```

Now whenever anyone commits it'll publish the automatically created filtered `openapi.public.yaml` instead of the original version, and we won't even have to think about it again.

You could also use this approach to deploy _two different_ sets of documentation, maybe on different [Bump.sh Hubs](https://bump.sh/api-catalog) for different teams with different permissions. 🙌

**Another scenario:** what if we have been adding some new endpoints which aren't quite ready yet? Bump.sh users can use the `x-beta: true` [vender extension](/help/specification-support/doc-beta/) and filter that just as you would with `x-internal`. Another approach would be to use tags to mark things as beta, because openapi-filter will let you use tags as flags with the `--checkTags` flag. Here we can look for the `Beta` tag, and filter out any operations that use it.

```
  '/webhook/orders':
    post:
      operationId: post-orders
      summary: Save Shopify Order
      tags:
        - Webhooks
        - Beta
      requestBody:
        content:
          # snip
```

```
$ openapi-filter -- --flags Beta --checkTags api/openapi.yaml api/openapi.public.yaml
```

That extra `--checkTags` means openapi-filter will look into the `tags` array, and remove any that have tags mentioned in flags! 

For the Bump action that would look like this:

```
      - name: Filter beta endpoints
        run: |
          npx openapi-filter -- --flags Beta --checkTags api/openapi.yaml api/openapi.public.yaml

      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: <DOC-ID>
          token: ${{secrets.BUMP_TOKEN}}
          file: api/openapi.public.yaml # 👈 updated this
```

Ok, enough with removing things. What about adding and changing things? 

## Enriching OpenAPI with Descriptions & Examples 

Product, marketing, or tech writers often focus more on the  "why" and "how" of the OpenAPI descriptions, helping prepare them to be used as API Documentation after developers have traditionally set up the skeleton based mainly on the "what". 

For teams following an API Design First workflow (where you're managing your description documents as a source of truth and using them to power/test your code) then you probably don't have a problem, as your non-technical users can just modify those files, but teams who are following API Code-first have some problems to deal with here. When generating OpenAPI from source code with comments or annotations, or generated from HTTP traffic, any changes made to the generated OpenAPI will be lost next time they generate. How can that be avoided?

OpenAPI has a new experimental extension called Overlays, put together by the OAI (OpenAPI Initiative), tooling vendors, and community members that all came together to make a specification. 

It's early days for the standard, but Bump.sh has added experimental support for Overlays in the Bump CLI, meaning you can use it right now.

```
npm install -g bump-cli@beta
```

Let's take a look at some example use cases.

### Example: Update API Description with Overlays

Here we have a fairly generic `openapi.yaml` which was published by another team, not really intending it for a public audience.

```yaml
openapi: 3.1.0
info:
  title: Tree Tracker API
  description: 'Stock management for tree planting, and biodiversity improvement.'
```

Not very exciting is it! If this were your API, the technical writers would want to explain things a bit better, and the developer experience people want to outline where you could go to get access tokens, so lets make an overlay that does that.

The way Overlays work is to look up bits of the OpenAPI description using something like a CSS selector or XPath if you're familiar with that. Spectral users will recognize this for sure. Once you've pointed the overlay to a bit of the OpenAPI description, you can apply an action, which is either `update` or `remove`.

```yaml
# overlays.yaml
overlay: 1.0.0
info:
  title: Improve the API's main description
  version: 0.0.1
actions:
  - target: '$.info'
    description: Provide a better introduction for our end users than this techno babble.
    update:
      description: >
        Protect Earth's Tree Tracker API will let you see what we've been planting and restoring all
        around the UK, and help support our work by directly funding the trees we plant or the sites
        we restore.
        To get involved [contact us and ask for an access token](https://protect.earth/contact) then
        [check out the API documentation](https://protect.earth/api).
```

Let's break this down a bit. 

The `target` is `$` (root), then `.info` goes into the `info:` object at the root of our OpenAPI document. Now that we've pointed to the right bit of the OpenAPI document, we can update it, which in this example will update the object to contain a new `description` property, with a much longer description that's got handy Markdown (CommonMark) in there.

Now we've got the original `openapi.yaml` and this new `overlays.yaml` document sitting around, how can we actually get these overlays applied? With the [Bump.sh CLI](https://github.com/bump-sh/cli)! Run this command to make it all happen.

```
$ bump overlay openapi.yaml overlays.yaml > openapi.public.yaml
```

Now in `openapi.public.yaml` I can see my handy new description.

```yaml
# openapi.yaml
openapi: 3.1.0
info:
  title: Tree Tracker API
  description: >-
    Protect Earth's Tree Tracker API will let you see what we've been planting
    and restoring all around the UK, and help support our work by directly
    funding the trees we plant or the sites we restore.

    To get involved [contact us and ask for an access
    token](https://protect.earth/contact) then [check out the API
    documentation](https://protect.earth/api).
```

There, that's a lot more useful!

A pretty simple example, but hopefully an illustrative one, and the use cases can go as far as your creativity. Let's try some more out.

### Example: Updating Public Contact Info

Perhaps your API dev teams are putting their own work emails into the contacts. That is great for internal usage, but you probably don't want the entire world emailing that one developer. Let's swap `info.contact` for a more generic email: 

```yaml
# overlays.yaml
overlay: 1.0.0
info:
  title: Overlay to customise API for Protect Earth
  version: 0.0.1
actions:
  - target: '$.info'
    description: Let's have the public contact general support instead of whoever happened to release this API.
    update:
      contact:
        name: Protect Earth Support
        url: https://protect.earth/contact
        email: help@protect.earth
```

This has done more than just update a string, this has replaced all these properties in an object with the new properties. This can be used to append more properties onto an object too.

### Example: Adding Descriptions to Tags

Developers not adding descriptions for tags? They're a great place to put a lot more information about what an "Order" or "Organization" is in the context of this API, so let's expand on that.

```yaml
# overlays.yaml
overlay: 1.0.0
info:
  title: Overlay to customise API for Protect Earth
  version: 0.0.1
actions:
  - target: '$.tags[?(@.name=="Order")]'
    description: Provide more information for Order tags.
    update:
      description: >
        The Order resource represents a single order for trees, which can be fulfilled by one or more
        deliveries. Orders are created by the [Protect Earth team](https://protect.earth/contact) and
        are used to track the progress of your order from creation to delivery.

  - target: '$.tags[?(@.name=="Organization")]'
    description: Provide more information for Order tags.
    update:
      description: >
        The Organization resource represents a single organization, which can be a charity, business,
        or other entity. Organizations are created by the [Protect Earth team](https://protect.earth/contact)
        and are connected to each of your Orders.
```

Yeah that JSONPath is a bit wild, but by popping the whole OpenAPI description document (converted to JSON) into [the JSONPath Online Evaluator](https://jsonpath.com/) and taking a quick browse of the docs helped me get there.

### Deploy Overlay Changes to Bump

How can you automate working with overlays? Same idea as working with openapi-filter but we'll tweak the GitHub Actions a bit to use [Bump CLI](https://github.com/bump-sh/cli) (as overlay support has not been added to the GitHub Action just yet).

```yaml
# .github/workflows/bump.yml
name: Deploy API documentation

on:
  push:
    branches:
      - main

jobs:
  deploy-doc:
    if: ${{ github.event_name == 'push' }}
    name: Deploy API documentation on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Apply Overlays to customise OpenAPI
        working-directory: ./api
        run: |
          npx bump-cli@beta overlay openapi.yaml overlays.yaml > openapi.public.yaml

      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: 68ac0647-184a-4e9d-accc-682a5b1f7189
          token: ${{secrets.BUMP_TOKEN}}
          file: api/openapi.public.yaml
```

### Example: Removing Development Servers with Overlays

Before you send OpenAPI-based API documentation out to the public you may want to remove development and staging servers to avoid confusing end-users, and in the past that's been something that has caused conflict with dev teams. Do you force them to remove it from their OpenAPI, despite it being useful for them, or do you try and hack it later? 

No more arguments, and no more hacks. You can do that with overlays.

```yaml
# overlays.yaml
overlay: 1.0.0
info:
  title: Hide Non-Production Servers
  version: 0.0.1
actions:
  - target: '$.servers.*'
    description: Remove all other servers so we can add our own.
    remove: true

  - target: '$.servers'
    description: Pop our server into the empty server array.
    update:
      - description: Production
        url: https://api.protect.earth/
```

IF you'd like something more generic: 

```yaml
# overlays.yaml
overlay: 1.0.0
info:
  title: Remove non-Production Servers
  version: 0.0.1
actions:
  - target: '$.servers[?(@.description=="Development" || @.description=="Staging")]'
    description: Remove Development and Staging servers but leave anything else.
    remove: true
```

This action will remove any servers with a `description` of "Development" or "Staging". This approach could also be done with openapi-filters if you pop `x-internal` on there, so there is a bit of crossover in what can be done.

## Summary

Filters are a quick and relatively simple way to customize OpenAPI, but they can really only do the one thing. If you just want to remove some operations, tags, servers, etc., then openapi-filter is probably the way to go.

Overlays are a lot more advanced and can do both removals and updates. It's a bit harder to work with, and the Speakeasy dependency is not the easiest to install on some computers (especially Continuous Integration environments), but the power is incredible.

Being able to change things however you like, then publish the changed versions off seamlessly is really handy, and will hopefully be the last time you need to do awkward JSON/YAML hacking on other peoples documents. JSONPath is a tricky thing to learn, but if you can master regex you can master JSONPath, then the world is your oyster.
