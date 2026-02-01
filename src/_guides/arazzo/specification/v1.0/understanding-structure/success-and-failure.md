---
title: Success and Failure in API Workflows
authors: phil
excerpt: Define precise success and failure criteria for each step in your Arazzo workflows, describing comprehensive error handling and branching logic.
date: 2025-01-30
---

- TOC
{:toc}

Some API workflow tools just check HTTP status codes for a 200 OK or a 500 server error and decide based on that! Real-world APIs are far more involved that. A 200 response might contain an empty result set. A 404 might be totally expected in a given scenario. Arazzo gives you fine-grained control over what "success" and "failure" actually mean for the use-case and work flow by allowing criteria to be defined for each step.

```yaml
- stepId: search
  operationId: $sourceDescriptions.api.searchTrips
  successCriteria:
    - condition: $statusCode == 200
    - type: jsonpath
      context: $response.body
      condition: $.trips[0] != null
  failureCriteria:
    - condition: $statusCode == 404
```

Sometimes HTTP says might say "success", but the business logic says "nope!" so it's helpful to not rely entirely on status checks. Imagine a search API that returns 200 OK, but with zero results. Or an inventory check that returns 200 with `{"available": false}`. These need explicit criteria because it could be a success or a failure depending on the context of that workflow.

Here are a few things we might want to check:

- The response contains the data you expected.
- Specific fields have the right values.
- Arrays have at least one item (or exactly N items).
- Headers indicate proper caching or rate limiting.
- The response structure matches your schema.

Both the success and failure criteria are arrays of checks that work in in the same way, using the same criteria objects.

## Criteria Object

Every one of these conditions must pass for the step to be considered successful, making it an `AND` operation, not an `OR`.

```yaml
steps:
- stepId: exampleStep
  operationId: $sourceDescriptions.api.exampleOperation

  successCriteria:
    - condition: $statusCode == 200
    - condition: $response.body.results != null

  failureCriteria:
    - context: $response.body
      condition: $.errors[0] != null
      type: jsonpath
```

**condition (required)**

A boolean expression that must evaluate to true.

```yaml
successCriteria:
  - condition: $statusCode == 200
  - condition: $response.body.available == true
```

**type (optional)**

Type of criterion (defaults to `simple`):

- `simple` - Basic condition evaluation.
- `regex` - Regular expression matching.
- `jsonpath` - JSONPath query.

**context (required when type == regex or jsonpath)**

Which bit of the data are we evaluating. This could be `$response.body`, `$response.headers`, or any other valid [runtime expressions](_guides/arazzo/specification/v1.0/working-with-arazzo/runtime-expressions.md).

```yaml
successCriteria:
  - condition: $response.body.status == 'confirmed'
```

## Success and Failure Actions

Once criteria determine whether a step has succeeded or failed, what happens next? By default, the workflow continues to the next sequential step. But we can also define `onSuccess` and `onFailure` actions to branch the workflow based on outcomes.

Actions can be defined inline or referenced from [reusable components](_guides/arazzo/specification/v1.0/understanding-structure/components-and-references.md) to maintain consistency across workflows.

### Action Types

Both `onSuccess` and `onFailure` use the same action types. Each action has a `name`, a `type` (what to do), optional `criteria` which is a list of assertions to see if this action should be executed, and type-specific fields.

**type: end**

Stops the workflow immediately.

```yaml
onFailure:
  - name: criticalError
    type: end
    criteria:
      - condition: $statusCode >= 500
```

**type: goto**

Jumps to another step (perfect for error handlers or alternative paths).

```yaml
onFailure:
  - name: tryAlternative
    type: goto
    stepId: alternativeBookingMethod
    criteria:
      - condition: $statusCode == 429  # Too Many Requests

onSuccess:
  - name: continueToPayment
    type: goto
    stepId: processPayment
    criteria:
      - condition: $response.body.requiresPayment == true
```

**type: retry**

Tries the same step again (with optional delays and limits).

```yaml
onFailure:
  - name: retryOnTimeout
    type: retry
    retryAfter: 5  # seconds
    retryLimit: 3  # attempts
    criteria:
      - condition: $statusCode == 408  # Request Timeout
```

### Invoking Workflows on Actions

Sometimes a single step can't handle the recovery or next phase. The `workflowId` field lets actions invoke other workflows for complex scenarios:

```yaml
onFailure:
  # Expired token - refresh and retry
  - name: refreshExpiredToken
    type: retry
    workflowId: refreshTokenWorkflow
    retryAfter: 1
    retryLimit: 3
    criteria:
      - condition: $statusCode == 401
      - condition: $response.body.errorCode == 'TOKEN_EXPIRED'
  
  # Primary API down - switch to backup
  - name: useBackupApi
    type: goto
    workflowId: backupApiSearchWorkflow
    stepId: searchWithBackup
    criteria:
      - condition: $statusCode >= 500
```

This is particularly useful for:

- **Token refresh flows** - When authentication expires, invoke a workflow to get new credentials and retry.
- **Fallback API chains** - Try alternative APIs or services when primary ones fail.
- **Data synchronization** - Trigger reconciliation workflows when data inconsistencies are detected.
- **Escalation procedures** - Invoke notification and logging workflows for critical errors.

The workflow will runs completely when it's invoked, then returns to the current step to continue processing based on the result.

## Examples 

Let's rattle through a few more complete scenarios to see how it all fits together.

### Branching on Search Results

A more advanced workflow has been created for the Train Travel API which allows folks to search for train trips, and based on various critera it will either look for better trips or go ahead and book.

```yaml
workflows:
  - workflowId: searchAndBookTrips
    summary: Search for train trips and handle different results
    inputs:
      type: object
      properties:
        origin:
          type: string
        destination:
          type: string
        departureDate:
          type: string
        maxPrice:
          type: number
    
    steps:
      - stepId: searchTrips
        operationId: $sourceDescriptions.trainApi.searchTrips
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
        
        successCriteria:
          - condition: $statusCode == 200
          - type: jsonpath
            context: $response.body
            condition: $.trips[0] != null

        onSuccess:
          # Found affordable trips - proceed to booking
          - name: foundAffordableTrips
            type: goto
            stepId: selectTrip
            criteria:
              - type: jsonpath
                context: $response.body
                condition: $.trips[?(@.price <= $inputs.maxPrice)][0] != null
          
          # Only expensive trips - offer alternatives
          - name: onlyExpensiveTrips
            type: goto
            stepId: suggestAlternativeDates
            criteria:
              - type: jsonpath
                context: $response.body
                condition: $.trips[?(@.price <= $inputs.maxPrice)][0] == null
        
        onFailure:
          # No trips available - try different dates
          - name: noTripsAvailable
            type: goto
            stepId: searchAlternativeDates
            criteria:
              - type: jsonpath
                context: $response.body
                condition: $.trips[0] == null
          
          # API error - retry
          - name: apiError
            type: retry
            retryAfter: 5
            retryLimit: 3
            criteria:
              - condition: $statusCode >= 500
      
      - stepId: selectTrip
        # ... trip selection logic
      
      - stepId: suggestAlternativeDates
        # ... alternative date suggestions
      
      - stepId: searchAlternativeDates
        # ... search with different dates
```

This workflow branches based on the search results:

- **Affordable trips exist** - Go to trip selection.
- **Only expensive trips** - Suggest alternative dates.
- **No trips at all** - Also suggest alternative dates.
- **API failure** - Retry the search.

## Example: Branching on Booking Status

Once a trip is selected, creating the booking might succeed in different ways:

```yaml
workflows:
  - workflowId: createTripBooking
    summary: Create booking with different confirmation flows
    inputs:
      type: object
      properties:
        passengers:
          type: array
    
    steps:
      - stepId: createBooking
        operationId: $sourceDescriptions.trainApi.createBooking
        requestBody:
          payload:
            tripId: $steps.selectTrip.outputs.selectedTripId
            passengers: $inputs.passengers
        
        successCriteria:
          - condition: $statusCode == 201
          - condition: $response.body.id != null
        
        onSuccess:
          # Booking confirmed immediately - skip to payment
          - name: instantConfirmation
            type: goto
            stepId: processPayment
            criteria:
              - condition: $response.body.status == 'confirmed'
          
          # Pending confirmation - wait for availability check
          - name: pendingConfirmation
            type: goto
            stepId: pollBookingStatus
            criteria:
              - condition: $response.body.status == 'pending'
          
          # Free trip (promotional) - skip payment
          - name: freeTrip
            type: goto
            stepId: sendConfirmationEmail
            criteria:
              - condition: $response.body.totalPrice == 0
        
        onFailure:
          # Seats sold out - offer alternative trips
          - name: seatsUnavailable
            type: goto
            stepId: findAlternativeTrips
            criteria:
              - condition: $statusCode == 409
              - condition: $response.body.errorCode == 'SEATS_UNAVAILABLE'
          
          # Invalid passenger data - return to form
          - name: invalidPassengerData
            type: goto
            stepId: notifyValidationError
            criteria:
              - condition: $statusCode == 400
              - condition: $response.body.errorCode == 'INVALID_PASSENGER_DATA'
      
      - stepId: processPayment
        # ... payment processing
      
      - stepId: pollBookingStatus
        # ... poll for booking confirmation
      
      - stepId: sendConfirmationEmail
        # ... send confirmation
      
      - stepId: findAlternativeTrips
        # ... find other available trips
      
      - stepId: notifyValidationError
        # ... notify about validation issues
```

## Example: Multi-Passenger Validation

When handling multiple passengers, validate all requirements before proceeding:

```yaml
workflows:
  - workflowId: validateTripPassengers
    summary: Validate passenger data with different requirements
    inputs:
      type: object
      properties:
        passengers:
          type: array
    
    steps:
      - stepId: validatePassengers
        operationId: $sourceDescriptions.trainApi.validatePassengerData
        requestBody:
          payload:
            passengers: $inputs.passengers
            tripId: $steps.selectTrip.outputs.selectedTripId
        
        successCriteria:
          - condition: $statusCode == 200
          - type: jsonpath
            context: $response.body
            condition: $.passengers[?(@.valid == false)][0] == null
        
        onSuccess:
          # All passengers valid - proceed
          - name: allPassengersValid
            type: goto
            stepId: createBooking
        
        onFailure:
          # Child without guardian - request guardian details
          - name: childWithoutGuardian
            type: goto
            stepId: requestGuardianInfo
            criteria:
              - type: jsonpath
                context: $response.body
                condition: $.passengers[?(@.age < 16 && @.guardianId == null)][0] != null
          
          # Senior discount requires ID verification
          - name: seniorRequiresVerification
            type: goto
            stepId: verifySeniorDiscount
            criteria:
              - type: jsonpath
                context: $response.body
                condition: $.passengers[?(@.age >= 65 && @.idVerified == false)][0] != null
          
          # Invalid passport for international trip
          - name: invalidPassport
            type: goto
            stepId: requestValidPassport
            criteria:
              - condition: $response.body.tripType == 'international'
              - type: jsonpath
                context: $response.body
                condition: $.passengers[?(@.passportValid == false)][0] != null
        
      - stepId: createBooking
        # ... proceed with booking
      
      - stepId: requestGuardianInfo
        # ... request guardian details for minors
      
      - stepId: verifySeniorDiscount
        # ... verify senior citizen ID
      
      - stepId: requestValidPassport
        # ... request valid passport for international travel
```


### Validate Business Rules, Not Just HTTP

The goal is to ensure the workflow meets business needs, not just technical success at the transportation level. Get business logic written down, and if the logic changes that's ok, the workflow can be updated to match.

```yaml
# Good - checks business requirements
successCriteria:
  - condition: $statusCode == 200
  - condition: $response.body.status == 'confirmed'
  - condition: $response.body.seats != null
  - condition: $response.body.totalPrice <= $inputs.maxBudget

# Insufficient - only checks HTTP
successCriteria:
  - condition: $statusCode == 200
```

### Reusable Actions with Components

For actions used across multiple steps or workflows, define them in the components section:

```yaml
components:
  failureActions:
    # Reusable token refresh
    refreshToken:
      name: refreshExpiredToken
      type: retry
      workflowId: refreshTokenWorkflow
      retryAfter: 1
      retryLimit: 3
      criteria:
        - condition: $statusCode == 401
    
    # Reusable backup API fallback
    useBackupSystem:
      name: switchToBackupApi
      type: goto
      workflowId: backupSystemWorkflow
      stepId: retryWithBackup
      criteria:
        - condition: $statusCode >= 500
        - condition: $response.headers.retry-after == null
```

Then reference them in your steps:

```yaml
- stepId: searchTrips
  operationId: $sourceDescriptions.trainApi.searchTrips
  onFailure:
    - reference: $components.failureActions.refreshToken
    - reference: $components.failureActions.useBackupSystem
```

This keeps your workflows clean and ensures consistent error handling across your entire API workflow description.
