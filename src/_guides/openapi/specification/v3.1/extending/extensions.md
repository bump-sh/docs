---
title: Specification Extensions in OpenAPI
authors: phil
excerpt: Using extensions allows you to customize and integrate various tools through OpenAPI.
canonical_url: https://docs.bump.sh/guides/openapi/specification/v3.2/extending/extensions/
date: 2024-03-20
---

- TOC
{:toc}

OpenAPI v3.1 has a concept of [Specification Extensions](https://spec.openapis.org/oas/v3.1.0#specification-extensions) which are additional properties not specified by the OpenAPI specification. These are a chance to customize and integrate tools from documentation to API gateways, all hooking into the OpenAPI document and storing information important to them in the form of extra properties that will be ignored by other tooling. 

All those properties start with the `x-` naming convention to be identified as “eXternal” from the OpenAPI specification.

## Add a feedback link (`x-feedbackLink`)

The `x-feedbackLink` object can be added directly in the `info` object of your OpenAPI document. Find out more in our [dedicated section](/help/publish-documentation/feedback/).

## Add topics to your documentation (`x-topics`)

This vendor-specific property we created helps to add more context paragraphs in your generated documentation. Find out more in our [dedicated section](/help/enhance-documentation-content/topics/).

## Custom code sample examples (`x-codeSamples`)

> This vendor extension is only available for OpenAPI documents for now
{: .info}

We added a custom property, not supported by OpenAPI, so you can add your own code samples in one or more programming languages to your documentation. Find out more in our [dedicated section](/help/specification-support/doc-code-samples).

## Expose your beta features (`x-beta`)

This custom property allows you to identify some components of your
documentation as beta. Find out more in our [dedicated section](/help/specification-support/doc-beta).
