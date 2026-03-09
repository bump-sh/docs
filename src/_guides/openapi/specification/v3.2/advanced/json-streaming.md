---
title: JSON Streaming
authors: phil
excerpt: "Streaming data in OpenAPI v3.2.0 with itemSchema."
date: 2025-07-23
---

- TOC
{:toc}

Streaming data allows API servers to send and receive data in real-time or in
chunks, rather than waiting for the entire response to be ready. This is already
how browsers handle HTML, images, and other media, and now it can be done for
APIs working with JSON.

This can improve responses with lots of data, or be used to send events from
server to client in realtime without polling or adding the complexity of
Webhooks or WebSockets. Streaming works by sending "chunks", which clients can
then work with individually instead of waiting for the entire response to be
ready.

Streaming JSON in particular is increasingly useful as expectations around big
data, data science, and AI continue to grow. JSON on its own does not stream
very well, but a few standards and conventions have popped up to expand JSON
into a streamable format, and OpenAPI v3.2 introduces keywords to describe data
in these stream formats.

## JSON Streaming

Streaming JSON is a bit tricky because JSON is not designed to be streamed. A
naive approach might look like this:

```json
{
  {"timestamp": "1985-04-12T23:20:50.52Z", "level": 1, "message": "Hi!"},
```

This would trip up most tooling, but we can use something like [JSON
Lines](https://jsonlines.org/) (a.k.a JSONL) to send one JSON instance per line.

```json
{"timestamp": "1985-04-12T23:20:50.52Z", "level": 1, "message": "Hi!"}
{"timestamp": "1985-04-12T23:20:51.37Z", "level": 1, "message": "Hows it hangin?"}
{"timestamp": "1985-04-12T23:20:53.29Z", "level": 1, "message": "Bye!"}
```

This format allows each line to be a valid JSON object, making it easy to parse
with standard native tooling and a `for` loop. There are a bunch of other
streaming formats you might want to work with in your API like [Newline
Delimited JSON](https://github.com/ndjson/ndjson-spec) (NDJSON), [JSON Text
Sequence](https://www.rfc-editor.org/rfc/rfc7464.html), [GeoJSON Text
Sequence](https://datatracker.ietf.org/doc/html/rfc8142). Thankfully they are
all quite similar and working with them in OpenAPI is almost identical.

## Streaming with OpenAPI

OpenAPI v3.0 & v3.1 were able to stream binary data, but struggled to support
JSON streaming formats as there was no standard way to define the **schema of
individual events** in a stream. People would try to describe things as an
array:

```yaml
content:
  application/jsonl:
    schema:
      type: array
      items: 
        type: object
        properties:
          timestamp:
            type: string
            format: date-time
          level: 
            type: integer
          message:
            type: string
```

You might see this sort of thing around, but it's not valid, and will confuse
tooling. A stream cannot be described as a single array, and it is a sequence of
multiple objects on new lines which is rather different. Some tools could spot
the `application/jsonl` content type and figure that out, but we don't need
awkward hacks anymore because the OpenAPI team have solved the problem. 

OpenAPI v3.2 introduces two new keywords to describe streamed data and events:

- `itemSchema` - define the structure of each item in a stream.
- `itemEncoding` - define how those items are encoded (or serialized), as text, JSON, binary, etc.


### itemSchema

Describing a stream with `itemSchema` works just like `schema` with one
difference: it will be applied to each item in the stream, instead of the entire
response. 

Consider an example like the train travel API running a stream of tickets: 


```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/jsonl; charset=utf-8
Transfer-Encoding: chunked
Date: Tue, 19 Aug 2025 18:36:10 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"train":"ICE 123","from":"Berlin","to":"Munich","price":79.9}
{"train":"TGV 456","from":"Paris","to":"Lyon","price":49.5}
{"train":"EC 789","from":"Zurich","to":"Milan","price":59}
```

To describe this stream of items, we can use the `itemSchema` keyword:

```yaml
content:
  application/jsonl:
    itemSchema:
      type: object
      properties:
        train:
          type: string
        from:
          type: string
        to:
          type: string
        price:
          type: number
          format: float
```

Tooling now has two important switches it can use to figure out how to handle
the response. The `itemSchema` makes it clear the response is a stream, and the
`application/jsonl` content type lets tooling decide how to present that.

For streaming formats that just handle streams of JSON, the `itemSchema` is
often sufficient to describe the structure of each item in the stream. For more
complicated formats, additional encoding information may be needed.

### itemEncoding

The `itemEncoding` keyword allows you to specify how each item in the stream
should be encoded, with the same encoding object as the `encoding` keyword.

Using `itemEncoding` is only possible for `multipart/*` responses, so it is not
very useful for an API that's streaming JSON, unless you were streaming a
mixture of JSON and assets/docs/images on a single response.

```yaml
content:
  multipart/mixed:
    itemSchema:
      $comment: A single data image from the device
    itemEncoding:
      contentType: image/jpg
```

Let's ignore itemEncoding for now and focus on the major use case of streams for
APIs: streaming data and events.

## Popular Streaming Formats

- [JSON Lines](https://jsonlines.org/)
- [NDJSON](https://github.com/ndjson/ndjson-spec)
- [JSON Text Sequences](https://datatracker.ietf.org/doc/html/rfc7464)
- [Server-Sent Events (SSE)](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)

They all work a little different, but they share the common goal of allowing
data to be sent in a continuous stream rather than as a single, complete
response.

### JSON Lines & NDJSON

Working with JSON Lines or NDJSON is basically identical in OpenAPI, and feels
very much like working with plain JSON responses just with a different header
and a bit of `itemSchema` usage.

If using JSONL use content type `application/jsonl`, and if using NDJSON use
content type `application/x-ndjson`. 

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
                    {"timestamp": "1985-04-12T23:20:51.37Z", "level": 1, "message": "Hows it hangin?"}
                    {"timestamp": "1985-04-12T23:20:53.29Z", "level": 1, "message": "Bye!"}
```

The example once again shows JSONL as a series of JSON objects with a newline character `\n` (0x0A) between them. This can only be described as a [YAML multiline string](https://yaml-multiline.info/), because JSONL/NDJSON cannot be described as plain JSON/YAML due to the newline characters.

> Remember to use `value: |`, because the pipe will allow newlines to be passed through. USing `value: >` would remove newlines and put each JSON instance onto the same line. 
{: .warning }

The sample code for either of these formats could look a bit like this:

```js
app.get("/tickets", async (_, res) => {
  res.setHeader("Content-Type", "application/jsonl; charset=utf-8");
  res.setHeader("Transfer-Encoding", "chunked");

  for (const ticket of tickets) {
    res.write(JSON.stringify(ticket) + "\n");
  }

  res.end();
});
```

### JSON Text Sequence 

A third JSON streaming format which would be identical other than a weird little complication. The other two formats are just a newline character `\n` (0x0A) at the end of the line, but [RFC 7464: JSON Text Sequence](https://www.rfc-editor.org/rfc/rfc7464.html) requires a control character at the start ASCII Record Separator (0x1E). This is not a visible character in most contexts, but it will be in there like this:

```
0x1E{"timestamp": "1985-04-12T23:20:50.52Z", "level": 1, "message": "Hi!"}
0x1E{"timestamp": "1985-04-12T23:20:51.37Z", "level": 1, "message": "Hows it hangin?"}
0x1E{"timestamp": "1985-04-12T23:20:53.29Z", "level": 1, "message": "Bye!"}
```

The `0x1E` (ASCII Record Separator) indicates the start of a new JSON object in the stream. Control characters are a bit magical and invisible to most text editors so it can be a little confusing. Working with JSON Text Sequence tooling for both producing the stream and reading the stream can solve this problem, letting the tooling insert and read out the control characters without you needing to worry.

```js
import { Generator } from "json-text-sequence";

// ... snip express setup ...

app.get("/tickets", async (_, res) => {
  res.setHeader("Content-Type", "application/json-seq");

  const g = new Generator();
  g.pipe(res);

  for (const ticket of tickets) {
    g.write(ticket);
  }

  res.end();
});
```

The [json-text-sequence](https://www.npmjs.com/package/json-text-sequence) package makes this easier and provides a simple method for generating and consuming JSON Text Sequences.

### Server-Sent Events (SSE)

Streaming JSON as chunks of data is only one way that JSON gets streamed. What about sending events, with some JSON being passed along as attributes?

[Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events) (SSE) can handle this, as a standard for sending real-time updates from a server to a client over HTTP. In OpenAPI, you can define SSE streams using the `text/event-stream` content type and the `itemSchema` keyword to describe the structure of the events being sent.

```yaml
content:
  description: A request body to add a stream of typed data.
  required: true
  content:
    text/event-stream:
      itemSchema:
        type: object
        properties:
          event:
            type: string
          data:
            type: string
          retry:
            type: integer
        required: [event]
        # Define event types and specific schemas for the corresponding data
        oneOf:
        - properties:
            event:
              const: addString
        - properties:
            event:
              const: addInt64
            data:
              format: int64
        - properties:
            event:
              const: addJson
            data:
              contentMediaType: application/json
              contentSchema:
                type: object
                required: [foo]
                properties:
                  foo:
                    type: integer
```

The `oneOf` is optional, but a handy use of [polymorphism](_guides/openapi/specification/v3.2/data-models/schema-composition.md) to describe different schemas for each event - which can really help with documentation and validation.

Valid events to come through this stream might look like:

```
event: addString
data: This data is formatted
data: across two lines
retry: 5

event: addInt64
data: 1234.5678
unknownField: this is ignored

event: addJSON
data: {"foo": 42}
```


## Sentinel Events

Some streaming systems do not always send all data or events in the exact same way. The items in a stream could be polymorphic objects, or there could be some special events that come through to say the stream is closed (also known as sentinel events).

Instead of trying handle all of these edge cases with special new keywords, OpenAPI allows you to use the standard JSON Schema keywords to model these variations.

```yaml
text/event-stream:
  itemSchema:
    oneOf:
    - <your normal data/event schema>
    - const: { data: "[DONE]" }
```

Whatever the schema is, it can be defined using the standard JSON Schema keywords like `oneOf`, `anyOf`, or `allOf` to handle variations in the event structure. This allows you to define a flexible schema that can accommodate different types of events in the stream.

## Further Reading

- [Learn OpenAPI: Sequential Media Types](https://learn.openapis.org/specification/media-types.html)
- [OpenAPI Specification v3.2.0: Media Types Object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.2.0.md#media-type-object)
