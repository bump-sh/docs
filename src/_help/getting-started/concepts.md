---
title: Main concepts
---

- TOC
{:toc}

Before we proceed further, we wanted to share some vocabulary to clarify what we are talking about throughout this documentation.<br>
The terminology used here aims to be as accurate as possible, but you may encounter different terms elsewhere. We have chosen to use the most common and meaningful terms.

## API definition

An API definition is the representation of an API written in compliance with an existing specification format.<br>
It is sometimes referred to as an API schema, API contract, or even API specification.

As of today, Bump.sh supports the following specifications: Swagger, [OpenAPI](https://spec.openapis.org/oas/v3.1.0), and [AsyncAPI](https://www.asyncapi.com/docs).<br>
Each standard has its prerequisites, and while your API definition doesn't need to be 100% compliant with them to be used on Bump.sh, it should generally follow their structure.

We provide a detailed introduction to API definitions [through this guide](https://docs.bump.sh/guides/api-basics/api-contracts-extended-introduction/).

## API contract

An API contract represents the use of an API definition when it defines an agreement, a contract between API developers, its consumers, how it is used, and the tools that surround it.

## API document

An API document refers to the file containing an API definition.<br>
Bump.sh supports YAML and JSON formats for API documents.

## Specification

Specifications are the standards that define a format for describing an API, such as OpenAPI or AsyncAPI. These standards outline a set of elements and rules to follow when writing an API definition.

To learn more about the supported specifications, we have written dedicated guides on [OpenAPI](https://docs.bump.sh/guides/openapi/what-is-openapi/) and [AsyncAPI](https://docs.bump.sh/guides/asyncapi/what-is-asyncapi/).

## Deploy

During the upload of an API document, Bump.sh begins processing it to prepare for publication. During this step, various checks are performed, including ensuring that the file is functional.<br>
This step is referred to as deployment.

## Release

Once the deployment is completed, the release allows the publication of its results: the documentation is updated, the changelog reflects the changes, and notifications, if configured, are sent out.

## API change

An API change refers to a change in the structure of an API (rather than a change in documentation) after the deployment of an API definition. It helps identify modifications that may impact API consumers.

## Changelog

After each deployment, Bump.sh updates the documentation's changelog, listing all API changes between the current deployment and the previous one. If the "Track all changes" option is enabled, the changelog will also display changes in the documentation.