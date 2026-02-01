---
title: Runtime Expressions
authors: phil
excerpt: Learn how to use runtime expressions in Arazzo to create dynamic, data-driven workflows.
date: 2025-02-01
---

- TOC
{:toc}

Runtime expressions are the heart of Arazzo's dynamic capabilities. They allow you to reference data from inputs, previous steps, and responses, compute new values, and create conditional logic. Understanding runtime expressions is essential for building sophisticated workflows.

## What Are Runtime Expressions?

Runtime expressions are evaluated during workflow execution to produce values. They start with a `$` and use dot notation to access data:

```yaml
# Reference workflow input
$inputs.origin

# Reference previous step output
$steps.search.outputs.tripId

# Reference response status
$statusCode

# Reference response body
$response.body.booking.id
```

## Expression Contexts

Expressions can reference data from several contexts:

### Workflow Inputs

Access data passed to the workflow:

```yaml
workflows:
  - workflowId: search-trips
    inputs:
      type: object
      properties:
        origin:
          type: string
        destination:
          type: string
        date:
          type: string
    
    steps:
      - stepId: search
        parameters:
          - name: from
            in: query
            value: $inputs.origin  # Access workflow input
          - name: to
            in: query
            value: $inputs.destination
          - name: departure
            in: query
            value: $inputs.date
```

**Nested inputs:**

```yaml
inputs:
  type: object
  properties:
    passenger:
      type: object
      properties:
        name:
          type: string
        age:
          type: integer

# Access nested values
value: $inputs.passenger.name
value: $inputs.passenger.age
```

**Array inputs:**

```yaml
inputs:
  type: object
  properties:
    userName:
      type: string
    email:
      type: string

# Access input properties
value: $inputs.userName
value: $inputs.email
```

### Previous Step Outputs

Reference outputs from earlier steps:

```yaml
steps:
  - stepId: search
    operationId: $sourceDescriptions.api.searchTrips
    outputs:
      selectedTripId: $response.body.trip.id
      tripPrice: $response.body.trip.price
  
  - stepId: createBooking
    operationId: $sourceDescriptions.api.createBooking
    requestBody:
      payload:
        # Reference outputs from 'search' step
        tripId: $steps.search.outputs.selectedTripId
        price: $steps.search.outputs.tripPrice
```

To access an output from a previous step, use the syntax:

```
$steps.{stepId}.outputs.{outputName}
```

For this to work the output must be defined in the referenced step, and that step must have already run. 

**Learn more about [steps and outputs](_guides/arazzo/specification/v1.0/understanding-structure/steps-inputs-outputs.md).**

### Current Response

Within success/failure criteria and outputs, access the current response:

```yaml
- stepId: getBooking
  operationId: $sourceDescriptions.api.getBooking
  successCriteria:
    # Access response body
    - condition: $response.body.status == 'confirmed'
    
    # Access response headers
    - condition: $response.header.content-type == 'application/json'
  
  outputs:
    # Extract from response
    bookingId: $response.body.id
    customerEmail: $response.body.customer.email
    total: $response.body.pricing.total
```

**Response properties:**
- `$response.body` - Response body (parsed JSON/XML)
- `$response.header` - Response headers object
- `$response.header.content-type` - Specific header

### HTTP Status

Access the HTTP status code of the current response:

```yaml
successCriteria:
  - condition: $statusCode >= 200 && $statusCode < 300

outputs:
  responseCode: $statusCode
```

### Source Descriptions

Reference operations from source APIs:

```yaml
sourceDescriptions:
  - name: trainApi
    url: ./train-api.yaml
    type: openapi

steps:
  - stepId: search
    # Reference operation from source
    operationId: $sourceDescriptions.trainApi.searchTrips
```

That's `$sourceDescriptions.{sourceName}.{operationId}` or  `$sourceDescriptions.{sourceName}.{workflowId}` for other Arazzo workflows.

## Operators in Conditions

Runtime expressions support various operators for use in success and failure criteria:

### Comparison Operators

```yaml
successCriteria:
  # Equality
  - condition: $response.body.status == 'confirmed'
  - condition: $statusCode == 200
  
  # Inequality
  - condition: $response.body.error != null
  - condition: $statusCode != 404
  
  # Greater than
  - condition: $response.body.price > 100
  - condition: $response.body.stock > $inputs.quantity
  
  # Greater than or equal
  - condition: $response.body.rating >= 4.0
  
  # Less than
  - condition: $response.body.price < $inputs.maxPrice
  
  # Less than or equal
  - condition: $response.body.quantity <= $response.body.maxQuantity
```

### Logical Operators

```yaml
successCriteria:
  # AND - all conditions must be true
  - condition: $statusCode == 200 && $response.body.available == true
  - condition: $response.body.price > 0 && $response.body.price < 1000
  
  # OR - at least one condition must be true
  - condition: $statusCode == 200 || $statusCode == 201
  - condition: $response.body.status == 'confirmed' || $response.body.status == 'pending'
```

### String Operators

Concat strings using interpolation:

```yaml
outputs:
  fullName: '{$response.body.firstName} {$response.body.lastName}'
  message: 'Booking {$response.body.id} confirmed'
```

## Null Safety

Check for null values in conditions:

```yaml
successCriteria:
  # Check for null/undefined
  - condition: $response.body.email != null
  - condition: $response.body.address != null
  - condition: $response.body.id != null
```

## Extracting Values

Use outputs to extract values from responses:

```yaml
outputs:
  # Extract simple values
  bookingId: $response.body.id
  customerEmail: $response.body.customer.email
  tripPrice: $response.body.trip.price
  
  # Extract nested values
  originCity: $response.body.trip.origin.city
  destinationCity: $response.body.trip.destination.city
```

## Using Expressions in Conditions

Expressions are frequently used in success and failure criteria. Here's a comprehensive guide to condition patterns:

### Status Code Checks

```yaml
  # Exact status
  - condition: $statusCode == 200
  - condition: $statusCode == 201
  
  # Status ranges
  - condition: $statusCode >= 200 && $statusCode < 300
  
  # Multiple acceptable codes
  - condition: $statusCode == 200 || $statusCode == 201
```

### Field Value Checks

```yaml
# Simple field checks
- condition: $response.body.status == 'confirmed'
- condition: $response.body.stock > 0
- condition: $response.body.payment.processed == true

# Field existence
- condition: $response.body.id != null
- condition: $response.body.bookingReference != null
```

### Checking Response Structure

```yaml
# Check for required object properties
- condition: $response.body.trip != null
- condition: $response.body.trip.available == true
- condition: $response.body.trip.price <= $inputs.maxPrice
```

### Header Checks

```yaml
  # Header values
  - condition: $response.header['content-type'] == 'application/json'
  - condition: $response.header['x-api-version'] == '2024-01'
  
  # Rate limiting (header values are strings)
  - condition: $response.header['x-rate-limit-remaining'] != '0'
  - condition: $response.header['retry-after'] == null
```

### JSONPath in Conditions

For complex filtering, use JSONPath expressions with `type: jsonpath`. This is **only available in conditions** (`successCriteria`/`failureCriteria`), not in outputs or parameters.

```yaml

# Check all bookings are confirmed
- type: jsonpath
  context: $response.body
  condition: $.bookings[?(@.status != 'confirmed')][0] == null

# At least one affordable trip
- type: jsonpath
  context: $response.body
  condition: $.trips[?(@.price < 100)][0] != null

# Find child passengers
- type: jsonpath
  context: $response.body
  condition: $.passengers[?(@.age < 18)][0] != null

# No critical errors
- type: jsonpath
  context: $response.body
  condition: $.errors[?(@.severity == 'critical')][0] == null
```

Mastering runtime expressions enables you to build dynamic, data-driven workflows that respond intelligently to API responses and user inputs.
