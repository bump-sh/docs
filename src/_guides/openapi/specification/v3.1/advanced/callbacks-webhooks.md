---
title: Callbacks and Webhooks
authors: phil
excerpt: Dive into the world of API file uploads in OpenAPI.
date: 2024-08-07
---

REST/HTTP APIs are often considered to be a simple request and response model, but they have always been a lot more asynchronous than that, and OpenAPI can capture two types of asynchronous HTTP event using `callbacks` and `webhooks`.

Both of these types of events are basically a HTTP request being made by _your_ API, which is the opposite of all the other requests and responses being defined, but it works in a fairly familiar way.

## Backstory

In traditional request/response API designs, the client makes a request and the server responds. This works well for many use cases, but sometimes you need the server to notify the client about certain events asynchronously. This is where `callbacks` and `webhooks` come into play:

- `callbacks` Callbacks allow an API to send real-time data back to the client as soon as the event has completed, and without the client having to check for progress. This is often used in tandem with `202 Accepted` responses which defer the actually processing to a queue, promising to let you know when the work is complete.
- `webhooks` Webhooks are similar to callbacks, but might not be happening in response to any one web request being made. It could be a generic "updates" integration point between multiple web services, with all sorts of events being transmitted as different happen throughout the system.

In OpenAPI v3.0 you only had callbacks, but OpenAPI v3.1 added support for webhooks too.

## Callbacks

Let's start by setting up a callback in OpenAPI. Suppose we have an API for creating orders, and we want to notify the client when the order status changes.

```yaml
paths:
  /orders:
    post:
      summary: Create a new order
      operationId: createOrder
      requestBody:
        description: Order object that needs to be added
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                id:
                  type: string
                item:
                  type: string
                quantity:
                  type: integer
                callbackUrl:
                  type: string
                  format: uri
      responses:
        '201':
          description: Order created
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                  status:
                    type: string
      callbacks:
        onOrderStatusChange:
          '{$request.body#/callbackUrl}':
            post:
              summary: Callback for order status change
              requestBody:
                description: Status update payload
                required: true
                content:
                  application/json:
                    schema:
                      type: object
                      properties:
                        orderId:
                          type: string
                        status:
                          type: string
              responses:
                '200':
                  description: Callback processed successfully
```

This could be broken into two parts: creating a path for registering for the callbacks, in this case creating an order, then the definition of that `callbacks` themselves. 

Callbacks need a name, which is mainly used within OpenAPI and any tools which choose to find a use for it. This one is called `onOrderStatusChange` but you can use any naming convention you like.

The next bit is `'{$request.body#/callbackUrl}'` which is a [runtime expression](https://spec.openapis.org/oas/v3.1.0#runtime-expressions), that looks for a `callbackUrl` property in the HTTP request body. 

When the client sends a request to the API they need to let the API know the URL to send the callback to.

```http
POST /orders HTTP/2
Host: api.example.com
Content-Type: application/json

{
  "id": "12345",
  "item": "Widget",
  "quantity": 1,
  "callbackUrl": "https://example.com/callbacks/order-status-updates"
}
```

The callbackURL could be in headers or could be composed of various other bits of data in the request, take a look at OpenAPI v3.1's [runtime expressions](https://spec.openapis.org/oas/v3.1.0#runtime-expressions) syntax to get more advanced.

Once you've got a callback named and figured out where the URL is going, the rest of the OpenAPI is going to feel very familiar, only it's backwards.

You describe the request that _your API is going to send_, which is letting the client know what the HTTP request you're sending will look like.

Then you describe a response that _your API is hoping to see their API return_. You can get really specific with this or just specify that a `200` or `2XX` is needed to let your API know the callback request is received properly. Most callback implementers will choose to retry these callbacks at a later date if the wrong status code appears, or if other success criteria fail errors can be sent to the authenticated users contact details.

## Webhooks

Technically callbacks are actually [HTTP Webhooks](https://www.redhat.com/en/topics/automation/what-is-a-webhook) in implementation, but in OpenAPI a "webhook" is specifically something named under the `webhooks` root of your OpenAPI document.

They are defined in a similar way to paths, but with a name instead of a URL. 

```yaml
openapi: 3.1.0
info:
  title: Train Travel API
  version: 1.0.0
webhooks:
  newBooking:
    post:
      summary: New Booking
      description: Subscribe to new bookings being created, to update integrations for your users.
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Booking'
      responses:
        '200':
          description: Return a 200 status to indicate that the data was received successfully.
```

> This example has trimmed the `components` section out for brevity, but you can imagine any `schema` you like going in there.

Both webhooks and paths are lists of Path Item Objects, similarly to callbacks, they are all just HTTP requests, some coming in (paths to be called), some going out (webhooks to be sent).

The key bits to notice here are: 

- `newBooking` is a unique nickname
- Summary is a short title
- Description is longer form documentation with Markdown covering context like "why" and edge cases to think of not covered elsewhere.
- The `requestBody` is the request you're going to send.
- The `responses` property is a map of responses you want the client to return.

These then don't need to be tied to paths. In fact, you can have an OpenAPI document which has no paths. This could be because you're splitting your documents up in interesting reusable ways with these webhooks being shared across multiple APIs, or because your API is entirely asynchronous. 

## Consider AsyncAPI 

If you are using a few webhooks in an API which is largely otherwise driven by request/response, OpenAPI will be just fine for you with callbacks and webhooks helping as needed. 

However if you are building an API that is entirely asynchronous, you are using technologies like WebSockets, or are working with any other event-driven API protocols, you should consider using [AsyncAPI](_guides/asyncapi/what-is-asyncapi.md) for describing those parts of the architecture.

## Examples

There's a full example in either [Bump.sh's Train Travel API](https://bump.sh/blog/modern-openapi-petstore-replacement), or OpenAPI v3.1 Specification has a [Petstore example](https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.1/webhook-example.yaml).
