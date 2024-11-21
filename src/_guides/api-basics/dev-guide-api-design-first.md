---
title: A Developer's Guide to API Design-First
authors: phil
image: images/guides/api-first-design-guide.png
canonical_url: https://bump.sh/blog/dev-guide-api-design-first
excerpt: Learn about the principles of API design-first and how it can benefit your organization.
date: 2024-11-15
---

API Design-First, also called schema-first or contract-first, is all about designing the interface of an API before writing any code. It's about planning the [API contract](https://bump.sh/blog/api-contracts-extended-introduction) first, and defining what the API does and how it works so everyone's on the same page before implementation starts. This approach has been around for a while, and over time, it's evolved to meet the needs of different technologies. These days, OpenAPI has become the defacto standard for designing REST APIs, and it can make life easier for everyone the whole way through the lifecycle of an API.


## A Brief History

To understand why design-first is such a big deal, it helps to know where it came from.

- **The early days: WSDL and SOAP**: In the late 90s and early 2000s, SOAP web services were popular, and people used the XML-based WSDL (Web Services Description Language) to describe them. WSDL files outlined all the operations and payloads in a verbose XML format. It was powerful, but many felt it was overly complex. Developers creating, maintaining, and using the APIs felt the frustration of working with them.

- **REST APIs take over**: REST, introduced in the early 2000s, focused on simplicity and scalability. Unlike SOAP, REST didn't have a standard way of describing APIs. Many developers relied on manual documentation, example cURL commands, or tools like Postman collections. It worked, but it was messy, inconsistent, and could easily diverge from the implementation of the API.

- **The OpenAPI era**: Around 2011, Swagger (later renamed OpenAPI) arrived to help describe REST APIs. It introduced a standard machine-readable format for defining operations, parameters, payloads, and validation rules, all using JSON or YAML. There were a few other similar projects (mainly RAML, API Blueprint) but they all fell out of use, and OpenAPI became the champion.

## What Is API Design-First?

API Design-First means you define the API's contract before writing any application code. This contract includes things like:

- The endpoints (URLs) and their HTTP methods (GET, POST, etc.)
- The structure and validation rules of resources and collections.
- Authentication rules (like API keys, OAuth 2.x, OpenID).
- Errors that could be expected, and an example of their structure.

At first this all seems like extra work, but much like writing tests for an application, it will eventually speed up the delivery of APIs, saving everyone time and money, and reduce costly rewrites onces not-quite-right APIs make it to beta, or even worse get into production.

## Why Design-First?

Here's why design-first is worth the effort:

1. **Clear communication**: Everyone – from frontend developers to testers to external users – knows what the API does.
2. **Parallel work**: Frontend and backend teams can work at the same time. Mock APIs can be set up using the design, so development doesn't have to wait.
3. **Consistency**: It's easier to enforce standards when the contract is agreed upon first.
4. **Automation**: You can auto-generate documentation, code snippets, and even parts of the implementation using tools.
5. **Version control**: It's easier to track and manage changes to the API over time.

## OpenAPI and How It Helps

Describing an API is the most important part of the API design-first workflow after planning is done, and for anyone building a REST/RESTish API, the API description format of choice is OpenAPI.

OpenAPI documents are written in JSON or YAML, making them machine-readable, and somewhat human-readable too. They contain all the information needed to describe the interface of an API: requests, responses, reusable components, etc.

```yaml
openapi: 3.0.0
info:
  title: Example API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get a list of users
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                    name:
                      type: string
```

This snippet describes an API endpoint `/users` that responds with a list of users when a client sends a GET request. It then describes the responses a client could expect to see, with the status codes (e.g.: 200), content types (e.g.: `application/json`), then gets stuck into the `schema` which will outline the shape of the JSON.

If you're just getting started with OpenAPI, we're here to help you on your journey. We've put together a guide to help you [learn OpenAPI from scratch](https://docs.bump.sh/guides/openapi/specification/v3.1/understanding-structure/basic-structure/), starting from the basic structure and going through every part of the functionality.

## Comparing Design-first and Code-first

For years the API Code-first approach was the way to build an API. You'd sketch out the API you want to build on a whiteboard, then before that was even done somebody would be generating controllers and views in their favourite programming language and firing JSON around. The goal was always to get coding as fast as possible, so that clients could start integrating with it as soon as a prototype was ready. 

The rush to get coding often meant the first version clients get to see is not really anything like what they want, so a lot of time gets lost and wasted recoding controllers and doing database migrations. At some point everyone runs out of time and they have to go to production with whatever they have, even if it's a mess for clients to work with, and everyone just agrees to fix it all later in v2.0...

When OpenAPI is utilized in this approach, it is usually as annotations or code comments, popped into the application somewhere near the code it's describing, with the hope being that a developer will remember to update both at the same time. These annotations can then be exported to an `openapi.yaml` document which can be displayed as documentation or generate SDKs.

```java
class UserController {
  @OpenApi(
      path = "/users",
      method = HttpMethod.POST,
      // ...
  )
  public static void createUser(Context ctx) {
      // ...
  }
}
```

Sadly this approach relies entirely on conflating proximity with accuracy. The annotations and code just a few lines below would often tell two completely different stories.

Anyone who has been building APIs for more than a few years has probably done this and felt the pain, which is why so many API teams are starting to leverage the API design-first workflow.

Here's a quick look at the two workflows for comparison.

![](/images/guides/design-first/code-first-design-first.png)

Whilst there are a few more steps, the time invested on agreeing a contract early on brings massive time benefits through the rest of the API lifecycle.

Combining the API-Design-first workflow with OpenAPI specifically allows for amazing benefits:

1. **Readable by humans and machines**: The YAML/JSON format means it's clear for developers and allows for API design reviews / governance with teams that don't have to read multiple programming languages.
2. **Interactive docs**: API Documentation generators like Bump.sh turn OpenAPI documents into interactive documentation, showing off parameters and examples, so clients can quickly and easily work with the API.
3. **Mock servers**: Tools like Microcks and Wiretap can use the OpenAPI document to simulate the API, allowing parallel development of API and client applications, and allowing feedback to come in early and often.
4. **Server-side Validation**: Instead of rewriting all of your validation logic in docs and code, you can use the OPenAPI document to power your application, making absolute certain the the documentation matches the implementation and reducing time spent writing code.
5. **Contract Testing**: Use automated tools to probe your API implementation based off the OpenAPI document, and add assertions to existing test suites saying "does this response match what it says in OpenAPI", further ensuring the two are in agreement and saving time writing complicated contract testing by hand.
6. **Code generation**: Many tools generate client libraries or server stubs directly from an OpenAPI document, saving loads of time.
7. **API Style Guides**: Style guides are hard to enforce against code, developers need to check them manually, but with OpenAPI you can enforce standards on the API from the very first endpoint that is described.

Anyone who has written API documentation by hand knows that it takes forever and is usually bad and outdated very quickly, so the fact that you have entirely accurate documentation from the start is a huge benefit for most teams. 

These other benefits may not have ever been considered, they were just things that you spent infinite time doing by hand and had never even considered automating, but when you combine them altogether in a single workflow your team becomes unstoppable. 

Speed and accuracy both go through the roof, reducing time, cost and client frustration with your API.

## Wrapping Up

API Design-First is all about getting the API's design nailed down before jumping into coding. It helps teams work faster, stay consistent, and avoid costly mistakes later on. OpenAPI has become the standard for REST APIs, making it easy to design, document, and manage APIs. While other technologies like GraphQL offer alternatives, the simplicity and reliability of REST, combined with OpenAPI's ecosystem, make it a solid choice for most teams.
