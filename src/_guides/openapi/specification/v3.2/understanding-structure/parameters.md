---
title: Defining Parameters
authors: phil
excerpt: Teach OpenAPI all about the headers, query params, and path parameters in your API.
date: 2025-07-04
---

- TOC
{:toc}

Parameters in OpenAPI are a fundamental part of creating an API specification, allowing you to define the inputs your API can accept. 

Parameters fall into one of a few types:

- **Path Parameters:** Variables within the path, e.g., `/bookings/{bookingId}`.
- **Query Parameters:** Appended to the URL, e.g., `/bookings?date=2024-05-01`.
- **Header Parameters:** Included in the request header, e.g., `Acme-Custom-Header: Value`.
- **Cookie Parameters:** Passed in the request cookies.

Each parameter in OpenAPI is defined with specific attributes such as `name`, `in` (location), `required`, `description`, and `schema` (for defining data types and validation rules). Defining parameters with these keywords allows documentation to show example how HTTP requests should be constructed making life easier for the client, but also make sure machines know what to do with it, making SDKs and server-side validation a whole lot more powerful.

## Parameter Types

There are five main types of parameters in OpenAPI v3.2, each serving a different purpose in the context of an HTTP request.

- Path Parameters - `in: path`
- Query Parameters -`in: query`
- Header Parameters - `in: header`
- Cookie Parameters - `in: cookie`
- OpenAPI 3.2 added Querystring Parameters `in: querystring`

That new addition is a little confusing as the names are so similar, but we'll cover that in a bit.

### Path Parameters

The first type of parameter to get the hang of is path parameters.

```yaml
  /bookings/{bookingId}:
    get:
      parameters:
        - name: bookingId
          in: path
          required: true
          description: The ID of the booking to retrieve.
          schema:
            type: string
            format: uuid
          example: 1725ff48-ab45-4bb5-9d02-88745177dedb
```

Here is one required path parameter, `bookingId`, with its `name` matching `{bookingId}`. The `schema` can contain anything you'd [expect to find in schema](_guides/openapi/specification/v3.2/data-models/schema-and-data-types.md), from data types to other validations.

> Path parameters have to be marked as `required: true` because they're in the path, and if its missing it would break especially if the variable was between two other segments, e.g: `/bookings/{bookingId}/payment` would become `/bookings//payment` if the value was empty and that's going to be confusing.
{: .warning }

OpenAPIis very particular about allowed characters:

> The value for these path parameters MUST NOT contain any unescaped "generic syntax" characters described by RFC3986: forward slashes (/), question marks (?), or hashes (#).

This means it's best to just use normal A-Z and 0-9 characters in the names for your path parameters. 

### Query Parameters

```yaml
  /trips:
    get:
      parameters:
        - name: origin
          in: query
          description: The ID of the origin station
          required: true
          schema:
            type: string
            format: uuid
          example: efdbb9d1-02c2-4bc3-afb7-6788d8782b1e
        - name: destination
          in: query
          description: The ID of the destination station
          required: true
          schema:
            type: string
            format: uuid
          example: b2e783e1-c824-4d63-b37a-d8d698862f1d
        - name: date
          in: query
          description: The date and time of the trip in ISO 8601 format in origin station's timezone.
          schema:
            type: string
            format: date-time
          example: '2024-02-01T09:00:00Z'
```

In this example `origin`, `destination`, and `date` are query parameters. The first two are defined as required, because it's important to know where you're going from and to when buying a ticket, but the date is optional at this point because a customer might be looking for the cheapest day.

Query parameters are appended to the URL when a client actually makes the request, e.g., `/trips?origin=efdbb9d1-02c2-4bc3-afb7-6788d8782b1e&destination=destination&date=2024-05-01T10:00:00`. 

### Header Parameters

Header parameters are sent in the HTTP request as a HTTP header. HTTP headers are often are often used for passing authorization tokens, specifying content types being sent, requesting the types being received, and directing the behavior of cache mechanisms. Some of this is already covered by other OpenAPI functionality so you don't need to manually re-define `Content-Type` or `Accept`, but anything else will need to be defined. 

For example, if you'd like to let API users know they can ask for fresh (uncached) data on a certain endpoint, you can advertise the API respects the `If-Modified-Since` header like this:

```yaml
paths:
  /trips:
    get:
      summary: Get train trips
      parameters:
        - in: header
          name: If-Modified-Since
          schema:
            type: string
            format: date-time
          required: false
          description: >
            Allows the client to request the resource only if it has been modified after the specified date and time.
      responses:
        '200':
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Trips'
        '304':
          description: The data has not been modified since the date and time specified in the `If-Modified-Since` header.
```

Try to clearly explain not just what the header does, but in what scenarios a client might want to use it, and focus on how it helps them.


### Cookie Parameters

Cookie parameters are sent in the HTTP request through the [Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies) functionality available in all web browsers and some HTTP clients. 

Cookie parameters can be any primitive values, arrays and objects. Arrays and objects are serialized using the form style. For more information, see [Parameter Serialization](_guides/openapi/specification/v3.2/understanding-structure/parameter-serialization.md).

The first thought might be to use cookie for authentication, but for that you would be better off using [API keys](_guides/openapi/specification/v3.2/advanced/security.md). Cookie parameters are reserved for other things, like tracking and analytics, locale preferences, or other session related information which does not fit into the HTTP specification with dedicated headers.

```yaml
paths:
  /analytics/visit:
    get:
      summary: Track user visit
      description: Records user visit for analytics purposes.
      parameters:
        - name: UserId
          in: cookie
          required: false
          description: Unique user identifier
          schema:
            type: string
            example: "abc123"
        - name: VisitCount
          in: cookie
          required: false
          description: Number of visits by the user
          schema:
            type: integer
            example: 5
```

### Querystring Parameters

OpenAPI v3.2 added support for a new type of parameter called `querystring` parameters. These are similar to query parameters, but they allow for more complex structures to be sent in the query string.

Unlike `in: query`, with `in: querystring` the entire query string is treated as a single parameter with complex structure. This means that combinations of query parameters can be expressed using a well-defined Schema object:

```yaml
paths:
  /search:
    get:
      parameters:
      - name: advancedQuery
        in: querystring
        content:
          application/x-www-form-urlencoded:
            schema:
              type: object
              properties:
                filters:
                  type: object
                sorting:
                  type: array
                  items:
                    type: string
```

In HTTP that would look like this:

```http
GET /search?filters[origin]=london&filters[destination]=paris
  &filters[has_dogs]=true&sorting[]=price&sorting[]=duration
```

It also allows for JSON encoded query strings:

```yaml
paths:
  /search:
    get:
      summary: Search for items
      parameters:
        - name: filter
          in: querystring
          content:
            application/json:
              schema:
                type: object
                properties:
                  origin:
                    type: string
                  destination:
                    type: string
                  has_dogs:
                    type: boolean
          
```

In HTTP that would look like this:

```http
GET /search?filter={"origin":"london","destination":"paris","has_dogs":true}
```

Handling advanced query strings like this used to rely on trickery with a combination of [parameter serialization](_guides/openapi/specification/v3.2/understanding-structure/parameter-serialization.md) options most users (and tooling) seemed to struggle with. This new `querystring` parameter type makes it much clearer what is going on, and allows for more complex structures to be expressed in a way that is easier to understand.

Thanks to this new approach giving you the full power of the `schema` keyword, you can re-use and combine sets of query parameters with allOf, you can make them conditional and interdependent with `if`/`then`/`else`, and support [polymorphism with `oneOf`/`anyOf`](_guides/openapi/specification/v3.2/data-models/schema-composition.md). You can even forbid unexpected parameters with `additionalProperties: false` if you want to be strict about what is allowed.

## Defining Parameters for Multiple Operations 

All these examples show parameters being defined at the operation level, but they can also be defined at the path level to avoid repetition. This is especially useful for path parameters, but works for all types of parameters.

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
      ...
    delete:
      ...
```

By defining the `bookingId` parameter at the path level, it will be automatically applied to all operations under the `/bookings/{bookingId}` path.

## Defining Shared Parameters in Components

Alternatively, you can define shared parameters in the `components` section of your OpenAPI specification. This allows you to reuse the parameters across different paths and operations. Here's an example:

```yaml
components:
  parameters:
    bookingId:
      name: bookingId
      in: path
      required: true
      description: The ID of the booking to retrieve.
      schema:
        type: string
        format: uuid
      example: 1725ff48-ab45-4bb5-9d02-88745177dedb
```

To use the shared parameter, you can reference it in your path or operation like this:

```yaml
  /bookings/{bookingId}:
    get:
      parameters:
        - $ref: '#/components/parameters/bookingId'
    delete:
      parameters:
        - $ref: '#/components/parameters/bookingId'
```

This way, you can maintain consistency and avoid duplicating parameter definitions across your API description.

## Reserved Keywords in Parameters

Some characters are reserved for use in URI paths, query and header parameters, and this can lead to confusion when you want to use them literally in your parameter values. 

OpenAPI allows you to define parameters that can include these reserved characters without percent-encoding them via the `allowReserved` keyword to `path`, `query`, `header`, and `cookie` parameters. 

> The `allowReserved` keyword only added support for `header` parameters in OpenAPI v3.2.
{: .info }

When `allowReserved` is set to `true`, the parameter value can include reserved characters without percent-encoding them. This is particularly useful for parameters that need to include characters like `/`, `?`, or `#` in their values, such as file paths or URLs. For example, `/` is encoded as `%2F` (or `%2f`), so that the parameter value `photos/cat.jpg` would be sent as:

```
GET /files?path=photos%2Fcat.jpg
```

This rules for encoding are known as "reserved expansion", which is defined by [RFC 6570](https://www.rfc-editor.org/rfc/rfc6570). Basically, it allows [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986)'s reserved character set `:/?#[]@!$&'()*+,;=`, as well as percent-encoded triples. These can all pass through unchanged, but everything else will be percent-encoding (including % outside of percent-encoded triples).

Here's how `allowReserved: true` looks in action:

```yaml
parameters:
  - in: query
    name: path
    schema:
      type: string
    allowReserved: true
```

This allows you to send a request like this without percent-encoding the path:

```
GET /files?path=photos/cat.jpg
```

Learn more about reserved characters in the [OpenAPI v3.2 specification](https://spec.openapis.org/oas/v3.2.0#delimiters-in-parameter-values).
