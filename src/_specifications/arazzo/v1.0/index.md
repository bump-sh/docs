---
title: "Arazzo Specification Complete Guide"
excerpt: "The complete guide to the Arazzo specification. Learn how to describe API workflows, chain API calls together, handle errors, and create reusable components with the open standard from the OpenAPI Initiative."
date: 2025-01-23
display_authors: false
---

Arazzo is an open standard from the [OpenAPI Initiative](https://www.openapis.org/) for describing API workflows. While [OpenAPI](/openapi/v3.2/) documents what each endpoint does individually, Arazzo documents how endpoints work together to accomplish real tasks like booking a trip, processing a payment, or onboarding a user.

A single Arazzo document can power documentation, integration tests, production monitoring, and automation. This guide covers every aspect of the Arazzo 1.0 specification.

## Introduction

- [**What is Arazzo?**](/arazzo/v1.0/introduction/what-is-arazzo/): what problems Arazzo solves, how it compares to previous approaches (written docs, sample code, proprietary tools), and what a workflow document looks like in practice.
- [**History and evolution**](/arazzo/v1.0/introduction/history/): from the first OpenAPI community discussions in 2021 to the official 1.0.0 release in 2024, and what is planned for version 1.1.
- [**Benefits of using Arazzo**](/arazzo/v1.0/introduction/benefits/): how Arazzo improves documentation, testing, governance, monitoring, and cross-API orchestration, with concrete examples for each use case.

## Understanding Arazzo structure

Every Arazzo document is built from five building blocks: a version declaration, metadata, source descriptions, workflows, and optional reusable components.

- [**Basic structure**](/arazzo/v1.0/understanding-structure/basic-structure/): the top-level anatomy of an Arazzo document, with the `arazzo`, `info`, `sourceDescriptions`, `workflows`, and `components` sections.
- [**Defining sources**](/arazzo/v1.0/understanding-structure/defining-sources/): how to reference OpenAPI documents and other Arazzo files, enable cross-API orchestration across multiple services, and compose workflows from separate files.
- [**Workflows**](/arazzo/v1.0/understanding-structure/workflows/): designing workflow sequences with typed inputs (JSON Schema), computed outputs, global parameters, and dependency chains between workflows.
- [**Steps, inputs, and outputs**](/arazzo/v1.0/understanding-structure/steps-inputs-outputs/): how each step references an API operation, passes parameters and request bodies, extracts values from responses with JSON Pointer, and feeds data to the next step.
- [**Success and failure**](/arazzo/v1.0/understanding-structure/success-and-failure/): defining business-level success criteria beyond HTTP status codes, branching with `goto`, retrying with backoff, invoking recovery workflows, and using JSONPath for complex validations.
- [**Components and references**](/arazzo/v1.0/understanding-structure/components-and-references/): extracting repeated patterns (auth headers, retry logic, pagination inputs) into reusable definitions and referencing them across workflows.

## Working with Arazzo

- [**Runtime expressions**](/arazzo/v1.0/working-with-arazzo/runtime-expressions/): the `$inputs`, `$steps`, `$response`, and `$statusCode` expression syntax that powers data flow between steps. Covers JSON Pointer notation, comparison and logical operators, string interpolation, null safety, and JSONPath for advanced conditions.

## Quick reference

- [**The Cheat Sheet**](/arazzo/v1.0/cheatsheet/): a downloadable one-page reference of the entire specification for quick lookup during development.
