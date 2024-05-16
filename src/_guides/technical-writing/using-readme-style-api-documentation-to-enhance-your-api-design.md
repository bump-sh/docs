---
title: Using README-style API Documentation to Enhance Your API Design
authors: james
canonical_url: 
excerpt: Take a user-centric approach to API documentation by leveraging README-style documentation to bridge the gap between individual operations and practical usage scenarios. 
---

A common pitfall of API documentation is focusing solely on documenting individual operations in isolation, neglecting the complexity of real-world workflows that involve chaining multiple operations together. While individual API operations often appear well-designed, the true test lies in how users can orchestrate these operations to achieve specific goals. This can lead to confusion and frustration for developers, hindering API adoption and ultimately compromising its effectiveness.

This article proposes a user-centric approach to API documentation, leveraging README-style documentation to bridge the gap between individual operations and practical usage scenarios. We will explore what README-style API documentation looks like, the value it provides, and how you can link this style of documentation into your [Bump.sh](https://bump.sh)-generated documentation set to improve the developer experience of your APIs. 

## OpenAPI Specification: Defining the Technical Foundation

Before diving into README-style documentation, it's crucial to establish a solid foundation using the OpenAPI Specification (OAS). This industry-standard format provides a machine-readable description of your API, including its endpoints, parameters, request/response structures, and error codes. Here's an example OAS snippet for a hypothetical e-commerce API:

```yaml
paths:
  /products/{productId}:
    get:
      summary: Get product information by ID
      parameters:
        - name: productId
          in: path
          required: true
          type: integer
      responses:
        200:
          description: Product details
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                  name:
                    type: string
                  ...
  /orders:
    post:
      summary: Create a new order
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                customer_id:
                  type: integer
                items:
                  type: array
                  items:
                    type: object
                    properties:
                      product_id:
                        type: integer
                      quantity:
                        type: integer
      responses:
        201:
          description: Order created
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
  /orders/{orderId}/items:
    post:
      summary: Add items to an existing order (updated endpoint)
      parameters:
        - name: orderId
          in: path
          required: true
          type: integer
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                items:
                  type: array
                  items:
                    type: object
                    properties:
                      product_id:
                        type: integer
                      quantity:
                        type: integer
      responses:
        200:
          description: Items added to order
```

Now that we understand the API a bit better, let’s look at how reference documentation generated from this OpenAPI Specification can create problems for your API consumers. 

## The Problem with Traditional API Documentation

Traditional API documentation often follows a technical reference approach, meticulously detailing each individual endpoint with its parameters, request/response formats, and error codes. While this information is valuable, it fails to capture the bigger picture of how users actually interact with the API.

Here's why this approach falls short:

*   **Limited Context:** Users are left guessing how to combine individual operations to achieve desired outcomes.
    
*   **Workflow Disconnect:** The documentation doesn't reflect the natural flow of user tasks, making it difficult to understand how to achieve specific goals.
    
*   **Lack of Practical Guidance:** Real-world examples and code snippets are often missing, leaving users to figure out the integration on their own.
    

This can lead to:

*   **Steeper Learning Curve:** Users struggle to grasp the overall API functionality and spend valuable time piecing together workflows from scattered documentation.
    
*   **Usability Issues:** Confusion and frustration arise when users encounter unexpected behavior or limitations not evident from individual operation descriptions.
    
*   **Delayed Adoption:** Users may be hesitant to adopt the API if the documentation doesn't provide a clear path to achieving their goals.
    

## README-style API Documentation: A User-Centric Approach

README-style API documentation shifts the focus from individual operations to user workflows. It presents API usage through practical scenarios, demonstrating how operations are chained together to achieve specific outcomes.

Here's what it entails:

*   **Workflow-Driven:** Documents showcase common user workflows or use cases, outlining the sequence of operations needed to accomplish specific tasks.
    
*   **Practical Examples:** Code snippets and step-by-step instructions guide users through the process, lowering the barrier to entry.
    
*   **Real-World Focus:** Examples are tailored to actual use cases, providing context and relevance for users.
    

This approach offers several benefits:

*   **Improved Usability:** Users can easily understand how to achieve their goals by following documented workflows.
    
*   **Early Feedback:** Observing user interactions with documented workflows can reveal design flaws and areas for improvement before the cost of change becomes higher due to the need for code changes.
    
*   **Enhanced Getting Started Guide:** README-style documentation provides a practical foundation for building a comprehensive getting started guide.
    

## Implementing README-style API Documentation

Here are some practical steps to get started:

1.  **Identify Common User Workflows:** Analyze user needs and identify common tasks they want to achieve using the API.
    
2.  **Craft Clear and Concise Workflows:** Document each workflow with a clear narrative, outlining the sequence of operations involved.
    
3.  **Utilize Code Snippets and Examples:** Provide code snippets in popular programming languages to illustrate the practical implementation of each workflow.
    
4.  **Integrate with Existing Tools:** Leverage existing documentation platforms and tools to seamlessly integrate README-style documentation with your API reference.
    
For many APIs, there may be a large number of workflows that could be generated. When this is the case, start with the most common workflows and expand as time allows. 

## Example: User Workflow with README-style Documentation

Let's consider our hypothetical e-commerce API, above, by documenting a common workflow of viewing product details, creating a new order, and adding the product to the order. Here's an example of a README-style workflow demonstrating this workflow:

**Workflow: Creating an Order and Adding Items**

This workflow demonstrates how to create a new order and add items to it using the e-commerce API:

**Step 1.  Get Product Information:**
    
Use the `/products/get` operation to retrieve information about the desired product(s).
    

```http
GET /products/123
```

**Step 2. Create a New Order:**

Use the /orders/create operation to create a new order.
    
```http
POST /orders 
{  
  "customer_id": 1,  
  "items": []
}
```

**Step 3. Add Items to Order:**
    
Use the `/orders/{orderId}/items` operation to add retrieved products to the newly created order.
    
```http
POST /orders/1/items

[  
  {    "product_id": 123,    "quantity": 2  },  
  {    "product_id": 456,    "quantity": 1  }
]
```

This workflow provides a clear step-by-step guide, eliminating ambiguity and simplifying the process for users.

## Using Bump.sh x-topic extensions

The [x-topic](https://docs.bump.sh/help/enhance-documentation-content/topics/#use-x-topics) extensions from Bump.sh offers a method of including these kinds of documentation details into your OpenAPI Specification document. In this case, you can enclose your content using Markdown into the OpenAPI Specification and allow the Bump.sh platform to render it. 

Below is an example of how this might be used, by playing x-topics at the top-level of your OpenAPI Specification document:

```yaml
x-topics:
- title: "Workflow Example: Creating an Order and Adding Items"
  content: |
This workflow demonstrates how to create a new order and add items to it using the e-commerce API:

**Step 1.  Get Product Information:**
    
Use the `/products/get` operation to retrieve information about the desired product(s).
    

```http
GET /products/123
```

**Step 2. Create a New Order:**
…
```

If you prefer not to include your workflows in your OpenAPI specification, you can also leverage [external JSON refs](https://docs.bump.sh/help/specification-support/references/#external-references) to decouple your workflow-based documentation from your API specification. 

## OpenAPI Workflow Specification: The Future of API Workflows

The OpenAPI Initiative is currently developing a dedicated OpenAPI Workflow Specification that aims to formally define and document API workflows. This specification will provide a structured approach to capturing the sequence of operations involved in achieving specific tasks, further enhancing the user experience and promoting better API design.

Here's a potential example of how the OpenAPI Workflow Specification could be used to capture the "Creating an Order and Adding Items" workflow:

```yaml
workflows:
  createOrderAndAddItems:
    description: Creates a new order and adds items to it.
    steps:
      - operationId: getProductById
        path: /products/{productId}
      - operationId: createOrder
        path: /orders
      - operationId: addItemsToOrder
        path: /orders/{orderId}/items
```

This example demonstrates how the workflow defines the sequence of operations involved, along with their corresponding operation IDs and paths. While this extension to the OpenAPI Specification is in its early days as of the time of this writing, it shows considerable promise. You can find out more by visiting the [OAI Workflows SIG](https://github.com/OAI/sig-workflows). 

### Conclusion

README-style API documentation empowers developers to design APIs that prioritize user experience. By focusing on real-world workflows and providing practical guidance, it fosters better understanding, reduces friction, and ultimately leads to more effective and user-friendly APIs.

Adopting this approach allows developers to:

*   Bridge the gap between technical specifications and practical usage.
    
*   Gather valuable user feedback through documented workflows.
    
*   Create comprehensive and user-friendly API documentation that promotes adoption.
    
Investing in README-style documentation leads to a more intuitive and user-centric API experience, ultimately driving better user engagement and API success. By leveraging the `x-topics` extension from Bump.sh and the OpenAPI Workflow Specification, you will have multiple options to provide a standardized and machine-readable format for capturing and sharing complex workflows.
