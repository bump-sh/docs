---
title: Handling Error Formats
authors: phil
excerpt: Describing HTTP errors efficiently in OpenAPI v3.1.
date: 2024-08-07
---

- TOC
{:toc}

When your API is happy you return the data or whatever response the action would like to provide, but what happens when you stray off that happy path and into the world of errors? 

In HTTP an error is any response returning a 400-599 status code, but that alone is generally not enough to tell an API client what to do, why it happened, what can be done to avoid it, when to try again, or anything else. 

HTTP API errors usually involve some sort of JSON payload which explains a few key things:

- A human readable short summary: "Cannot checkout with an empty shopping cart"

- A human readable message: "It looks like you have tried to check out but there is nothing in your..."

- An application-specific error code relating to the problem: `ERRCARTEMPTY`

- Links to a documentation page or knowledge base where a client or user of the client can figure out what to do next.

## API Errors with JSON Responses

The most basic API error might look a bit like this, with something for the humans to read, a specific error code for a machine to read that should describe a more specific situation to them (perhaps its documented somewhere), and/or a unique link to a specific error which can help a machine recognize the exact application-level problem from a predefined list.


```http
HTTP/1.1 400 Bad Request
Content-Type: application/json

{
  "error": {
    "message": "Message describing the error",
    "code": "ERR-01234",
    "href": "http://example.org/docs/errors/#ERR-01234"
  }
}
```

This JSON structure is not perfect but it's realistic, so lets show how to describe it.

```yaml
paths:
  /bookings:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Booking'
        '400':
          $ref: '#/components/responses/BadRequest'
        '401':
          $ref: '#/components/responses/Unauthorized'
        '404':
          $ref: '#/components/responses/NotFound'
        '409':
          $ref: '#/components/responses/Conflict'
        '429':
          $ref: '#/components/responses/TooManyRequests'
        '500':
          $ref: '#/components/responses/InternalServerError'
```

This operation shows a success status of 201, and a whole variety of interesting potential errors that can be returned. Any HTTP interaction could have a 500 so maybe you don't need to mention that, and there could be infinite other errors happening between your server and the client that would be impossible to guess, but if you aim to define as many errors for any given operation as seem relevant, you aren't going to be far off.

To avoid repetition and ensure consistency, this example defines reusable HTTP error responses in the components section. These reusable components can then be referenced in multiple operations.

```yaml
components:
  schema:
    Problem:
      properties:
        message:
          type: string
          description: An explanation of the problem.
          example: Not enough credits in your account balance.
        code:
          type: string
          description: An error code relating to an application-specific error scenario
          example: ERR-01234
        href:
          type: string
          format: url
          description: A URL to find some more documentation on this problem if needed.
          example: http://example.org/docs/errors/#ERR-01234

  responses:
    BadRequest:
      description: Bad Request
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Problem'
          example:
            message: The request is invalid or missing required parameters.
            code: ERR-NAUGHTY001
            href: https://example.com/docs/errors/ERR-NAUGHTY001

    Conflict:
      description: Conflict
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Problem'
          example:
            message: There is a conflict with an existing resource.
            code: ERR-EYYWOAH001
            href: https://example.com/docs/errors/ERR-EYYWOAH001

    Forbidden:
      description: Forbidden
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Problem'
          example:
            message: Access is forbidden with the provided credentials.
            code: ERR-NAH001
            href: https://example.com/docs/errors/ERR-NAH001

    InternalServerError:
      description: Internal Server Error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Problem'
          example:
            message: An unexpected error occurred.
            code: ERR-OOF001
            href: https://example.com/docs/errors/ERR-OOF001
```

This approach is one of many you could take, but essentially what we're doing here is using one generic schema, then providing a tailored example for each type of error, with the types of error corresponding so far to the HTTP status codes likely to be returned. 

You could get more specific and get into application-level errors here, but they might be better off left as examples and the specific errors all defined elsewhere, the same place that is being linked to with these `href` values.

## Other Error Formats

API errors can be designed in a bunch of ways, and described in a bunch of ways, but as with most things in APIs: there's a standard for that! Actually... there's a few.

### RFC 9457: Problem Details

[RFC 9457: Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc9457) (replacing very similar RFC 7807) defines loads of useful ideas and structure for API error messages. If we want to describe this, we can expand the main problem object from the last example. 

```yaml
components:
  schema:
    Problem:
      properties:
        type:
          type: string
          description: A URI reference that identifies the problem type
          example: https://example.com/probs/out-of-credit
        title:
          type: string
          description: A short, human-readable summary of the problem type
          example: You do not have enough credit.
        detail:
          type: string
          description: A human-readable explanation specific to this occurrence of the problem
          example: Your current balance is 30, but that costs 50.
        instance:
          type: string
          description: A URI reference that identifies the specific occurrence of the problem
          example: /account/12345/msgs/abc
        status:
          type: integer
          description: The HTTP status code
          example: 400
```

Then as before you can expand on that schema with better examples.

```yaml
  responses:
    BadRequest:
      description: Bad Request
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
          example:
            type: https://example.com/errors/bad-request
            title: Bad Request
            status: 400
            detail: The request is invalid or missing required parameters.
        
    Conflict:
      description: Conflict
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
          example:
            type: https://example.com/errors/conflict
            title: Conflict
            status: 409
            detail: There is a conflict with an existing resource.
     
    Forbidden:
      description: Forbidden
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
          example:
            type: https://example.com/errors/forbidden
            title: Forbidden
            status: 403
            detail: Access is forbidden with the provided credentials.
     
    InternalServerError:
      description: Internal Server Error
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
          example:
            type: https://example.com/errors/internal-server-error
            title: Internal Server Error
            status: 500
            detail: An unexpected error occurred.
```

Here the `application/problem+json` content type lets everyone know this is specifically using that RFC, the URIs replace both the status code and the link to documentation, and a title + detail allow room for a generic error message and instance specific details about the exact problem happening right now.

### JSON:API Errors

Another popular format for API errors is the JSON:API errors format. This format provides a standardized structure for representing errors in JSON responses.

The JSON:API errors format includes the following key components:

- An array of error objects, each representing a specific error.
- Each error object contains the following properties:
  - `id`: A unique identifier for the error.
  - `status`: The HTTP status code associated with the error.
  - `code`: An application-specific error code.
  - `title`: A short, human-readable summary of the error.
  - `detail`: A detailed description of the error.
  - `source`: Information about the source of the error, such as the field or parameter that caused the error.

This is a little different as its an array of `errors`, but here's how we can handle that with OpenAPI:

```yaml
components:
  schema:
    Problem:
      type: object
      properties:
        errors:
          type: array
          items:
            type: object
            properties:
              id:
                type: string
                format: uuid
                description: A unique identifier for the error.
                examples: ["2fe04316-9775-46af-987b-a12d8620d42e"]
              status:
                type: string
                description: The HTTP status code associated with the error.
                examples: ["404"]
              code:
                type: string
                description: An application-specific error code.
                examples: [ERR-NOT-FOUND]
              title:
                type: string
                description: A short, human-readable summary of the error.
                examples: [Resource Not Found]
              detail:
                type: string
                description: A detailed description of the error.
                examples: [The requested resource could not be found.]
              source:
                type: object
                properties:
                  pointer:
                    type: string
                    description: Information about the source of the error, such as the field or parameter that caused the error.
                    examples: ["/data/id"]
                  parameter:
                    type: string
                    description: Information about the source of the error, such as the field or parameter that caused the error.
                    examples: [id]
```

The fact that the schema is an array does not change the previous approach for describing errors, we just move that into the example: 

```yaml
  responses:
    BadRequest:
      description: Bad Request
      content:
        application/vnd.api+json:
          schema:
            $ref: '#/components/schemas/Problem'
          example:
            errors:
              - id: "2fe04316-9775-46af-987b-a12d8620d42e"
                status: "400"
                code: "ERR-BAD-REQUEST"
                title: "Bad Request"
                detail: "The request contained an id with an integer but its meant to be a UUID"
                source:
                  pointer: "/data/id"
                  parameter: "id"
            
    Conflict:
      description: Conflict
      content:
        application/vnd.api+json:
          schema:
            $ref: '#/components/schemas/Problem'
          example:
            errors:
              - id: "2fe04316-9775-46af-987b-a12d8620d42e"
                status: "409"
                code: "ERR-CONFLICT"
                title: "Bad Request"
                detail: > 
                  There is a conflict with an existing resource, the approved status
                  cannot be changed back to pending.
                source:
                  pointer: "/data/status"
                  parameter: "status"
     
    Forbidden:
      description: Forbidden
      content:
        application/vnd.api+json:
          schema:
            $ref: '#/components/schemas/Problem'
          example:
            errors:
              - id: "2fe04316-9775-46af-987b-a12d8620d42e"
                status: "403"
                code: "ERR-FORBIDDEN"
                title: "Access is forbidden with the provided credentials."
                detail: > 
                  This action cannot be undertaken for this particular reason.
                source:
                  pointer: "/header/Authorization"
                  parameter: "Authorization"
```

If you need to handle errors responses in multiple content types, you can learn about [Multiple Content Types](_guides/openapi/specification/v3.1/advanced/multiple-content-types.md) and it's all the same.
