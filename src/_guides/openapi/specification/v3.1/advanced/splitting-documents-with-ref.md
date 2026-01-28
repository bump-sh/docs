---
title: "Splitting OpenAPI Documents with $ref"
authors: phil
image: /docs/images/guides/ref_advanced_usages.png
canonical_url: https://bump.sh/blog/openapi-asyncapi-ref-usage-guide
excerpt: Learn how to use $ref to reduce clutter and repetition in your OpenAPI documents.
date: 2024-07-10
---

- TOC
{:toc}

After using OpenAPI for a while, you might notice your description documents have become a rather unwieldy mess of YAML and JSON. You end up with a whole lot of repetition, and this huge mess just loves to trigger merge conflicts as multiple developers change different things but Git seems none the wiser.

You can avoid this pain by splitting description documents up with `$ref`, using various reusable components, but how exactly you go about doing that can be a tricky one to work out.

## OpenAPI Reusable Components

The [OpenAPI Documentation](https://learn.openapis.org/) includes a brilliant example of an API for playing the classic board game Tic Tac Toe. 

This has several parts that are used several times, so instead of copy-pasting everything they've defined reusable `components` for both `schemas` and `parameters`. 

```yaml
paths:
  # Whole board operations
  /board:
    get:
      summary: Get the whole board
      description: Retrieves the current state of the board and the winner.
      tags:
        - Gameplay
      operationId: get-board
      responses:
        "200":
          description: "OK"
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/status"
  # Single square operations
  /board/{row}/{column}:
    parameters:
      - $ref: "#/components/parameters/rowParam"
      - $ref: "#/components/parameters/columnParam"
    get:
      # ... Hidden for readability...
    put:
      # ... Hidden for readability...

components:
  parameters:
    rowParam:
      description: Board row (vertical coordinate)
      name: row
      in: path
      required: true
      schema:
        $ref: "#/components/schemas/coordinate"
    columnParam:
      description: Board column (horizontal coordinate)
      name: column
      in: path
      required: true
      schema:
        $ref: "#/components/schemas/coordinate"
  schemas:
    errorMessage:
      type: string
      maxLength: 256
      description: A text message describing an error
    coordinate:
      type: integer
      minimum: 1
      maximum: 3
      example: 1
    mark:
      type: string
      enum: [".", "X", "O"]
      description: Possible values for a board square. `.` means empty square.
      example: "."
    board:
      type: array
      maxItems: 3
      minItems: 3
      items:
        type: array
        maxItems: 3
        minItems: 3
        items:
          $ref: "#/components/schemas/mark"
    winner:
      type: string
      enum: [".", "X", "O"]
      description: Winner of the game. `.` means nobody has won yet.
      example: "."
    status:
      type: object
      properties:
        winner:
          $ref: "#/components/schemas/winner"
        board:
          $ref: "#/components/schemas/board"

```

This is not particularly unmanageable, but let's pretend there is 50 or more endpoints. You could imagine how this one file would be getting a bit much to handle.

How people split up there files has been completely unique to the developer for a long time, but certain conventions are starting to emerge with tooling leading the way.

```
├── paths
│   ├── board.yaml
│   └── board_{row}_{column}.yaml
├── components
│   ├── schemas
│   │   ├── errorMessage.yaml
│   │   ├── board.yaml
│   │   ├── coordinate.yaml
│   │   ├── status.yaml
│   │   ├── winner.yaml
│   │   └── mark.yaml
│   └── parameters
│       ├── columnParam.yaml
│       └── rowParam.yaml
└── openapi.yaml
```

This convention splits each type of `components` into their own subdirectory, and then puts them into their own unique file. 

Now the `openapi.yaml` is a whole lot lighter.

```yaml
openapi: 3.1.0
info:
  title: Tic Tac Toe
  description: |
    This API allows writing down marks on a Tic Tac Toe board
    and requesting the state of the board or of individual squares.
  version: 1.0.0
tags:
  - name: Gameplay
paths:
  /board:
    $ref: paths/board.yaml
  /board/{row}/{column}:
    $ref: paths/board_{row}_{column}.yaml
```

The `paths/board.yaml` looks like this:

```yaml
get:
  summary: Get the whole board
  description: Retrieves the current state of the board and the winner.
  tags:
    - Gameplay
  operationId: get-board
  responses:
    '200':
      description: OK
      content:
        application/json:
          schema:
            $ref: ../components/schemas/status.yaml
```

Finally, `components/schemas/status.yaml` looks like this:

```yaml
type: object
properties:
  winner:
    $ref: ./winner.yaml
  board:
    $ref: ./board.yaml
```

All the filepaths are relative to their current location, and can traverse up and down the filesystem, with the standard `../` to go up a directory.

The chance of getting a Git conflict when two different developers add two different paths or expanding properties in a schema is now a fair bit smaller. If a conflict does occur, the diff will be a lot less confusing to work out.

One downside of splitting up components into different documents like this is that it becomes harder to follow API changes, either directly or by looking at files in GitHub. Changing a schema in one document can effect how multiple different endpoints work, and that can caused a bit of confusion. API change management tools like [Bump.sh](https://bump.sh/api-change-management) or [Optic](https://www.useoptic.com/docs/diff-openapi) can help by spotting breaking changes and reporting them on PRs, so that you can easily see problems that could otherwise slip through.

## AsyncAPI Reusable Components

AsyncAPI is thankfully the same when it comes to `$ref` and `components`, so if your event-driven API is struggling as much as your HTTP API then it's time to split things up.

```yaml
  v0/rust/servers/{server_id}/players/{steam_id}/events/banned:
    description: Channel for notifying a server banned a player
    parameters:
      server_id:
        "$ref": "./components/parameters.json#/server_id"
      steam_id:
        "$ref": "./components/parameters.json#/steam_id"
    subscribe:
      operationId: ServerPlayerBanned
      message:
        "$ref": "./components/messages/ServerPlayerBanned.json"
```

This example is taken from the [Gaming API](https://github.com/GamingAPI/definitions/) example projects, and highlights a slightly different approach of using a single `parameters.json` document and referencing a parameter within that file, instead of using a `parameters/` subdirectory with a file for each parameter. You could do either with either OpenAPI or AsyncAPI, it's a matter of personal preference. 

To learn more about the `components` keyword in AsyncAPI, head on over to [their documentation](https://www.asyncapi.com/docs/reference/specification/v2.6.0#componentsObject).

## Using $ref with URLs

Filepaths are not the only way to work with `$ref`, you can also use URLs.

This is particularly helpful when you have a "data model" that is shared across multiple APIs or microservices. Perhaps you don't want each API to define a User, Company, or Payment separately, and get stuck with infinite different variant models. 

Simply publish those shared components as JSON, YAML, or both, on a static site or S3 bucket somewhere and let people $ref them into their API.

```yaml
  responses:
    '200':
      description: OK
      content:
        application/json:
          schema:
            $ref: "https://schema.example.org/status.json"
```

### Benefits of URL `$ref`

Doing this has several benefits. Not only can other API teams all work together to make a single repository of all the most command/shared components, but API consumers can use them too. 

Perhaps clients want to implement some [client-side validation](https://apisyouwonthate.com/blog/json-schema-client-side-validation/) to make sure form submissions are valid before they waste time and carbon emissions going over the wire talking to the API with an invalid request.

Specifically splitting the "schemas" out is brilliant because its not just helpful for [OpenAPI tooling](https://openapi.tools), but for [JSON Schema tooling](https://json-schema.org/implementations) too. There's even more JSON Schema tooling than OpenAPI tooling so its handy to be able to use both.

### Downsides of URL `$ref`

One downside you're probably already thinking of is that doing all of this requires a bit of work. This is jokingly called SpecOps (API descriptions are also known as "specifications"). Setting up deployment pipelines and hosting to make those reusable components available is a faff.

Other complications can appear depending on which tools you're using. Some tools do not support URLs in `$ref`, either for security concerns or because the tool maintainers never got around to it. You need to programmatically replace all the $ref's with URLs to be local refs, and whilst there are tools which can "bundle" your API descriptions up for you, it's another bit of work, and adds another copy of the API description document to keep track of and keep updated.

Finally there's authentication. Some people have their API descriptions in a private Git repositories and cannot access it with `https://raw.githubusercontent.com/org/repo/main/content/schemas/foo.json` because it would need some sort of access token and how's that going to work? Making a GitHub Action / Continuous Integration step that deploys the API descriptions or schemas to a public S3 bucket or other public static site is probably the best thing to do there.

Others hide their OpenAPI and AsyncAPI by choice for security reasons, but that's never made much sense because Stripe, PayPal, Box, GitHub, and plenty of other massive API companies have their API descriptions out in public and nobody has hacked them. APIs should be protected with firewalls and API keys, but OpenAPI and AsyncAPI information can be plastered all over the place. Another vote for the public static site.

There is an argument for making public APIs public and keeping internal API's private, and some hosted API documentation tools can help with that, or you can host internal API docs on a different static site that's only available on the company network. Either way you'll need to keep your public APIs public, and keep your shared components public, then hide the internal APIs that reference those. That gives you the best of both worlds.

## Propagating Changes

Using tools like Bump.sh you get all the benefits of a tool that understands $ref, but without any of the hassle of needing to bundle documents up. 

Like any tool which uses a build step, this has the pro and the con of meaning that documentation is built at a certain point in time. Changes that happen to the $ref'ed resources - whether they're in another repository, or being pulled in via URL - will take some time to appear in your API.

For example, if the Widget API is using a shared Company schema via `$ref: https://widgets.com/schema/company.json`, and company decides to add VAT number as a property, your Widget API documentation is not going to mention that property until your next build.

Is that a good thing or a bad thing? It can be both depending on the scenario, but having changes appear in your API without your knowledge is probably not ideal.

## Tools for Bundling & Splitting 

Bundling is usually only needed if you are working with older or strange tools which do not support `$ref` properly (or at all). If you are working with Bump.sh CLI you won’t need to bundle, but if a tool wants you to import a single `openapi.yaml` document you might need to bundle.

```
$ redocly bundle openapi.yaml -o openapi-bundled.yaml
bundling openapi.yaml...
📦 Created a bundle for openapi.yaml at openapi-bundled.yaml 105ms.
```

This will grab all of the `$ref`'s that use "external files" or URLs and move the contents into the relevant subsection of `components` in the `openapi-bundled.yaml` document.

Splitting does the opposite. If you have a massive painful document (maybe generated from HTTP or converted from Postman) you can split it down into multiple documents with a sensible folder structure, ditch the original, commit all that to Git, and push it up to Bump.sh with all the `$ref`'s intact.

```
redocly split generated-openapi.json --outDir api/

bump deploy api/openapi.json
```

To give Redocly CLI a try, in combination with the Bump CLI, install them both:

```
npm install -g @redocly/cli bump-cli
```

## Further Reading 

If you'd like to learn more than you could ever possibly want to know about AsyncAPI $ref then head on over to [The Reference Rabbit Hole](https://www.asyncapi.com/blog/the-reference-rabbit-hole) by [Jonas Lagoni](https://github.com/jonaslagoni).
