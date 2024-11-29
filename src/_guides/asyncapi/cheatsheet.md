---
title: AsyncAPI 3.0 - The Cheat Sheet
authors: chris
excerpt: Everything you need to keep in mind when writing an AsyncAPI contract, on a one-pager.
date: 2024-11-29
---

AsyncAPI, as per the [official documentation site](https://www.asyncapi.com/docs/concepts), is an open source initiative that seeks to improve the current state of Event-Driven Architectures (EDA). Our long-term goal is to make working with EDAs as easy as working with REST APIs. That goes from documentation to code generation, from discovery to event management, and beyond.

Their sites offers extensive guides and tutorials, as well as the reference documentation of the AsyncAPI specification.


As we have built [one for OpenAPI](_guides/openapi/specification/v3.1/cheatsheet.md), we wanted to write our own AsyncAPI Cheat Sheet:

![asyncapi-30-cheatsheet-v1.png](https://storage.googleapis.com/bump-blog-resources/asyncapi-30-cheatsheet/asyncapi-30-cheatsheet-v1.png)
[Download the PDF version](https://storage.googleapis.com/bump-blog-resources/asyncapi-30-cheatsheet/asyncapi-30-cheatsheet-v1.pdf)

The Cheat Sheet is presented here in an initial version. We decided to have examples only in JSON Schema and Avro, which felt to us covering the majority of use cases we saw from Bump.sh users, at least.

Here are the current sections:
* Document Structure
* General Information
* Security
* Channels
* Operations
* Messages
* Schemas
* Protocal Bindings
* Reuse Elements
* Polymorphism

For any feedback and suggestions, please open an issue [on our GitHub Repository](https://github.com/bump-sh/docs/issues). We are currently working on building a web version of the Cheat Sheet, so that anyone can directly contribute to it with a Pull Request.
