---
title: Defining Sources
authors: phil
excerpt: Learn how to reference OpenAPI operations in Arazzo workflows using source descriptions.
date: 2025-01-30
---

- TOC
{:toc}

Source descriptions are how Arazzo gets a leg up pn understanding the APIs being worked with. To avoid repeating all the HTTP-level bits like endpoints, status codes, schema, etc. Arazzo just defines source description, then references operations by their `operationId`. Mostly these will be OpenAPI descriptions, but other Arazzo documents can also be used to reference workflows defined elsewhere, and soon AsyncAPI documents will be supported too.

## The sourceDescriptions Array

Source descriptions are described in the `sourceDescriptions` array at the root level, and there needs to be at least one:

```yaml
arazzo: 1.0.1
info:
  title: My Workflows
  version: 1.0.0

sourceDescriptions:
  - name: trainApi
    url: openapi.yaml
    type: openapi
  
  - name: paymentGateway
    url: https://api.example.com/payment-service.json
    type: openapi

workflows:
  # ... workflows reference these sources
```

This array has the two APIs, one local OpenAPI document written in YAML and a payment service where the OpenAPI is hosted remotely, available as a JSON URl. That'll all work fine, and makes it easier to work across context boundaries where different teams might manage their own APIs and OpenAPI.

## Source Description Fields

Let's have a bit of a closer look at the fields that make up a source description. Each source description object has three required fields:

```yaml
- name: myApi
  url: ./path/to/api-description.yaml
  type: openapi
```

### name (required)

To avoid having to call up that API description by its full path or URL every time, or refer to it by name "Barry's Badly Named API v231.3-final" we give it a short name that can be reused more easily. These short names are used as variables when referencing operations from that source.

```yaml
sourceDescriptions:
  - name: bookingService
    url: ./booking-api.yaml
    type: openapi

workflows:
  - workflowId: book-ticket
    steps:
      - stepId: create
        operationId: $sourceDescriptions.bookingService.createBooking
```

When there is only one source defined you can skip `$sourceDescriptions.bookingService.` and just use `createBooking` but when a second source is added the full reference is required to avoid ambiguity.

### url (required)

The location of the API description document. This can be a relative path:

```yaml
url: ./openapi.yaml
url: ../apis/booking.yaml
url: ./specs/v2/openapi.json
```

Or it can be an absolute URL:

```yaml
url: https://api.example.com/openapi.yaml
url: https://raw.githubusercontent.com/org/repo/main/openapi.json
```

### type (required)

The type of API description format. Current valid values:

- `openapi` - Supporting OpenAPI v3.x or v2.0 (formerly known as Swagger)
- `arazzo` - Reference other Arazzo documents.

This can be used to mix and match different API description formats in the same Arazzo document:

```yaml
sourceDescriptions:
  - name: restApi
    url: ./openapi.yaml
    type: openapi
  
  - name: commonWorkflows
    url: ./shared-workflows.yaml
    type: arazzo
```

## Referencing Operations from Sources

Once you've defined a source, you reference operations using the `operationId` with a runtime expression in the following format: `$sourceDescriptions.{name}.{operationId}`.

```yaml
sourceDescriptions:
  - name: trainApi
    url: ./train-api.yaml
    type: openapi

workflows:
  - workflowId: search-trains
    steps:
      - stepId: search
        operationId: $sourceDescriptions.trainApi.searchTrips
```

The operation must exist in the referenced API definition with a matching `operationId`. 

### OpenAPI Operation IDs

In your OpenAPI document:

```yaml
# train-api.yaml
paths:
  /trips:
    get:
      operationId: searchTrips  # This is what Arazzo references
      summary: Search for train trips
      # ...
```

The `operationId` in OpenAPI should be unique across the entire API description. You'll also need to be cautious when renaming `operationId` or sunsetting old endpoints as it could break some workflows.

## Multiple Sources

Simple workflows might only need one API but when working on cross-API orchestration (e.g., microservices, third-party integrations) or writing end-to-end tests that cross multiple APIs/services, you'll likely need to define multiple sources:

```yaml
sourceDescriptions:
  - name: inventoryApi
    url: https://inventory.example.com/openapi.yaml
    type: openapi
  
  - name: paymentApi
    url: https://payments.example.com/openapi.yaml
    type: openapi
  
  - name: shippingApi
    url: https://shipping.example.com/openapi.yaml
    type: openapi

workflows:
  - workflowId: complete-order
    summary: Orchestrate order across multiple services
    steps:
      - stepId: checkInventory
        operationId: $sourceDescriptions.inventoryApi.checkStock
        
      - stepId: reserveItems
        operationId: $sourceDescriptions.inventoryApi.reserveStock
        
      - stepId: processPayment
        operationId: $sourceDescriptions.paymentApi.createCharge
        
      - stepId: scheduleShipping
        operationId: $sourceDescriptions.shippingApi.createShipment
        
      - stepId: confirmOrder
        operationId: $sourceDescriptions.inventoryApi.confirmReservation
```

This is powerful for orchestrating across multiple microservices, combining your API with external third-party integrations, and using multiple providers together in multi-vendor workflows.

## Composing Arazzo Documents

Arazzo documents can reference other Arazzo documents to compose workflows, enabling you to share common workflows across different teams or projects, or build complex workflows from simpler, reusable components.

```yaml
# common-workflows.yaml
arazzo: 1.0.0
info:
  title: Common Workflows
  version: 1.0.0

sourceDescriptions:
  - name: authApi
    url: ./auth-api.yaml
    type: openapi

workflows:
  - workflowId: authenticate
    summary: Standard authentication workflow
    steps:
      - stepId: getToken
        operationId: $sourceDescriptions.authApi.createToken
        outputs:
          token: $response.body#/access_token
```

```yaml
# booking-workflows.yaml
arazzo: 1.0.0
info:
  title: Booking Workflows
  version: 1.0.0

sourceDescriptions:
  - name: bookingApi
    url: ./booking-api.yaml
    type: openapi
  
  - name: commonFlows
    url: ./common-workflows.yaml
    type: arazzo  # Reference another Arazzo document

workflows:
  - workflowId: authenticated-booking
    steps:
      # Use a workflow from another Arazzo document
      - stepId: auth
        workflowId: $sourceDescriptions.commonFlows.authenticate
      
      - stepId: book
        operationId: $sourceDescriptions.bookingApi.createBooking
        parameters:
          - name: Authorization
            in: header
            value: Bearer $steps.auth.outputs.token
```

This enables workflow reuse by sharing common workflows across documents, modularity by organizing workflows by domain or team, and composition by building complex workflows from simpler ones.
