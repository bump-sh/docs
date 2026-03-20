---
title: Important concepts
---

- TOC
{:toc}

Before we proceed further, we wanted to share some vocabulary to clarify what we are talking about throughout this documentation.
The terminology used here aims to be as accurate as possible, but you may encounter different terms elsewhere. We have chosen to use the most common and meaningful terms.

![Bump.sh global workflow including deploying, release and access management](/docs/images/help/bump-sh-global-workflow.png)

## Global concepts

### Specification

Specifications are the official standards used to describe, among other things:
- an API (OpenAPI, AsyncAPI, ...),
- an API workflow (Flower, Arazzo, ...).
These standards outline a set of elements and rules to follow when writing an API definition.

We support OpenAPI, AsyncAPI (up to 2.6), and Flower (our internal workflow specification). Arazzo will be supported soon. To learn more about the supported specifications, we have written dedicated guides on [OpenAPI](/guides/openapi) and [AsyncAPI](/guides/asyncapi/what-is-asyncapi/). We also made a guide on [Flower](/help/mcp-servers/specification-support/flower-support), our own workflow standard.

### Deployment

A deployment is the processing of an API or a workflow document by Bump.sh: after the upload, it validates the definition against its specification, analyses its content and either:
- makes it available on the MCP server, for a workflow document,
- prepares the [release](/help/publish-documentation/deploy-and-release-management/), for an API document.

## API documentation

### API definition

An API definition is the representation of an API written in compliance with an existing specification.
It is sometimes referred to as an API schema, API contract, or even [API specification](/help/getting-started/concepts/#specification) (which is something different).

As of today, Bump.sh supports the following specifications: [OpenAPI (Swagger)](https://spec.openapis.org/oas/latest.html), and [AsyncAPI](https://www.asyncapi.com/docs/reference/specification/v3.0.0).

We provide a detailed introduction to API definitions [through this guide](/guides/api-basics/api-contracts-extended-introduction/).

### API contract

An API contract represents the use of an API definition when it defines an agreement, a contract between API developers, its consumers, how it is used, and the tools that surround it.

### API document

An API document refers to the file containing an API definition.

### Release

The step following a successful deploy. During the [release](/help/publish-documentation/deploy-and-release-management/), the documentation is updated, the changelog reflects the related changes, and notifications, if configured, are sent out. The release step can be automatic, or manual.

### API change

An API change refers to a change in the structure of an API. After the release of an API definition, it is represented by a new entry in the [API changelog](/help/changes-management/changelog/).

### Breaking change

Breaking changes are the ones your API consumers should not miss and are highlighted in the changelog. Here is a non-exhaustive list of criteria that help us determine if a change is breaking or not:
- Renaming/Deleting an endpoint or operation
- Renaming/Deleting a property (body, parameters, etc...)
- Changing the "type" attribute of a property
- Removing polymorphism of a property
- Marking an existing property as required
- Add or delete a security requirement

### Changelog

After each deployment, Bump.sh updates the documentation's [changelog](/help/changes-management/changelog/), listing all API changes between the current deployment and the previous one. If the "Track all changes" option is enabled, the changelog will also display changes in the documentation.

## MCP servers

### MCP server

An MCP (Model Context Protocol) server makes your API workflows available to LLM-based applications and agents. It processes API workflow documents and handles the runtime execution of these workflows. The MCP standard is supported by many AI tools: adding an MCP server is often just a matter of pasting the server URL into the "Connectors" or "Tools" section of the AI app.

### Workflow

A workflow is a chain of multiple API calls designed to achieve specific business goals, rather than just providing a list of endpoints.

### Workflow definition

A workflow definition is the representation of an API workflow written in compliance with a workflow specification like Arazzo or Flower. It describes a sequence of API operations and the goal of this sequence, their dependencies, and the data flow between them (inputs and outputs).

### Workflow document

A workflow document refers to the file containing a workflow definition. These documents are deployed to Bump.sh where they're validated, processed, and made available on MCP servers for execution.