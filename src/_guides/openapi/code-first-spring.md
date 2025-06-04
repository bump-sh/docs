---
title: Generating OpenAPI docs for Java with Sprint Boot
authors: phil
excerpt: |
  Learn how to generate OpenAPI documentation for your Spring Boot application using Springdoc and Swagger Annotations.
date: 2025-06-04
---

API Code-first is the art of building an API, and then popping some annotations
or metadata in there to output API documentation in an API description format
like [OpenAPI](https://spec.openapis.org/oas/latest.html).

The most popular API Code-first approach in Spring uses a tool called
[Springdoc](https://springdoc.org/), which can generate OpenAPI v3.1 from any
Spring-based application (Boot, Web MVC, Webflux, etc). A basic skeleton will be
generated with absolutely no work whatsoever, then adding annotations will keep
improving the usefulness of the generated OpenAPI.

## Prerequisites

To follow this guide, you will need:

- [Java 21](https://www.oracle.com/java/technologies/downloads/) or later
- [Maven 3.5+](https://maven.apache.org/download.cgi) or [Gradle 7.5+](https://gradle.org/install/)
- A Spring Boot application, which you can create by following the [Spring Boot REST Service guide](https://spring.io/guides/gs/rest-service) or cloning down our [sample code](https://github.com/bump-sh-examples/spring-code-first).

Here's a few commands to help you out.

```bash
# check for java. v21 or above is fine
java --version

# check if maven or gradle are there
which mvn || which gradle
```

If you are new to working with Java applications it's recommended to use an IDE
like [IntelliJ IDEA](https://www.jetbrains.com/idea/) or [VS
Code](https://code.visualstudio.com/) (using this great guide to running [Spring
in VS Code](https://spring.io/guides/gs/guides-with-vscode)). You can use the
command line if you prefer.

## Creating OpenAPI with Springdoc

### Step 1: Install the Springdoc dependency

If you are using Maven, add the following dependency to your `pom.xml` file:

```xml
  <dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-api</artifactId>
    <version>2.8.8</version>
  </dependency>
```

If you are using Gradle, add this to your `build.gradle` file:

```groovy
dependencies {
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-api:2.8.8'
}
```

The `springdoc-openapi-starter-webmvc-api` package supports Spring MVC and
Spring Boot, but for Spring Webflux support use the
`springdoc-openapi-starter-webflux-api` package instead.

### Step 2: Configure Springdoc

You can customize the OpenAPI generation by adding properties to your
`application.properties` or `application.yml` file.

```properties
# application.properties
springdoc.api-docs.path=/openapi
```

Or if you are using YAML:

```yaml
# application.yml
springdoc:
  api-docs:
    path: /openapi
    title: My API
    version: 1.0.0
```

The path setting defines where the OpenAPI description will be available.
Springdoc makes it available on `http://localhost:8080/v3/api-docs` by default,
with the `v3` being a reference to OpenAPI v3.x, but you can change it to
something more suitable for your application. 

Why not a classy `/openapi` path so the OpenAPI description can be hosted on a
nice clean `http://localhost:8080/openapi` once the application is running.

### Step 3: Create/find some REST controllers

This step is less of a step, and more "have some controllers and models" which
you probably already do. Whether you are starting from scratch or looking at an
existing application, let's use the example of a `EmployeeController`, using
Hibernate and Spring Data JPA to make life a little easier.

```java
# src/main/java/com/bumpsh/demo/EmployeeController.java
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
  
  @GetMapping("/employees/{id}")
  Employee one(@PathVariable Long id) {
    
    return repository.findById(id)
      .orElseThrow(() -> new EmployeeNotFoundException(id));
  }

  // snipped PUT and DELETE for now
}
```

The repository is wrapping around the model to handle some tedious database
interaction, and the model looks like this: 

```java
# src/main/java/com/bumpsh/demo/Employee.java
import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
class Employee {

  private @Id
  @GeneratedValue Long id;
  private String name;
  private String role;

  // snip constructor, getters and setters
}
```
 
So far we've done absolutely nothing to this application code specific to
Springdoc or OpenAPI, but this is already enough for Springdoc to generate a
basic OpenAPI description.

### Step 4: Run the application

Boot up the Spring Boot application to install all the dependencies and start
the HTTP server.

If you are using an IDE, you can run the application directly from there. For
example, in IntelliJ IDEA, you can right-click on the main class (the one
annotated with `@SpringBootApplication`) and select "Run".

If you are using Maven, run:

```bash
mvn spring-boot:run
```

If you are using Gradle, run:

```bash
./gradlew bootRun
```

Once the application is running and the HTTP server is available, the OpenAPI
description will be available at <http://localhost:8080/openapi> for JSON, or
<http://localhost:8080/openapi.yaml> for YAML.

![](/images/guides/code-first-spring/springdoc-initial.png)

Very basic, and it's only saying "what" which misses out on the critical "why"
and "how" aspect of API documentation, but it will be a start. 

### Step 5: Deploy to Bump.sh

Before we get stuck into making this OpenAPI perfect, lets get used to deploying
it to Bump.sh so we can see how things look. Iterative improvements are easy
with Bump.sh, as it can be hooked up to deploy a new version of the
documentation every time a pull request is merged in.

If you're new to Bump.sh, [create your first
API](/help/getting-started/upload-your-first-definition/), then, retrieve the
name and token of this documentation from the _CI deployment_ settings page.
We'll use this to deploy the OpenAPI description with the Bump.sh CLI.

```bash
npm install -g bump-cli
```

Now we can deploy the OpenAPI description to Bump.sh using the `bump deploy` command.

```bash
$ bump deploy http://localhost:8080/openapi \
  --doc spring-code-first \
  --token my-documentation-token

* Your new documentation version will soon be ready at https://bump.sh/bump-examples/hub/code-samples/doc/spring-code-first
```

This can then be automated in your CI/CD pipeline, so every time you merge a
pull request, the OpenAPI description is automatically deployed to Bump.sh.
We'll show you how to do that in the end, but for now, let's focus on improving
the OpenAPI description.

### Step 6: Improve OpenAPI with Java annotations

The default OpenAPI description generated by Springdoc is a good start, but it
lacks context and explanations. To make it more useful, we can add annotations
to the controllers and models to provide additional information.

This is done with annotations from the `io.swagger.v3.oas.annotations` package,
which allows you to add  metadata around your controllers explaining their
paths, responses, and adding some descriptions that will help people understand
how things work when the documentation is built. 

**Adding Operation Annotations**

```java
# src/main/java/com/bumpsh/demo/EmployeeController.java
import io.swagger.v3.oas.annotations.Operation;

@RestController
class EmployeeController {

  // Add the @Operation annotation to the method
  @GetMapping("/employees/{id}")
  @Operation(summary = "Get an employee by ID", description = "Returns the details of an employee based on the provided ID")
  List<Employee> all() {
    return repository.findAll();
  }

  // Do this for each HTTP method in the controller
  @PostMapping("/employees")
  @Operation(summary = "Create a new employee", description = "Adds a new employee to the system")
  Employee newEmployee(@RequestBody Employee newEmployee) {
    return repository.save(newEmployee);
  }
}
```

Just adding operation names and descriptions is the first step to making your
OpenAPI documentation more useful. Lets take a look at the OpenAPI description
generated by Springdoc after adding these annotations.

```yaml
openapi: 3.1.0
info:
  title: OpenAPI definition
  version: v0
servers:
- url: http://localhost:8080
  description: Generated server url
tags:
- name: Employee Management
  description: Operations related to employee management
paths:
  /employees/{id}:
    get:
      tags:
      - Employee Management
      summary: Get an employee by ID
      description: Returns the details of an employee based on the provided ID
      operationId: one
      parameters:
      - name: id
        in: path
        required: true
        schema:
          type: integer
          format: int64
      responses:
        "404":
          description: Not Found
          content:
            '*/*':
              schema:
                type: string
        "200":
          description: OK
          content:
            '*/*':
              schema:
                $ref: "#/components/schemas/Employee"
```

Of course these example operations are very basic, but this is a good place to
get stuck into letting users know what to expect when they call your API. Is the
response paginated? Is there a default sort order? 

![](/images/guides/code-first-spring/operation-description.png)

**Tagging Controllers**

```java
# src/main/java/com/bumpsh/demo/EmployeeController.java

import io.swagger.v3.oas.annotations.tags.Tag;

// Add the @Tag annotation to the class
@RestController
@Tag(name = "Employee Management", description = "Operations related to employee management")
class EmployeeController {
  // ... existing code ...
}
```

**Adding Parameters**

Parameters can be added to the method using the `@Parameter` annotation. This is
useful for describing path parameters, query parameters, and request body
parameters.

These parameter annotations are applied to the method parameters, like this:

```java
# src/main/java/com/bumpsh/demo/EmployeeController.java
import io.swagger.v3.oas.annotations.Parameter;

@RestController
class EmployeeController {

  @GetMapping("/employees/{id}")
  @Operation(summary = "Find an employee", description = "Returns the details of an employee based on the provided ID")
  public Employee one(
      @Parameter(in = ParameterIn.PATH, description = "ID of the employee to retrieve", required = true, schema = @Schema(type = "integer")) 
      @PathVariable Long id) {
    // ... existing code ...
  }
}
```

This will add a parameter to the OpenAPI description for the `id` path variable,
which looks like this in the generated OpenAPI:

```yaml
paths:
  '/employees/{id}':
    get:
      parameters:
        - name: id
          in: path
          required: true
          description: ID of the employee to retrieve
          schema:
            type: integer
            format: int64
```

Parameter descriptions can contain all sorts of handy information, like letting people know that a date parameter is in ISO 8601 format, or that a
string parameter is a UUID. This is useful for consumers of the API to understand
how to use the API correctly without having to look at the code or ask questions.

![](/images/guides/code-first-spring/parameter-description.png)

**Adding Responses**

How about adding a response schema to the `@ApiResponse` annotation to describe
what the response body will look like? By default, Springdoc will use the return
type of the method to generate the response schema, but you can override this by
using the `@ApiResponse` annotation.

```java
# src/main/java/com/bumpsh/demo/EmployeeController.java

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
@RestController
class EmployeeController {

  @GetMapping("/employees/{id}")
  @Operation(summary = "Find an employee", description = "Returns the details of an employee based on the provided ID")
  @ApiResponse(
    responseCode = "200", 
    description = "Successful operation", 
    content = @Content(mediaType = "application/json", 
    schema = @Schema(implementation = Employee.class))
  )
  public Employee one(@PathVariable Long id) {
    // ... existing code ...
  }
```

**Annotating the Model**

To make the OpenAPI description even more useful, you can annotate the model
class to describe its properties. This is done using the `@Schema` annotation.

```java
# src/main/java/com/bumpsh/demo/Employee.java
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Schema(description = "Employees are individuals who work for an organization, " +
  "contributing their skills and expertise to achieve the organization's goals." +

  "Roles are the specific functions or positions that employees occupy within the organization, " +
  "defining their duties, responsibilities, and the scope of their work."
)
class Employee {

  private @Id

  @Schema(accessMode = Schema.AccessMode.READ_ONLY, description = "Unique identifier which should not be shared publicly", example = "1234")
  @GeneratedValue Long id;
  
  @Schema(description = "Employee name", example = "Bilbo Baggins")
  private String name;

  @Schema(description = "Employee role", example = "Software Engineer")
  private String role;

  Employee() {}

  Employee(String name, String role) {
    this.name = name;
    this.role = role;
  }

  // Getters and Setters
}
```

This will add a description to the `Employee` model, and also describe each
property with its type, description, and example value. The generated OpenAPI
will look like this:

```yaml
components:
  schemas:
    Employee:
      type: object
      description: "Employees are individuals who work for an organization, contributing\
        \ their skills and expertise to achieve the organization's goals.Roles are\
        \ the specific functions or positions that employees occupy within the organization,\
        \ defining their duties, responsibilities, and the scope of their work."
      properties:
        id:
          type: integer
          format: int64
          description: Unique identifier which should not be shared publicly
          example: 1234
          readOnly: true
        name:
          type: string
          description: Employee name
          example: Bilbo Baggins
        role:
          type: string
          description: Employee role
          example: Software Engineer
```


### Step 7: Deploy the improved OpenAPI description

Now that we've added some annotations to the controllers and models, we can
generate a new OpenAPI description and deploy it to Bump.sh.

Run the application again to generate the new OpenAPI description, and then
deploy it to Bump.sh using the `bump deploy` command.

```bash
$ bump deploy http://localhost:8080/openapi \
  --doc spring-code-first \
  --token my-documentation-token
* Your new documentation version will soon be ready at https://bump.sh/bump-examples/hub/code-samples/doc/spring-code-first
```

This will update the OpenAPI description on Bump.sh with the new version, which
will now include the additional context and explanations we added with the
annotations.

### Step 8: Automate the deployment

To automate the deployment of the OpenAPI description to Bump.sh, you can add a
step in your CI/CD pipeline to run the `bump deploy` command every time a pull
request is merged. This way, the OpenAPI description will always be up-to-date
and available on Bump.sh.
You can use a CI/CD tool like GitHub Actions, GitLab CI, or Jenkins to run the
deployment command automatically.
For example, if you are using GitHub Actions, you can create a workflow file
`.github/workflows/deploy-openapi.yml` with the following content:

```yaml
name: Deploy OpenAPI to Bump.sh
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up JDK
        uses: actions/setup-java@v2
        with:
          java-version: '21'

      - name: Build and run the application
        run: |
          ./mvnw clean package spring-boot:run &

      - name: Wait for the application to start
        run: sleep 30

      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: <BUMP_DOC_ID>
          token: ${{secrets.BUMP_TOKEN}}
          file: http://localhost:8080/openapi
```

This workflow will run every time a commit is pushed to the `main` branch, build
the application, wait for it to start, and then deploy the OpenAPI description to
Bump.sh using the `bump deploy` command. Make sure to set the `BUMP_TOKEN` secret
in your GitHub repository settings with the token you retrieved from the Bump.sh
CI deployment settings page.


## Sample Code

The sample code for this guide is published on GitHub so you can try that if
you're having trouble adding it to your application:
[spring-code-first](https://github.com/bump-sh-examples/spring-code-first), and
the [deployed
documentation](https://bump.sh/bump-examples/hub/code-samples/doc/spring-code-first)
is over here.
