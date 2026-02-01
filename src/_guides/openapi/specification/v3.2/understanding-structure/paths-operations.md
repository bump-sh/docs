---
title: Paths and Operations
authors: phil
excerpt: Learn how to build OpenAPI descriptions using path and operations.
date: 2025-07-04
---

- TOC
{:toc}

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

Paths can store variables, a little bit like the concept of [server variables](_guides/openapi/specification/v3.2/understanding-structure/api-servers.md), using curly braces `{}` as a placeholder for a parameter which will be defined within the operation.
 
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

## HTTP Methods

In OpenAPI v3.1 only the following methods were allowed:

- `get`
- `put`
- `post`
- `delete`
- `options`
- `head`
- `patch`
- `trace`

OpenAPI v3.2 expanded this list to allow:

- `query` (as defined in [draft-ietf-httpbis-safe-method-w-body-08](https://www.ietf.org/archive/id/draft-ietf-httpbis-safe-method-w-body-08.html) or later)
- anything else via "additional properties".

Anything that you are using as a HTTP method could be used in an operation in capitals, so you could use the following examples: 

- `CONNECT` - used by proxies to establish a tunnel.
- `COPY` - old WebDAV method for copying resources. 
- `LOCK` - another old WebDAV method for locking a resource to prevent further editing.

Tempting as it is to use those old WebDAV methods, it's probably not a great idea, but the fact that OpenAPI v3.2 lets you document _any_ HTTP method you like is certainly an upgrade on previous versions.

## Operations

Each operation should have an `operationId` which is really useful for all sorts of automated tooling, and a summary which is more human-readable and helps the operation show up nicely in documentation tools. 

The description can then be as long and complex as you want, using CommonMark (standardized Markdown) and multi-line YAML syntax to place all the context which cannot be picked up from just looking at variable names.

Any HTTP request which has a body (e.g.: `POST`, `PUT`, `PATCH`, `QUERY`) can define a `requestBody`, which can be marked as required or not. Each request can have multiple content types, supporting JSON, XML, CSV, images, whatever you need to define. 

A common example would be supporting XML and JSON, but is really helpful for APIs which support image uploads being supported simultaneously via a direct `Content-Type: image/*` upload, whilst also supporting JSON sending the URL (e.g.: `"image_url": "http://..."`). It's also handy for  "import spreadsheet" type functionality. 

```yaml
paths:
  /bookings:
    post:
      summary: Create a new booking
      operationId: create-booking
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Booking'
          text/csv:
            schema:
              type: string
            example: |
              departureTime,arrivalTime,operator,price
              2023-04-01T10:00:00Z,2023-04-01T15:00:00Z,TrainCo,59.99
      responses:
        '200':
          description: Booking created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Booking'
            text/csv:
              schema:
                type: string
              example: |
                bookingId,departureTime,arrivalTime,operator,price
                123,2023-04-01T10:00:00Z,2023-04-01T15:00:00Z,TrainCo,59.99
```

The responses are then broken down by status code, and again all the responses can have [multiple content types](_guides/openapi/specification/v3.2/advanced/multiple-content-types.md). Then the content can be further described by a `schema`, and an `example` (or `examples`).

For both request and response, `schema` is optional, but is massively helpful and worth putting in the work to define, because this is where all of the HTTP body information exists, which can contain validation rules, potential values, examples, and useful context like "why" and "how" instead of just "what". 

- Learn more about defining [HTTP requests](_guides/openapi/specification/v3.2/understanding-structure/http-requests.md) and [HTTP responses](_guides/openapi/specification/v3.2/understanding-structure/http-responses.md).
- Learn more about [schemas and data types](_guides/openapi/specification/v3.2/data-models/schema-and-data-types.md).
