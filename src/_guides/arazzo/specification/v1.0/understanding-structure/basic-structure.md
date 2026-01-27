---
title: Basic Structure
authors: phil
excerpt: Learn your way around an Arazzo document for describing HTTP workflows.
date: 2025-01-27
---

- TOC
{:toc}

The [Arazzo Specification](https://spec.openapis.org/arazzo/v1.0.1.html) defines how exactly an Arazzo document should be laid out, and understanding this structure is essential for creating effective HTTP workflow documentation. 

## The Arazzo Document

An Arazzo document is written as YAML or JSON. In a simple world you would typically name it `arazzo.yaml` or `arazzo.json`, but you can use any name you prefer. 

Let's go through the main sections in an Arazzo document:

1. **Arazzo Version**
2. **Info Object**
3. **Source Descriptions**
4. **Workflows**
5. **Components**

Let's examine each of these in detail.

## 1. Arazzo Version

The root of every Arazzo document must specify the version of the Arazzo Specification being used:

```yaml
arazzo: 1.0.1
```

The `arazzo` field is required, and tells tooling which version of the specification to use when parsing the document. The latest version at time of writing is `1.0.1`, but there is no semantic difference between `1.0.0` and `1.0.1`. It is just good practice to use the latest patch version.

## 2. Info Object

The `info` object provides metadata about the workflow document:

```yaml
info:
  title: Train Travel Workflows
  version: 1.0.0
  summary: Common workflows for the train ticket API
  description: |
    Workflows for working with the Train Travel API, covering
    searching for trips, making bookings, and managing tickets.
```

**Required fields:**

- `title` - A human-readable name for your workflow document
- `version` - The version of this workflow document (independent of API version or Arazzo spec version)

**Optional fields:**

- `summary` - A short summary of what these workflows accomplish
- `description` - A longer description, supports CommonMark (Markdown)

The `info` object is similar to the OpenAPI `info` object, but describes the workflows rather than an API.

## 3. Source Descriptions

The `sourceDescriptions` array references the API definitions that workflows will use, which will often just be a single `openapi` document but could be multiple APIs or even other Arazzo documents.

```yaml
sourceDescriptions:
  - name: trainApi
    url: https://api.example.com/openapi.yaml
    type: openapi
  
  - name: paymentApi
    url: ./payment-api.json
    type: openapi
```

Each source description has the following fields:

- `name` - An identifier used to reference APIs when multiple sources are used in a workflow. Some people prefer camelCase (e.g.; `trainApi`), because these will be used in runtime expressions later on.
- `url` - Location of the API description, could be a URL or relative file path.
- `type` - The type of API description (`openapi` to reference an API, or `arazzo` to reference another Arazzo document).

**Learn more about [source descriptions](_guides/arazzo/specification/v1.0/understanding-structure/defining-sources.md).**

## 4. Workflows

The `workflows` array is where the magic really happens. Each workflow describes a sequence of steps to accomplish a given task:

```yaml
workflows:
  - workflowId: book-train-ticket
    summary: Complete workflow for booking a train ticket
    description: Searches for trips, selects one, and creates a booking
    
    inputs:
      type: object
      properties:
        origin:
          type: string
        destination:
          type: string
        passengers:
          type: array
    
    steps:
      - stepId: search
        description: Search for available trips
        operationId: $sourceDescriptions.trainApi.searchTrips
        parameters:
          - name: origin
            in: query
            value: $inputs.origin
          - name: destination
            in: query
            value: $inputs.destination
        
        successCriteria:
          - condition: $statusCode == 200
        
        outputs:
          tripId: $response.body.trips[0].id
      
      - stepId: createBooking
        description: Create booking for the selected trip
        operationId: $sourceDescriptions.trainApi.createBooking
        requestBody:
          contentType: application/json
          payload:
            tripId: $steps.search.outputs.tripId
            passengers: $inputs.passengers
        
        successCriteria:
          - condition: $statusCode == 201
        
        outputs:
          bookingId: $response.body.id
```

Each workflow contains:

**Workflow Metadata:**

- `workflowId` (**required**) - Unique identifier for this workflow.
- `summary` - A shorter description (used as a title).
- `description` - Longer form description, with CommonMark (Markdown) support.
- `inputs` - JSON Schema defining what inputs the workflow accepts.
- `outputs` - What outputs the workflow produces.

**Steps Array:**

- `stepId` (**required**) - Unique identifier for this step within the workflow.
- `operationId` - Reference to an API operation to call.
- `parameters` - Parameters to pass to the operation.
- `requestBody` - Request body to send.
- `successCriteria` - Conditions that define success.
- `onSuccess` / `onFailure` - Actions to take based on results.
- `outputs` - Values to extract from the response.

**Learn more about [Workflows](_guides/arazzo/specification/v1.0/understanding-structure/workflows.md).**

## 5. Components

In order to cut down on repetition - which is tedious and to keep up to date, and a vector for making mistakes - commonly used chunks of Arazzo can be defined in the `components` object. 

Components can define:

- `inputs` - Reusable input schemas.
- `parameters` - Reusable parameters.
- `successActions` - Reusable success actions.
- `failureActions` - Reusable failure actions.

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
  
  parameters:
    authHeader:
      name: Authorization
      in: header
      value: Bearer $inputs.token
  
  successActions:
    logSuccess:
      type: end
      name: logSuccess
  
  failureActions:
    logFailure:
      type: end
      name: logFailure
```

**Learn more about [components and referencing](_guides/arazzo/specification/v1.0/understanding-structure/components-and-references.md).**

## Putting It All Together

To see how this structure all works together, here's a complete (but very minimal) Arazzo document showing the key bits, including a couple of reusable components:

```yaml
arazzo: 1.0.1

info:
  title: Train Travel Workflows
  version: 1.0.0
  summary: Common workflows for the train ticket API

sourceDescriptions:
  - name: trainApi
    url: https://api.example.com/openapi.yaml
    type: openapi

components:
  inputs:
    bookTrainTicketInput:
      type: object
      required: [origin, destination, passengers, token]
      properties:
        origin:
          type: string
        destination:
          type: string
        passengers:
          type: array
        token:
          type: string

workflows:
  - workflowId: book-train-ticket
    summary: Complete workflow for booking a train ticket
    
    inputs:
      $ref: '#/components/inputs/bookTrainTicketInput'

    steps:
      - stepId: search
        description: Search for available trips
        operationId: $sourceDescriptions.trainApi.searchTrips
        parameters:
          - name: origin
            in: query
            value: $inputs.origin
          - name: destination
            in: query
            value: $inputs.destination
        successCriteria:
          - condition: $statusCode == 200

        outputs:
          tripId: $response.body.trips[0].id

      - stepId: createBooking
        description: Create booking for the selected trip
        operationId: $sourceDescriptions.trainApi.createBooking
        requestBody:
          contentType: application/json
          payload:
            tripId: $steps.search.outputs.tripId
            passengers: $inputs.passengers
        successCriteria:
          - condition: $statusCode == 201

        outputs:
          bookingId: $response.body.id
```

## Next Steps

Now that you understand the basic structure, if you'd like to learn more about any of the sections in particular you can take a look at these guides.

- [Defining Sources](_guides/arazzo/specification/v1.0/understanding-structure/defining-sources.md) - How to reference API definitions
- [Workflows](_guides/arazzo/specification/v1.0/understanding-structure/workflows.md) - Creating workflow sequences  
- [Steps, Inputs, and Outputs](_guides/arazzo/specification/v1.0/understanding-structure/steps-inputs-outputs.md) - Working with data flow
- [Success and Failure](_guides/arazzo/specification/v1.0/understanding-structure/success-and-failure.md) - Handling outcomes
- [Components & References](_guides/arazzo/specification/v1.0/understanding-structure/components-and-references.md) - Reusing definitions
