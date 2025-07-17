---
title: Using OpenAPI to simplify building and testing Java and Spring APIs
authors: phil
excerpt: Dive into the API Design-first workflow with Java and Spring, leveraging OpenAPI to power server-side request validations, and build a contracting test suite using that same API contract.
date: 2025-06-17
---

Spring Boot is a powerful Java framework with loads of handy community
extensions for building APIs, and working with
[OpenAPI](https://spec.openapis.org/oas/latest.html) and all its [brilliant
tooling](https://openapi.tools/).

Some folks may be used to the API code-first workflow, where you write the whole
API then sprinkle in some metadata later using Swagger Annotations or something
similar. The API design-first workflow is the opposite of that approach, and
helps you write less code whilst also getting better quality testing and 100%
aligned API documentation.

Instead of rushing into the code, we can build OpenAPI descriptions before
writing any code at all, like creating a blueprint before building a house. Once
you have the OpenAPI description documents saved (ideally in your source code
repository), you can leverage it at every step of the API lifecycle, to produce
[mock APIs for clients](src/_guides/bump-sh-tutorials/mocking-with-microcks.md)
to test assumptions with, build [client libraries without writing any
code](src/_guides/bump-sh-tutorials/generate-sdks-with-speakeasy.md), make
really effective contract testing, and even generate backend code to get the
application teams started once the contract is all signed off.

The whole API design first workflow is huge depending on how much of its power
you leverage, but this guide is going to look at how to parts of the workflow
work with Spring Boot: server-side request validation, and contract testing.

- [Getting OpenAPI \& Bump.sh Setup](#getting-openapi--bumpsh-setup)
- [Request Validation with OpenAPI in Spring Boot](#request-validation-with-openapi-in-spring-boot)
- [Contract Testing Spring APIs with OpenAPI](#contract-testing-spring-apis-with-openapi)
- [Sample Code](#sample-code)


## Getting OpenAPI & Bump.sh Setup

The API design-first workflow means you'll need to create your OpenAPI
description before you start writing all your code, so if you don't have an
`openapi.yaml` already that is probably the first step. You can use a wide
variety of [graphical editors](https://openapi.tools/#gui-editors), [text
editors](https://openapi.tools/#text-editors), or [traffic
sniffing](/guides/openapi/code-first/#traffic-sniffing), or
[AI](https://create-api.dev/) to generate this OpenAPI, and you can use our
[ultimate OpenAPI
Guide](src/_guides/openapi/specification/v3.1/introduction/what-is-openapi.md)
to help you get started writing and updating OpenAPI.

If you are switching from code first and getting on the design first train, you
can export your old [annotations-based
OpenAPI](_guides/openapi/code-first-spring.md), download it, save it as
`openapi.yaml`, stick it through [OpenAPI
Format](https://www.npmjs.com/package/openapi-format) to tidy it up a little,
and delete all the old annotations from cluttering your codebase. You don't need
those annotations anymore, we're gonna work with `openapi.yaml` directly and use
that as our source of truth for everything.

Alternatively you can grab some sample OpenAPI from the [API Guru
marketplace](https://apis.guru/), and click JSON or YAML to download their
OpenAPI descriptions.

Once you have an OpenAPI description document, pop it into your Git repository.
This is often in the root as `openapi.yaml`. 

Building an API for a bunch of clients is always a tricky one, but by deploying
the documentation first, you can see if people like the look of the API before
you waste time building it.

Then, as you progress through, especially if you add these tools to an existing
codebase, you will continue to find mistakes in your OpenAPI or your actual API
code. Improve both as you go until you have a perfect match that will never
again be broken, solving the "docs vs code" drift problem, and every fix will be
deployed to Bump.sh with each commit/merge.

```bash
$ bump deploy openapi.yaml \
  --doc spring-design-first \
  --token my-documentation-token

* Your new documentation version will soon be ready at https://bump.sh/hub/code-samples/doc/spring-design-first
```

Instead of using the [CLI](https://github.com/bump-sh/cli#bump-deploy-file) you
could use [GitHub
Actions](https://github.com/marketplace/actions/bump-sh-api-documentation-changelog),
or a bunch of other [Continuous Integration](/help/continuous-integration/).

Once Bump.sh is hooked up, let's look at how we'd teach a Spring Boot API (new,
or existing) to handle request validation for us.

## Request Validation with OpenAPI in Spring Boot

In a Spring Boot application, you can use OpenAPI to validate incoming requests
against the API description. This ensures that the requests conform to the
expected structure and data types defined in the OpenAPI specification.

To demonstrate this, let's assume we have a simple Spring Boot application with
an `Employee` entity that has two properties: `name` and `role`. We'll create a
controller that handles incoming requests to create new employees, but it
doesn't do any validation just yet.

```java
@RestController
class EmployeeController {

	private final EmployeeRepository repository;

	EmployeeController(EmployeeRepository repository) {
		this.repository = repository;
	}

	@GetMapping("/employees")
	List<Employee> all() {
		return repository.findAll();
	}

	@PostMapping("/employees")
	Employee newEmployee(@RequestBody Employee newEmployee) {
		return repository.save(newEmployee);
	}
```

When a request is made it will try and create a record with `name` and `role`,
but if either property is missing (or misspelled) it will just save it anyway. 

```bash
curl -iXPOST -H 'content-type:application/json' \
  localhost:8080/employees \
  --data '{"role":"thief","nam":"Bilbo"}'
```

```http
HTTP/1.1 200
Content-Type: application/json

{"id":3,"name":null,"role":"thief"}
```

Oops!

This API needs more validation.

**Bringing OpenAPI into the Spring Boot Application**

If we're going to teach Spring Boot and OpenAPI to get along, let's first move OpenAPI somewhere Spring Boot is expecting it and de-clutter our root in the process. A great place for this is the `src/main/resources/api/` directory.

```shell
mkdir -p src/main/resources/api
mv openapi.yaml src/main/resources/api/openapi.yaml
```

**Installing Kappa**

Kappa is a library that integrates OpenAPI with Spring Boot, allowing you to validate requests against your OpenAPI description without needing to generate code. It acts as a middleware that intercepts requests and checks them against the OpenAPI schema before they reach your controllers.

Kappa can be installed as a servlet using the `kappa-servlet-adapter` dependency, which would let us write a bit of code to [create a middleware](https://medium.com/@sharmapraveen91/understanding-api-middleware-in-spring-boot-a-deep-dive-79a03fc899c9). Thankfully there's an even easier tighter integration using the `kappa-spring` module, which will cut down the setup drastically.

To install `kappa-spring` with Maven, pop it into `pom.xml`.

```xml
  <dependency>
    <groupId>com.github.erosb</groupId>
    <artifactId>kappa-spring</artifactId>
    <version>2.0.0-RC15</version>
  </dependency>
```

**Configuring Kappa in Spring Boot**

Now that Kappa is installed, we need to enable it in our Spring Boot application. Kappa provides an `@EnableKappaRequestValidation` annotation to stick on our Application class, then we can point Kappa to our OpenAPI in the `kappaSpringConfiguration()` method:

```java
package com.bumpsh.demo;

import com.github.erosb.kappa.autoconfigure.EnableKappaRequestValidation;
import com.github.erosb.kappa.autoconfigure.KappaSpringConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.SpringApplication;
import org.springframework.context.annotation.Bean;
import java.util.LinkedHashMap;

@SpringBootApplication
@EnableKappaRequestValidation
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	public KappaSpringConfiguration kappaSpringConfiguration() {
		KappaSpringConfiguration kappaConfig = new KappaSpringConfiguration();
		var pathPatternToOpenapiDescription = new LinkedHashMap<String, String>();
		pathPatternToOpenapiDescription.put("/**", "/api/openapi.yaml");
		kappaConfig.setOpenapiDescriptions(pathPatternToOpenapiDescription);
		return kappaConfig;
	}

}
```

That is basically it. With a surprisingly little amount of work, our application is now protected with a middleware that will reject any invalid requests.

I know, it seems too easy, so let's test it out!

**Testing the Middleware**

Let's try sending a request that is missing the `name` property, which is required in the OpenAPI description.

```bash
curl -iXPOST -H 'content-type:application/json' \
  localhost:8080/employees \
  --data '{"role":"thief"}'
```

When we run this request, we should see a response like this:

```http
HTTP/1.1 400
Content-Type: application/problem+json
Connection: close

{
  "type" : "https://erosb.github.io/kappa/request-validation-failure",
  "status" : 400,
  "title" : "Validation failure",
  "detail" : "Invalid request.",
  "errors" : [
    {
      "message" : "required properties are missing: name",
      "dataLocation" : "$request.body (line 1, position 1)",
      "dynamicPath" : "#/$ref/required"
    }
  ]
}
```

The error that comes is super useful and contains a whole lot of information to [help humans and computers](https://apisyouwonthate.com/blog/useful-api-errors-for-rest-graphql-and-grpc/) move forward. 

The format if this error is using [RFC 9457: Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc9457), so this may be familiar to you. You can design your own API to use these same error responses, and even have multiple APIs having all the same formats, so everything works nicely and consistently. 

Problem Details cover the main keywords here: `type`, `status`, `title`, `detail`, which help to explain what's going on. This is a HTTP 400 (Bad Request), and the specific problem as that it's got an invalid request, as determined by `https://erosb.github.io/kappa/request-validation-failure` which is a unique error as defined by the tool Kappa. Then to help explain the validation issue further, Kappa adds in the `errors` array, which includes an object with details of the validation failure. 

In this instance it's let us know that `name` is missing from the request body, so we can go ahead and add that back in.

```
curl -iXPOST -H 'content-type:application/json' \
  localhost:8080/employees \
  --data '{"role":"thief","name":"Bilbo"}'
```

```http
HTTP/1.1 200
Content-Type: application/json

{"id":4,"name":"Bilbo","role":"thief"}
```

There we go! The request is now valid, and the response is a HTTP 200 OK with the created employee record.

## Contract Testing Spring APIs with OpenAPI

Contract testing being built from from OpenAPI is one of the best things about using the API design-first workflow, because it allows us to ensure the API is working exactly as planned all the way through from planning and development to deployment. 

Instead of redefining the contract in the test suite and having that differ slightly from the documentation or the validation, everything is all using the same OpenAPI which is sat right there in the codebase. 

Enabling contract testing to make sure requests and responses match the OpenAPI does not involve any new tools, because Kappa handles this too. No new concepts or workflows will be required, we can just use the existing Spring Boot testing framework and add a single annotation to our tests to enable contract testing.

```xml
  <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
  </dependency>
```

Now we can write a test that will validate the API against the OpenAPI description. Here's an example of a test that checks the `/employees` endpoint:

```java
package com.bumpsh.demo;

import com.github.erosb.kappa.autoconfigure.EnableKappaContractTesting;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * The @EnableKappaContractTesting will tell Kappa to validate all HTTP requests and responses against the openapi.yaml.
 *
 * So contract testing is an additional verification step in every test. If an endpoint sends a response that doesn't
 * match the openapi description, then the test will fail, even if all assertions of the concrete test would pass.
 */
@SpringBootTest
@AutoConfigureMockMvc
@EnableKappaContractTesting
@Tag("failing-contract-tests")
public class EmployeeApiTest {

    @Autowired
    MockMvc mvc;

    /**
     * Fails because the openapi.yaml describes a HTTP 201 Created response code, but the SUT responds with 200 OK.
     */
    @Test
    void responseCodeMismatch() throws Exception {
        mvc.perform(post("/employees").contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                            "name": "Bilbo",
                            "role": "ring-bearer"
                        }
                        """))
                // here we don't exactly specify the expected response code
                // but due to @EnableKappaContractTesting, Kappa will still check if the response code is in the openapi.yaml
                .andExpect(status().is2xxSuccessful());
    }

    /**
     * Fails because the 404 response in the openapi.yaml describes a mandatory "id" property, but it isn't present in the response
     */
    @Test
    void notFoundResponseBodyMismatch() throws Exception {
        mvc.perform(MockMvcRequestBuilders.get("/employees/22").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                // actually, this is the json that will be returned by the endpoint, but it doesn't match the openapi description because it is missing the "message" property
                .andExpect(content().json("""
                        {
                            "message": "Could not find employee 22"
                        }
                        """));
    }
}
```

This test is a pretty standard spring MockMvc test, with an additional `@EnableKappaContractTesting` annotation. This will tell Kappa to validate all requests and responses against the openapi.yaml description, and make the tests fail on mismatch.

```shell
mvn test
```

When you run the tests, Kappa will validate the requests and responses against the OpenAPI description. If there are any mismatches, the tests will fail, providing detailed information about what went wrong.

A common error for a contract test is a test not sending a required field. That mismatch could be down to a field only recently being made required (which could be a BC break), or OpenAPI falsely describing a field as required when it is not. Either way, the test will fail and provide a useful error message to help you fix the mismatch.

```
[ERROR]   EmployeeApiTest.responseCodeMismatch:37 Invalid request.
required properties are missing: thirdThing
instance location: $request.body (line 1, position 1)
schema location: file:/Users/bump/spring-design-first/target/classes/api/openapi.yaml#/components/schemas/Employee/required
	evaluated on dynamic path: file:/Users/bump/spring-design-first/target/classes/api/openapi.yaml#/$ref/required
```

This error message indicates that the request body is missing a required property `thirdThing`, which is defined in the OpenAPI description. The test will fail, and you can then go back to your API implementation to fix the issue.

Another common problem contract testing helps surface is content type or response code mismatches. For example, if the OpenAPI description specifies that a 404 response should return a JSON body with a `title` and `detail` property like RFC 9457, but the actual response is a plain text message.

```
[ERROR] Failures:
[ERROR]   EmployeeApiTest.notFoundResponseBodyMismatch:54 Invalid response.
could not parse HTTP entity: unexpected character C
instance location: $request.body (line 1, position 1)
schema location: file:/Users/bump/spring-design-first/target/classes/api/openapi.yaml#/paths/~1employees~1{id}/get/responses/404/content
```

Having the OpenAPI description (and therefore API documentation) show JSON errors but sending plain text errors would be embarrassing and problematic, but Kappa caught this mismatch and failed the test. OpenAPI-based contract testing tools are not just looking at the shape of the data being returned, but the whole response, including the content type and status code.

This is a great way to ensure that your API is always in sync with the OpenAPI description, and that any changes to the API are reflected in the tests.

This approach allows us to ensure that our API is always in sync with the OpenAPI description, and that any changes to the API are reflected in the tests.

## Sample Code

By integrating OpenAPI into our Spring Boot application with Kappa, we can easily validate requests and responses against the OpenAPI description without needing to generate code. This not only simplifies the development process but also ensures that our API is robust and reliable.

To help you get Kappa into your Spring Boot codebase, check out our sample code published on GitHub. Please take a look at [spring-design-first](https://github.com/bump-sh-examples/spring-design-first), and the [deployed documentation](https://bump.sh/bump-examples/hub/code-samples/doc/spring-design-first) is over here.
