---
title: Git Workflows for API Technical Writers
authors: james
canonical_url: 
excerpt: Explore the challenges and solutions of keeping your docs in sync with an evolving API design using git workflows.
---

Technical writers are often challenged with keeping API documentation in sync with an ever-evolving API design. This article explores the challenges and solutions for tackling this ongoing struggle, focusing on parallel development and leveraging automation to streamline the process.

## Benefits of Utilizing Git Workflows for API Documentation

Incorporating git into your technical writing workflow offers several advantages:

**Version control:** Git workflows ensure that all documentation changes are tracked and versioned, enabling easy rollback and historical analysis.

**Collaboration:** Git facilitates collaboration between technical writers and the development team, allowing for ongoing feedback and improvement.

**Automation:** Integration with CI/CD pipelines allows for automated documentation updates whenever the API codebase changes.

However, there isn't a one-size-fits-all approach. Let's explore common scenarios that technical writers will face and some workflow options for making the documentation process as smooth as possible.

## The Challenges of Technical Writing with Code-Generated Docs

Code annotations are a common method for generating OpenAPI specification documents directly from source code. Below is an example provided from the baeldung website on how [SpringDoc](https://www.baeldung.com/spring-rest-openapi-documentation), a Java-based Spring Boot library, helps produce OpenAPI Specification documents from Java code:

```java
@Operation(summary = "Get a book by its id")
@ApiResponses(value = { 
  @ApiResponse(responseCode = "200", description = "Found the book", 
    content = { @Content(mediaType = "application/json", 
      schema = @Schema(implementation = Book.class)) }),
  @ApiResponse(responseCode = "400", description = "Invalid id supplied", 
    content = @Content), 
  @ApiResponse(responseCode = "404", description = "Book not found", 
    content = @Content) })
@GetMapping("/{id}")
public Book findById(@Parameter(description = "id of book to be searched") 
  @PathVariable long id) {
    return repository.findById(id).orElseThrow(() -> new BookNotFoundException());
}
```

While this approach ensures that documentation is closely aligned with the codebase, it often results in documentation that is too technical, lacks an external consumer-based context, or is simply incomplete due to limited time. 

Additionally, technical writers are now forced to edit documentation from within the source code to make improvements. As you can imagine, editing source code with these annotations, while trying to focus on producing clear copy that improves the developer experience, is challenging at best. 

If you are a technical writer working with a team generating OpenAPI-based documentation from source code, consider the following ideas to improve your workflow:

**Merge improved copy into the source**: Tech writers produce improved documentation to an engineer on the team that will merge it into the source code on behalf of the technical writer. While this is less efficient, it can help technical writers to improve the quality of documentation without changing existing development processes. For technical writers familiar with git and code, they may opt to perform the work themselves using a combination of feature branches and an existing CI/CD pipeline to verify that their changes didn’t break any code. 

**Use code annotations for one-time generation**: Rather than using code annotations as the only API documentation method, consider generating the OpenAPI Specification once, then adopting the OpenAPI Specification document as the primary source of truth. This avoids the need for technical writers to edit source code, while reducing the need to author a YAML-based OpenAPI document from scratch. In this scenario, the OpenAPI document may be kept in the same or separate repository. 

**OpenAPI specification overlays**: The use of [OpenAPI overlays](https://github.com/OAI/Overlay-Specification) allows the technical writer to replace a portion of an existing OpenAPI document with new content. This allows technical writers to enrich the documentation without cluttering the codebase while operating independently. Overlay support varies by vendor, but is supported [by Bump.sh](https://docs.bump.sh/help/specification-support/overlays/). 

## For Greenfield API Design, Collaboration is Key

By using a design-first approach for new (greenfield) APIs,, the development team prioritizes API design before code. This is accomplished by creating the OpenAPI document before implementing the API code. The OpenAPI document becomes the source of truth for how the API is to be implemented and is kept up-to-date and design decisions are made. 

Unfortunately, technical writers may be often left out of the design process. Involving technical writers in the API design process has several advantages:

- **Design Input**: Technical writers can provide input on design decisions from a documentation perspective, advocating for clarity, consistency, and usability.
- **User-Centric Documentation**: Early involvement helps ensure that the documentation meets the needs of its target audience from the very beginning.
- **Aligning Documentation with API Strategy**: Helps in creating documentation that is not only informative but also aligns with the broader goals of the API program.

The biggest challenge with this approach is keeping track of the changes that are made to prevent the OpenAPI document from drifting away from the actual implementation. Tools like [Bump.sh](https://bump.sh) can generate automated diffs, highlighting changes in code or documentation that might impact the other. This fosters better communication between engineers and technical writers, and helps prepare for new releases.

## Git Workflow Conflicts: The Case for Separate Repositories

In some organizations, the workflow of the engineering teams may conflict with that of a technical writer. These conflicts may prevent technical writers from being able to update documentation stored within the same git repository, resulting in waiting for development cycles to be complete. Or, perhaps the changes being made by a technical writer to API documentation is slowing down developers as they are forced to deal with extra feature branches and merging requirements. 

In this case, it may be best to store your API documentation in a separate git repository. Storing API documentation in a separate repository from the code can provide several advantages:

- **Flexibility in Documentation Management**: Allows documentation to be updated independently from the code, facilitating updates and revisions without needing to touch the codebase.
- **Version Control for Documentation**: Helps maintain a history of changes specifically for documentation, making it easier to track and revert changes if necessary.
- **Collaboration Across Teams**: Enables non-developers, like technical writers and product managers, to contribute more easily to the documentation process.

Of course, a separate CI/CD pipeline process will need to be created to support the automatic build and publication process of the API documentation. Plus, API documentation can easily become out of sync with the code. 

To ease this workflow, consider using [diff tooling](https://bump.sh) to help identify documentation or code that has changed, requiring updates to one or both git repositories. This makes it easier to plan your technical writing schedule by quickly identifying areas in need of updated documentation. 

## Conclusion

Coordinating API documentation with software engineering is an ongoing challenge. By embracing separate repositories, leveraging OpenAPI overlays, and utilizing automation tools, technical writers can work effectively alongside engineers to deliver exceptional API experiences. This not only improves the quality of the API documentation but also enhances the overall developer experience, leading to a more successful API program.
