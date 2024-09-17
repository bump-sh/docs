---
title: Defining Parameters
authors: phil
excerpt: Teach OpenAPI all about the headers, query params, and path parameters in your API.
date: 2024-07-04
---

- TOC
{:toc}

Parameters in OpenAPI v3.1 are a fundamental part of creating an API specification, allowing you to define the inputs your API can accept. 

Parameters fall into one of a few types:

- **Path Parameters:** Variables within the path, e.g., `/bookings/{bookingId}`.
- **Query Parameters:** Appended to the URL, e.g., `/bookings?date=2024-05-01`.
- **Header Parameters:** Included in the request header, e.g., `Acme-Custom-Header: Value`.
- **Cookie Parameters:** Passed in the request cookies.

> In previous versions of OpenAPI the entire request body and form data would all be sent as parameters, but since OpenAPI v3.0 this has been moved to the content object. Learn more in [HTTP Requests](_guides/openapi/specification/v3.1/understanding-structure/http-requests.md).
{: .info }

Each parameter in OpenAPI is defined with specific attributes such as `name`, `in` (location), `required`, `description`, and `schema` (for defining data types and validation rules). Defining parameters with these keywords allows documentation to show example how HTTP requests should be constructed making life easier for the client, but also make sure machines know what to do with it, making SDKs and server-side validation a whole lot more powerful.

## Parameter Types

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

Here is one required path parameter, `bookingId`, with its `name` matching `{bookingId}`. The `schema` can contain anything you'd [expect to find in schema](_guides/openapi/specification/v3.1/data-models/schema-and-data-types.md), from data types to other validations.

> Path parameters have to be marked as `required: true` because they're in the path, and if its missing it would break especially if the variable was between two other segments, e.g: `/bookings/{bookingId}/payment` would become `/bookings//payment` if the value was empty and that's going to be confusing.
{: .warning }

OpenAPI v3.1 is very particular about allowed characters:

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

Cookie parameters can be any primitive values, arrays and objects. Arrays and objects are serialized using the form style. For more information, see [Parameter Serialization](_guides/openapi/specification/v3.1/understanding-structure/parameter-serialization.md).

The first thought might be to use cookie for authentication, but for that you would be better off using [API keys](_guides/openapi/specification/v3.1/advanced/security.md). Cookie parameters are reserved for other things, like tracking and analytics, locale preferences, or other session related information which does not fit into the HTTP specification with dedicated headers.

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
