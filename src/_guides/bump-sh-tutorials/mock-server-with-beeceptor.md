---
title: Mocking APIs with Beeceptor
authors: ankit
excerpt: Create dynamic, stateful API mocks using Beeceptor. Import OpenAPI specs, simulate real-world workflows, and test with context-aware responses.
date: 2025-07-02
---

When building distributed software systems, from an e-commerce storefront to a logistics API, each component is deeply tied to others. In this setup, waiting for dependencies can slow down engineering productivity. If the backend isn’t ready, the frontend team stalls. If partner APIs are flaky or have no sandbox, QA engineers can't write tests.

Mocking APIs is an essential part of modern developer development. For those following an [API design-first workflow](_guides/api-basics/dev-guide-api-design-first.md), the next step is to enable all stakeholders to start working with the API early.

[Beeceptor](https://beeceptor.com/openapi-mock-server/) is a tool that can help. It's a no-code mock server that transforms your OpenAPI spec into a live API that responds with realistic payloads. Let’s walk through the process of using Beeceptor for this purpose.

## What is Beeceptor?

Beeceptor is a no-code tool for mocking APIs. It provides a lightweight approach to service virtualization. With Beeceptor:

- Teams can simulate downstream or upstream services without writing any backend code.
- Frontend, QA, and partner integrations can begin early using realistic mock APIs.
- You don’t need to manage infrastructure, container platforms, or CI/CD pipelines to prototype an API.

## From OpenAPI to Realistic Responses

 You can take either a `YAML` or `JSON` OpenAPI file and start a mock server. If your spec is hosted publicly (on [Bump.sh](https://bump.sh/) or Github), you can provide a public URL directly, and [Beeceptor](https://beeceptor.com/openapi-mock-server/) will fetch and parse it. Once imported, Beeceptor intercepts the following to build a dedicated mock server page:
- All the defined paths, methods, and operationIds
- Request and response payload schemas
- Parameters, headers, and query definitions

It then plugs a test data generator to create dynamic responses. Field names, descriptions, [JSON-Schema](_guides/openapi/specification/v3.1/data-models/json-schema.md), and formats (e.g. enums, date-time, emails, prices) are all considered to produce realistic payloads.

> Have your OpenAPI spec published via Bump.sh? You can import it into Beeceptor and use the generated mock server URLs directly inside your spec's servers block for interactive try-outs.

Creating the mock server is quick.

![Beeceptor - accepts OpenAPI URL to start building mock](/images/guides/mock-with-beeceptor/beeceptor-openapi-url.png)

![Beeceptor - takes a minute to get mock server ready](/images/guides/mock-with-beeceptor/beeceptor-mock-server-created.png)

You can open the mock server's dashboard to review the specification's path, request, and response payload.

![Expanding API paths and payload in Beeceptor](/images/guides/mock-with-beeceptor/beeceptor-openapi-paths-expanded.gif)

Here is a sample API response when invoking the Get All Products API. Instead of placeholder values, you get domain-specific values without any extra configuration. Checkout the following response payload and refer to the `name`, `price`, `stock`, and `created_at` for the generated values.

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

While Beeceptor generates mock responses from your OpenAPI spec, real-world testing often demands more control, like responses that change based on headers, query parameters, request bodies, or session context. This is where Mock Rules come in.

At Beeceptor, the mock rules are evaluated top-down, and the first matching rule is applied. When a rule is matched, Beeceptor sends the defined response and bypasses the default OpenAPI mock logic. This gives you complete control over the mocking behavior.

#### Key Capabilities

- **Priority Handling**: Rules always take precedence over the auto-generated OpenAPI responses.
- **Flexible Matching**: Match on HTTP method, path, query params, headers, and body content (exact or regex).
- **Network Behavior Simulation**: Add artificial delays (e.g., delay: 2000ms) or drop connections to test edge cases.
- **Error Simulation**: Easily return `500` / `401` / `429` responses under specific test conditions.
- **Dynamic Personalization**: Define responses per user or role. E.g.: When hitting `GET /products`, the response changes based on who logged in.
```
Header: X-User-ID: userA → returns products [A,B]
Header: X-User-ID: userB → returns products [B,C]
```

## Build Stateful Mocks

Modern mocking is about more than static JSON; it's about simulating behaviors. To simulate dynamic, multi-step application behavior, stateful mocking is essential. Beeceptor supports this with a persistent state engine.

With stateful mocks, your mock endpoints can:

- Remember data across requests
- Simulate object creation and retrieval
- Track counters (e.g., order IDs, session steps)
- Emulate queue-like flows (e.g., shopping cart, job queues)

Beeceptor achieves this through three fundamental operators:

- Step Counters – for sequential values or stage tracking. E.g. counting page views, or total orders.
- Data Stores – for key-value persistence. E.g. storing current logged in user name.
- Lists – for storing a collection of items. E.g. shopping cart, to-do lists, etc.

You should user these in the response templates using a simple _Handlebars_ syntax. This syntax replaces scripting.


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
- `list 'push'` appends it to the mock-side list

This list persists across calls for the endpoint.

#### View Cart (GET /cart)

Now, when you query the cart, you can retrieve the entire list:

```json
{
  "cartItems": {{ list 'get' 'shoppingCart' }},
  "totalItems": {{ len (list 'get' 'shoppingCart') }}
}
```

The cart is simulated entirely in-memory. Each `POST` adds to the cart, and each `GET` returns the full list.

Stateful mocks turn the mock server into a simulation platform. This allows API stakeholders to have a realistic server. You can build full test workflows, mimic backend services, and let teams explore real behavior — before writing a single line of backend code.

---

Mocking is about realism and developer speed, not just sending  `200 OK` with dummy JSON. Enabling stakeholders quickly is a key success metric for Developer Experience (DX). If you're looking to improve developer onboarding, shift QA left, or remove test dependency bottlenecks, consider adding a mock server to your API documentation. This is a simple yet powerful solution that doesn't require managing infrastructure, writing scripts, or defining examples by hand.
