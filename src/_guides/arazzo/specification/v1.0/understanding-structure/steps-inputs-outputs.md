---
title: Steps, Inputs, and Outputs
authors: phil
excerpt: Master the building blocks of Arazzo workflows - steps that call operations, inputs that provide data, and outputs that capture results for subsequent steps.
date: 2025-01-31
---

- TOC
{:toc}

If workflows are the recipes, then steps are the individual cooking instructions. Each step does one thing: call an API endpoint, run another workflow, or make a decision. Steps get their data from inputs and output from other steps, do their work, then save interesting bits of the response for steps that come after.

## What is a Step?

A step is a single action in your workflow. Most often that means calling an API endpoint, but steps can also invoke other workflows or handle conditional branching.

Here's an example step that operates within a workflow to search for train trips:

```yaml
steps:
  - stepId: searchTrips
    description: Search for available train trips
    operationId: $sourceDescriptions.trainApi.searchTrips
    parameters:
      - name: origin
        in: query
        value: $inputs.origin
    successCriteria:
      - condition: $statusCode == 200
    outputs:
      firstTripId: $response.body#/trips/0/id
```

### Required Fields

**stepId** 

The unique name for this step within the workflow.

```yaml
steps:
  - stepId: search
  - stepId: createBooking
  - stepId: processPayment
```

Stick to descriptive names in `camelCase` or `kebab-case`. This ID is how other steps reference this step's outputs, and how control flow (like `goto`) targets specific steps.

Every step needs to specify what it's going to do, and that will be a single operation or a whole other workflow. Operations can be picked with the `operationId` if the OpenAPI has defined operationIds (best practice, and most linters will pester you to do this), or `operationPath` if operationIds are missing. Kicking off a whole workflow can be done with `workflowId`. 

**operationId**

References an operation from your source APIs.

```yaml
- stepId: getBooking
  operationId: $sourceDescriptions.trainApi.getBookingById
```

**operationPath**

Reference by HTTP method and path. Requires a bit more implementation detail and will break when a path or parameter changes.

```yaml
- stepId: getBooking
  operationPath: /bookings/{bookingId}
  method: get  # Will also need to specify method
```

**workflowId**

Execute another workflow.

```yaml
- stepId: cancelBooking
  workflowId: $sourceDescriptions.trainApi.cancelBookingWorkflow
```

### Optional Fields

**description**
Explain what the step does in a way that is useful for human-readable documentation.

```yaml
- stepId: search
  description: Search for train trips between two stations on a specific date
  operationId: $sourceDescriptions.trainApi.searchTrips
```

**parameters** 

Override or add parameters to the operation.

```yaml
- stepId: search
  operationId: $sourceDescriptions.trainApi.searchTrips
  parameters:
    - name: origin
      in: query
      value: $inputs.origin
    - name: destination
      in: query
      value: $inputs.destination
```

**requestBody** 
Define the request body for POST/PUT/PATCH/QUERY operations.

```yaml
- stepId: createBooking
  operationId: $sourceDescriptions.trainApi.createBooking
  requestBody:
    contentType: application/json
    payload:
      tripId: $steps.search.outputs.tripId
      passengers: $inputs.passengers
```

**successCriteria**

Define what counts as a successful step execution.

```yaml
- stepId: search
  operationId: $sourceDescriptions.trainApi.searchTrips
  successCriteria:
    - condition: $statusCode == 200
    - condition: $response.body.trips.length > 0
```

**onSuccess** / **onFailure** 

Actions to take based on outcome.

```yaml
- stepId: checkAvailability
  operationId: $sourceDescriptions.api.checkStock
  successCriteria:
    - condition: $response.body.available == true
  onFailure:
    - name: soldOut
      type: end
```

**outputs**

Extract data from the response.

```yaml
- stepId: createBooking
  operationId: $sourceDescriptions.api.createBooking
  outputs:
    bookingId: $response.body#/id
    status: $response.body#/status
    totalPrice: $response.body#/pricing/total
```

## Step Execution Order

By default, steps run in order from top to bottom. Step 1 finishes, then step 2 runs, then step 3, and so on. Simple and predictable:

```yaml
steps:
  - stepId: step1  # Executes first
    # ...
  
  - stepId: step2  # Executes second (after step1 completes)
    # ...
  
  - stepId: step3  # Executes third (after step2 completes)
    # ...
```

### Controlling Flow with Actions

But sometimes you need to jump around. The `onSuccess` and `onFailure` fields let you break out of that linear flow:

```yaml
steps:
  - stepId: checkInventory
    operationId: $sourceDescriptions.api.checkStock
    onSuccess:
      - name: proceed
        type: goto
        stepId: createBooking
    onFailure:
      - name: unavailable
        type: goto
        stepId: notifyUser
  
  - stepId: createBooking
    # Runs if inventory check succeeded
  
  - stepId: notifyUser
    # Runs if inventory check failed
```

## Working with Inputs

Steps need data to do their work, and that data comes from three places. Let's look at each:

### 1. Workflow Inputs

Data passed to the entire workflow gets accessed with `$inputs`:

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
    
    steps:
      - stepId: search
        operationId: $sourceDescriptions.api.searchTrips
        parameters:
          # Reference workflow inputs
          - name: origin
            in: query
            value: $inputs.origin
          - name: destination
            in: query
            value: $inputs.destination
```

### 2. Previous Step Outputs

Access data from earlier steps.

```yaml
steps:
  - stepId: search
    operationId: $sourceDescriptions.trainApi.searchTrips
    outputs:
      selectedTripId: $response.body#/trips/0/id
  
  - stepId: createBooking
    operationId: $sourceDescriptions.api.createBooking
    requestBody:
      payload:
        # Reference output from previous step
        tripId: $steps.search.outputs.selectedTripId
```

### 3. Global Parameters

Inherit parameters defined at the workflow level:

```yaml
workflows:
  - workflowId: authenticated-flow
    parameters:
      - name: Authorization
        in: header
        value: Bearer $inputs.token
    
    steps:
      - stepId: getBookingDetails
        operationId: $sourceDescriptions.trainApi.getBooking
        # Automatically includes Authorization header
```

## Parameters

Parameters are how you customize API calls. They can go in the URL (query or path), in headers, or in cookies. Each parameter overrides or supplements what's defined in the OpenAPI operation:

### Query Parameters

```yaml
- stepId: search
  operationId: $sourceDescriptions.api.searchTrips
  parameters:
    - name: origin
      in: query
      value: $inputs.origin
    - name: destination
      in: query
      value: $inputs.destination
    - name: date
      in: query
      value: $inputs.departureDate
    - name: passengers
      in: query
      value: $inputs.passengerCount
```

### Path Parameters

```yaml
- stepId: getBooking
  operationId: $sourceDescriptions.api.getBookingById
  parameters:
    - name: bookingId
      in: path
      value: $steps.createBooking.outputs.bookingId
```

### Header Parameters

```yaml
- stepId: authenticatedRequest
  operationId: $sourceDescriptions.api.getProtectedResource
  parameters:
    - name: Authorization
      in: header
      value: Bearer $steps.login.outputs.accessToken
    - name: X-Request-ID
      in: header
      value: $inputs.requestId
```

### Cookie Parameters

```yaml
- stepId: sessionRequest
  operationId: $sourceDescriptions.api.getSessionData
  parameters:
    - name: sessionId
      in: cookie
      value: $steps.auth.outputs.sessionId
```

## Request Bodies

For POST, PUT, PATCH, and QUERY operations, you'll usually need to send a request body. Arazzo makes this straightforward:

### Simple Request Body

```yaml
- stepId: addPassenger
  operationId: $sourceDescriptions.trainApi.addPassengerToBooking
  requestBody:
    contentType: application/json
    payload:
      name: $inputs.passengerName
      email: $inputs.passengerEmail
```

### Complex Request Body

```yaml
- stepId: createBooking
  operationId: $sourceDescriptions.api.createBooking
  requestBody:
    contentType: application/json
    payload:
      tripId: $steps.search.outputs.tripId
      passengers:
        - name: $inputs.passengers[0].name
          age: $inputs.passengers[0].age
          seatPreference: $inputs.passengers[0].seat
        - name: $inputs.passengers[1].name
          age: $inputs.passengers[1].age
          seatPreference: $inputs.passengers[1].seat
      contactInfo:
        email: $inputs.email
        phone: $inputs.phone
      specialRequests: $inputs.specialRequests
```

### Using Previous Step Data

```yaml
- stepId: updateBooking
  operationId: $sourceDescriptions.api.updateBooking
  parameters:
    - name: bookingId
      in: path
      value: $steps.createBooking.outputs.id
  requestBody:
    contentType: application/json
    payload:
      # Merge previous booking data with updates
      status: confirmed
      paymentId: $steps.processPayment.outputs.id
      confirmationCode: $steps.generateCode.outputs.code
```

### Different Content Types

```yaml
# JSON
- stepId: jsonRequest
  requestBody:
    contentType: application/json
    payload:
      key: value

# Form data
- stepId: updateTravelPreferences
  requestBody:
    contentType: application/x-www-form-urlencoded
    payload:
      seatPreference: $inputs.seatPreference
      mealOption: $inputs.mealOption

# Multipart (file upload)
- stepId: uploadTicket
  requestBody:
    contentType: multipart/form-data
    payload:
      file: $inputs.ticketScan
      bookingId: $inputs.bookingId
```

## Outputs

Outputs are how you pluck useful data from responses and make it available to later steps. Don't extract everything, just grab what you'll actually need.

### Basic Outputs

```yaml
- stepId: createBooking
  operationId: $sourceDescriptions.api.createBooking
  outputs:
    bookingId: $response.body#/id
    status: $response.body#/status
```

### JSON Pointer Notation

Most real-world APIs using JSON are going to have nested data, with objects and arrays inside each other. Selecting out the exact piece of data needed for an output value can be done with [JSON Pointer](https://www.rfc-editor.org/rfc/rfc6901.html) notation.

```yaml
- stepId: getBookingDetails
  operationId: $sourceDescriptions.trainApi.getBooking
  outputs:
    bookingId: $response.body#/id
    customerName: $response.body#/customer/name
    customerEmail: $response.body#/customer/email
    tripOrigin: $response.body#/trip/origin
    tripDestination: $response.body#/trip/destination
    totalPrice: $response.body#/pricing/total
```

When dealing with arrays, you can access a specific record in an array by its index using JSON Pointer notation. 

```yaml
- stepId: search
  operationId: $sourceDescriptions.api.searchTrips
  outputs:
    firstTripPrice: $response.body#/trips/0/price
    secondTripPrice: $response.body#/trips/1/price
```

### Headers and Status

Besides response bodies, you can also extract HTTP status codes and headers. This is useful for capturing rate limits, pagination tokens, or debugging information:

```yaml
- stepId: makeRequest
  operationId: $sourceDescriptions.api.someOperation
  outputs:
    # Response body
    responseData: $response.body
    
    # Status code
    statusCode: $statusCode
    
    # Headers
    contentType: $response.header.content-type
    rateLimit: $response.header.x-rate-limit-remaining
```


## Using Outputs in Subsequent Steps

Outputs are referenced using the `$steps` runtime expression:

```yaml
steps:
  # Step 1: Create a booking
  - stepId: createBooking
    operationId: $sourceDescriptions.api.createBooking
    outputs:
      bookingId: $response.body#/id
      amount: $response.body#/totalPrice
  
  # Step 2: Process payment (uses booking outputs)
  - stepId: processPayment
    operationId: $sourceDescriptions.paymentApi.createCharge
    requestBody:
      payload:
        bookingReference: $steps.createBooking.outputs.bookingId
        amount: $steps.createBooking.outputs.amount
        currency: USD
    outputs:
      paymentId: $response.body#/id
      status: $response.body#/status
  
  # Step 3: Confirm booking (uses both previous outputs)
  - stepId: confirmBooking
    operationId: $sourceDescriptions.api.confirmBooking
    parameters:
      - name: bookingId
        in: path
        value: $steps.createBooking.outputs.bookingId
    requestBody:
      payload:
        paymentId: $steps.processPayment.outputs.paymentId
        paymentStatus: $steps.processPayment.outputs.status
```


## Best Practices

A few tips that'll make your workflows easier to work with:

### Descriptive Step IDs

Make step IDs self-documenting. Six months from now, `searchAvailableTrips` will be much clearer than `step1`:

```yaml
# Good
- stepId: searchAvailableTrips
- stepId: selectFirstTrip
- stepId: createBookingForTrip
- stepId: processPaymentForBooking

# Avoid
- stepId: step1
- stepId: doSomething
- stepId: api_call
```

### Extract Useful Outputs

Be intentional about outputs. Only extract data you know you'll need in a later step:

```yaml
# Good - outputs are used in subsequent steps
- stepId: search
  outputs:
    tripId: $response.body#/trips/0/id  # Used in next step
    price: $response.body#/trips/0/price  # Used for display

# Avoid - extracting everything "just in case"
- stepId: search
  outputs:
    entireResponse: $response.body
    # Too broad - unclear what will actually be used
```

### Clear Descriptions

```yaml
- stepId: validatePayment
  description: |
    Validates payment details before processing.
    Checks card number format, expiry date, and CVV.
    Returns validation errors if any field is invalid.
  operationId: $sourceDescriptions.paymentApi.validateCard
```

### Extract Useful Outputs

Be intentional about outputs. Only extract data you know you'll need in a later step:

```yaml
# Good - clear purpose
outputs:
  selectedTripId: $response.body#/trips/0/id
  userEmailAddress: $response.body#/customer/email
  totalPriceIncludingTax: $response.body#/pricing/total

# Avoid - vague names
outputs:
  id: $response.body#/trips/0/id
  value: $response.body#/customer/email
  amount: $response.body#/pricing/total
```

## Wrapping Up

Steps are where workflows get real work done. Each step calls an operation, transforms data, and passes results to the next step.

With steps down, you're ready to handle the inevitable: things going wrong. The next section covers success and failure conditions.
