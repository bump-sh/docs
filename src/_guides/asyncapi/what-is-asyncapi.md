---
title: What is AsyncAPI?
authors: jay
image: images/guides/what-is-asyncapi.png
---

AsyncAPI is the most popular specification for describing asynchronous APIs and Event-Driven Architectures.
Open-source and partially based on OpenAPI standards, AsyncAPI has been a solid and efficient answer to asynchronous communication needs, especially since its 2.0 version.

## A brief look at APIs’ history

Let’s start by explaining, very simply, APIs.

A long time ago, communication between applications or services required you to deep dive into their code if you had access to it, which could take quite a while if they were many (or messy). APIs have been created to make this part of programming much easier: APIs tell you precisely what you can ask to an application and what to expect in return, without seeing what the application does underneath.

At first, almost every API had its own way of working and communicating. And if documentation was missing or outdated, it would quickly become a mess. Different standards were built, but one of them ultimately rose to the top: OpenAPI.

OpenAPI (previously called Swagger until version 3.0) has been the most popular choice for REST APIs, solving documentation problems and creating a good standard. Now part of the Linux Foundation, we covered OpenAPI recently in [another blog post](https://bump.sh/blog/what-is-openapi). We even have a fantastic example [right here](https://developers.bump.sh).

## What about asynchronous APIs?

Choosing between a synchronous or an ansynchronous API is basically an architectural decision. If classic synchronous APIs are helpful when you expect a response to any request you make, asynchronous APIs can be useful in other situations like telling application that some event occurred without expecting a callback or storing data on a device with connection issues.

For example, we could think of a chef working in a restaurant. An asynchronous API (here, the waiter) would suit this perfectly as the kitchen just need to get the dishes and the table they belong to. You can even imagine richer messages, including food allergies or meat cooking requests. You do not expect a reply from the kitchen every time.

![](https://storage.googleapis.com/bump-blog-resources/what-is-asyncapi/muppets-muppet.gif)

Here comes [AsyncAPI](https://www.asyncapi.com/): built with OpenAPI’s legacy in mind and sharing some concepts with, it uses some parts of its original structure and optimizes them for asynchronous needs.

## Definitions

### AsyncAPI specification

Consider this as the guidelines to describe your asynchronous API to ensure that you follow the standards.

### AsyncAPI definition

*aka AsyncAPI file / document / description*

This is the part you produce, explaining exactly how your API works, what it can or cannot do, what data it accepts and returns.

### AsyncAPI documentation

The human-readable documentation of your AsyncAPI definition. It can be automatically generated to save time.

## What does it look like?

AsyncAPI documents can be written in YAML and JSON. This example will use YAML, as it’s the most popular and readable format. Let’s have a quick look:

```yaml
asyncapi: 2.3.0
info:
  title: Hello world application
  version: '0.1.0'
servers:
  production:
    url: server.cogip.com
    protocol: amqp
    description: Absolutely official COGIP server.
channels:
  hello:
    publish:
      message:
        bindings:
          amqp:
            contentEncoding: gzip
            bindingVersion: 0.2.0
        payload:
          type: string
          pattern: '^hello .+$'
```

## AsyncAPI document structure

- Right after the document type and its version comes the `info` object, which contains at least the `title` (the name of your API) and the `version` (don’t forget to change it after every update).
- `servers` tells where and how to connect to your message broker or server. You need to specify a `protocol`, like `amqp`, `mqtt` or `ws` for instance, and a `url`.
- With AsyncAPI, you use `channels` (like the `paths` in OpenAPI) to send your `message` to the application. This section details how messages flow through.
- The `payload` is the part where you explain how `message` are made: types, format, pattern, etc...
- `bindings` describe protocol-specific information. It can be defined specifically at the `message` level or generally at the `servers` level.

## AsyncAPI benefits

If OpenAPI is HTTP and endpoints oriented, AsyncAPI allows many protocols, as we have seen before in the server section of the document, but also more API styles (request/response, publish/subscribe, etc...). AQMP, IBM, Kafka, MQ, MQTT, SNS, WebSockets, JMS for the most popular.

## Tooling

AsyncAPI has gained more and more popularity since its version 2.0. Great tools are continuously developed by the AsyncAPI community, and here’s a short selection from our favorites:

### Editors

- [AsyncAPI Studio](https://studio.asyncapi.com/?url=https://raw.githubusercontent.com/asyncapi/asyncapi/v2.2.0/examples/simple.yml): Still in beta, this tool was expected from the community. Great to start playing with the standard.

### Validators

- [AsyncAPI Parser](https://github.com/asyncapi/parser-js)
- [Spectral](https://stoplight.io/open-source/spectral/)

### Mocking & Testing

- [Microrocks](https://microcks.io/)
- [Virtualan](https://virtualan.io/)

### Documentation

- [Bump.sh](https://bump.sh) 💙
- [AsyncAPI Generator](https://github.com/asyncapi/generator)

AsyncAPI has a fantastic list of valuable tools that make the difference for most use cases, you may want to [check it out](https://www.asyncapi.com/docs/community/tooling).

## More resources

We hope this short tour of AsyncAPI made you want to try it yourself. We strongly suggest giving it a try with the [AsyncAPI Studio](https://studio.asyncapi.com/?url=https://raw.githubusercontent.com/asyncapi/asyncapi/v2.2.0/examples/simple.yml), or even find some public examples like these ones:

- [Slack API](https://api.slack.com/apis/connections/events-api)
- [Gitter-streaming API](https://github.com/asyncapi/spec/blob/8ff3d0d30d23f152e520263ab7a8a4e305f52dc3/examples/gitter-streaming.yml)

Bump was one of the first SaaS products to believe in and support AsyncAPI since its 2.0 release. We have worked continuously for the past years, convinced that it will become the same strong standard to asynchronous APIs that OpenAPI is to the REST world today.
We are proud to be one of AsyncAPI’s Bronze Sponsors and we hope you’ll enjoy coding with AsyncAPIs as much as we do.

If you have any questions or comments, feel free to reach out. We’re just a mail away from you!
