---
title: Components & References
authors: phil
excerpt: Learn how to use components and references in Arazzo to reduce repetition and build maintainable workflows.
date: 2025-01-23
---

- TOC
{:toc}

Arazzo helps teams and tools not waste time and effort writing and parsing the same stuff over and over again. By defining reusable components just the once, they can be reused in various parts of the workflow. This not only makes it quicker to write them and cuts down on the maintenance burden, but far more importantly it drastically reduces the chance of human error that can cause inconsistencies.

Reuse in Arazzo is built upon two concepts: the `components` object, and the `reference` keyword.

## The Components Object

The `components` object at the root of your Arazzo document contains reusable definitions:

```yaml
arazzo: 1.0.1
info:
  title: My Workflows
  version: 1.0.0

components:
  inputs:
    # Reusable input schemas
  
  parameters:
    # Reusable parameters
  
  successActions:
    # Reusable success actions
  
  failureActions:
    # Reusable failure actions

workflows:
  # ... workflows can reference components
```

## Component Types

Arazzo supports several component types, each designed to reduce repetition and make workflows easier to maintain.

```yaml
components:
  inputs:
    pagination:
      type: object
      properties:
        page:
          type: integer
          minimum: 1
          default: 1
        pageSize:
          type: integer
          minimum: 1
          maximum: 100
          default: 20
    
    dateRange:
      type: object
      required: [startDate, endDate]
      properties:
        startDate:
          type: string
          format: date
        endDate:
          type: string
          format: date
    
    authentication:
      type: object
      required: [username, password]
      properties:
        username:
          type: string
        password:
          type: string
          format: password
```

This example defines three input objects, named `pagination`, `dateRange`, and `authentication`. The latter two have required properties, whilst the former has only optional properties that can helpfully define defaults using the JSON Schema `default` keyword.

This is a good place to focus on human descriptions explaining what each input is for, and any constraints not covered by the schema itself.

### Parameters

Parameters bring an input value and introduce it to the world of HTTP. They define how to send data to the source API, whether in the path, query string, headers, or cookies.

- `path` - Part of the URL itself, using OpenAPI-style path templating. For example, in `/items/{itemId}`, the path parameter is `itemId`.
- `query` - Appended to the URL as a query string, like `/items?id=123`.
- `header` - Sent as an HTTP header. Header field names are case-insensitive (see [RFC 9110: Field Names](https://httpwg.org/specs/rfc9110.html#rfc.section.5.1)).
- `cookie` - Sent as a cookie value to the source API.

A parameter is considered unique by the combination of its `name` and `in` fields, so give it a sensible name and don't have two parameters with the same name in the same location.

```yaml
components:
  parameters:
    authHeader:
      name: Authorization
      in: header
      value: Bearer $inputs.token
    
    apiVersion:
      name: API-Version
      in: header
      value: "2024-01"
    
    requestId:
      name: X-Request-ID
      in: header
      value: $inputs.requestId
    
    acceptJson:
      name: Accept
      in: header
      value: application/json
```

### Success Actions

Success actions define reusable actions to take when a step completes successfully.

Successful actions have two possible outcomes, they can either end the workflow there, or they can go to another step. 

Whichever the outcome, defining criteria is an optional way to decide if that outcome should be taken. The criteria objects rely on runtime expressions, and can be paired with Regex, JSONPath, JSON Pointers, or XPath for even more advanced logic.

```yaml
components:
  successActions:
    paymentPending:
      name: paymentPending
      type: goto
      stepId: getBooking
      criteria:
        - condition: $response.body.status == 'pending'

    paymentSucceeded:
      name: paymentSucceeded
      type: end
      criteria:
        - context: $response.body
          condition: $.status == 'succeeded'
          type: jsonpath
```

Both of those conditions are actually the same but using different expression types. The first uses a simple expression, while the second uses JSONPath to extract the status from the response body. 

Learn more about success and failure actions in the [Success and Failure](_guides/arazzo/specification/v1.0/understanding-structure/success-and-failure.md) guide.

### Failure Actions

Failure actions define reusable actions to take when a step fails.

```yaml
components:
  failureActions:
    retryOnServerError:
      name: serverErrorRetry
      type: retry
      retryAfter: 5
      retryLimit: 3
      criteria:
        - condition: $statusCode >= 500
    
    handleRateLimit:
      name: rateLimited
      type: retry
      retryAfter: 60
      retryLimit: 5
      criteria:
        - condition: $statusCode == 429
    
    logAndEnd:
      name: logFailure
      type: goto
      stepId: logError
```

## Referencing Components

Now that these components are defined, they can be referenced using the `reference` keyword.

```yaml
components:
  parameters:
    authHeader:
      name: Authorization
      in: header
      value: Bearer $inputs.token

workflows:
  - workflowId: myWorkflow
    steps:
      - stepId: authenticatedCall
        operationId: $sourceDescriptions.api.getUser
        parameters:
          - reference: authHeader
```

Referenced parameters are pulled into the step at runtime, just as if they had been defined inline.

You can even mix referenced and inline definitions.

```yaml
steps:
  - stepId: search
    operationId: $sourceDescriptions.api.search
    parameters:
      - reference: authHeader
      - name: query
        in: query
        value: $inputs.searchTerm
      - name: limit
        in: query
        value: 20
```

Here the `authHeader` parameter is reused as-is, while `query` and `limit` are defined inline for this one step.

## Referencing Inputs

Inputs are a little different than the rest of Arazzo in that they are defined entirely using JSON Schema. This means there is little space for the `reference` keyword, but that's no trouble as JSON Schema comes with its own `$ref` keyword.

While JSON Schema composition keywords like `allOf` are valid, they are not always supported consistently by Arazzo tooling. In practice, the most widely supported pattern is to define full input schemas under `components.inputs`, then point `workflows[].inputs` at them with `$ref`.

```yaml
components:
  inputs:
    pagination:
      type: object
      properties:
        page:
          type: integer
          default: 1
        pageSize:
          type: integer
          default: 20
      
workflows:
  - workflowId: listBookings
    inputs:
      type: object
      properties:
        pagination:
          $ref: '#/components/inputs/pagination'
        status:
          type: string
          enum: [pending, confirmed, cancelled]
  
  - workflowId: listUsers
    inputs:
      type: object
      properties:
        pagination:
          $ref: '#/components/inputs/pagination'
        role:
          type: string
          enum: [admin, user, guest]
```

Each input schema can define properties, and use `$ref` to pull in reusable input components mixed in with inline definitions for just that workflow.

## Referencing Actions

Actions are where `reference` really shines: define consistent behavior once, then attach it to any step using `onSuccess` or `onFailure`.

### Success Actions

Use a success action component when multiple steps should react the same way to success.

For example, using the `paymentPending` and `paymentSucceeded` success actions defined earlier, you can attach both outcomes to a payment step.

```yaml
workflows:
  - workflowId: completeBooking
    steps:
      - stepId: payForBooking
        operationId: $sourceDescriptions.api.createBookingPayment
        onSuccess:
          - reference: paymentPending
          - reference: paymentSucceeded
```

Because each success action has criteria, you can attach both and let runtime data decide whether the workflow continues (`goto`) or completes (`end`).

### Failure Actions

Failure actions are often reused even more heavily, because retry logic and error routing tends to be consistent across many steps.

```yaml
workflows:
  - workflowId: completeBooking
    steps:
      - stepId: payForBooking
        operationId: $sourceDescriptions.api.createBookingPayment
        onFailure:
          - reference: retryOnServerError
          - reference: handleRateLimit
          - reference: logAndEnd
```

This step reuses the failure actions from earlier: retry on transient server errors, retry more cautiously when rate limited, and then route to a logging step if it still fails.

### Conditional Action Reuse

Criteria let you attach multiple actions to the same step and still get different outcomes based on runtime data.

```yaml
workflows:
  - workflowId: completeBooking
    steps:
      - stepId: payForBooking
        operationId: $sourceDescriptions.api.createBookingPayment
        onSuccess:
          - reference: paymentPending
          - reference: paymentSucceeded
        onFailure:
          - reference: retryOnServerError
          - reference: handleRateLimit
```

Because each action has criteria, you can attach them together without them all firing every time.

## Summary

Arazzo provides powerful reusability through:

- **Components object** for shared definitions
- **reference** for Arazzo-style references (simple, readable)
- **External references** for cross-file reuse
- **Component types**: inputs, parameters, success actions, failure actions

Inputs are JSON Schema, so you may see `$ref` in workflow inputs and inside input schemas. That's JSON Schema's own referencing mechanism and is separate from Arazzo's `reference` keyword.

Effective use of components and references makes your Arazzo documents more maintainable, consistent, and easier to understand. Next, let's explore how workflows are executed at runtime.
