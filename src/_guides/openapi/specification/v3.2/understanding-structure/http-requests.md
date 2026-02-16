---
title: HTTP Requests
authors: phil
excerpt: Define HTTP requests in your OpenAPI to help users know the rules on what to send and how.
date: 2025-07-09
---

- TOC
{:toc}

HTTP requests are a fundamental part of any API. They allow clients to send data to the server, whether that’s creating new resources, updating existing ones, or performing complex queries.

OpenAPI 3.x provides a robust way to define these requests, and OpenAPI v3.2 introduces even more capabilities to handle a wider range of scenarios.

Supported HTTP Methods: 

- `GET`
- `PATCH`
- `POST`
- `PUT`
- `DELETE`
- `HEAD`
- `OPTIONS`
- `TRACE`
- `QUERY`
- Additional custom methods via `additionalOperations`

The HTTP request can also include a body: usually JSON or XML. The request body can be used for:

- Creating new resources (e.g.: booking a train ticket)
- Updating existing resources (e.g.: updating or cancelling that booking)
- Uploading files (e.g.: uploading an image to your railcard)

## Structure of Request Bodies

In OpenAPI 3.x, the request body is defined using the `requestBody` object. This object allows you to specify:

- The content type (e.g.: `application/json`, `application/xml`).
- The schema that defines the structure of the request body.
- Whether the request body is required or optional.
- Descriptions for these requests to add context to API documentation.

Let's consider the [Train Travel API](https://bump.sh/blog/modern-openapi-petstore-replacement), which allows users to book train tickets.

### Creating a Resource

When a user wants to book a train ticket, they need to send details like the passenger's name, trip ID, date of travel, and seat preference, which would look a bit like this:

```yaml
paths:
  /bookings:
    post:
      summary: Book a train ticket
      description: Endpoint to book a train ticket
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                passenger_name:
                  type: string
                  example: "John Doe"
                trip_id:
                  type: string
                  example: "1234"
                date:
                  type: string
                  format: date
                  example: "2024-08-15"
                seat_preference:
                  type: string
                  enum: [window, aisle, any]
                  example: "window"
```

Here the `requestBody` object defines two important properties:

- `required: true` - indicates that the request body is mandatory for this operation.
- `content` - specifies that the request body should be in `application/json` format with the following `schema`.

The schema defines the structure of the request body, including properties like `passenger_name`, `train_id`, `date`, and `seat_preference`. This can be defined inline like this, or it can use `components` to share an [existing schema](_guides/openapi/specification/v3.2/data-models/schema-and-data-types.md) and reduce repetition.

### Updating a Resource

If a user wants to update their booking (e.g.: change the seat preference), the API can define a `PUT` or `PATCH` operation, to allow updating the entire booking, or part of the booking respectively. Either way, they need to send the updated data in the request body. Here’s how to define it:

```yaml
paths:
  /bookings/{bookingId}:
    patch:
      summary: Update a booking
      description: Endpoint to update an existing booking
      parameters:
        - name: bookingId
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                seat_preference:
                  type: string
                  enum: [window, aisle, any]
                  examples:
                  - aisle
```

Here the `PATCH` method is used to describe an operation that can update one specific field from an existing booking. The `required: true` says the `requestBody` is mandatory, and the only media type defined is `application/json` so that says the request must be in that format.

The `schema` then defines the structure of the request body, which demonstrates that only the `seat_preference` property can be updated.

If multiple properties could be updated, you would define all the properties that could be updated, then show off some [examples](_guides/openapi/specification/v3.2/data-models/examples.md) for common use-cases of things users might want to do.

## Query Requests

OpenAPI 3.2 adds native support for the `QUERY` HTTP method, which is designed to support complex queries that don’t fit neatly in URL query strings.

Prior to the HTTP Query method it was common for people to add infinite query string parameters like  `?origin=london&destination=paris&has_dogs=true`, or to try and create some sort of query syntax using a standard or home-grown DSL like `?filter=origin:london,destination:paris,has_dogs:true`, but these syntaxes struggle when it comes to `is null`, `not null`, or `>=10`. Putting the query into the body allows for more advanced structures using JSON for example.

```yaml
paths:
  /products:
    query:
      summary: Product search
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                filter:
                  type: object
                  required: [field, value]
                  properties: 
                    field:
                      type: string
                      examples: [id]
                    value:
                      type: string
                      examples: [abc123]
                    operator:
                      type: string
                      example: "!="
                sort:
                  type: object
                  description: A hash of field names as keys, and direction as a value (asc or desc).
                  additionalProperties:
                    type: string
                    enum: [asc, desc]
                  examples:
                    - price: "desc"
                      published: "desc"

      responses:
        '200':
          description: Search results
```

Within a simple structure like this, searching and filtering can be handled with a more useful 

```http
QUERY /feed 
Content-Type: application/json

{ 
  "q": "foo", 
  "limit": 10, 
  "sort": {
    "price": "desc",
    "published": "asc"
  }, 
   "filter": [
    {
      "field": "origin",
      "value": "london"
    },
    { 
      "field": "destination",
      "value": "paris"
    },
    {
      "field": "price",
      "value": "60.00",
      "operator": "<="
    }
  ]
}
```

## Additional HTTP Methods

Use `additionalOperations` for HTTP methods not covered by standard OpenAPI operations. 

For example, maybe an API is using the `PURGE` HTTP method to remove cached resources from the an API behind a cache proxy like [Varnish](https://varnish-cache.org/docs/3.0/tutorial/purging.html).

```yaml
paths:
  /tickets/{ticketId}:
    parameters:
      - name: ticketId
        in: path
        required: true
        schema:
          type: string
    additionalOperations:
      PURGE:
        summary: Purge a ticket from the cache
        responses:
          '204':
            description: Ticket purged from cache
```

This allows for full support of any HTTP method you can think of, allowing OpenAPI v3.2 to go beyond only supporting the core HTTP methods.

## File Uploads & Multipart Forms

HTTP requests can also cover more advanced scenarios like [file uploads](_guides/openapi/specification/v3.2/advanced/file-uploads.md) and [multipart form data](_guides/openapi/specification/v3.2/advanced/multipart-form-data.md), which have their own guides in the advanced section.
