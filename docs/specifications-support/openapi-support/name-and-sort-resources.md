## Endpoints and Webhooks are resources

REST APIs are composed of a set of possible requests, from server to server.

- Endpoints are request that can be generated from an external server to the API, and the API responds. Endpoints are stored with OpenAPI under resource `paths`

OR

- Webhooks are requests that can be generated from the API to the external server, after a specific event occurred. Webhooks are stored with OpenAPI 3.1 under resource `webhooks`

Here's how we describe, sort and group these resources, based on an OpenAPI specification example. Below is an overview of the full specification you can find on [OpenAPI Specification examples repo.](https://github.com/OAI/OpenAPI-Specification/blob/master/examples/v3.0/petstore.yaml)

```yaml
openapi: "3.0.0"
info:
  title: Swagger Petstore
paths:
  /pets:
    get:
      summary: List all pets
      operationId: listPets
      tags:
        - all pets
      # ...

    post:
      summary: Create a pet
      operationId: createPets
      tags:
        - single pet
      # ...
  /pets/{petId}:
    get:
      summary: Info for a specific pet
      operationId: showPetById
      tags:
        - single pet
      # ...

```

There are three operations here, and three different ways to generate, group and order them, regarding option chosen for **How to group operations?**

![Group by path or group by tag?](/files/-MU8HgDhZXrUBOih-Aa4.png)

### Group by path

In this case, we deduce endpoint name from related `path`. First part of the path is extracted to generate the `endpoint` name, and every operation related to this endpoint name will be grouped together.


Let's Bump it up to something visual with a first [Petstore live example](https://bump.sh/hub/examples/doc/petstore):

![Group petstore operations by path](/files/-MUJe7kuSWbH7xA9Cwhy.png)

Operations `GET`  and `POST` from `/pets` , and `GET` from `/pets/{petId}` are grouped under same endpoint `Pets` (first part of the path), and their names are generated from field `summary`

### Group by tag

You may have noticed they are two different `tags` for these 3 operations: "all pets" and "single pet" . If you chose option "Group by tag", we'll use these values to group, name and sort these operations. Here is our second [Petstore live example](https://bump.sh/hub/examples/doc/petstore-grouped-by-tags), based on the same specification, with option "Group by tag" :

![Group Petstore operations by tag](/files/-MUJj6SDDPshQJ1uqwYp.png)

This option **group by tag** allows a better customization of your doc, by overriding resources name. And, last but not least, there is a feature that'd allow you to override how your `endpoints` are ordered: a first level field `tags`, available at  [OpenAPI root document object](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md#openapi-object).

```yaml
tags:
  - name: single pet
  - name: all pets
paths:
  # ...
```

With these first level tags, endpoints 'Single Pet' would be displayed above 'All pets' on your documentation.

### Webhooks

And what about webhooks?

It's quite well explained how webhooks name is generated from `summary`, `description`  in [Webhooks documentation's page](undefined). But by choosing option "Group Operations by tag?", `webhooks` are displayed, grouped and ordered with same rule than `endpoints.`

_⚠️ Be careful about webhooks without tags then, they would be ignored!_

Two possibilities for this OpenAPI 3.1 documentation with endpoints and webhooks, on our [examples hub](https://bump.sh/hub/examples):

- [Resources grouped by path](https://bump.sh/hub/examples/doc/webhooks-extended)
- [Resources grouped by tags](https://bump.sh/hub/examples/doc/webhooks-extended-grouped-by-tags)

Finally, we hope these options will help you build the most readable documentations, feel free to [contact us](mailto:hello@bump.sh) if you need support or have some suggestion.

