---
title: The Elements of Great API Documentation
authors: james
canonical_url: 
excerpt: Let’s explore the different types of API documentation and the role each has to play in helping a developer become proficient in consuming your API. 
---

When you think of API documentation, what comes to mind? More than likely, you think of reference documentation that describes how to use an API, including the operations and request/response details. This kind of reference documentation leverages the OpenAPI Specification (formerly known as Swagger). However, there is more to documenting your API than just the reference documentation. Let’s explore the different types of API documentation and the role each has to play in helping a developer become proficient in consuming your API. 

## API documentation is the user interface for developers

API documentation is the most important user interface for developers who will integrate your API. It acts as the primary communication medium between the API producer and the many developers who will consume the API via applications and automation scripts.

Yet, API documentation is often the least-favorite step for most developers. Within an organization, API consumers may have access to the source code to better understand how the API works. So documentation is often left off, citing access to the source code as the best way to understand how to use an API. 

But even if access to the source code is possible, reading code to understand an API is unacceptable. It slows down the developer. At best, it causes frustration. At worst, it results in the developer building the API themselves rather than just consuming yours. 

Investing in proper documentation is very important for your API. Going beyond the reference documentation of your API operations to other types of documentation can unlock increased value for your API consumers.

## API reference documentation

Traditionally, API reference documentation was locked in PDF or Microsoft Word documents that started to grow stale the moment they were downloaded to a developer’s laptop. API description formats, such as the [OpenAPI Specification](https://spec.openapis.org/) and more recently [TypeSpec](https://typespec.io/), capture API reference documentation in machine-readable format. RPC and REST-based APIs leverage these formats to capture the details of their API operations. 

Once captured in these formats, tools are used to convert the machine-readable format into HTML documentation, generate client-side libraries, and produce a skeleton of server-side code with common patterns and practices already established. Some formats even support API interaction right from the generated API reference documentation. [Bump.sh](https://bump.sh/) is a great option for teams looking to produce professional API documentation. 

GraphQL-based APIs leverage the schema definition language (SDL) to capture the query and mutation operation details. The SDL documents are then used to generate documentation and playground documentation, allowing developers to explore the GraphQL-based API. 

Likewise, gRPC uses the interface definition language (IDL) to capture the service, operations, and input/output fields for the API. Reference documentation and code is then generated for clients in their preferred language to understand and consume the API.

Reference documentation is a foundational element for documenting your API. But the documentation effort doesn’t stop there. Let’s explore other documentation types that can enhance the developer experience. 

## Code examples are documentation, too

You may not realize it, but code examples are also a form of API documentation. They demonstrate how to use the API in practice, either using HTTP request/response interactions or perhaps by using a client helper library in the developer’s native programming language. 

Code examples come in a variety of forms, from just a few lines that demonstrate how a specific operation works to reference applications.

Time to First Hello World, or TTFHW, has been a key metric for API owners to determine how long it takes for a developer to start consuming an API. While API products may measure this time in minutes, some APIs may require hours or days to successfully get started with your API. 

The use of code examples as part of your API documentation effort helps to accelerate the time it takes to start using your API. The best code examples require nothing more than dropping in their API authorization token into the example before building and executing the example. 

Code examples are a great documentation technique to help jumpstart developers. But sometimes a code example isn’t enough. Instead, it takes a getting started guide to help them kickstart their experience.

## Getting started guides drive the developer’s initial experience

APIs rarely gain adoption if it is difficult to get started. Provide a getting started guide to introduce developers to common use cases that the API solves and provides a step-by- step guide to getting started for each case. Sometimes these guides are referred to as a quick start guide.

Getting started guides should help the developer through the following milestones:

1. Registering an application using the developer portal
2. Steps to generate an authorization token
3. Making the first API call, preferably a simple read-only operation
4. A guided tour of the API’s other capabilities, from common operations to error handling and pagination
5. How to use refresh tokens to update an expired authorization token

Helping to bootstrap the developer experience with a getting started guide can help consumers jump in quickly and start solving problems with your API. 

For APIs that are designed to handle more complex interactions, your API documentation may require several guides. Sometimes these are called ‘cookbooks’ or ‘implementation guides’, as they help developers to understand how to solve a specific problem. You may need to produce additional guides to address specific use cases based upon the needs of a target persona, market segment, or business process. 

Cross-promoting these guides is an important step. Offer the guides directly from your developer portal, link to them from reference documentation, and list them at the end of your getting started guide. Making them available from multiple areas of your documentation and support processes will help to meet developers where they are and address their needs. 

## Change logs keep developers up-to-date

A final element to incorporate into your documentation is a change log or release notes. While you may have spent days, weeks, or perhaps even months discovering, designing, and delivering new capabilities for your APIs, your consumers were busy solving their own problems. Use release notes to keep developers informed on the latest updates to your API, including new operations, bug fixes, and new API product offerings. 

One of the challenges of managing change logs and release notes is that it is easy to forget a small change you made that can have a large impact on your developers. Use [Bump.sh](https://bump.sh/) to quickly spot changes between API revisions and capture those in your release notes. 

## Wrap-up
The creation of comprehensive API documentation is critical for the success and usability of any API. It extends beyond mere reference documentation to include a variety of resources that enhance the developer experience, such as code examples, getting started guides, and release notes. These elements together form a robust user interface for developers, facilitating easier integration and quicker adoption of the API. 

If your team is struggling to produce documentation for your API, remember that great API documentation is not just about providing information but about empowering developers to effectively and confidently use the API to its full potential.
