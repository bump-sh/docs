---
title: Basic Structure
authors: phil
excerpt: Learn your way around the OpenAPI description format for HTTP APIs by learning the basic structure.
date: 2024-07-02
---

The OpenAPI Specification (OAS) is an "API Description Format", providing a standard format for describing REST APIs, making it easier to design, document, and consume them.

In this tutorial we'll explore the structure of an OpenAPI document, focusing on the main sections and important elements, so that you can get a feel for where everything is, without having to go through the whole OpenAPI Specification yourself, as that's meant more for tooling developers than users like yourself.

## The OpenAPI Document

An OpenAPI document is typically written in either YAML or JSON format, usually called `openapi.yaml` or `openapi.json`, but it could have any name.

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
openapi: 3.1.1
```

This is required, so that tooling knows which version you are working with. The `3.1` part is the important bit, and the patch number doesn't really matter as those "patch" versions only add clarifications to the specification and never change meaning, but it's helpful to know what version somebody was reading when they wrote the OpenAPI.

### 2. Info Object

The `info` object provides general metadata about the API, such as the title, version, description, and contact information.

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

It can also contain the license details of your OpenAPI (note, that's different to the license details of your API which would be licensed through source control with a `LICENSE.txt`.)

### 3. Servers Object

The `servers` object specifies one or more server URLs where the API is hosted. Each server can have a URL and optional description.

```yaml
servers:
  - url: https://api.example.com/v1
    description: Production server
  - url: https://staging-api.example.com/v1
    description: Staging server
```

It's fine to put any development and testing servers in here because you can always flag them as internal or [strip them out with overlays later](https://docs.bump.sh/guides/openapi/augmenting-generated-openapi/).

### 4. Paths Object

The `paths` object is probably the most important section for your API. It lists all the available API endpoints, with each path being a key in the object. Then the object is further broken down by the specific HTTP methods supported by each endpoint. The object in each of these HTTP methods is another object which describes the "operation", which is a term in OpenAPI to describe a specific combination of path and method.

```yaml
  paths:
    /bookings:
      get:
        operationId: get-bookings
        summary: List existing bookings
        responses:
          '200':
            description: A list of bookings                 
      post:
        operationId: create-booking
        summary: Create a booking
        requestBody:
          required: true
        responses:
          '201':
            description: Booking successful
```

Here the `operationId` helps us spot the two different operations, and give them a unique name which can be useful for all sorts of tools. The summary then gives a human readable title that will often be used in documentation tools.

Any HTTP request which has a body (e.g.: `POST`, `PUT`, `PATCH`) can define a `requestBody`, and the responses are broken down by status code. This is a bit of a skeleton at the moment and ignores the media types and payloads, but we'll get to that.

### 5. Components Object

The `components` object is where various types of reusable objects live. The main thing people use here is `schemas`, which some people call "data models" but that doesn't exist anywhere in the specification, thats just a nickname.you might hear. 

These components can be referenced throughout the API specification to avoid duplication.

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

Components can also contain reusable parameters, request bodies, responses, and security schemes. 

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

  securitySchemes:
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-KEY

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

Understanding `$ref` is a large topic, and we'll get into it later, but just understand for now that this is where reusable components of all sorts are stored.

<!-- TODO Link advanced / splitting documents into multiple parts -->

Another important type of component is the `securitySchemes` section. OpenAPI supports several authentication types, but here are a few examples:

```yaml
components:
  securitySchemes:
    ApiKeyHeader:
      type: apiKey
      in: header
      name: X-API-Key
    
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

This is just a few examples of various types of security schemes that can be defined, but defining them alone doesn't do anything. They need to be referenced by the `security` object.

### 6. Security Object

The top-level `security` object specifies the security schemes that apply globally to the API, so if an entire API uses an API key or OAuth2 you might have:

```yaml
security:
  - apiKey: []
  - oauth2:
    - read
    - write
```

You can get into path specific overrides and various complex "and" situations with more [advanced security functionality](/guides/openapi/specification/v3.1/advanced/security).

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
        - Bookings
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

You may have spotted the `tags` keyword in the paths and webhooks, and those are referencing tags defined in the top-level `tags` object. The tag name is used to group related operations together. Each tag has a name and an optional description.

```yaml
tags:
  - name: Bookings
    description: | 
      Create and manage bookings for train trips, including passenger details
      and optional extras.
  - name: Payments
    description: |
      Pay for bookings using a card or bank account, and view payment
      status and history.

      > warn
      > Bookings usually expire within 1 hour so you'll need to make your payment
      > before the expiry date 
```

The name is often displayed to users in human-readable documentation so its best to make it "Title Case", and the description can be quite long, think paragraphs not sentences, explaining what this concept is to the user as that will also show up in most documentation tools.

## Example OpenAPI Document

Putting it all together, here is a simple example of an OpenAPI document:

```yaml
openapi: 3.0.3
info:
  title: Sample API
  description: A sample API to illustrate OpenAPI concepts.
  version: 1.0.0
  contact:
    name: API Support
    url: http://www.example.com/support
    email: support@example.com
servers:
  - url: https://api.example.com/v1
    description: Production
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
    description: Operations related to users
```

For a more advanced example, take a look at the [Train Travel API](https://bump.sh/blog/modern-openapi-petstore-replacement), the modern OpenAPI example from Bump.sh.
