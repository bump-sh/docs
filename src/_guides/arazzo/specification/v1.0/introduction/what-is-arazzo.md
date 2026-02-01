---
title: What is Arazzo?
authors: phil
excerpt: Arazzo is the standard format for describing API workflows - sequences of API calls that work together to accomplish complex tasks, with built-in error handling and state management.
date: 2025-01-23
---

- TOC
{:toc}

Arazzo (the "Arazzo Specification") is a standard format for describing API workflows. Managed by the [OpenAPI Initiative](https://www.openapis.org/) (OAI), the folks that brought you OpenAPI. Arazzo provides a way to define sequences of API calls that work together to accomplish workflows.

While OpenAPI describes what an API can do in any given interaction, Arazzo describes how those interactions can be chained together to achieve real-world goals, like finding the right train ticket, picking a seat, and booking it.

## Previous Approaches to API Workflows

For years OpenAPI has made "API reference documentation" considerably better, going beyond the hand-crafted written stuff that rarely had any useful details and was usually out of date. API clients are able to integrate with APIs much quicker, and it's helped at every stage of the API lifecycle from design, testing, monitoring, and back to designing new versions again. 

This API reference documentation provides detailed information about specific bits of the API's interface, like all the endpoints, the parameters, request & response bodies, status codes, content types, etc. That's really handy stuff, even more so if there are no SDKs built for an API, but it does not help anyone understand how to actually use these API endpoints together to accomplish a real task.

Some HTTP APIs are treated like a data source, with CRUD operations being completely independent of each other, but REST APIs are most commonly used to define workflows. Using our [Train Travel API](https://bump.sh/bump-examples/doc/train-travel-api/) example, a typical user journey to book a ticket could involve a whole bunch of steps:

1. Search for stations in a particular area.
2. See available trips between origin and destination stations, on a certain date, and with a dog!
3. Pick a seat on that train.
4. Create a booking for that trip and seat.
5. Pay for the booking.
6. Get a ticket issued for the paid booking.

Each step depends on data from previous steps (like available trips depend on the chosen stations and date), and there are many ways things can go wrong (no trips found, seat already booked, payment failed, etc).

Until Arazzo, most of the advice for teams maintaining API documentation was to document these workflows using one of the following approaches:

- **Written documentation** - Technical writers will create written explanations with examples of workflows, but these explanations and examples can quickly become outdated, and they cannot be automatically tested.
- **Sample codebases** - These are language specific which can cause confusion for developers not familiar with them, and cannot be reused for other automated workflows.
- **Proprietary implementations** - Tools like Postman and Readme offer proprietary ways to handle this which can lead to vendor lock-in, limiting integration potential, and are limited in expressing complex logic.
- **Custom scripts** - Useful for testing but not standardized or portable.

All of these approaches will partially solve the problem for some aspect of what various teams need, but just like OpenAPI solved the problem of API contracts being rewritten over and over in different formats for different documentation, testing, and governance tools, a solution was needed to standardize API workflow documentation and reduce the repetition that was so prone to mistakes and mismatches.

## Introducing Arazzo

Arazzo was designed to solve all these problems by creating a standardized, machine-readable, vendor-neutral description format to describe API workflows. Instead of picking a single problem sector (e.g. documentation) they brought in authors and contributors from a variety of backgrounds to create a specification that can be used for any part of the API lifecycle.

Much like OpenAPI did for endpoint documentation, Arazzo standardizes how we describe the multi-step journeys so that tooling can parse them, validate them, and even visualize them. It also fits neatly into the ecosystem you already have, because Arazzo doesn’t replace OpenAPI: it extends it by using OpenAPI documents as sources for the API operations your workflows call.

```yaml
arazzo: 1.0.0
info:
  title: Train Travel API - Book & Pay
  version: 1.0.0
sourceDescriptions:
  - name: train-travel
    url: ./openapi.yaml
    type: openapi
workflows:
  - ...
```

These workflow steps reference "operations" (API calls) from those sources.

```yaml
workflows:
  - workflowId: book-trip
    summary: Find train trips to book between origin and destination stations.
    inputs:
      $ref: "#/components/inputs/book_trip_input"
    steps:     
      - stepId: book-trip
        operationId: create-booking
```

To turn this into brilliant documentation it needs some descriptions, which tools can use to generate user-friendly guides. Beyond that, the best part of this workflow documentation is visualizing the messiest part of real integrations: carrying values from one step to the next. 

Arazzo is designed to allow inputs and outputs from each step to be clearly described and passed between each other, then branching based on what happened, deciding success or failure based on more than "did I get a 2xx?", and handling retries or recovery paths when something goes wrong.

Because the whole thing is structured, the workflows can be executed. That means the same file can power testing and automation, not just documentation. And once the documentation is executable there is no way for documentation and implementation to drift out of sync, because you can run the workflows as tests to verify everything still works as expected on every single pull request or commit to main branch.

## What Arazzo Looks Like

Here's a simple example of an Arazzo workflow for searching and booking a train:

```yaml
arazzo: 1.0.1
info:
  version: 1.0.0

sourceDescriptions:
  - name: train-travel
    url: ./openapi.yaml
    type: openapi

workflows:
  - workflowId: book-train-ticket
    summary: Search for and book a train ticket
    steps:
      - stepId: search
        operationId: search-trips
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
        operationId: create-booking
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

This workflow defines two steps: searching for trips and creating a booking. It specifies how to pass parameters and handle outputs between steps, so it's clear which bits come from where, and clearly defining what success looks like: e.g: this API uses a 201 Created status code, where some poorly designed APIs might use 200 OK for everything, or a 202 Accepted for async operations.

This clarity allows tools to generate accurate documentation, run tests, and even automate these workflows reliably.

## Who Benefits from Arazzo?

- **API Designers** - Document intended usage patterns during the design phase
- **Backend Developers** - Validate that implementations support the designed workflows
- **QA Engineers** - Use workflows as integration test suites
- **Technical Writers** - Generate accurate workflow documentation automatically
- **API Consumers** - Understand how to accomplish real tasks, not just individual calls
- **DevOps Teams** - Use workflows for smoke tests and monitoring

Arazzo brings the same revolution to API workflow documentation that OpenAPI brought to API reference documentation: a single source of truth that serves multiple purposes throughout the API lifecycle.
