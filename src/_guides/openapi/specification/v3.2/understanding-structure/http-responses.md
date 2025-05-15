---
title: HTTP Responses
authors: phil
excerpt: 
date: 2025-05-14
---

- TOC
{:toc}

HTTP responses outline what an API user could expect to receive in response to a HTTP request. In OpenAPI responses described in the `responses` object, broken down by expected media-types and status codes.

```yaml
paths:
  /health:
    get:
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  healthy:
                    type: boolean  
```

Here's an example from the [Train Travel API](https://bump.sh/blog/modern-openapi-petstore-replacement), showing two responses for the same operation, one success and one failure, both defining a JSON response:

```yaml
  responses:

    '200':
      description: A list of train stations
      headers:
        RateLimit:
          description: The RateLimit header communicates quota policies.
          schema:
            type: string
            examples:
              - limit=10, remaining=0, reset=10
      content:
        application/json:
          schema:
            properties:
              $ref: '#/components/schemas/Stations'

    '400':
      description: Bad Request
      content:
        application/problem+json:
          schema:
            $ref: '#/components/schemas/Problem'
```

> These responses contain shared schemas which are referenced via the [components section](_guides/openapi/specification/v3.2/understanding-structure/components.md) to keep the relevant parts of the example clear, but you can [learn more about schemas](_guides/openapi/specification/v3.2/data-models/schema-and-data-types.md) to see what else could go in there.
{: .info }

The key parts that define a response:

**description**: A short, descriptive text about the response which is mandatory. It explains the meaning of the response in the context of the API operation. This is often just the status code text, so 200 would be "Ok", 201 would be "Success", but it can be anything you think makes sense.

**headers**: An optional map of headers that can be sent by the response. Each header is itself described by an object, which defines the name as a key, then has an object with a description of its own and a schema to describe the header. then `Cache-Controls`, RFC headers like `RateLimit` or custom headers like `'X-Rate-Limit'`.

**content**: An optional field that describes the content of the response body. It allows for different media types to be documented, specifying how the body of the response should be formatted. For each media type, you can define a schema and examples, making it clear what the response will look like. 

**links**: An optional section that can define hypermedia relations associated with the response. Links can show clients what operations might be related or available to them after receiving the response, essentially guiding them on what they can do next.

The HTTP response object in OpenAPI allows for detailed documentation of each possible outcome of an API operation, making it easier for developers to understand and handle those responses correctly in their applications.

## HTTP Status Codes

HTTP status codes are essential for defining the responses of API operations. Each response in an API operation must include at least one HTTP status code, such as `200` for success or `404` for not found. Typically an operation specifies one successful status code for the "happy path", and one or more error statuses describing the variety of things that can go wrong.

```yaml
  responses:
    '200':
      description: OK
    '304':
      description: Not Modified
    '400':
      description: Bad Request
    '401':
      description: Unauthorized
    '403':
      description: Forbidden
    '429':
      description: Too Many Requests
    '500':
      description: Internal Server Error
```

How many status codes you choose to describe is up to you. There is a balance to be found between "only the status codes the API is programmed to emit" and "everything that could possibly ever come out of the API, server, and network components involved" which is going to be different for everyone. 

### Status Ranges

OpenAPI allows defining a range of response codes to simplify documentation:

- 1XX for informational responses
- 2XX for successful responses
- 3XX for redirection messages
- 4XX for client errors
- 5XX for server errors

If a specific code is detailed within a range, that code's definition takes precedence over the general range definition. Each status code in the documentation requires a description, explaining under what conditions it is returned. Markdown (CommonMark) can be used for these descriptions to include rich text formatting.

### More about HTTP Status Codes

For more detailed information on HTTP status codes, the OpenAPI Specification defers to [RFC 9110](https://datatracker.ietf.org/doc/html/rfc9110) and the [IANA Status Code Registry](https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml). If a code is defined there, it's valid to use in your OpenAPI.

If you're struggling to remember which HTTP status codes to use for any scenario, [HTTP Cats](https://http.cat/) will help you visualize the right choice.

## Empty status body

Some HTTP responses will not have a body. For example 204 No Content is often used after something has been deleted and therefore there is nothing to return. Another common one is 304 Not Modified, which lets clients know they can [reuse previous cached responses](https://apisyouwonthate.com/blog/http-client-response-caching/) because nothing has changed on the server.

To describe HTTP responses with no body in OpenAPI you simply leave the `content` object out. 

```yaml
paths:
  /example:
    get:
      summary: "Endpoint with no response body"
      responses:
        '204':
          description: "No content to return"
          # No 'content' field here
```

> If you are using OpenAPI for contract testing then most tools will understand this, but they will get confused if you are omitting content for responses which do actually return content. Make your OpenAPI be more accurate by describing the return body content of anything which does return, and only omitting content for responses which legitimately do not return content. 
{: .warning }
