---
title: Multiple Content Types with OpenAPI
authors: phil
excerpt: 
date: 2024-08-07
---

- TOC
{:toc}

Let's dive into the nitty-gritty of describing multiple content types in OpenAPI. If you’ve ever needed to handle JSON, XML, CSV, and maybe even images in your API, you’re in the right place. This tutorial will guide you through setting up your OpenAPI document to gracefully handle multiple different formats.

### Why Support Multiple Content Types?

Supporting multiple content types in your API enhances client flexibility, interoperability, and user convenience. Different clients may prefer different data formats: JSON is great for web apps, XML might be preferred by legacy systems, and CSV is handy for data import/export tasks. By offering multiple formats, your API can interact with a broader range of systems and tools, making it more user-friendly and accessible.

## Setting Up OpenAPI for Multiple Content Types

We’ll start with a simple OpenAPI document for an endpoint that supports JSON, XML, and CSV.

### Operation Definition

In [Understanding Structure > Paths & Operations](_guides/openapi/specification/v3.1/understanding-structure/paths-operations.md) we learned how to create a simple API with both `application/json` and `text/csv`, so lets take that example and expand it a little.


```yaml
    get:
      summary: Get a list of bookings
      responses:
        '200':
          description: A list of bookings
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Bookings'
            application/xml:
              schema:
                $ref: '#/components/schemas/Bookings'
            text/csv:
              schema:
                type: string
              examples:
                bookingsCsv:
                  $ref: '#/components/examples/BookingsCSV'
```

For JSON and XML we can `$ref` to a schema, which could look a bit like this:

```yaml
components:
  schemas:
    Bookings:
      type: array
      items:
        type: object
        properties:
          id:
            type: integer
            format: int64
          name:
            type: string
          price:
            type: number
            format: float
```

This is a generic enough data object that it would be fine to use for JSON and XML without any modifications. Here's the output:

```json
[
  {
    "id": 0,
    "name": "string",
    "price": 0
  }
]
```

The XML it would look like this: 

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Bookings>
	<id>0</id>
	<name>string</name>
	<price>0</price>
</Bookings>
```

The API documentation tool has named the XML tag `<Bookings>` from the component name, but you can change that if [learn about the `xml` keyword](_guides/openapi/specification/v3.1/data-models/representing-xml.md), which can also handle more advanced XML syntax.

### Schemas & Examples

OpenAPI doesn’t have native support for CSV schemas like it does for JSON and XML, but you can provide examples to illustrate the format.

```yaml
components:
  examples:
    BookingsCSV:
      summary: Example CSV output
      value: |
        id,name,price
        1,Item 1,10.00
        2,Item 2,15.00
        3,Item 3,20.00
```

Here’s the complete OpenAPI document:

```yaml
openapi: 3.1.0
info:
  title: Multi-Content API
  description: An API that supports JSON, XML, and CSV
  version: 1.0.0
paths:
  /bookings:
    get:
      summary: Get a list of bookings
      responses:
        '200':
          description: A list of bookings
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Bookings'
            application/xml:
              schema:
                $ref: '#/components/schemas/Bookings'
            text/csv:
              schema:
                type: string
              examples:
                bookingsCsv:
                  $ref: '#/components/examples/BookingsCSV'

components:
  schemas:
    Bookings:
      type: array
      items:
        type: object
        properties:
          id:
            type: integer
            format: int64
          name:
            type: string
          price:
            type: number
            format: float
  examples:
    BookingsCSV:
      summary: Example CSV output
      value: |
        id,name,price
        1,Item 1,10.00
        2,Item 2,15.00
        3,Item 3,20.00
```

You now have an OpenAPI document that supports multiple content types, including JSON, XML, and CSV. By setting up your API this way, you can cater to a wider range of API clients and use cases, making your API more useful and user-friendly.
