---
title: What is OpenAPI?
authors: Grégoire Pichat
image: images/guides/what-is-openapi.png
---
OpenAPI is a standard for describing APIs (Application Programming Interfaces). The OpenAPI specification (or OAS) defines an open and independent description format for API services and allows both humans and computers to discover and understand how an API works and how to interact with it, without the need to look at the source code. More specifically, OpenAPI allows to describe, develop, test, and document APIs conforming to the REST architecture, to create RESTful APIs.

## A bit of history: From Swagger to OpenAPI

To avoid any misunderstanding, we may have to explain the difference between OpenAPI and Swagger. Until version 3.0, this specification was still called Swagger before being renamed to OpenAPI specification.

In 2016, the OpenAPI specification became a separate project from Swagger, now supervised by the [OpenAPI Initiative](https://www.openapis.org/), an open-source project under the [Linux Foundation](https://linuxfoundation.org/).

The name Swagger is still very popular even if most people are now using OpenAPI under the hood. Habits are hard to break!

## Definitions

Sometimes the terms we come across differ from one source to another, and it can be a bit confusing. Here is a quick reminder to understand correctly every concept and call a cat a cat.

![Call a cat a cat gif](https://storage.googleapis.com/bump-blog-resources/what-is-openapi/bump-api-call.gif)

### OpenAPI specification

*Also known as OpenAPI specs / OAS*

The OpenAPI specification is the standard for describing a RESTful API. It can be seen as your guide for writing the API definition following the OpenAPI rules.

### OpenAPI definition

*Also known as OpenAPI file / OpenAPI document / OpenAPI description / OpenAPI contract*

The OpenAPI definition describes exactly how your API works. The OpenAPI definition is written following the OpenAPI specification.

### OpenAPI documentation

*Also known as OpenAPI reference*

The OpenAPI documentation is human-readable documentation for your API based on your OpenAPI definition. Your documentation can be automatically generated from your OpenAPI definition to avoid the pain of writing it by hand.

## Major differences between OpenAPI 2.0, 3.0, 3.1

### Versions

In the 2.0 specification, a property called “`swagger`” indicated which version of the specification you are using. In OpenAPI 3.0, this is replaced by a new “`openapi`” property:

* `"swagger": "2.0"`  line is thus transformed into `"openapi": "3.0.0"`

### Structural changes

The following image sums up the main structural changes between 2.0 and 3.0. As you can see a simplification effort has been made to group each concern in a more logical way.

![openapi 2 versus openapi 3](https://storage.googleapis.com/bump-blog-resources/what-is-openapi/OpenAPI-2-versus-OpenAPI-3.png)

If you want to get more into the details about what changed between OpenAPI 3.0 and 3.1, you can have a look at our dedicated article [here](https://bump.sh/blog/changes-in-openapi-3-1).

## Format

OpenAPI definition can be written both in YAML and JSON formats.

These formats were chosen because they are easy for a human to read and write, and easy for machines to parse. In practice, YAML is the most used format adopted to write OpenAPI definitions. Like it or not, YAML is easier to read than JSON mainly because it reduces the use of markup tags. Also, it is a format that is widely used to write any sort of software configuration.

Here is an example of a simple OpenAPI (3.0.2) definition endpoint written in YAML :

```yaml
/previews:
  post:
    summary: Create a preview
    description: |
      Create a preview for a given documentation file. The preview will have a unique
      temporary URL, and will be active for 30 minutes.
    security: []
    requestBody:
      $ref: "#/components/requestBodies/Preview"
    responses:
      "201":
        description: "Success"
        content:
          "application/json":
            schema:
              $ref: "#/components/schemas/Preview"
```

## OpenAPI simple definition structure

Your OpenAPI definition lets you describe your REST API:

* Define general information about your API: description, terms of use, license, contact, etc…
* Authentication methods `HTTP`, `API keys`, `OAuth 2`, `OpenID`, etc…
* Available endpoints `/users`, etc…
* Since OpenAPI 3.1, [available webhooks](https://bump.sh/blog/changes-in-openapi-3-1#webhooks-support) 
* Available operations on each endpoint: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, etc…
* Input and output parameters for each operation

## OpenAPI benefits

### Design-First

In a design-first world, OpenAPI allows you to describe your whole API from endpoints to examples before even writing the first line of code.

Using this approach, the API definition is the cornerstone of your API and becomes the single source of truth in your organization. Code is based on what has been validated during the design phase and the documentation is generated and synced with the API definition.

Your team can collaborate at every step of the API design phase and leverage their workflow:

Business and product teams can specify new features that meet consumers needs and a technical writer or an engineer can create or update the OpenAPI definition. Teams can [discuss the changes](https://bump.sh/blog/api-design-first-with-bump-diff#collaborating-on-api-design), test the impacts and validate them.

The API design process is boosted: frontend and backend developers can use the OpenAPI file to start working on the implementation, even if this is not the final version of the document.

### Code-first

Obviously, we can’t talk about Design-First without mentioning the historical approach of Code-First, as it can have some benefits as well.

If you need to deploy an API fast for a MVP, internal use or with few endpoints, spending time on API design before you start coding may not be necessary and may slow your delivery time.

As developers, we have our rooted habits and Code-First follows the historical development process. We put ourselves directly into coding, without the need to learn yet another language or design tools to create our APIs. Sometimes it is a great time saver.

## Tools for OpenAPI

There are many tools to help you get the most out of OpenAPI, at every step of the API life cycle, here is a selection of our preferred ones:

### Editors

* [OpenAPI-GUI](https://mermade.github.io/openapi-gui/)
* [Stoplight studio](https://stoplight.io/studio/)
* [Swagger editor](https://editor.swagger.io/)
* [Insomnia](https://insomnia.rest/)

### Linters

* [Speccy](https://github.com/wework/speccy)
* [Spectral](https://github.com/stoplightio/spectral)

### Documentation

* [Bump.sh](https://bump.sh/api-documentation) 💙
* [Swagger UI](https://github.com/swagger-api/swagger-ui)
* [Redoc](https://github.com/Redocly/redoc)
* [Readme](https://readme.com/)

### Mocking

* [Prism](https://github.com/stoplightio/prism)
* [APISprout](https://github.com/danielgtaylor/apisprout)

### Testing

* [Postman](https://www.postman.com/api-platform/api-testing/)
* [Microcks](https://microcks.io/)

### Clients generator

* [OpenAPI Generator](https://github.com/OpenAPITools/openapi-generator)

### Observability

* [Akita](https://www.akitasoftware.com/)
* [Optic](https://useoptic.com/)

Besides the ones mentioned above, here is an amazing and more exhaustive list of curated tools for OpenAPI: [](https://openapi.tools/)<https://openapi.tools/>

## Give it a try

Now that you know what OpenAPI is, try it out and get inspired by existing OpenAPI definitions to create your own.
Here are some examples of public API definitions:

* [Meilisearch API](https://raw.githubusercontent.com/meilisearch/specifications/main/open-api.yaml)
* [Gitlab API](https://gitlab.com/gitlab-org/gitlab/-/raw/master/doc/api/openapi/openapi.yaml)
* [Bump API](https://developers.bump.sh/source.json)

You can use any of those URL in our dedicated preview box right below this article.

Have fun with OpenAPI! ✨
