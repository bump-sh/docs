---
title: Mocking APIs with Microcks
authors: phil
excerpt: Create powerful API mocks to speed up client development using Microcks.
date: 2024-07-04
---

Mocking has a lot of meanings in computing, but in the world of APIs it's specifically about simulating an API. Simulating API's can have many uses, from stubbing out difficult systems from end-to-end testing to providing a harmless playground for users to make requests from documentation without having to build a whole new "sandbox" environment. The main use case is allowing API clients and stakeholders the ability to play around with an API before wasting time writing code that might not be helpful, and the process can be sped up massively using OpenAPI-based mocking tools like Microcks.

Mocking is often a very simplistic version of the API, focused more on the structure of the data than the specific data being sent. This can mean a mock API gives out static responses regardless of the request, but that in itself is pretty helpful. For example, making sure clients are integrating with the right expectations around data types: not mixing up integers and numeric strings, and help ensure the responses are being used properly in the user interface.

This guide will show you how to take the same OpenAPI documents that power your Bump.sh documentation and create mock APIs with Microcks, that can be stored run locally, in continuous integration environments, or hosted on a web server.


## Step 1: Set up Microcks locally

You don't have to run Microcks locally, but it never hurts to get a good understanding of software before trying to deploy it somewhere else. Microcks is built with Sprint Boot, but you can avoid thinking about that by using either [Docker](http://docker.io/) or [Podman](https://podman.io/) to install Microcks within a container.

Assuming you've got Docker installed and running, you can use following command to get Microcks running on your computer.

<!-- TODO after end of july 2024 change latest to latest-native -->
 
```
docker run -p 8585:8080 -it --rm quay.io/microcks/microcks-uber:latest
```

When that's done open a browser tab and point to the <http://localhost:8585> endpoint, changing the port if you picked a different one.

![](/images/guides/mocking-with-microcks/microcks-dashboard.png)

## Step 2: Add Your First API

There are several ways to get OpenAPI into Microcks, but for the sake of simplicity we're going to use the web interface to upload your OpenAPI. If you are just starting out and don't have any OpenAPI yet, why not use the [Train Travel API](https://github.com/bump-sh-examples/train-travel-api) for now. 

Once we've got Microcks loaded in the browser, click on "Importers", and click the "Upload" button.

![](/images/guides/mocking-with-microcks/upload-modal.png)

The modal that pops up is asking for an Artifact, which is referring to various documents that could describe an API, like a [Postman Collection](/guides/bump-sh-tutorials/try-requests-in-postman/) and other "API description documents". We can pop our OpenAPI in there, which is the same `openapi.yaml` document that you use to deploy to Bump.sh.

The question about primary or secondary artifacts can be ignored for now.

![](/images/guides/mocking-with-microcks/microcks-api-view.png)

Once you've uploaded, go to "APIs | Services" and click on your new API, which should have the same name as whatever was in the `info.title` of your OpenAPI. Below it you'll see a bunch of operations, which are all the endpoints that Microcks found in your OpenAPI.

## Step 3: Try out the Mock Endpoints

Open up one of the operations and see what Microcks thinks about it.

![](/images/guides/mocking-with-microcks/get-bookings.png)

You should see a URL which you can copy, and the sample JSON it has pulled from the OpenAPI `examples` object.

```
http://localhost:8585/rest/Train+Travel+API/1.0.0/bookings
```

It's basically:

```
<wherever microcks is running>/rest/<info.name>/<info.version>/<operation path>
```

If that operation has a GET method defined you can copy a curl command that'll look something like this:


```
curl -X GET 'http://localhost:8585/rest/Train+Travel+API/1.0.0/bookings' -H 'Accept: application/json'
```

Running this command will then return the sample Microcks was showing the web interface.

```json
{
  "data": [
    {
      "id": "bfc5af2c-f477-43c4-8bdf-a00bdb939d65",
      "trip_id": "efdbb9d1-02c2-4bc3-afb7-6788d8782b1e",
      "passenger_name": "John Doe",
      "has_bicycle": true,
      "has_dog": true
    },
    {
      "id": "b2e783e1-c824-4d63-b37a-d8d698862f1d",
      "trip_id": "b2e783e1-c824-4d63-b37a-d8d698862f1d",
      "passenger_name": "Jane Smith",
      "has_bicycle": false,
      "has_dog": false
    }
  ],
  "links": {
    "self": "https://api.example.com/bookings",
    "next": "https://api.example.com/bookings?page=2"
  }
}
```

Getting a collection is a handy first example, but next lets try working with resources. 

Microcks uses examples with a particular naming contention, pairing up request examples and response examples with the same name. The naming convention is is `<resource>_<id>`, so sticking with the Train Travel API, we could do this:

```yaml
 /bookings/{bookingId}:
    get:
      summary: Get a booking
      operationId: get-booking
      parameters:
        - name: bookingId
          in: path
          required: true
          description: The ID of the booking to retrieve.
          schema:
            type: string
            format: uuid
          examples: 
            booking_1725ff48-ab45-4bb5-9d02-88745177dedb:
              value: 1725ff48-ab45-4bb5-9d02-88745177dedb
            booking_bfc5af2c-f477-43c4-8bdf-a00bdb939d65:
              value: bfc5af2c-f477-43c4-8bdf-a00bdb939d65
      responses:
        '200':
          description: The booking details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Booking'
              examples:
                booking_1725ff48-ab45-4bb5-9d02-88745177dedb:
                  summary: John Doe
                  value:
                    id: 1725ff48-ab45-4bb5-9d02-88745177dedb
                    trip_id: efdbb9d1-02c2-4bc3-afb7-6788d8782b1e
                    passenger_name: John Doe
                    has_bicycle: true
                    has_dog: true
                booking_bfc5af2c-f477-43c4-8bdf-a00bdb939d65:
                  summary: Billy Bikeless
                  value:
                    id: bfc5af2c-f477-43c4-8bdf-a00bdb939d65
                    trip_id: efdbb9d1-02c2-4bc3-afb7-6788d8782b1e
                    passenger_name: Billy Bikeless
                    has_bicycle: false
                    has_dog: true
```

Upload that to Microcks again and it will now be aware of these two examples, and show you the mock URLs for both.

![](/images/guides/mocking-with-microcks/microcks-resources.png)

Now you can call either of them, and get different HTTP responses with the appropriate example data being used for each.

```
curl -X GET 'http://localhost:8585/rest/Train+Travel+API/1.0.0/bookings/1725ff48-ab45-4bb5-9d02-88745177dedb' -H 'Accept: application/json'

curl -X GET 'http://localhost:8585/rest/Train+Travel+API/1.0.0/bookings/bfc5af2c-f477-43c4-8bdf-a00bdb939d65' -H 'Accept: application/json'
```

This is already really useful, you could use this to build a read-only API client on your computer without needing the actual API to actually exist. 

If you need to send `POST`, `PUT` or `PATCH` requests you can do that too. Let's try sending a `POST` request. The "Copy to clipboard" functionality in Microcks won't automatically give you a predefined request body, but pop back over to your Bump.sh API docs to get a better curl example and it should look a bit like this.

```
curl -X POST 'http://localhost:8585/rest/Train+Travel+API/1.0.0/bookings' \
  -H 'Accept: application/json' \
  -H 'Content-type: application/json' \
  -d '{"passenger_name":"New Passenger","has_bicycle":false,"has_dog":false,"trip_id":"4f4e4e1-c824-4d63-b37a-d8d698862f1d"}'
```

```json
{
  "id": "efdbb9d1-02c2-4bc3-afb7-6788d8782b1e",
  "trip_id": "efdbb9d1-02c2-4bc3-afb7-6788d8782b1e",
  "passenger_name": "John Doe",
  "has_bicycle": true,
  "has_dog": true,
  "links": {
    "self": "https://api.example.com/bookings/efdbb9d1-02c2-4bc3-afb7-6788d8782b1e"
  }
}
```

That's somewhat handy, but it's showing me a generic response instead of the data sent in the POST request. Named examples would not help here, as we want to use client data from the request body and not just show predetermined examples. How can we New Passenger instead of John Doe, and how can we see the actual `trip_id` instead of the default one?

## Step 4: Customizing Responses

Mocks can be made just thats little bit more powerful with [dynamic mocking](https://microcks.io/documentation/explanations/dynamic-content/), made is possible through the [templating system](https://microcks.io/documentation/references/templates/) Microcks offers. Using a combination of predefined variables, built-in functions, and some JSON Pointers, we can provide a dynamic example in OpenAPI which put together a more useful response.

```yaml
responses:
  '201':
    description: Booking successful
    content:
      application/json:
        schema:
          # snip
        examples:
          new_booking:
            summary: New Booking
            value: |-
              {
                "id": "{{ uuid() }}",
                "trip_id": "{{ request.body/trip_id }}",
                "passenger_name": "{{ request.body/passenger_name }}",
                "has_bicycle": {{ request.body/has_bicycle }},
                "has_dog": {{ request.body/has_dog }},
                "links": {
                  "self": "https://api.example.com/bookings/1725ff48-ab45-4bb5-9d02-88745177dedb"
                }
              }
```

Go back to Importers, Upload the `openapi.yaml` document again, and it will merge changes into API so we can see how they look.

```
 curl -X POST 'http://localhost:8585/rest/Train+Travel+API/1.0.0/bookings' \
  -H 'Accept: application/json' \
  -H 'Content-type: application/json' \
  -d '{"passenger_name":"New Passenger","has_bicycle":false,"has_dog":false,"trip_id":"4f4e4e1-c824-4d63-b37a-d8d698862f1d"}'
```

Now we will see the values we sent showing back up, and the computed random UUID.

```
{
  "id": "a248a638-000a-44b4-b19b-0ca30507a940",
  "trip_id": "4f4e4e1-c824-4d63-b37a-d8d698862f1d",
  "passenger_name": "New Passenger",
  "has_bicycle": false,
  "has_dog": false,
  "links": {
    "self": "https://api.example.com/bookings/1725ff48-ab45-4bb5-9d02-88745177dedb"
  }
}
```

Finally, that HATEOAS link at the bottom there is not right. The id is `a248a638-000a-44b4-b19b-0ca30507a940`, so how can we get that showing up in the link? If we used `{{ uuid() }}` again it would be generate a second different UUID, Microcks templating has a brilliant feature called capture.

```yaml
examples:
  new_booking:
    summary: New Booking
    value: |-
      {
        "id": "{{ uuid() > put(bookingId) }}",
        "trip_id": "{{ request.body/trip_id }}",
        "passenger_name": "{{ request.body/passenger_name }}",
        "has_bicycle": {{ request.body/has_bicycle }},
        "has_dog": {{ request.body/has_dog }},
        "links": {
          "self": "https://api.example.com/bookings/{{ bookingId }}"
        }
      }
```

Upload that again. Run the command again. 

```yaml
{
  "id": "b4441c3d-b659-4f57-95d3-ce6ee592da7c",
  "trip_id": "4f4e4e1-c824-4d63-b37a-d8d698862f1d",
  "passenger_name": "New Passenger",
  "has_bicycle": false,
  "has_dog": false,
  "links": {
    "self": "https://api.example.com/bookings/b4441c3d-b659-4f57-95d3-ce6ee592da7c"
  }
}
```

Perfect! Now you can do almost anything you need to do with the API.

## Step 5: Deploy Microcks Somewhere

Working with Microcks locally was an OK way to get the hang of it, and could be useful for some solo developers, but the chances are you'll want to get this off your laptop and share it with people. 

You can deploy Microcks anywhere that takes Docker/Kubernetes instances, and they have lots of documentation on your [deployment options for Microcks](https://microcks.io/documentation/explanations/deployment-options/). 

One approach is to stick the Docker container into a managed Kubernetes cluster on Google Kubernetes Engine, which has free trials and free tiers to ease you into the process. 

![](/images/guides/mocking-with-microcks/gke-setup.png)

This puts Microcks behind a publicly accessible load balancer, so you can stick some DNS on it and have everyone able to call the hosted version of the mock server.

```
curl -X GET 'https://mocks.example.com/rest/Train+Travel+API/1.0.0/bookings'
```

Once this is done we can replace the manual uploads with some automatic solutions too. 

## Step 6: Automate Mock Updates

Whatever your work flow, the last thing you want to be doing is manually uploading OpenAPI documents whenever there are changes. There are two approaches you can take to keep your Microcks mocks up-to-date with your API as it evolves. 

### Option 1: Pull from Git

The Importer can be configured to poll a public URL to see if there are any changes to the OpenAPI.

![](/images/guides/mocking-with-microcks/importer-step1.png)
 
Learn more about the [Microcks Scheduler](https://microcks.io/documentation/guides/usage/importing-content/#2-import-content-via-importer)

### Option 2: Push with CLI, GitHub Actions, or API

Using the CLI on your continuous integration server, or using a GitHub Action, is probably how you are deploying to Bump.sh already, so it might make sense to do this with Microcks too. 

For example, if you've got Bump.sh deploying with GitHub Actions, you can add one more action after it to get it also pushing changes to Microcks.

```
# .github/workflows/bump.yml
name: Deploy API documentation

on:
  push:
    branches:
      - main

jobs:
  deploy-openapi:
    if: ${{ github.event_name == 'push' }}
    name: Deploy API documentation on Bump.sh
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: 68ac0647-184a-4e9d-accc-682a5b1f7189
          token: ${{secrets.BUMP_TOKEN}}
          file: api/openapi.yaml

      - uses: microcks/import-github-action@v1
        with:
          specificationFiles: 'api/openapi.yaml:true'
          microcksURL: 'https://mocks.example.com/api/'
          keycloakClientId:  ${{ secrets.MICROCKS_SERVICE_ACCOUNT }}
          keycloakClientSecret:  ${{ secrets.MICROCKS_SERVICE_ACCOUNT_CREDENTIALS }}
```

You'll need to set up some secrets on your repository for that microcks service account, but then you're done.

_Learn more about [Microcks Automation](https://microcks.io/documentation/guides/automation/)._
