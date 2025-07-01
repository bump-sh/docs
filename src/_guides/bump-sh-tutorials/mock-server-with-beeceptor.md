---
title: Mocking APIs with Beeceptor - Fast, Context-Aware
authors: ankit
excerpt: Create dynamic, stateful API mocks using Beeceptor. Import OpenAPI specs, simulate real-world workflows, test with context-aware responses. No-code, test data, service virtualization, mock server.
date: 2024-08-24
---

Today everyone builds distributed software systems. Whether you're building an e-commerce storefront, integrating a payment gateway, or testing a logistics API — every component is deeply tied to another. In this setup, waiting is the enemy of progress and engineering productivity. If the backend isn’t ready, the frontend team stalls. If partner APIs are flaky or missing sandboxes, QA engineers can't write tests. 

Mocking APIs isn't a "nice to have" anymore - it’s an essential foundation of modern developer workflows. Besides, if you've been following the [API design-first workflow](_guides/api-basics/dev-guide-api-design-first.md) the next phase to this is how do you enable all stakeholders to start early?

That’s where [Beeceptor](https://beeceptor.com/openapi-mock-server/) fits in. It's a no-code, intelligent mock server that transforms your OpenAPI spec into a live, interactive API — one that doesn't just echo static data, but responds with realistic, context-aware payloads. Let’s walk through the process and features that make Beeceptor stand out as API publisher.

## What is Beeceptor?

Beeceptor is a no-code, easy-to-use API design and mock server tool that enables teams to build, test, and integrate APIs faster. It provides a practical, lightweight approach to service virtualization, ideal for modern, iterative development cycles. With Beeceptor:

- Teams can simulate downstream or upstream services without writing any backend code.
- Frontend, QA, and partner integrations can begin early using realistic mock APIs.
- You don’t need to manage infrastructure, container platforms, or setup CI/CD pipelines just to prototype an API.

Beeceptor is optimized for quick adoption for developers, testers, and solution engineers alike.

## From OpenAPI to Life-Like Responses

[Beeceptor](https://beeceptor.com/openapi-mock-server/) can take either a `YAML` or `JSON` OpenAPI file. If your spec is hosted publicly (e.g., on [Bump.sh](https://bump.sh/), Github, or internal HTTP server), you can provide a public URL directly, and Beeceptor will fetch and parse it.

Once imported, Beeceptor expands the following on a dedicated mock server page:
- All the defined paths, methods, and operationIds
- Request and response payload schemas
- Parameters, headers, and query definitions

It then uses an AI-assisted test data generator to create dynamic, contextual responses. Field names, descriptions, [JSON-Schema](_guides/openapi/specification/v3.1/data-models/json-schema/), and formats (e.g. enums, date-time, emails, prices) are all considered to produce realistic payloads.

> Have your OpenAPI spec published via Bump.sh? You can import it into Beeceptor and use the generated mock server URLs directly inside your spec's servers block for interactive try-outs.

Creating the mock server takes around a minute. 

![Beeceptor - accepts OpenAPI URL to start building mock](/images/guides/mock-with-beeceptor/beeceptor-openapi-url.png)

![Beeceptor - takes a minute to get mock server ready](/images/guides/mock-with-beeceptor/beeceptor-mock-server-created.png)

You can open the mock server's dashboard to review specification's path, request and response payload.

![Expanding API paths and payload in Beeceptor](/images/guides/mock-with-beeceptor/beeceptor-openapi-paths-expanded.gif)

Here is a sample API response when invoking the Get All Products API. Instead of `foo`, `bar`, `lorem` and `{id}`, you get domain-specific values immediately, without configuring or changing anything.

```json
GET /products

HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": "052c50e6-0b41-47e0-8376-314845db5b43",
    "name": "Refined Aluminum Chair",
    "price": 68.83,
    "stock": 37,
    "category": "Electronics",
    "image_url": "https://picsum.photos/seed/bEc1um1r/766/809?blur=8",
    "created_at": "2023-12-18T00:00:00.0Z",
    "description": "Discover the elephant-like agility of our Bacon, perfect for rich users",
    "updated_at": "2025-06-05T00:00:00.0Z"
  },
  {
    "id": "bb637eb4-76e2-4d83-be33-442b8ff4bc2e",
    "name": "Tasty Bamboo Pants",
    "price": 224.73,
    "stock": 67,
    "category": "Outdoors",
    "created_at": "2024-02-27T00:00:00.0Z",
    "image_url": "https://picsum.photos/seed/b0PetW5/766/809?grayscale&blur=7",
    "description": "Fantastic Keyboard designed with Rubber for quarterly performance",
    "updated_at": "2025-06-17T00:00:00.0Z"
  }
]
```

## Customizing Mocks with Rules

While Beeceptor generates life-like mock responses from your OpenAPI spec by default, real-world testing often demands finer control — responses that change based on headers, query parameters, request bodies, or even session context.

This is where Mock Rules come in.

Mock rules are evaluated top-down, and the first matching rule wins. Once matched, Beeceptor sends the defined response and bypasses the default OpenAPI mock logic. This gives you complete control over mocking behavior.

### Key Capabilities

- Priority Handling: Rules always take precedence over the auto-generated OpenAPI responses.
- Flexible Matching: Match on HTTP method, path, query params, headers, and body content (exact or regex).
- Network Behavior Simulation: Add artificial delays (e.g., delay: 2000ms) or drop connections to test edge cases.
- Error Simulation: Easily return `500`/`401`/4`29 responses under specific test conditions.
- Dynamic Personalization: Define responses per user or role, e.g.:

```text
GET /products

Header: X-User-ID: userA → returns products [A,B]
Header: X-User-ID: userB → returns products [B,C]
```

## Build Stateful Mocks

Mocking in 2025 isn’t just about static JSON anymore — it’s about behavior. Today's applications are dynamic, multi-step, and interactive. To simulate such behavior, stateful mocking becomes essential. Beeceptor does this by offering state-aware constructs, powered by an internal, persistent state engine.

With Beeceptor, your mock endpoints can:

- Remember data across requests
- Simulate object creation and retrieval
- Track counters (e.g., order IDs, session steps)
- Emulate queue-like flows (e.g., shopping cart, job queues)

Beeceptor achieves this through:

- Step Counters – for sequential values or stage tracking
- Data Stores – for key-value persistence
- Lists – for collections like carts, to-do lists, message queues

All of this is declared inside your response templates, using simple, expressive syntax and doesn't require any backend or scripting.


### Example: Add to Cart and View Cart

Let’s say you want to simulate a shopping cart workflow using two endpoints:

```js
POST /cart/items → Add item to the cart
```

```
GET /cart → List current cart contents
```

#### Add Item to Cart (POST /cart/items)

Here’s a response template that adds the incoming item to a persistent list named shoppingCart:

```json
{{ list 'push' 'shoppingCart' (body) }}
{
  "message": "Item added to cart",
  "item": {{ body }}
}
```

Here, 
- `(body)` captures the full incoming JSON payload
- list 'push' appends it to the mock-side list

This list persists across calls (per endpoint)

#### View Cart (GET /cart)

Now, when you query the cart, retrieve the entire list:

```json
{
  "cartItems": {{ list 'get' 'shoppingCart' }},
  "totalItems": {{ len (list 'get' 'shoppingCart') }}
}
```

The cart is simulated entirely in-memory. Each `POST` adds to the cart; each `GET` returns the full list.

Stateful mocks turn the mock server from a “static response generator” into a "simulation platform"! The API stakeholders have life like server. You can build full test workflows, mimic backend services, and let teams explore real behavior — before writing a single backend line.

---

Mocking today is about realism and developer speed, not just about sending 200 OKs with dummy JSON. How fast all the stakeholders are enabled is a key success metric for Developer Experience (DX). If you're looking to improve developer onboarding, shift QA left, or remove test dependency bottlenecks, adding a mock server from OpenAPI spec. This is radically simple yet powerful solution, without managing infra, writing scripts, or defining examples by hand.