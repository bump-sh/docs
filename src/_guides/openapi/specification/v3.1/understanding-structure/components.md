---
title: OpenAPI Components
authors: phil
excerpt: Learn your way around the OpenAPI description format for HTTP APIs by learning the basic structure.
date: 2024-07-02
---

The Components object in OpenAPI allows you to create reusable bits of OpenAPI that can then be pieced together like Lego to build a better API description. This keeps things nice and tidy, and you can even spread them across multiple documents to share components between multiple APIs, or at least just keep your file sizes down.

```yaml
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
        name:
          type: string
        email:
          type: string
          format: email
  parameters:
    userId:
      name: id
      in: path
      description: ID of the user
      required: true
      schema:
        type: integer
  responses:
    NotFound:
      description: User not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Error'
  requestBodies:
    User:
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/User'
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

The full list of objects which can be defined in components is:

- `callbacks` - Define callback objects that send outgoing requests.
- `examples` - Define reusable examples for whole media types.
- `headers` - Define reusable HTTP header objects to be included in responses.
- `links` - Define reusable links between operations.
- `parameters` - Define reusable parameters that can be used in requests.
- `pathItems` - Define reusable path items which can go into paths and webhooks.
- `requestBodies` - Define reusable request body objects for operations.
- `responses` - Define reusable response objects for operations.
- `schemas` - Define reusable schemas for media types and any other object which accepts schemas.
- `securitySchemes` - Define reusable security schemes for API authentication and authorization.

## Using $ref with Components

Once components have been defined they can be referenced with `$ref`. This is mostly the same definition of [$ref in JSON Schema](https://www.learnjsonschema.com/2020-12/core/ref/) so it can help to learn how that works, but there are a few caveats to keep in mind.

The [OpenAPI Documentation](https://learn.openapis.org/) from the OpenAPI Initiative includes a brilliant example of an API for playing the classic board game Tic Tac Toe, and it demonstrates `$ref` nicely.

This has several parts that are used several times, so instead of copy-pasting everything they’ve defined reusable `components` for both `schemas` and `parameters`.

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

Hopefully this gives an idea of how `$ref` can be used, and if you'd like to learn more check out our advanced guide: [Splitting Documents with $ref](../advanced/splitting-documents-with-ref.md).

## Create "Design Libraries" of Shared Components

An OpenAPI document does not need to contain `paths` or `webhooks`, it could be just a `components` object with nothing else.

One of more of these "components only" documents could then be shared around forming a rudimentary "design library", helping teams reuse data models and various other bits across multiple APIs, multiple departments, or even externally to your organization. 

There are various proprietary tools out there to help with this, but the concept can be achieved by just sharing these `openapi-components.yaml` or similar on your network drive, Git repository, intranet, or public website. 
