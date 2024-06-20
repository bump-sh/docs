---
title: API Contracts - an Extended Introduction
authors: Sooter Saalu
image: images/guides/api-contracts-extended-introduction.png
canonical_url: https://bump.sh/blog/api-contracts-extended-introduction
excerpt: This guide explains how API contracts can help your business, the best practices to follow, and gives some practical examples.
date: 2023-11-24
---

An API contract is a document that showcases how an API behaves and how it should be used.
This article is all about API contracts: how they can help your business, the best practices to follow, as well as some practical examples.

### Why Are API Contracts Important?

The purpose of an API contract is to ensure developers using the API can interact with it in a consistent and predictable manner.

A consistent API contract also helps standardize integration with other systems, reducing misunderstandings and errors.

It's a useful tool for promoting a shared understanding of your API, easing in changes, and assuring the users of your APIs stability and reliability.

Having a defined API contract helps streamline processes for both internal and external API users. When multiple external systems or teams are involved, a contract can help avoid misunderstandings and reduce the risk of API usage errors.

It’s also important in API-first design as downstream teams will often start building mocks of your API before the first version is actually live. Your API development team’s process is also improved with a contract in place, as there's a clear set of guidelines for how the API should behave.

API contracts can contribute to the security and dependability of the systems that use them. By specifying rules around how different systems should interact, API contracts can help prevent misuse of data and ensure that systems can recover gracefully from errors or failures. Good API contracts will also include details about authorization, request limits, and usage restrictions, which helps users avoid accidentally losing access.

Finally, almost any API that uses a strict contracting process will have better documentation than one that doesn’t. Often, API contracts are turned directly into documentation, making the lives of development teams much easier.

### What Are API Contracts ?

API contracts can take many forms, such as a document describing the interface, a formal specification written in a particular language, or a set of code examples illustrating how the API should be used; it can also be written in a combination of formats.

API Contracts often follow a preexisting specification like [OpenAPI](https://spec.openapis.org/oas/latest.html), [gRPC](https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md), [GraphQL](https://spec.graphql.org/October2021/), [AsyncAPI](https://www.asyncapi.com/docs/reference/specification/v2.0.0), or [Blueprint](https://apiblueprint.org/documentation/specification.html).

Using an established standard helps new developers working with your contract learn it faster and it helps your development team save time on creating and maintaining the contract. Most standard come with a set of tools and a publicly available community which gives them the advantage of almost always being better than coming up with your own API contract from scratch.
These contracts typically set out information such as the API's expected behavior, data formats, authorization and authentication processes, error handling, and limitations. Seeing how the contract changes over time can also help users understand changes to your API as new versions are released.

It may include details about the specific endpoints (i.e., URLs) that can be called, the parameters that can be passed to those endpoints, and the responses that will be returned. Some API contracts may also include information about authentication and authorization, error handling, and other details that are key to proper integration.

### What Should You Consider When Designing an API Contract?

Here are some basic concepts to keep in mind while designing your API contract:

* **Keep it simple, easy to understand, and consistent:** In most cases, you should use a predefined specification (as mentioned above) to help users learn and integrate your API into their applications more quickly while reducing the scope for misunderstandings or errors. A uniform vocabulary and style across the contract can also help developers identify what they need and quickly understand how to use the API.

* **Document all parts of the API:** This API contract will be a very good place for everyone interacting with your API to have a complete overview of it. The more it is exhaustive, the more they will be able to fully view and understand the structure of your API. Including elements such as inputs, outputs, error codes, etc. is enormously helpful in the implementation process. Examples are also beneficial as they offer a clear understanding of how the API works and how to incorporate it into applications.

* **Thoroughly test the API against the contract:** You should test the implementation of your API against the stated contract before release, and provide means of reporting changes - especially breaking ones - or inconsistencies as the API evolves. This means your contract should be in a format allowing your QA process to read and validate against it. Ideally, the testing process should be automated so your API can be validated during the [continuous integration](https://en.wikipedia.org/wiki/Continuous_integration) process each time changes are made.

## API Contracts: Best Practices

### Defining the Expected Behavior of the API

At a minimum, your API contract should showcase the expected behavior of your API and its endpoints as well as explore details about how an application will call the API. Here's an excerpt of an API contract showcasing the API behavior and the data you can get from it:

```
GET /weather

Input parameters:
- location (string): The location for which to retrieve weather information (e.g. "New York, NY")
- version (string): The version of the API to use (e.g. "v1", "v2")

Output:
- temperature (float): The current temperature in degrees Fahrenheit
- condition (string): A description of the current weather conditions (e.g. "sunny", "cloudy", "rainy")

Example usage:

GET /weather?location=New%20York,%20NY&version=v2

Output:
{
  "temperature": 72.5,
  "condition": "sunny"
}
```

[*Representation of the behavior of the API*]

Your contract should always provide details on how your users can utilize your API. This excerpt, for example, specifies that the API can be accessed using a GET request to the `/weather` endpoint and that it takes an input parameter, `location`, which is a string representing the location for which to retrieve weather information. The second input parameter, `version`, is also a string and represents the version of the API the user would like to interact with.

It also makes clear that the API returns a JSON object with two fields: temperature, which is a float representing the current temperature in degrees Fahrenheit, and condition, which is a string describing the current weather conditions.

### Specifying the Contract and API Version

It is common, on an API lifecycle, to see changes to the API behavior itself.  As an API grows, changes will be made to the current version of the API. The contract is a good place to communicate to your users and API consumers about the changes in your API and how to keep using your API service after the change applies.

If you need to make a breaking change or your API grows and changes so much that you have the need to release a new version of it, you will need to create a new contract. Each version of your API should possess its own. And ideally each version of the API has their own documentation.

Your contract should note which API version it services.
It should also display the API contract version, which can be different from your API version. For instance, in the OpenAPI spec, an [info.version](https://spec.openapis.org/oas/v3.1.0#fixed-fields-0) field is used to explicitly state the version or revision of the API contract in use.

```
info:
  description: "A simple API example."
  title: "Example"
  version: "1.2"
```
[*An example of how to specify the version according to the Open API spec*]

As your API contract and API versions change, you should ensure these are noted in your changelog or release notes. This helps users know when a breaking release is made and what they need to do to keep their implementation working.

### Document Data Formats, Limitations, and Restrictions

Your API contract should accurately document the peculiarities and formats of data that a user might receive from API calls. [Data normalization is notoriously difficult](https://medium.datadriveninvestor.com/why-data-normalization-is-still-a-huge-challenge-for-organizations-6e0d5f5721d), so you want to help your API’s users as much as possible by giving them clear descriptions of return types and input expectations.

It should also set out the limitations that the user should be aware of as they implement the API — for example, rate limits, availability schedules, and requirements for access to certain data. If these constraints are not clear it can be frustrating for users who suddenly hit unexpected limits.

## API Contract at the Age of Automation

Your API contract does not only allow you all the things listed above, it’s also a good piece to add in your automations.

A common practice is to have your unit tests results tested against the API contract. You can make your [CI](https://en.wikipedia.org/wiki/Continuous_integration) process fail if the behavior of the API is not matching the expectations of the contract, and you can also analyze changes (including breaking changes) directly from the CI as well.

## What’s Next for your API Contract ?

Once you’ve defined your contract and implemented your API, you can use a tool to [create the user-facing documentation](https://bump.sh/api-documentation). In addition to documentation generation based on API contract documents, Bump.sh also integrates with your CI pipeline to ensure that changes to the API are noted in the documentation upon each release.

If you’re interested in learning more about API design or development, be sure to check out the [Bump.sh blog](https://bump.sh/blog), or [sign up for free](https://bump.sh/users/sign_up) to see how Bump.sh can help you generate user documentation more easily.
