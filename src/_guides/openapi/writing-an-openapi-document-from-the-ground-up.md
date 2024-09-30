---
title: Writing an OpenAPI Document from the Ground Up
authors: james
excerpt: A step-by-step guide for authoring OpenAPI documents, starting from the essentials and expanding upon the details of your API. 
---

Composing an OpenAPI document can be daunting, especially during the early stages of API design. Your API design will need to evolve as you learn more about the problem space. To avoid needing to re-write large portions of your OpenAPI document, [I recommend a phased approach](https://addrprocess.com) to designing and documenting your API. The process starts with a breadth-first approach, capturing the essentials of the API including purpose and scope, then adding high-level operational descriptions. Finally, add more detail as you gain insights and receive feedback, until your OpenAPI document is complete. 

In this article, we will break the OpenAPI documentation process into three phases, with steps within each phase to help you get the most out of your document. Each phase will keep your OpenAPI document syntactically valid for input to your tool chain. To see the process in action, we will use an example TODO list API to show how you can iteratively produce your OpenAPI document as you gain a deeper understanding of the needs of your developers.

## Introducing the TODO API

To understand the phased approach, let’s use a simple TODO API example. The API will support the following operations:

* Add a new task - `POST /tasks`
* View a task - `GET /tasks/{taskId}`
* Update a task - `PUT /tasks/{taskId}`
* Delete a task - `DELETE /tasks/{taskId}`
* List tasks - `GET /tasks`

While we could add more operations, this API will provide a good sample of operations to better understand how to iteratively compose our OpenAPI documentation. Let’s get started by first capturing the `info` section. 

If you are new to the OpenAPI Specification, check out our article titled, [“What is OpenAPI?”](https://docs.bump.sh/guides/openapi/specification/v3.1/introduction/what-is-openapi/) to gain better understanding prior to jumping into this step-by-step guide. 

***Looking for an OpenAPI reference? Be sure to check out the [OpenAPI Cheat Sheet](https://bump.sh/blog/openapi-31-cheatsheet/).***

## Phase 1: Create the Info Section

The `info` block is crucial as it contains essential metadata about your API, including the title, description, version, and terms of service. It helps readers quickly understand what your API does and the terms associated with its use.

### Step 1.1: Define the API Title

- **Objective:** Create a descriptive and succinct title that is SEO-friendly.
- **Guidelines:**
  - Be descriptive enough so that the reader immediately understands what the API offers.
  - Avoid generic and vague terms like 'service', 'manager', and 'controller', which do not provide insight into the API's functionality and leaks implementation details.
- **Actions:**
  - Create the boilerplate of the document, including `openapi` and `info` sections
  - Add a thoughtful title using the guidelines above

**Example:**

```yaml
openapi: 3.0.0
info:
  title: Personal TODO List API
  version: 1.0.0
```

### Step 1.2: Write a Compelling API Description

- **Objective:** Offer a clear summary of what the API does, its scope, and capabilities.
- **Actions:** Add a description of the API
- **Tips:**
  - Include purpose and scope to clarify the API's intent.
  - Mention key digital capabilities to outline what the API can do.
  - Highlight the workflow or typical use cases to guide the reader on how to implement the API effectively.
  - Utilize Markdown for formatting to enhance readability and structure of the content.

**Example:**

```yaml
openapi: 3.0.0
info:
  title: Personal TODO List API
  version: 1.0.0
  description: 
    This API allows an individual to manage a simple list of tasks. 
    
    Tasks have a status of 'new' when first created and should be moved to 'in progress' when the task has begun and 'completed' once the task is finished.
```

### Step 1.3: Include Additional Metadata
- **Objective:** Add additional metadata and a boilerplate section to ensure the document is syntactically valid. 
- **Actions:** Add the following sections:
  - **Contact Details:** Add relevant contact information like an email, phone number, or a link to your API support or contact page.
  - **Licensing Details:** Specify the API's license type and include a link to the full license text if available.
  - **Version:** Note the current version of the API document, which is important for users to track changes and updates.
  - **Servers:** If you know the URL(s) for your servers, go ahead and put them here. Otherwise, you can add them later. 
  - **Paths:** Since we focused on the info section for now, let’s create an empty paths section to ensure the file will validate without any errors. 

**Example:**

```yaml
openapi: 3.0.0
info:
  title: Personal TODO List API
  version: 1.0.0
  description: 
    This API allows an individual to manage a simple list of tasks. 
    
    Tasks have a status of 'new' when first created and should be moved to 'in progress' when the task has begun and 'completed' once the task is finished.
  contact:
    email: api-support@todolist.local
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
  termsOfService: https://onlinestore.com/terms    
paths: {}
```

### Step 1.4: Review and Revise
- **Objective:** Ensure clarity, accuracy, and effectiveness of the information provided.
- **Action:** Review the `info` section with stakeholders, revise based on feedback, and keep it updated as changes occur in services or terms. Validate that the OpenAPI document is valid using your favorite editor or the [Swagger Editor](https://editor.swagger.io) as a quick check. 

For more information on improving your `info` section, refer to the article titled, [“Enriching Your OpenAPI Info Documentation for Understanding”](https://docs.bump.sh/guides/technical-writing/enriching-your-openapi-info-documentation-for-understanding/)

## Phase 2: Capture High-Level Operation Details

Next, let’s capture some basic operation details. This will include the paths and HTTP methods our API will offer, along with some summary and description details. We will expand the operations further in the final phase. For now, focus on identifying all of the operations you will need to capture. 

> You may be thinking that the next step is to capture schema components. However, I’ve found that taking a breadth-based approach to the operations first offers a better opportunity to identify all necessary schema components without getting too deep too quickly. 
{: .info}

### Step 2.1: Capture Paths and HTTP Methods

- **Objective:** Capture the basic framework of API operations before adding details.
- **Action:** Focus on capturing all API operations using only the paths and HTTP methods. Additional details will be added later. 
- **Guidelines:**
  - Each operation is specified under the `paths` object in the OAS.
  - Operations are defined by HTTP methods like GET, POST, PUT, PATCH, DELETE, etc.

**Example:**

```yaml
paths:
  /tasks:
    get:
    post:
  /tasks/{taskId}:
    get:
    delete:
    put:
```

### Step 2.2: Capture Operation Summaries and Descriptions
- **Objective:** Document the purpose and details of each API operation.
- **Actions:** 
  - Write a short summary about the purpose of each operation, along with a more detailed description. 
  - Add an `operationId` to provide a unique name to each operation which can be useful for linking and clarity.
- **Tips:**
  - The summary of each operation will be the first thing the reader sees, so spend time crafting a thoughtful summary.
  - The description should provide further context on when (and when not) to use the specific operation to give the reader confidence that they are in the right place. 
  - Utilize Markdown for formatting the descriptions to include bold, italics, bullet points, and links.
  - Be descriptive and avoid generic phrases; provide enough context to understand the operation's utility and execution.

**Example:**

```yaml
paths:
  /tasks:
    get:
      summary: List available tasks on the TODO list
      description: 
        Lists tasks that have been created, with a default filter of 'new' and 'in progress' tasks unless specified otherwise
      operationId: listTasks
    post:
      summary: Add a new task to the TODO list
      description:
        Adds a new task to the TODO list and sets the status to 'new'
      operationId: addTask
  /tasks/{taskId}:
    get:
      summary: Retrieve the details for a task on the TODO list
      description:
        Returns the details for a task from the TODO list by identifier
      operationId: getTask
    delete:
      summary: Remove a task from the TODO list
      description:
        Permanently removes a task from the TODO list. If a task was completed, use `PUT /tasks/{taskId}` to update its status to 'completed'
      operationId: removeTask
    put:
      summary: Update a task on the TODO list
      description:
        Updates a specific task's details and/or status
      operationId: updateTask
```

Refer to the guide [“https://docs.bump.sh/guides/technical-writing/5-improvements-to-openapi-operation-documentation/”](https://docs.bump.sh/guides/technical-writing/5-improvements-to-openapi-operation-documentation/) for tips on improving your API operation documentation. 

### Step 2.3: Assign Tags to Group Operations
- **Objective:** Identify a few tags that will group API operations
- **Action:** Add a `tags` section to each API operation, along with a `tags` description section to name each of your tags. 
- **Guidelines:** If your API contains multiple operations that could be grouped, using tags helps the reader to find the operation they need quickly. 

***Example:***

```yaml
tags:
  - name: Manage Tasks
    description: Supports task management such as adding, updating, and deleting tasks
  - name: View Tasks
    description: Lists all tasks or retrieves the details for a specific task
paths:
  /tasks:
    get:
      summary: List available tasks on the TODO list
      description: 
        Lists tasks that have been created, with a default filter of 'new' and 'in progress' tasks unless specified otherwise
      operationId: listTasks
      tags:
        - View Tasks
    post:
      summary: Add a new task to the TODO list
      description:
        Adds a new task to the TODO list and sets the status to 'new'
      operationId: addTask
      tags:
        - Manage Tasks
  /tasks/{taskId}:
    get:
      summary: Retrieve the details for a task on the TODO list
      description:
        Returns the details for a task from the TODO list by identifier
      operationId: getTask
      tags:
        - View Tasks
    delete:
      summary: Remove a task from the TODO list
      description:
        Permanently removes a task from the TODO list. If a task was completed, use `PUT /tasks/{taskId}` to update its status to 'completed'
      operationId: removeTask
      tags:
        - Manage Tasks
    put:
      summary: Update a task on the TODO list
      description:
        Updates a specific task's details and/or status
      operationId: updateTask
      tags:
        - Manage Tasks
```

Refer to our guide, [“Using OpenAPI and AsyncAPI Tags to Better Organize API Endpoints”](https://docs.bump.sh/guides/api-basics/openapi-asyncapi-tags-organize-endpoints/) for further details on using tagging in your OpenAPI description.

### Step 2.4: Capture Path Parameters and Query Arguments
- **Objective:** Capture path parameter and query argument details.
- **Action:** Add any path parameters and query arguments to each operation, with a clear description, type/format, and required boolean value.

***Example:***

```yaml
paths:
  /tasks:
    get:
      # ... hidden for readability ...
      parameters: 
      - name: status
        in: query
        required: false
        description: Filters the list of tasks by the status provided
        schema:
          type: string
    post:
      summary: Add a new task to the TODO list
      # ... hidden for readability ...
  /tasks/{taskId}:
    parameters:
      - name: taskId
        in: path
        required: true
        description: The ID of the task to operate on
        schema:
          type: integer
    get:
      summary: Retrieve the details for a task on the TODO list
      # ... hidden for readability ...
    delete:
      summary: Remove a task from the TODO list
      # ... hidden for readability ...
    put:
      summary: Update a task on the TODO list
      # ... hidden for readability ...
```

### Step 2.5: Document Expected Responses
- **Objective:** Specify the success and error response codes for each operation.
- **Action:** Add responses for success and error codes to each operation, including a description. The response details will be expanded in the final phase.

***Example:***

```yaml
paths:
  /tasks:
    get:
      summary: List available tasks on the TODO list
      # ... hidden for readability ...
      responses:
        '200':
          description: Returns a list of Tasks, with any request filters applied
    post:
      summary: Add a new task to the TODO list
      # ... hidden for readability ...
      responses:
        '201':
          description: Task created successfully
  /tasks/{taskId}:
    # ... hidden for readability ...
    get:
      summary: Retrieve the details for a task on the TODO list
      # ... hidden for readability ...
      responses:
        '200':
          description: Returns the details of the retrieved task
    delete:
      summary: Remove a task from the TODO list
      # ... hidden for readability ...
      responses:
        '204':
          description: Task deleted successfully
        '404':
          description: Task not found by the ID provided
    put:
      summary: Update a task on the TODO list
      # ... hidden for readability ...
      responses:
        '200':
          description: Task updated successfully
        '404':
          description: Task not found by the ID provided
```

Of course, feel free to add more responses to your document, such as `400` when the resource representation lacks required fields or valid values when we create and update a Task. 

### Step 2.6: Review and Validate
- **Objective:** Ensure the accuracy and completeness of the operation documentation.
- **Action:** Test each operation using your editor to ensure you have addressed any syntax errors as you review your operation overview details. 

As a review, here is what we have captured so far in our validated OpenAPI document:

```yaml
openapi: 3.0.0
info:
  title: Personal TODO List API
  version: 1.0.0
  description: 
    This API allows an individual to manage a simple list of tasks. 
    
    Tasks have a status of 'new' when first created and should be moved to 'in progress' when the task has begun and 'completed' once the task is finished.
  contact:
    email: api-support@todolist.local
  license:
    name: Apache 2.0
    url: https://www.apache.org/licenses/LICENSE-2.0.html
  termsOfService: https://onlinestore.com/terms    
servers: 
  - url: 'https://api.todolist.local/v1'
tags:
  - name: Manage Tasks
    description: Supports task management such as adding, updating, and deleting tasks
  - name: View Tasks
    description: Lists all tasks or retrieves the details for a specific task
paths:
  /tasks:
    get:
      summary: List available tasks on the TODO list
      description: 
        Lists tasks that have been created, with a default filter of 'new' and 'in progress' tasks unless specified otherwise
      operationId: listTasks
      tags:
        - View Tasks
      parameters: 
      - name: status
        in: query
        required: false
        description: Filters the list of tasks by the status provided
        schema:
          type: string
      responses:
        '200':
          description: Returns a list of Tasks, with any request filters applied
    post:
      summary: Add a new task to the TODO list
      description:
        Adds a new task to the TODO list and sets the status to 'new'
      operationId: addTask
      tags:
        - Manage Tasks
      responses:
        '201':
          description: Task created successfully
  /tasks/{taskId}:
    parameters:
      - name: taskId
        in: path
        required: true
        description: The ID of the task to operate on
        schema:
          type: integer
    get:
      summary: Retrieve the details for a task on the TODO list
      description:
        Returns the details for a task from the TODO list by identifier
      operationId: getTask
      tags:
        - View Tasks
      responses:
        '200':
          description: Returns the details of the retrieved task
    delete:
      summary: Remove a task from the TODO list
      description:
        Permanently removes a task from the TODO list. If a task was completed, use `PUT /tasks/{taskId}` to update its status to 'completed'
      operationId: removeTask
      tags:
        - Manage Tasks
      responses:
        '204':
          description: Task deleted successfully
        '404':
          description: Task not found by the ID provided
    put:
      summary: Update a task on the TODO list
      description:
        Updates a specific task's details and/or status
      operationId: updateTask
      tags:
        - Manage Tasks
      responses:
        '200':
          description: Task updated successfully
        '404':
          description: Task not found by the ID provided
```

In the final phase, we will add the final details for the documentation to make it complete. 

## Phase 3: Capture Schema and Remaining Operation Details

This is the final pass of our documentation effort, focusing on adding schema components and any remaining operation details for our API. 

### Step 3.1: Add Request and Response Details

- **Objective:** Add request and response details, including JSON refs that will point to our future schema components.
- **Action:** Add `requestBody` and response `content` to each operation’s request and response. 
- **Tips:**
  - Add JSON refs for the schema component definitions that you will need to add. We will add those in the next step, but adding the JSON refs will help us identify what we need. 

**Example:**

```yaml
paths:
  /tasks:
    get:
      summary: List available tasks on the TODO list
      # ... hidden for readability ...
      responses:
        '200':
          description: Returns a list of Tasks, with any request filters applied
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Task'
    post:
      summary: Add a new task to the TODO list
      # ... hidden for readability ...
      responses:
        '201':
          description: Task created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
  /tasks/{taskId}:
    # ... hidden for readability ...
    get:
      summary: Retrieve the details for a task on the TODO list
      # ... hidden for readability ...
      responses:
        '200':
          description: Returns the details of the retrieved task
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
    delete:
      summary: Remove a task from the TODO list
      # ... hidden for readability ...
      responses:
        '204':
          description: Task deleted successfully
        '404':
          description: Task not found by the ID provided
    put:
      summary: Update a task on the TODO list
      # ... hidden for readability ...
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Task'
      responses:
        '200':
          description: Task updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
        '404':
          description: Task not found by the ID provided
```

### Step 3.2: Add Missing Schema Components
- **Objective:** Specify reusable schema components that are referenced across operations. 
- **Action:** Add schema components referenced from the previous step, including the type, format, and other details.

**Example:**

```yaml
components:
  schemas:
    Task:
      type: object
      description: Represents a task with a status indicating its progression.
      properties:
        id:
          type: integer
          description: The unique identifier for a task.
        description:
          type: string
          description: A brief summary of the task.
        status:
          type: string
          description: The current status of the task, which can be 'new', 'in progress', or 'completed'.
          enum:
            - new
            - in progress
            - completed
          default: new
```

### Step 3.3: Capture Operation Security Requirements
- **Objective:** Specify the authentication and authorization requirements for each operation.
- **Action:** Add required `securitySchemes` and the required scopes for each operation under the `security` field.

**Example:**

```yaml
paths:
  /tasks:
    get:
      summary: List available tasks on the TODO list
      # ... hidden for readability ...
      security:
        - oauth2:
            - task:read
      # ... hidden for readability ...
    post:
      summary: Add a new task to the TODO list
      # ... hidden for readability ...
      security:
        - oauth2:
            - task:create
      # ... hidden for readability ...
  /tasks/{taskId}:
    # ... hidden for readability ...
    get:
      summary: Retrieve the details for a task on the TODO list
      # ... hidden for readability ...
      security:
        - oauth2:
            - task:read
      # ... hidden for readability ...
    delete:
      summary: Remove a task from the TODO list
      # ... hidden for readability ...
      security:
        - oauth2:
            - task:delete
      # ... hidden for readability ...
    put:
      summary: Update a task on the TODO list
      # ... hidden for readability ...
      security:
        - oauth2:
            - task:update
      # ... hidden for readability ...
components:
  # ... hidden for readability ...
  securitySchemes:
    oauth2:
      type: oauth2
      flows:
        authorizationCode:
          authorizationUrl: https://api.todolist.local/oauth/authorize
          tokenUrl: https://api.todolist.local/oauth/token
          scopes:
            task:read: Authorization to Read tasks
            task:create: Authorization to Create tasks
            task:update: Authorization to Update tasks
            task:delete: Authorization to Delete tasks
```
### Step 3.4: Add Examples to Operations and Schema Components
- **Objective:** Expand the documentation to include examples for better understanding.
- **Action:** Add examples for schema components, request parameters, and request/response objects. 

**Example:**

```yaml
paths:
  /tasks:
    get:
      summary: List available tasks on the TODO list
      # ... hidden for readability ...
      parameters: 
      - name: status
        in: query
        required: false
        description: Filters the list of tasks by the status provided
        schema:
          type: string
          example: 'completed'
      responses:
        '200':
          description: Returns a list of Tasks, with any request filters applied
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/Task'
              examples:
                tasks:
                  value: 
                    - id: 1
                      description: "Buy milk"
                      status: "completed"
                    - id: 2
                      description: "Send email to John"
                      status: "in progress"
    post:
      summary: Add a new task to the TODO list
      # ... hidden for readability ...
      responses:
        '201':
          description: Task created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
              examples:
                task:
                  value:
                    id: 3
                    description: "Read a book"
                    status: "new"
  /tasks/{taskId}:
    parameters:
      # ... hidden for readability ...
    get:
      summary: Retrieve the details for a task on the TODO list
      # ... hidden for readability ...
      responses:
        '200':
          description: Returns the details of the retrieved task
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Task'
              examples:
                task:
                  value:
                    id: 3
                    description: "Read a book"
                    status: "new"
    delete:
      summary: Remove a task from the TODO list
      # ... hidden for readability ...
    put:
      summary: Update a task on the TODO list
      # ... hidden for readability ...
components:
  schemas:
    Task:
      type: object
      description: Represents a task with a status indicating its progression.
      properties:
        id:
          type: integer
          description: The unique identifier for a task.
          example: 1
        description:
          type: string
          description: A brief summary of the task.
          example: "Buy milk"
        status:
          type: string
          description: The current status of the task, which can be 'new', 'in progress', or 'completed'.
          enum:
            - new
            - in progress
            - completed
          default: new
          example: "new"
  securitySchemes:
    # ... hidden for readability ...
```

### Step 3.5: Review and Validate
- **Objective:** Ensure the accuracy and completeness of the OpenAPI document.
- **Action:** Test each operation using your editor to ensure you have addressed any syntax errors across the entire document. 

At this point, we have a complete and valid OpenAPI document. We can always go back and improve any `summary`, `description`, and `example` entries to make sure they are clear to the reader. 

## Key Takeaways

As we wrap up this guide on creating an OpenAPI document for a TODO list API, it's important to reflect on the iterative nature of API design and documentation. Starting with a basic structure and gradually enriching the details allows you to adapt to changes and insights gained throughout the development process.

1. **Start with Essentials**: Begin with essential metadata in the `info` section and expand to operation details and security specifications. This approach keeps the initial setup manageable and scales complexity as you expand your documentation.

2. **Iterative Refinement**: With each phase of the documentation process, revisit and refine previous sections. This iterative refinement ensures that the document evolves alongside the API, maintaining accuracy and relevance.

3. **Engage Stakeholders**: Regularly review the API documentation with stakeholders, including developers, product managers, and potential API consumers. Their feedback is invaluable in shaping a practical and user-friendly API.

4. **Utilize Examples**: Including examples throughout your OpenAPI document is important for clear understanding. They provide guidance on how the API operates in real-world scenarios, making the documentation both instructive and actionable.

5. **Security and Compliance**: Don't overlook the importance of accurately documenting security schemas and requirements. Clear documentation of authentication and authorization processes ensures that API consumers can securely interact with your API.

6. **Documentation as a Living Document**: Treat your OpenAPI documentation as a living document that grows and adapts. Changes in business requirements, user feedback, and technology should all trigger updates to ensure the documentation remains a reliable resource.

## Final Thoughts

The process of building and maintaining effective API documentation is continuous and dynamic. By adopting a phased approach, as demonstrated with our TODO list API, you create a strong foundation that accommodates growth and change. Remember, the ultimate goal is to provide clear, comprehensive, and usable documentation that serves both the creators and the consumers of the API.

Incorporating these practices into your API development lifecycle will not only improve the quality of your API's documentation but also its usability and longevity in the market.




