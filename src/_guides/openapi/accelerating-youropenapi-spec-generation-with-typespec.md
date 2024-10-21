---
title: Accelerating your OpenAPI Spec Generation with TypeSpec 
authors: james
canonical_url: https://bump.sh/blog/accelerating-your-openapi-spec-generation-with-typespec
excerpt: Let's explore TypeSpec, an alternative to the OpenAPI Specification for capturing the details of your API definition, with support for OpenAPI, gRPC, and JSON Schema output formats.
---

There have been a number of options emerge recently beyond OpenAPI for documenting your API interface details. One such option is TypeSpec, which offers a declarative syntax to define HTTP, REST, and gRPC-based APIs. The high-level syntax allows developers to define API types, schemas, and interfaces, making it easier to manage the complexities of modern API ecosystems.

In this article, we will explore what TypeSpec is, how it can transform your API documentation process, and how it supports established API standards like OpenAPI and gRPC. By leveraging TypeSpec, teams can streamline the creation and maintenance of their APIs, ensuring that their systems remain consistent and scalable across various services. Along the way, we will dive into examples, practical applications, and find out where TypeSpec fits into the API lifecycle to help you decide if it’s the right tool for your API program.

## What is TypeSpec?

[TypeSpec](https://typespec.io/) (formerly known as Cadl) was built to simplify the API design process for REST APIs, HTTP services, and gRPC APIs by providing a high-level, declarative syntax to model types and services. It supports defining the types, schemas, and interfaces that describe an API's operations and resource models. 

By using TypeSpec, developers can generate code, documentation, and other artifacts from their API definitions, simplifying the process of maintaining and evolving APIs and services. Microsoft leverages TypeSpec internally to define APIs across various products and services, including Azure.

As of this writing, TypeSpec supports the modeling of REST and HTTP APIs, gRPC, and JSON Schema. This is handled by the use of decorators, which provide annotation-style declarations of your resources and operations. Emitters are then used to transform TypeSpec into the preferred output format for the model used including OpenAPI v3 for REST and HTTP APIs, an IDL file for gRPC, or JSON Schema. This means that you are able to use TypeSpec tooling to describe your APIs, while still leveraging existing tools for the remainder of your API delivery lifecycle.  

## Getting Started with TypeSpec

You can install TypeSpec in just a few steps using the installation instructions provided by the [Getting Started Guide](https://typespec.io/docs/getting-started/getting-started-rest/01-setup-basic-syntax#summary-of-setup-and-installation). At a minimum, you will need a current version of Node.js installed, along with the TypeSpec CLI. 

If you prefer, you can use the [TypeSpec Playground](https://typespec.io/playground) to get started quickly, without the need to install the CLI. 

## A TypeSpec Example

The first step is to create a new TSP file or use an existing TSP file. A TSP file contains your API definition using TypeSpec syntax. Below is an example provided by the TypeSpec documentation for a Petstore API:

```
import "@typespec/http";

using TypeSpec.Http;

@service({
  title: "Pet Store",
})
@server("https://example.com", "Single server endpoint")
namespace PetStore;

model Pet {
  id: int32;

  @minLength(1)
  name: string;

  @minValue(0)
  @maxValue(100)
  age: int32;

  kind: petType;
}

enum petType {
  dog: "dog",
  cat: "cat",
  fish: "fish",
  bird: "bird",
  reptile: "reptile",
}

@route("/pets")
namespace Pets {
  @get
  op listPets(): {
    @statusCode statusCode: 200;
    @body pets: Pet[];
  };

  @get
  op getPet(@path petId: int32): {
    @statusCode statusCode: 200;
    @body pet: Pet;
  } | {
    @statusCode statusCode: 404;
  };

  @post
  op createPet(@body pet: Pet): {
    @statusCode statusCode: 201;
    @body newPet: Pet;
  } | {
    @statusCode statusCode: 202;
    @body acceptedPet: Pet;
  };

  @put
  op updatePet(@path petId: int32, @body pet: Pet): {
    @statusCode statusCode: 200;
    @body updatedPet: Pet;
  } | {
    @statusCode statusCode: 404;
  };

  @delete
  op deletePet(@path petId: int32): {
    @statusCode statusCode: 204;
  };
}
```
The `import` and `Using` commands tell the TypeSpec compiler what kind of decorators you will be using to define your API. In this case, we will be modeling a REST/HTTP API. 

We then define the details about the API using the `@service` decorator and the host(s) where our API implementation will reside using the `@servers` decorator. 

Next, we use TypeSpec `model` and `enum` declarations to describe our models. For this example, we have a `Pet` resource model that our API will support. 

Finally, we define our API operations using a `@route` decorator that will define the path and associated HTTP methods our API supports. In this case, we offer `@get` to retrieve all Pets or a specific Pet by ID, `@post` to add a Pet to the pet store, `@put` to update a Pet, and `@delete` to delete a Pet. 

Notice that the syntax is designed to optimize the developer experience when defining your API definition. In our example, a single declaration of the route `/pets` sets the current URL path. Within this route, we see that each HTTP method builds upon this path to define `GET /pets`, `GET /pets/{petId}`, and so on. This makes for a much more manageable API definition than a traditional OpenAPI definition. 

Using the TypeSpec playground, I converted the example above into an OpenAPI Specification:

```
openapi: 3.0.0
info:
 title: Pet Store
 version: 0.0.0
tags: []
paths:
 /pets:
   get:
     operationId: Pets_listPets
     parameters: []
     responses:
       '200':
         description: The request has succeeded.
         content:
           application/json:
             schema:
               type: array
               items:
                 $ref: '#/components/schemas/Pet'
   post:
     operationId: Pets_createPet
     parameters: []
     responses:
       '201':
         description: The request has succeeded and a new resource has been created as a result.
         content:
           application/json:
             schema:
               $ref: '#/components/schemas/Pet'
       '202':
         description: The request has been accepted for processing, but processing has not yet completed.
         content:
           application/json:
             schema:
               $ref: '#/components/schemas/Pet'
     requestBody:
       required: true
       content:
         application/json:
           schema:
             $ref: '#/components/schemas/Pet'
 /pets/{petId}:
   get:
     operationId: Pets_getPet
     parameters:
       - name: petId
         in: path
         required: true
         schema:
           type: integer
           format: int32
     responses:
       '200':
         description: The request has succeeded.
         content:
           application/json:
             schema:
               $ref: '#/components/schemas/Pet'
       '404':
         description: The server cannot find the requested resource.
   put:
     operationId: Pets_updatePet
     parameters:
       - name: petId
         in: path
         required: true
         schema:
           type: integer
           format: int32
     responses:
       '200':
         description: The request has succeeded.
         content:
           application/json:
             schema:
               $ref: '#/components/schemas/Pet'
       '404':
         description: The server cannot find the requested resource.
     requestBody:
       required: true
       content:
         application/json:
           schema:
             $ref: '#/components/schemas/Pet'
   delete:
     operationId: Pets_deletePet
     parameters:
       - name: petId
         in: path
         required: true
         schema:
           type: integer
           format: int32
     responses:
       '204':
         description: 'There is no content to send for this request, but the headers may be useful. '
components:
 schemas:
   Pet:
     type: object
     required:
       - id
       - name
       - age
       - kind
     properties:
       id:
         type: integer
         format: int32
       name:
         type: string
         minLength: 1
       age:
         type: integer
         format: int32
         minimum: 0
         maximum: 100
       kind:
         $ref: '#/components/schemas/petType'
   petType:
     type: string
     enum:
       - dog
       - cat
       - fish
       - bird
       - reptile
servers:
 - url: https://example.com
   description: Single server endpoint
   variables: {}
```

As you can see, [TypeSpec](https://typespec.io/) is much smaller and easier to manage while the OpenAPI format is about twice as long (69 lines for TypeSpec vs. 131 lines for OpenAPI). Of course, we could continue to extend our TypeSpec definition with our own `operationId` values rather than using the auto-generated ones, examples that will be mapped to OpenAPI examples, and a variety of other OpenAPI options. Considerable work has been done by the TypeSpec team to make the emitters production ready and as close to the OpenAPI, gRPC IDL, and JSON Schema specifications as possible. 

## Should I Use TypeSpec or OpenAPI?

TypeSpec offers several advantages over OpenAPI:

1. **Type-Centric Language**: TypeSpec emphasizes defining API models and associated types. These models can then be reused across different APIs, making it easier to maintain consistency in larger API ecosystems.

2. **Schema Definition**: It provides a way to define data schemas and validation rules, which can later be transformed into various output formats, such as OpenAPI, JSON Schema, and Protocol Buffers.

3. **API First Design**: TypeSpec encourages API-first design principles, meaning you define the API contract before the implementation, ensuring that both the client and server agree on the interface.

4. **Target Multiple Outputs**: One of the primary advantages of TypeSpec is its ability to generate multiple output formats from a single source of truth. It can produce OpenAPI, GraphQL schemas, or even generate code for client libraries or server implementations.

5. **Extensibility**: TypeSpec is designed to be extensible, allowing users to write plugins to customize the output format or introduce new conventions for specific platforms.

This makes TypeSpec a powerful tool for organizations focused on API standardization, consistency, and automation, fitting well into environments where multiple APIs and services need to coexist under shared design principles. 

However, it is important to keep in mind that TypeSpec is still a bit early. While used heavily by Microsoft and other organizations, the tool ecosystem is limited. So, expect to add a step in your delivery pipeline to convert your TypeSpec file into OpenAPI so that you can continue to use your favorite OpenAPI-based tools. 

## Where Does TypeSpec Fit in the API Lifecycle?

TypeSpec assumes that you have already modeled your APIs using an API design first methodology, such as the [Align-Define-Design-Refine (ADDR)](https://addrprocess.com), and are ready to apply an API design style. However, TypeSpec does offer advantages in the **design, delivery, and documentation** stages of the API lifecycle:

   - **API Contract Definition**: In an API-first development model, defining the API contract is crucial. TypeSpec provides a high-level, type-centric language for defining the interface and structure of your API. It allows teams to describe the types, methods, and services, ensuring clarity about what the API should do and what data it will handle.
   - **Consistency & Reusability**: TypeSpec promotes consistency across different APIs within an organization by allowing reusable types and schemas. This is particularly important for teams working with multiple APIs that need to adhere to shared standards and practices.
   - **Standardized Documentation**: TypeSpec can generate documentation from the API definition (e.g., OpenAPI/Swagger documentation), allowing you to import it into [Bump.sh](https://bump.sh) and other tools
   - **API Versioning**: TypeSpec facilitates API versioning by allowing different versions of an API to be defined and managed from the same source. This is essential when evolving APIs while maintaining backward compatibility with older clients.
   - **Schema Evolution**: As an API evolves, changes to the schema and types can be managed within TypeSpec, ensuring that changes are tracked and understood across teams.
   - **Governance**: For organizations that have centralized API governance, TypeSpec can help enforce consistency in API designs across different teams by enforcing organizational standards for API design.
   - **Automated Linting and Checks**: TypeSpec can be integrated into CI/CD pipelines to automatically check whether APIs conform to best practices and organizational rules during the design phase.

## Wrap-Up

[TypeSpec](https://typespec.io/) has some considerable potential. While I was hoping to find a way to model APIs using the [ADDR API Profile format](https://addrprocess.com/define-phase-overview/) prior to mapping it into a specific API design style, it offers a simple way to capture your API design using a single syntax and then convert it into the format required for your tooling. Organizations with a large API portfolio would also benefit from the ability to modularize, share, and import your definitions easily, prior to outputting a single OpenAPI definition. 

I would recommend checking out the [getting started guide](https://typespec.io/docs/getting-started/getting-started-rest/01-setup-basic-syntax) to help you understand the full potential of TypeSpec. Considerable work has been done to make the tooling approachable, with many examples including the one we used above. 

Just keep in mind that the TypeSpec syntax is still developer-centric, so product owners and business users may find it difficult to use unless they have a development background. However, technical audiences such as developers and technical writers might find the syntax useful for describing APIs, then using the OpenAPI emitter to convert TypeSpec to OpenAPI for use by their CI/CD toolchain. 


