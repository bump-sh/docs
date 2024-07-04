---
title: Paths and Operations
authors: phil
excerpt: Learn your way around the OpenAPI description format for HTTP APIs by learning the basic structure.
date: 2024-07-04
---

OpenAPI has the concept of "paths" and "operations", which is two parts of what people would think of as an "endpoint". The path covers the URL and the operation covers the rest of it. 

Here are a list of paths in the [Train Travel API example](https://bump.sh/blog/modern-openapi-petstore-replacement).

```yaml
paths:
  /stations:
  /trips:
  /bookings:
  /bookings/{bookingId}:
  /bookings/{bookingId}/payment:
```

The path defines the relative path of the API endpoint from wherever the server URL ends, which in this example is `https://api.example.com`, which together describe full URLs like this:

- `https://api.example.com/stations`
- `https://api.example.com/trips`
- `https://api.example.com/bookings`
- `https://api.example.com/bookings/{bookingId}`
- `https://api.example.com/bookings/{bookingId}/payment`

Paths can store variables, a little bit like the concept of [server variables](./api-servers.md), using curly brackets as a placeholder for a parameter which will be defined within the operation.
 
### Defining Paths

Each path can then define one or more operations, using HTTP methods like `get`, `post`, `put`, `patch`, or `delete` as a key and the operation as an object inside that.

```yaml
  /bookings:
    get:
      operationId: get-bookings
      summary: List existing bookings
      description: Returns a list of all trip bookings by the authenticated user.
      responses:
        '200':
          description: A list of bookings
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Booking'

    post:
      operationId: create-booking
      summary: Create a booking
      description: A booking is a temporary hold on a trip. It is not confirmed until the payment is processed.
      security:
        - OAuth2:
            - write
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Booking'
      responses:
        '201':
          description: Booking successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Booking'
```

Each operation should have an `operationId` which is really useful for all sorts of automated tooling, and a summary which is more human-readable and helps the operation show up nicely in documentation tools. 

The description can then be as long and complex as you want, using CommonMark (standardized Markdown) and multi-line YAML syntax to place all the context which cannot be picked up from just looking at variable names.

Any HTTP request which has a body (e.g.: `POST`, `PUT`, `PATCH`) can define a `requestBody`, which can be marked as required or not. Each request can have multiple content types, supporting JSON, XML, CSV, images, whatever you need to define. This is helpful for APIs which support a direct upload of images or a JSON body containing a URL to the image, or "import spreadsheet" type functionality. 

The responses are then broken down by status code, and again all the responses can have multiple content types. 

For both request and response, `schema` is optional, but is massively helpful and worth putting in the work to define, because this is where all of the HTTP body information exists, which can contain validation rules, potential values, examples, and useful context like "why" and "how" instead of just "what". 

Learn more about [paths & operations](./paths-operations.md).
