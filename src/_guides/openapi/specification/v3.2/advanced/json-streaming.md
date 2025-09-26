---
title: JSON Streaming
authors: phil
excerpt: "Streaming data in OpenAPI v3.2.0 with itemSchema and itemEncoding"
date: 2025-07-23
---

- TOC
{:toc}

Streaming data allows API servers to send and receive data in real-time or in chunks, rather than waiting for the entire response to be ready. This is increasingly useful as expectations around big data, data science, and AI continue to grow, and various formats have emerged to expand JSON beyond. OpenAPI v3.2.0 introduces new keywords to help describe these streaming formats, making it easier to work with APIs that provide data in a continuous stream.

## JSON Streaming in OpenAPI

OpenAPI v3.x has been able to stream binary data for a while, but struggled to support JSON streaming formats as there was no standard way to define the **schema of individual events** in a stream, You could add media types like `text/event-stream` and `application/x-ndjson` which were line-delimited or multipart, but OpenAPI assumed they were single-message payloads.

As of OpenAPI v3.2.0, there are several new features related to JSON streaming, that allow requests and responses to be described in a way that reflects the nature of streaming data. The two main keywords introduced are `itemSchema` and `itemEncoding`.

These keywords allow you to define the structure of each item in a stream, and how those items are serialized, respectively.

## itemSchema

Specifies the **schema for individual items** in a streaming response body. Used **instead of `schema`** when the response body is a sequence of items (like in NDJSON, SSE, or multipart).

Supported Media Types**: `text/event-stream`, `application/x-ndjson`, `multipart/*`, and others.

<!-- TODO link to registry when online https://github.com/OAI/OpenAPI-Specification/pull/4808 -->

```
content:
  text/event-stream:
    itemSchema:
      type: object
      properties:
        event: { type: string }
        data: { type: string }
```

### itemEncoding

Specifies how each item in a stream is serialized, similar to how `encoding` works for multipart/form-data. Used with `itemSchema` to define how each property in the item should be encoded. Structure is very similar to the `encoding` keyword, it maps **property names** to serialization information.

```yaml
content:
  multipart/mixed:
    itemSchema:
      type: object
      properties:
        file: { type: string, format: binary }
        metadata: { type: object }
    itemEncoding:
      file:
        contentType: application/octet-stream
      metadata:
        contentType: application/json

```

This allows you to specify how each item in the stream should be serialized, including content type and other serialization options, supporting a wide range of streaming formats.

## Common Streaming Formats

- [JSON Lines](https://jsonlines.org/)
- [NDJSON](https://github.com/ndjson/ndjson-spec)
- [JSON Text Sequences](https://datatracker.ietf.org/doc/html/rfc7464)
- [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)

They all work a little different, but they share the common goal of allowing data to be sent in a continuous stream rather than as a single, complete response.

## Example: JSON Lines

Working with a data format like JSON Lines in OpenAPI is surprisingly similar to working with plain JSON. THe main differences being the `application/jsonl` content type and the `itemSchema` keyword usage.

```yaml
paths:
  /logs:
    get:
      summary: Stream of logs as JSON Lines
      responses:
        '200':
          description: |
            A stream of JSON-format log messages that can be read
            for as long as the application is running, and is available
            in any of the sequential JSON media types.
          content:
            application/jsonl:
              itemSchema:
                type: object
                properties:
                  timestamp:
                    type: string
                    format: date-time
                  level:
                    type: integer
                    minimum: 0
                  message:
                    type: string
              examples:
                JSONL:
                  summary: Log entries
                  description: JSONL examples are. just a string where each line is a valid JSON object.
                  value: |
                    {"timestamp": "1985-04-12T23:20:50.52Z", "level": 1, "message": "Hi!"}
                    {"timestamp": "1985-04-12T23:20:51.37Z", "level": 1, "message": "Bye!"}
```

Another difference is that example, which might help to illustrate how JSONL is subtly different from JSON. Instead of being a single JSON object and therefore being describable with YAML as usual, JSONL is actually a series of JSON objects with a newline between them. This can only be described as a YAML multi-line string, but it shows how that would be going over the wire.

## Sentinel Events

Some streaming systems do not always send all events the same way, they might be polymorphic objects, or there could be some special events that come through to say the stream is closed. Instead of trying to model all these edge cases, OpenAPI allows you to use the usual JSON Schema keywords to model these variations. 


```yaml
text/event-stream:
  itemSchema:
    oneOf:
    - {your normal event schema}
    - const: {data: "[DONE]"}
```

This allows you to define a schema that can handle different types of events in the stream, including special sentinel events that indicate the end of the stream or other significant states.

## Read the Specification

You can find details in the **OpenAPI Specification v3.2.0** under [Media Types Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.2.0.md#media-type-object). Look for `itemSchema` and `itemEncoding`.
