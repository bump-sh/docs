---
title: Pagination
authors: phil
excerpt: Learn how to implement pagination in OpenAPI.
date: 2024-08-07
---

Pagination is a common requirement in APIs that return large sets of data. It allows clients to retrieve a subset of a collection, which helps manage the load on servers and improves the user experience by not overwhelming clients with too much data at once.

Returning a subsection of a collection means returning maybe 10, 100, or 1,000 resources, which can be helpful for clients in various circumstances, such as when displaying a list of items in a user interface, or when processing large datasets in smaller chunks.

This is usually implemented as a query parameter, such as `?page=1` or `?cursor=abc123`, but can also be done with HTTP headers or links in the response body. The choice of method depends on the API design and the preferences of the API consumers, so we'll cover the most common approaches to pagination in OpenAPI.

- TOC
{:toc}

## Query Parameter Pagination

Clients specify which "page" of results they want using a `page` parameter and how many results per page with a limit (or per_page). For example, `?page=2&limit=10` would return the second set of 10 items. The server calculates which items to return based on these values, usually by using `offset = (page - 1) * limit`.

This approach is easy to use and works well for stable datasets where items don’t shift around frequently. It’s ideal for user-facing interfaces like tables or product lists. However, because it relies on counting and offsets, it may become inefficient or inaccurate on datasets that change rapidly.

### HTTP Example

**Request:**

```
GET /stations?page=2&limit=5 HTTP/1.1
Host: api.example.com
```

**Response:**

```json
{
  "data": [
    { "id": "6", "name": "Station 6" },
    { "id": "7", "name": "Station 7" },
    { "id": "8", "name": "Station 8" },
    { "id": "9", "name": "Station 9" },
    { "id": "10", "name": "Station 10" }
  ]
}
```

### OpenAPI

```yaml
components:
  parameters:
    Page:
      name: page
      in: query
      description: Page number to retrieve
      required: false
      schema:
        type: integer
        default: 1
        minimum: 1
    Limit:
      name: limit
      in: query
      description: Number of results per page
      required: false
      schema:
        type: integer
        default: 10
        minimum: 1
        maximum: 100

paths:
  /stations:
    get:
      summary: List train stations
      parameters:
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/Limit'
      responses:
        '200':
          description: OK
```

## Pagination with Metadata in Response Body

In addition to the data, the response includes a meta object that provides information such as the current page, total pages, page size, and total number of results. This gives clients context about the dataset, allowing them to build pagination UIs or navigate intelligently.

This is often used with query parameter pagination (page and limit) and works especially well when clients need to know how many pages exist or where they are in the dataset. The metadata is part of the JSON response, which makes it self-contained and easy to parse.

### HTTP Example

**Request:**

```
GET /stations?page=2&limit=5 HTTP/1.1
Host: api.example.com
```

**Response:**

```json
{
  "data": [
    { "id": "6", "name": "Station 6" },
    { "id": "7", "name": "Station 7" },
    { "id": "8", "name": "Station 8" },
    { "id": "9", "name": "Station 9" },
    { "id": "10", "name": "Station 10" }
  ],
  "meta": {
    "page": 2,
    "size": 5,
    "total_pages": 10,
    "total_items": 50
  }
}
```

### OpenAPI

```yaml
components:
  schemas:
    Station:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
    PaginationMeta:
      type: object
      properties:
        page:
          type: integer
        size:
          type: integer
        total_pages:
          type: integer
        total_items:
          type: integer
    PaginatedStationsResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Station'
        meta:
          $ref: '#/components/schemas/PaginationMeta'

paths:
  /stations:
    get:
      responses:
        '200':
          description: Paginated stations with metadata
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedStationsResponse'
```

## Pagination Using Links

Instead of asking clients to build pagination URLs, the server includes fully-formed navigation links in the response—typically self, next, and prev. These are provided in a links object and point to the exact URLs clients can follow to navigate pages.

This approach follows RESTful design principles and is especially useful when the underlying query structure is complex (e.g., filters, sorts, or cursors). Clients don’t need to understand how to build the next URL—they just follow the link provided.

### HTTP Example

**Request:**

```
GET /stations?page=2&limit=3 HTTP/1.1
Host: api.example.com
```

**Response:**

```json
{
  "data": [
    { "id": "4", "name": "Station 4" },
    { "id": "5", "name": "Station 5" },
    { "id": "6", "name": "Station 6" }
  ],
  "links": {
    "self": "https://api.example.com/stations?page=2&limit=3",
    "next": "https://api.example.com/stations?page=3&limit=3",
    "prev": "https://api.example.com/stations?page=1&limit=3"
  }
}
```

### OpenAPI

```yaml
components:
  schemas:
    PaginationLinks:
      type: object
      properties:
        self:
          type: string
          format: uri
        next:
          type: string
          format: uri
        prev:
          type: string
          format: uri
    PaginatedStationsWithLinks:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Station'
        links:
          $ref: '#/components/schemas/PaginationLinks'

paths:
  /stations:
    get:
      responses:
        '200':
          description: Paginated response with links
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedStationsWithLinks'
```

## Pagination with HTTP Headers

In this method, pagination metadata is moved out of the response body and into custom or standard HTTP headers. Common headers include X-Total-Count, X-Page, X-Per-Page, and the Link header for navigation URLs. The body contains only the raw data, which keeps it clean and minimal.

This style is common in APIs where response format must be lightweight or consistent across endpoints. It’s also helpful when clients want to inspect pagination information without parsing the body, though it does require clients to handle HTTP headers more deliberately.

### HTTP Example

**Request:**

```
GET /stations?page=3&limit=10 HTTP/1.1
Host: api.example.com
```

**Response Headers:**

```
X-Total-Count: 100
X-Page: 3
X-Per-Page: 10
Link: <https://api.example.com/stations?page=2>; rel="prev",
      <https://api.example.com/stations?page=4>; rel="next"
```

**Response Body:**

```json
[
  { "id": "21", "name": "Station 21" },
  { "id": "22", "name": "Station 22" },
  { "id": "23", "name": "Station 23" }
]
```

### OpenAPI

```yaml
paths:
  /stations:
    get:
      summary: Get paginated stations with headers
      responses:
        '200':
          description: Paginated results with header metadata
          headers:
            X-Total-Count:
              description: Total number of available items
              schema:
                type: integer
            X-Page:
              description: Current page number
              schema:
                type: integer
            X-Per-Page:
              description: Number of items per page
              schema:
                type: integer
            Link:
              description: Pagination navigation links
              schema:
                type: string
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Station'
```

## Cursor-Based Pagination

Cursor pagination uses a token (called a “cursor”) to mark the position in a dataset. Instead of using page numbers, the client requests the next chunk of results by passing a cursor from the previous response. For example: GET /items?cursor=abc123. The response includes a next_cursor value to be used in the following request.

This method is highly efficient and resilient in large or rapidly-changing datasets, especially when items are inserted or deleted often. It avoids issues with data shifting between pages, but it requires the server to maintain and interpret cursors accurately—often based on unique IDs or timestamps.

### HTTP Example

**Request:**

```
GET /stations?cursor=c3RhdGlvbjEyMw== HTTP/1.1
Host: api.example.com
```

**Response:**

```json
{
  "data": [
    { "id": "124", "name": "Station 124" },
    { "id": "125", "name": "Station 125" },
    { "id": "126", "name": "Station 126" }
  ],
  "meta": {
    "next_cursor": "c3RhdGlvbjEyNg==",
    "has_more": true
  }
}
```

### OpenAPI

```yaml
parameters:
  - name: cursor
    in: query
    required: false
    description: Cursor for the next set of results
    schema:
      type: string

components:
  schemas:
    CursorMeta:
      type: object
      properties:
        next_cursor:
          type: string
        has_more:
          type: boolean
    CursorPaginatedStations:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/Station'
        meta:
          $ref: '#/components/schemas/CursorMeta'

paths:
  /stations:
    get:
      parameters:
        - name: cursor
          in: query
          schema:
            type: string
      responses:
        '200':
          description: Cursor-paginated response
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CursorPaginatedStations'
```

## Best Practices for Pagination in OpenAPI

When implementing pagination in your OpenAPI specification, consider the following best practices:

* Use `$ref` for shared pagination metadata and parameters.
* Be consistent with naming (`meta`, `links`, `cursor`, etc.)
* Document the pagination method clearly in your API documentation, using operation descriptions and/or [topics](src/_help/documentation-experience/topics.md).
