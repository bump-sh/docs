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

JSON streaming is a way to send and receive JSON data in a continuous flow, rather than as a single, complete response. This is particularly useful for APIs that need to deliver large amounts of data or real-time updates, such as logs, events, or notifications.

This is an example of JSONL, one of several streaming formats:

```json
{"timestamp": "1985-04-12T23:20:50.52Z", "level": 1, "message": "Hi!"}
{"timestamp": "1985-04-12T23:20:51.37Z", "level": 1, "message": "Bye!"}
```

This format allows each line to be a valid JSON object, making it easy to parse and process in a streaming manner. Other formats like Server-Sent Events (SSE) or NDJSON (Newline Delimited JSON) follow similar principles, allowing for continuous data flow.

OpenAPI v3.x has been able to stream binary data for a while, but struggled to support JSON streaming formats as there was no standard way to define the **schema of individual events** in a stream. People were trying, and a common approach was to add media types like `text/event-stream` and `application/x-ndjson`. This was a helpful hint, but not enough, because any OpenAPI based tooling that wanted to work with streams would have to build in some conventions of their own, and tooling like documentation which would generate response examples of a JSON instance instead of a stream of JSON objects. The above example would trick a validator as it's not valid JSON. 

All these problems and more motivated the OpenAPI team to get proper JSON Streaming support into OpenAPI v3.2.0, which introduces new keywords to describe the structure of streaming data in a more standardized way. The two main keywords introduced are `itemSchema` and `itemEncoding`, allowing you to define the structure of each item in a stream, and how those items are serialized, respectively.

### itemSchema

Specifies the **schema for individual items** in a streaming response body. Used **instead of `schema`** when the response body is a sequence of items (like in NDJSON, SSE, or multipart).

Supported Media Types**: `text/event-stream`, `application/x-ndjson`, `multipart/*`, and others.

<!-- TODO link to registry when online https://github.com/OAI/OpenAPI-Specification/pull/4808 -->

```yaml
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

### Example: JSON Lines

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

The example once again shows JSONL as a series of JSON objects with a newline between them. This can only be described as a string, in this case a YAML multi-line string, because JSONL cannot be described with JSON or YAML due to the newline characters.

### Example: Server-Sent Events (SSE)

Server-Sent Events (SSE) is a standard for sending real-time updates from a server to a client over HTTP. In OpenAPI, you can define SSE streams using the `text/event-stream` media type and the `itemSchema` and `itemEncoding` keywords to describe the structure of the events being sent.

```yaml
paths:
  /events:
    get:
      summary: Stream of server-sent events
      responses:
        '200':
          description: |
            A stream of server-sent events that can be read
            for as long as the application is running, and is available
            in the `text/event-stream` media type.
          content:
            text/event-stream:
              itemSchema:
                type: object
                properties:
                  event:
                    type: string
                    description: The type of event being sent.
                  data:
                    type: string
                    description: The data associated with the event, typically a JSON string.
              itemEncoding:
                event:
                  contentType: text/plain
                data:
                  contentType: application/json
              examples:
                SSE:
                  summary: Server-sent events
                  description: |
                    Server-sent events are sent as a stream of text/event-stream.
                    Each event is a JSON object with an `event` and `data` field.
                  value: |
                    event: message
                    data: {"timestamp": "1985-04-12T23:20:50.52Z", "level": 1, "message": "Hi!"}

                    event: message
                    data: {"timestamp": "1985-04-12T23:20:51.37Z", "level": 1, "message": "Bye!"}
```

## Sentinel Events

Some streaming systems do not always send all events the same way, they might be polymorphic objects, or there could be some special events that come through to say the stream is closed. Instead of trying handle all of these edge cases with special new keywords, OpenAPI allows you to use the standard JSON Schema keywords to model these variations.

```yaml
text/event-stream:
  itemSchema:
    oneOf:
    - {your normal event schema}
    - const: { data: "[DONE]" }
```

Whatever the schema is, it can be defined using the standard JSON Schema keywords like `oneOf`, `anyOf`, or `allOf` to handle variations in the event structure. This allows you to define a flexible schema that can accommodate different types of events in the stream.

## Read the Specification

You can find details in the **OpenAPI Specification v3.2.0** under [Media Types Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.2.0.md#media-type-object). Look for `itemSchema` and `itemEncoding`.
