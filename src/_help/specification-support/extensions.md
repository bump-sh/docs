---
Title: Specification extensions
---

- TOC
{:toc}

These additional properties are not specified by the OpenAPI or the AsyncAPI specifications but can help you customize your documentation content. All those properties start with the x- naming convention to be identified as “eXternal” from the OpenAPI or AsyncAPI specification.

## Add topics to your documentation (`x-topics`)

This vendor-specific property we created helps to add more context paragraphs in your generated documentation. Find out more in our [dedicated section](/help/enhance-documentation-content/topics/).

## Custom code sample examples (`x-codeSamples`)

> This vendor extension is only available for OpenAPI documents for now
{: .info}

We added a custom property, not supported by OpenAPI, so you can add your own code samples in one or more programming languages to your documentation. Find out more in our [dedicated section](/help/specification-support/doc-code-samples).

## Add badges to your endpoints/operations (`x-state`) 

This custom property can be added to an operation/endpoint to display a contextual badge in the documentation.
More information on its usage is available in the [dedicated section](/help/specification-support/doc-badges).

## Expose your beta features (`x-beta`)

This custom property allows you to identify some components of your documentation as beta. Find out more in our [dedicated section](/help/specification-support/doc-badges/#beta).

## Get feedback from users (`x-feedbackLink`)

This custom property allows you to add a button to your documentation that enables you to collect feedback from your users. Find out more in our [dedicated section](/help/publish-documentation/feedback).

## Add links to external resources (`x-externalLinks`)

This custom property lets you add links to the navigation bar of your documentation, redirecting users to external resources. Find out more in our [dedicated section](/help/publish-documentation/external-links)