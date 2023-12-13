---
title: %Important concepts
---

- TOC
{:toc}

Before we proceed further, we wanted to share some vocabulary to clarify what we are talking about throughout this documentation.<br>
The terminology used here aims to be as accurate as possible, but you may encounter different terms elsewhere. We have chosen to use the most common and meaningful terms.

## API definition

An API definition is the representation of an API written in compliance with an existing specification.<br>
It is sometimes referred to as an API schema, API contract, or even [API specification](/help/getting-started/concepts/#specification) (which is something different).

As of today, Bump.sh supports the following specifications: [OpenAPI (Swagger)](https://spec.openapis.org/oas/latest.html), and [AsyncAPI](https://www.asyncapi.com/docs/reference/specification/v3.0.0).<br>

We provide a detailed introduction to API definitions [through this guide](https://docs.bump.sh/guides/api-basics/api-contracts-extended-introduction/).

## API contract

An API contract represents the use of an API definition when it defines an agreement, a contract between API developers, its consumers, how it is used, and the tools that surround it.

## API document

An API document refers to the file containing an API definition.<br>

## Specification

Specifications are the official standards that define a format for describing an API, such as OpenAPI or AsyncAPI. These standards outline a set of elements and rules to follow when writing an API definition.

To learn more about the supported specifications, we have written dedicated guides on [OpenAPI](https://docs.bump.sh/guides/openapi/what-is-openapi/) and [AsyncAPI](https://docs.bump.sh/guides/asyncapi/what-is-asyncapi/).

## Deployment

A deployment is the processing of an API document by Bump.sh: after the upload, it validates the definition against its specification, analyses its content and prepares the [release](/help/publish-documentation/deploy-and-release-management/).

## Release

The step following a successful deploy. During the [release](/help/publish-documentation/deploy-and-release-management/), the documentation is updated, the changelog reflects the related changes, and notifications, if configured, are sent out. The release step can be automatic, or manual.

## API change

An API change refers to a change in the structure of an API. After the release of an API definition, it is represented by a new entry in the [API changelog](/help/changes-management/changelog/).

## Changelog

After each deployment, Bump.sh updates the documentation's [changelog](/help/changes-management/changelog/), listing all API changes between the current deployment and the previous one. If the "Track all changes" option is enabled, the changelog will also display changes in the documentation.