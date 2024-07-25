---
title: What are the different API types?
authors: jay
image: images/guides/different-api-types.png
canonical_url: https://bump.sh/blog/what-are-the-different-api-types
excerpt: This is an introduction to the various API technologies that exist today, and their main use cases.
date: 2023-11-09
---
APIs have become increasingly popular over the past few years, enabling products, projects and people to connect. In this article, we will try to present a snapshot of the most popular solutions available as of August 2022. We did our best to avoid bias, but some technologies are not mentioned on purpose, as we want to focus on the most used/popular.

## History

Always great to start from the beginning. If APIs have been here for a very long time, they began to get more and more popular in the early 2000s, when they got mainly used to push forward businesses on the web. Resellers or business partners could reach popular platforms, with APIs helping customers quickly find the products they were looking for on a single website.

Some of the biggest technology companies released their APIs like Salesforce or Amazon in a few years. Their impact on the industry is unmatched, as they forever changed how we sell and shop online.

We could continue this for a long time. After shopping, more APIs were released for different purposes and are now everywhere: social media, cloud computing, communication, mapping, voice AI…

## RPC (Remote Procedure Call)

The simplest form of API interaction basically relies on executing some code on a distant server. RPC is probably the oldest type of API you could meet today. You can imagine it as a simple function with arguments but in a web context that makes them a web API.

RPC was designed for actions, executing procedures and commands with ease. One of the limitations is that it relies on the client mostly, which needs to know the endpoints and how and when to reach them. RPC itself is more an approach to APIs but with many existing specifications. We won’t talk about most of them but there’s one that is popular:

## SOAP

Introduced by Microsoft and IBM around 1998, SOAP is an actual communication protocol. Known to use a bit wordy XML, SOAP is from the beginning a true API contract: its strict guidelines confer it an image of stability and safety. Today, SOAP is still found on some legacy systems which rely on it, but has mostly been supplanted by REST. Among the companies that use SOAP for their APIs, [Salesforce](https://developer.salesforce.com/docs/atlas.en-us.api.meta/api/sforce_api_quickstart_intro.htm) is probably the most famous.

Learn more on [SOAP](https://en.wikipedia.org/wiki/SOAP).

### More RPC types

RPC has known some evolutions since its creation. One of them led directly to SOAP: **[XML-RPC](https://en.wikipedia.org/wiki/XML-RPC)** (basically, it continued to evolve until the decision to create a new standard from it). **[JSON-RPC](https://en.wikipedia.org/wiki/JSON-RPC)** has also been a bit popular at some point. Its main difference from XML-RPC is its capacity to handle notifications and work asynchronously.

## REST

REST APIs quickly grew in popularity, pushing SOAP on their passage. While RPC is a strict protocol, REST can be seen as general guidelines which define a standard, normalized architecture for APIs.

Due to this, REST offers fast deployments in your environment. With URLs for the client/server relations, REST avoids the time-consuming part of writing code for each. Client and server can be developed on their side without information about each other, and their code can be updated without affecting the other.

Another important part of REST is its Statelessness: to make it simple, it means that clients and servers don’t need to know the state of the other one. REST uses standard HTTP operations and doesn’t need to code a specific interface. Messages sent are automatically understood, without knowing the previous messages sent.

REST supports webhooks enabling asynchronous requests. Imagine subscribing to an alert when a specific event occurs or when you need a reply/action from the server at a later moment.

There are many ways to describe your REST API but one of the most popular solutions lately has been to use the OpenAPI specification, previously known as Swagger.

Learn more on [REST](https://en.wikipedia.org/wiki/Representational_state_transfer).

## OpenAPI Specification

While REST APIs were growing on the main stage, several actors worked hard to push this forward. One of the main issues was standardizing how APIs should be described. Swagger was one of these neutral description formats and eventually joined the Linux Foundation. The name changed as well to OpenAPI. Now the most popular standard to describe REST APIs, its community greatly supports OpenAPI specification.

Learn more on [OpenAPI](../openapi/specification/v3.1/introduction/what-is-openapi.md).

## GraphQL

Initially created by Facebook in 2012, GraphQL was moved as an open-source project to the GraphQL Foundation in late 2018. GraphQL is a query language for APIs, focusing on delivering exactly the data requested and no more. Schema is essential to a GraphQL API, as it is your API’s single source of truth. A single endpoint can share the full capability in terms of data, allowing you to control the data you’ll receive from the server precisely. And when REST APIs could need loading from several endpoints, GraphQL handles this in a single request.

However, as many developers are more familiar with REST APIs, GraphQL may require a longer learning curve.

Learn more on [GraphQL](https://graphql.org).

## gRPC

Created by Google, gRPC is an open source RPC framework, cross-platform with many languages, relying on HTTP 2.0 as its transport protocol. Protocol Buffers (also known as Protobuf) can be used for requests/messages. Protobuf could be seen as Google homemade JSON (but faster, smaller and natively generating language bindings).

We won’t deep dive too much here, but gRPC has some significant advantages like its use of binary payloads (very light requests/code, better performances) or the use of HTTP 2.0 backstage.

gRPC may be considered as a strongly enhanced version of RPC.

Learn more on [gRPC](https://grpc.io).

## EDA

Unlike REST (which relies on a request/response workflow), Event-Driven Architecture API (or asynchronous APIs) works with a subscribe/publish system. Asynchronous APIs are based on a message workflow, allowing asynchronous actions. Instead of reaching out to a server to get a response, an EDA API will subscribe and receive specific notifications about an event, when required. In some cases, it could be considered a great solution due to its excellent performance and reliability, like for a heavily requested server.

Asynchronous APIs are very popular in microservices environments, helping them to synchronize data across different services.

They have been growing in popularity over the years, receiving more and more support from the developer community. If asynchronous APIs can work with many protocols, a standard emerged to bind them all within the specification:

### Specifications

AsyncAPI is an open source standard describing an EDA API’s specifications, working with many possible protocols. Based on OpenAPI, AsyncAPI has optimized these parts for asynchronous needs: Designed from the idea of a messaging system where the messages are built with a header and a payload, helping to sort them into topics.

AsyncAPI focuses on the application and the communication channels and [works well with CloudEvents](https://www.asyncapi.com/blog/asyncapi-cloud-events), another standard for asynchronous APIs that focuses more on the event itself and the message format.

Learn more on [AsyncAPI](https://bump.sh/blog/what-is-asyncapi).

### Most commonly used protocols

We’re covering below a few protocols that are popularly used within an EDA API, but there are many more!

#### AMQP

Initially created by JPMorgan Chase in 2003 to build an open communication standard, AMQP has been supported by some of the biggest: Microsoft, VMWare, Cisco Systems and several banks like Barclays.

Among others, AMQP’s biggest advantages are its support of annotated data and its self-describing encoding system, which permits greater compatibility with clients.

Learn more on [AMQP](https://www.amqp.org).

#### MQTT

MQTT is a bit older than AMQP (1999) and was initially created to watch over an oléoduc in the desert. As the satellite connection was expensive, the goal was to have a bandwidth-efficient, battery-power-efficient protocol.

MQTT never stopped to evolve and is now one of the most popular protocols in the IoT field, thanks to its support of unreliable networks.

Learn more on [MQTT](https://mqtt.org).

#### Kafka

Kafka is often considered an alternative to “traditional” message brokers. Designed by LinkedIn, Kafka was meant to support the high volume of messages transiting through the platform. It quickly then switched to open-source in 2011, under the Apache Software Foundation.

Uber uses Kafka to help match passengers and drivers. More than 300 microservices rely on Kafka now and the protocol is considered the backbone of their architecture.

Learn more on [Kafka](https://en.wikipedia.org/wiki/Apache_Kafka).

#### WebSockets

WebSocket protocol has been here for a long time, standardized in 2011, and is supported natively by most browsers. Offering a very flexible implementation, you can easily find many resources online and a solid tooling experience.

WebSockets APIs are stateful (meaning that the connection between client and server remains active until stopped by one of them) and full-duplex (can send/receive simultaneously).

Widely spread in the EDA ecosystems, WebSockets are increasingly partnering with REST APIs to add an asynchronous layer to them.

Learn more on [WebSockets](https://en.wikipedia.org/wiki/WebSocket).

## Conclusion

This article was just a short tour of today’s API scene, as there’s much more to share on this growing, vivid topic. New concepts, ideas, projects, tools, standards, and optimizations are developed and shared weekly within the community. And even if we know that some content in this article will be obsolete in the upcoming months, we’ll try to keep it updated as much as possible.

In the meantime, we at Bump are trying to create great tools to help developers, API evangelists, communities and teams to get the best from their APIs. We have developed the first product that provides a unified experience around [OpenAPI](https://bump.sh/openapi) and [AsyncAPI](https://bump.sh/asyncapi). Feel free to look at our solution, and please reach us if you have any feedback, comment or suggestion you would like to share. We’re always listening. :)
