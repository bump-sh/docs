---
title: Workflows
authors: phil
excerpt: Learn how to define Arazzo workflows, similar to GitHub Actions and CI/CD workflows but for describing API interactions.
date: 2025-01-31
---

- TOC
{:toc}

Think of workflows as recipes for API operations. Just like a recipe breaks down cooking into steps (chop onions, sauté garlic, add tomatoes), an Arazzo workflow breaks down complex API tasks into manageable steps. If you've used GitHub Actions or Jenkins pipelines, the concept will feel familiar, but Arazzo is purpose-built for API orchestration rather than CI/CD.

## What is a Workflow?

A workflow is a named sequence of steps that performs a complete task using one or more APIs. Each workflow is self-contained. It declares what inputs it needs, what steps to execute, and what outputs to return. This makes workflows portable and reusable across different contexts.

```yaml
workflows:
  - workflowId: book-train-ticket
    summary: Complete workflow for booking a train ticket
    description: |
      This workflow handles the end-to-end process of booking a train ticket:
      1. Search for available trips
      2. Select a trip
      3. Create a booking
      4. Process payment
      5. Receive confirmation
    
    inputs:
      type: object
      properties:
        origin:
          type: string
        destination:
          type: string
        departureDate:
          type: string
          format: date
        passengers:
          type: array
    
    steps:
      # ... step definitions
    
    outputs:
      bookingId: $steps.createBooking.outputs.bookingId
      ticketUrl: $steps.confirm.outputs.ticketUrl
```

## Workflow Structure

### Required Fields

Only two fields are actually required to create a workflow:

**workflowId** identifies the workflow uniquely within the document. Pick something descriptive, which should conform to the regular expression `[A-Za-z0-9_\-]+` but why not use `kebab-case` to make it extra readable.

```yaml
workflows:
  - workflowId: create-and-retrieve-booking
```
  
**steps** is an array of actions to execute. We'll cover steps in detail later, but for now just know that every workflow needs at least one step.

```yaml
workflows:
  - workflowId: simple-workflow
    steps:
      - stepId: firstStep
        # ... step configuration
      - stepId: secondStep
        # ... step configuration
```

### Optional Fields

**summary** - A brief description:

```yaml
workflows:
  - workflowId: book-ticket
    summary: Search for and book a train ticket
```

**description** - A longer description that can go much longer, even including CommonMark (Markdown) formatting. This is great for documenting complex workflows and will be used by tools to generate nice documentation pages.

```yaml
workflows:
  - workflowId: complex-booking
    summary: Multi-step booking process
    description: |
      This workflow handles complex booking scenarios including:
      
      - Multi-city travel
      - Group bookings with different passenger types
      - Seat selection and preferences
      - Special assistance requests
      - Payment plan options
      
      The workflow includes extensive error handling for:
      - Sold out trips
      - Payment failures
      - Booking timeouts
```

**inputs** - Define what data the workflow accepts using a JSON Schema object:

```yaml
workflows:
  - workflowId: search-and-book
    inputs:
      type: object
      required:
        - origin
        - destination
      properties:
        origin:
          type: string
          description: Departure station code
          example: BOS
        destination:
          type: string
          description: Arrival station code
          example: NYC
        departureDate:
          type: string
          format: date
          description: Date of travel
```

**outputs** - Define what data the workflow produces:

```yaml
workflows:
  - workflowId: book-ticket
    outputs:
      bookingId:
        $steps.createBooking.outputs.bookingId
      confirmationCode:
        $steps.confirm.outputs.code
      totalPrice:
        $steps.payment.outputs.amount
```

**parameters** - Global parameters that apply to all steps (unless overridden):

```yaml
workflows:
  - workflowId: authenticated-workflow
    parameters:
      - name: Authorization
        in: header
        value: Bearer $inputs.token
    
    steps:
      # All steps will include this Authorization header
      # unless they override it
```

**dependsOn** - Specify dependencies on other workflows:

```yaml
workflows:
  - workflowId: authenticated-booking
    dependsOn:
      - authenticate-user
    steps:
      # This workflow assumes authentication has been completed
```

## Workflow Inputs

Workflows need some data to get started. Maybe it's a user ID, search criteria, or a new resource being created. Arazzo uses JSON Schema to define what inputs a workflow accepts, which has the handy side effect of providing validation and documentation automatically.

### Basic Inputs

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
          format: date
```

Input objects can have any valid JSON Schema structure, including nested objects and arrays. If you are new to JSON Schema, check out the [official documentation](https://json-schema.org/learn) for a full guide.

### Required vs Optional

Some inputs are must-haves (where are you going?), while others can have sensible defaults (how many passengers? probably just one). 

The `required` array specifies which inputs must be provided, everything else is assumed to be optional, with `default` values where specified:

```yaml
workflows:
  - workflowId: flexible-search
    inputs:
      type: object
      required:
        - origin
        - destination
      properties:
        origin:
          type: string
        destination:
          type: string
        departureDate:
          type: string
          format: date
          description: Optional - defaults to today
        passengers:
          type: integer
          default: 1
          minimum: 1
          maximum: 9
```

### Complex Input Types

Inputs can be as simple or complex as you need. Nested objects, arrays, enums,JSON Schema has a keyword for pretty much everything.

```yaml
workflows:
  - workflowId: book-with-preferences
    inputs:
      type: object
      properties:
        passengers:
          type: array
          items:
            type: object
            properties:
              name:
                type: string
              age:
                type: integer
              seatPreference:
                type: string
                enum: [window, aisle, any]
        
        paymentMethod:
          type: object
          properties:
            type:
              type: string
              enum: [credit_card, debit_card, paypal]
            token:
              type: string
```

### Using Inputs in Steps

Once you've defined inputs at the workflow level, steps can access them using runtime expressions like `$inputs.origin`. This is how data flows from the workflow into individual API calls:

```yaml
workflows:
  - workflowId: search-workflow
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
          - name: origin
            in: query
            value: $inputs.origin  # Reference input
          - name: destination
            in: query
            value: $inputs.destination  # Reference input
```

## Workflow Outputs

Workflows should return useful data. What good is running a booking workflow if you can't get the booking ID back? Outputs define what data the workflow makes available to whatever called it.

### Simple Outputs

```yaml
workflows:
  - workflowId: create-booking
    steps:
      - stepId: book
        # ... creates a booking
        outputs:
          bookingId: $response.body#/id
    
    outputs:
      bookingId: $steps.book.outputs.bookingId
      createdAt: $steps.book.outputs.timestamp
```

### Computed Outputs

```yaml
workflows:
  - workflowId: calculate-total
    steps:
      - stepId: getBasePrice
        outputs:
          basePrice: $response.body#/price
      
      - stepId: getTax
        outputs:
          taxAmount: $response.body#/tax
    
    outputs:
      basePrice: $steps.getBasePrice.outputs.basePrice
      tax: $steps.getTax.outputs.taxAmount
      total: $steps.getBasePrice.outputs.basePrice + $steps.getTax.outputs.taxAmount
```

## Global Parameters

Got a header or query parameter that every single step needs? Don't repeat yourself. Define them at the workflow level and all steps inherit it automatically:

```yaml
workflows:
  - workflowId: api-with-auth
    parameters:
      # This header will be included in all step requests
      - name: Authorization
        in: header
        value: Bearer $inputs.apiKey
      
      # API version header
      - name: API-Version
        in: header
        value: "2024-01"
    
    steps:
      - stepId: getUser
        operationId: $sourceDescriptions.api.getUser
        # Automatically includes Authorization and API-Version headers
      
      - stepId: updateUser
        operationId: $sourceDescriptions.api.updateUser
        # Also automatically includes both headers
```

## Workflow Dependencies

When workflows need to run in a specific order, the `dependsOn` field makes those dependencies explicit. This is particularly useful for authentication flows, multi-stage processes, or any scenario where one workflow produces data that another workflow requires:

```yaml
workflows:
  # Base workflow - no dependencies
  - workflowId: authenticate
    summary: Get an authentication token
    steps:
      - stepId: login
        outputs:
          token: $response.body#/access_token
  
  # Depends on authentication
  - workflowId: get-user-bookings
    dependsOn:
      - authenticate
    summary: Retrieve bookings for authenticated user
    steps:
      - stepId: fetchBookings
        parameters:
          - name: Authorization
            in: header
            value: Bearer $inputs.token  # Assumes token from authenticate workflow
```

Smart tools can use this information to automatically run prerequisite workflows, validate execution order, or generate nice workflow diagrams.

## Workflow Patterns

Here are some common patterns for organizing workflows:

### Linear Sequential Workflows

The most straightforward pattern - steps execute one after another:

```yaml
workflows:
  - workflowId: linear-booking
    steps:
      - stepId: searchTrips
      - stepId: selectTrip
      - stepId: createBooking
      - stepId: processPayment
```

### Multi-Source Workflows

Workflows can orchestrate across multiple APIs by referencing operations from different source descriptions:

```yaml
workflows:
  - workflowId: complete-order
    steps:
      - stepId: checkInventory
        operationId: $sourceDescriptions.inventoryApi.checkStock
      
      - stepId: processPayment
        operationId: $sourceDescriptions.paymentApi.createCharge
      
      - stepId: scheduleShipping
        operationId: $sourceDescriptions.shippingApi.createShipment
```

### Nested Workflows

Break complex processes into smaller, reusable workflows:

```yaml
workflows:
  - workflowId: authenticate
    summary: Get authentication token
    steps:
      - stepId: login
        operationId: $sourceDescriptions.authApi.login
  
  - workflowId: authenticated-booking
    dependsOn:
      - authenticate
    steps:
      - stepId: getProfile
        operationId: $sourceDescriptions.userApi.getProfile
      
      - stepId: createBooking
        operationId: $sourceDescriptions.bookingApi.create
```

## Best Practices

Here's a few tips for writing workflows that are easy to understand and maintain.

### Descriptive Workflow IDs

Pick workflow IDs that clearly describe what the workflow does:

```yaml
# Good - clear and descriptive
- workflowId: search-and-book-train-ticket
- workflowId: cancel-booking-with-refund
- workflowId: update-passenger-details

# Avoid - vague or cryptic
- workflowId: workflow1
- workflowId: process
- workflowId: sab
```

### Write Summaries That Add Value

Don't just repeat the workflow ID in different words. Your summary should tell readers what the workflow accomplishes and when they'd want to use it:

```yaml
# Good
- workflowId: guest-checkout
  summary: Complete checkout process for guest users without registration

# Avoid
- workflowId: checkout
  summary: Checkout workflow
```

### Document Complex Workflows

For workflows with many steps or intricate logic, use the `description` field to explain the overall process, key decisions, and error handling:

```yaml
- workflowId: multi-city-booking
  summary: Book a multi-city train journey
  description: |
    This workflow handles the complexity of booking trips across multiple cities:
    
    **Process:**
    1. Validates that all cities form a valid route
    2. Searches for available trips for each leg
    3. Ensures compatible connection times
    4. Creates individual bookings for each leg
    5. Links bookings together
    6. Processes single payment for entire journey
    
    **Error Handling:**
    - If any leg is unavailable, the entire booking fails
    - If payment fails, all leg bookings are cancelled
    - Connection validation ensures minimum 30 minute layovers
```

### Keep Workflows Focused

Each workflow should do one thing well. Don't create a mega-workflow that handles everything from user registration to coffee machine calibration:

```yaml
# Good - focused workflows
- workflowId: search-trips
- workflowId: create-booking
- workflowId: process-payment
- workflowId: cancel-booking

# Avoid - overly broad workflow
- workflowId: do-everything
  # ... handles search, booking, payment, cancellation, refunds, ...
```

Steps are where the real action happens in a workflow. They define the individual operations that get executed, whether that's calling an API endpoint, invoking another workflow, or performing conditional logic, so lets get stuck into that.
