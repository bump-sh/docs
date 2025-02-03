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

## Expose your beta features (`x-beta`)

This custom property allows you to identify some components of your
documentation as beta. Find out more in our [dedicated
section](/help/specification-support/doc-beta).

## Give precision to the state of your features (`x-state`) 

This custom property can be added inside an operation or a property to identify it with a custom tag.
The `x-state` property is a string.

### Example usage

Here under is an example of an operation and a property with a `x-state`.

```yaml
paths:
  /diffs:
    post:
      tags: ["x-state"]
      description: Create a diff between any two given API definitions
      x-state: Technical preview # x-state flag at the operation level
      requestBody:
        description: The diff creation request object
        content:
          application/json:
            schema:
              type: object
              properties:
                url:
                  type: string
                  format: uri
                  x-state: Still unstable # x-state flag at the object property level
                  description: |
                    **Required** if `definition` is not present.
                    Current definition URL. It should be accessible through HTTP by Bump.sh servers.
```

Adding or removing this property is a structural change.
When combined with the `x-beta`, the `x-state` replaces its value, but keeps the beta behavior: a change in a beta component is never identified as a breaking change.

The documentation displays custom tags on the operation and property:

![doc-beta.png](/images/help/doc-x-state.png)


## Get feedback from users (`x-feedbackLink`)

This custom property allows you to add a button to your documentation that enables you to collect feedback from your users. Find out more in our [dedicated
section](/help/publish-documentation/feedback).