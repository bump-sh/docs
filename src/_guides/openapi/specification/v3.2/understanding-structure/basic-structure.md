---
title: Basic Structure
authors: phil
excerpt: Learn your way around the OpenAPI description format for HTTP APIs by learning the basic structure.
date: 2024-07-02
---

- TOC
{:toc}

The OpenAPI Specification (OAS) is an "API Description Format", providing a standard format for describing REST APIs, making it easier to design, document, and consume them.

In this tutorial we'll explore the structure of an OpenAPI document, focusing on the main sections and important elements, so that you can get a feel for where everything is, without having to scan through the whole OpenAPI Specification yourself.

## The OpenAPI Document

An OpenAPI document is typically formatted as either YAML or JSON ([RFC8259](https://www.rfc-editor.org/rfc/rfc8259)). The document itself is usually named `openapi.yaml` or `openapi.json`, but it could have any name.

It consists of several key sections that describe the API's endpoints, requests, responses, data models, and more. Here is an outline of the main sections:

1. **OpenAPI Object**
2. **Info Object**
3. **Servers Object**
4. **Paths Object**
5. **Components Object**
6. **Security Object**
7. **Webhooks Object**
8. **Tags Object**

Let's look at each of these objects to see what's going on.

### 1. OpenAPI Object

The root of the OpenAPI document is the `openapi` object, which specifies the version of the OpenAPI Specification being used. For example:

```yaml
openapi: 3.2.0
```

This is required, so that tooling knows which version you are working with. The `3.2` part is the important bit. The patch number (`3.2.0`) doesn't really matter as those "patch" versions only add clarifications to the specification and never change meaning, but it's helpful to know what version somebody was reading when they wrote the OpenAPI.

### 2. Info Object

The `info` object holds general metadata about the API, such as the title, version, description, and contact information.

```yaml
info:
  title: Train Travel API
  description: |
    API for finding and booking train trips across Europe.
  version: 1.0.0
  contact:
    name: Train Support
    url: https://example.com/support
    email: support@example.com
  license:
    name: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
    identifier: CC-BY-NC-SA-4.0
```

Only the following fields are **required**:

- `title` - Your API probably has a name, and if not perhaps now is a good time to think of one thats useful for public consumption.
- `version` - The version of your OpenAPI document, which does not have to related to the API version, or the OpenAPI Specification version. 

Updating the version number when you make changes is pretty common, and keeping it separate from the API version at first feels a little bit odd, but soon makes sense. After all, you can fix issues with the OpenAPI document that produce no change whatsoever in the API, and vice-versa. 

These other fields are **optional**: 

- `description` - A handy place to put general information, especially introductory topics like where to find access tokens or links to various Postman/Insomnia Collections, or SDKs. This can be done using CommonMark (Markdown) to get as advanced as you want.
- `contact` - Help your APIs users find the help they need instead of wandering off to use another API.
- `license` - A chance to explain the license details of your API description. Note, that is very different from the license you use for your API source code, which would be licensed through source control with a `LICENSE.txt` or similar.

### 3. Servers Object

The `servers` object specifies one or more server URLs where the API is hosted. Each server can have a URL, a name, and an optional description.

```yaml
servers:
- name: Production
  url: https://api.example.com/v1
  description: The main production server for the API.

- name: Staging
  url: https://staging-api.example.com/v1
  description: A staging server for testing purposes.
```

It's fine to put any development and testing servers in here because you can always flag them as internal or [strip them out with overlays later](_guides/openapi/specification/v3.2/extending/overlays.md).

### 4. Paths Object

The `paths` object is probably the most important section for your API. It lists all the available API endpoints, with each path being a key in the object. Then the object is further broken down by the specific HTTP methods supported by each endpoint. The object in each of these HTTP methods is another object which describes the "operation", which is a term in OpenAPI to describe a specific combination of path and method.

```yaml
paths:
  /bookings:
    get:
      operationId: get-bookings
      summary: List existing bookings
      tags:
      - bookings
      responses:
        '200':
          description: A list of bookings                 
    post:
      operationId: create-booking
      summary: Create a booking
      tags:
      - bookings
      requestBody:
        required: true
      responses:
        '201':
          description: Booking successful
```

Here the `operationId` helps us spot the two different operations, and give them a unique name which can be useful for all sorts of tools. The `summary` gives a human readable title that will often be used in documentation tools.

Any HTTP request which has a body (e.g.: `POST`, `PUT`, `PATCH`, `QUERY`) can define a `requestBody`, and the responses are broken down by status code. This is a bit of a skeleton at the moment and ignores the media types and payloads. 

**Learn more about [paths & operations](_guides/openapi/specification/v3.2/understanding-structure/paths-operations.md).**

### 5. Components Object

The `components` object is where various types of reusable objects live. The main thing people use here is `schemas`, which some people call "data models" but that doesn't exist anywhere in the specification, thats just a nickname.you might hear. 

```yaml
components:
  schemas:
    Trip:
      type: object
      properties:
        id:
          type: string
          format: uuid
          description: Unique identifier for the trip
        origin:
          type: string
          description: The starting station of the trip
        destination:
          type: string
          description: The destination station of the trip
        departure_time:
          type: string
          format: date-time
          description: The date and time when the trip departs
        arrival_time:
          type: string
          format: date-time
          description: The date and time when the trip arrives
```

The schemas defined in `components.schemas` let you describe common data structures used throughout your API, allowing them to be referenced via `$ref` whenever a `schema` is required: whether that is a request body, response body, parameter, or header. 

```yaml
components:
  requestBodies:
    TripRequest:
      description: A request body for creating a new trip.
      required: true
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Trip'

  responses:
    TripResponse:
      description: A single Trip returned as a response.
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/Trip'
```

Components can also define parameters which can be used across multiple endpoints:

```yaml
components:
  parameters:
    pageParam:
      in: query
      name: page
      required: false
      schema:
        type: integer
        default: 1
        description: The page number for pagination.
```

Or common headers that can be returned across multiple endpoints:

```yaml
components:
  headers:
    RateLimit:
      description: |
        The RateLimit header communicates quota policies. It contains a `limit` to
        convey the expiring limit, `remaining` to convey the remaining quota units,
        and `reset` to convey the time window reset time.
      schema:
        type: string
        examples:
          - limit=10, remaining=0, reset=10

    Retry-After:
      description: | 
        The Retry-After header indicates how long the user agent should wait before making a follow-up request. 
        The value is in seconds and can be an integer or a date in the future. 
        If the value is an integer, it indicates the number of seconds to wait. 
        If the value is a date, it indicates the time at which the user agent should make a follow-up request. 
      schema:
        type: string
      examples:
        integer:
          value: '120'
          summary: Retry after 120 seconds
        date:
          value: 'Fri, 31 Dec 2021 23:59:59 GMT'
          summary: Retry after the specified date
```

Or examples, so multiple requests, responses, or parameters could share one or more examples.

```yaml
components:
  examples:
    Card:
      summary: Card Payment
      value:
        amount: 49.99
        currency: gbp
        source:
          object: card
          name: J. Doe
          number: '4242424242424242'
          cvc: 123
          exp_month: 12
          exp_year: 2025
          address_line1: 123 Fake Street
          address_line2: 4th Floor
          address_city: London
          address_country: gb
          address_post_code: N12 9XX
    Bank:
      summary: Bank Account Payment
      value:
        amount: 100.5
        currency: gbp
        source:
          object: bank_account
          name: J. Doe
          number: '00012345'
          sort_code: '000123'
          account_type: individual
          bank_name: Starling Bank
          country: gb
```

Or `securitySchemes` which will be called with the `security` keyword. OpenAPI supports several authentication types, but here are a few examples:

```yaml
components:
  securitySchemes:
    ApiKeyHeader:
      type: apiKey
      in: header
      name: X-API-Key

    BearerToken:
      type: http
      scheme: bearer

    JWT:
      type: http
      scheme: bearer
      bearerFormat: JWT

    OAuth2ReadWrite:
      type: oauth2
      flows:
        authorizationCode:
          scopes:
            read: Grants read access
            write: Grants write access
          authorizationUrl: https://example.com/oauth/authorize
          tokenUrl: https://example.com/oauth/token
          refreshUrl: https://example.com/oauth/refresh
```

This is just a few of the many types of security schemes that can be defined, but defining them alone doesn't do anything. They need to be referenced by the `security` object.

### 6. Security Object

The top-level `security` list specifies the security schemes that apply globally to the API, so if an entire API uses an API key or OAuth2 you might have:

```yaml
security:
  - apiKey: []
  - oauth2:
    - read
    - write
```

You can get into path specific overrides and various complex "and" situations with more [advanced security functionality](_guides/openapi/specification/v3.2/advanced/security.md).

### 7. Webhooks Object

```yaml
webhooks:
  newBooking:
    post:
      operationId: new-booking
      summary: New Booking
      description: |
        Subscribe to new bookings being created, to update integrations for your users.  Related data is available via the links provided in the request.
      tags:
        - bookings
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Booking'
      responses:
        '200':
          description: Return a 200 status to indicate that the data was received successfully.
```

### 8. Tags Object

You may have spotted the `tags` keyword in the paths and webhooks, and those are referencing tags defined in the top-level `tags` object. The tag name is used to group related operations together. Each tag needs a `name`, with optional `summary` and `description`.

```yaml
tags:
  - name: bookings
    summary: Bookings
    description: | 
      Create and manage bookings for train trips, including passenger details
      and optional extras.
  - name: payments
    summary: Payments
    description: |
      Pay for bookings using a card or bank account, and view payment
      status and history.

      > warn
      > Bookings usually expire within 1 hour so you'll need to make your payment
      > before the expiry date 
```

The `name` is more like a variable name so should be camelCase or similar. The `summary` is short and in human-readable for documentation so its best to make it "Title Case", and the `description` is Markdown (CommonMark) which can be quite long - think paragraphs not sentences, explaining what this concept is to the user as that will also show up in most documentation tools.

## Example OpenAPI Document

Putting it all together, here is a simple example of an OpenAPI document:

```yaml
openapi: 3.2.0
info:
  title: Sample API
  description: A sample API to illustrate OpenAPI concepts.
  version: 1.0.0
  contact:
    name: API Support
    url: http://www.example.com/support
    email: support@example.com
servers:
  - name: Production
    url: https://api.example.com/v1
    description: The main production server for the API.

paths:
  /users:
    get:
      summary: List all users
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
    post:
      summary: Create a new user
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/User'
      responses:
        '201':
          description: User created
components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: integer
          format: int64
        username:
          type: string
        email:
          type: string
          format: email
security:
  - api_key: []
tags:
  - name: users
    summary: Users
    description: Manage users in the system.
```

For a more advanced example, take a look at the [Train Travel API](https://bump.sh/blog/modern-openapi-petstore-replacement), the modern OpenAPI example from Bump.sh.
