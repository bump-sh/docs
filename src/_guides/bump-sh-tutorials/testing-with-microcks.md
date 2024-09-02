---
title: Contract Testing APIs with Microcks
authors: phil
excerpt: Make sure your APIs are doing what you expect them too with contract testing in Microcks.
date: 2024-08-24
---

After you've gone through planning and designing an excellent API, published your documentation to Bump.sh, got loads of useful feedback from stakeholders by [mocking your API](_guides/bump-sh-tutorials/mocking-with-microcks.md), and built (or generated) an API implementation, you're pretty close to releasing the API into the wild.

Before you send this API out into the world, how do you know that the documentation and the API are actually... correct? Is the API doing something the documentation doesn't mention? Is the documentation saying the API works differently to how it actually works? 

There's a lot of manual tedious error-prone stuff you could do, but why not use the same OpenAPI that powers your Bump.sh documentation to initiate a bunch of requests against the API, see if the requests are accepted as expected, and see if the responses from the API match the OpenAPI too? 

Setting that up yourself could be complicated, but [Microcks](https://microcks.io/) is an excellent tool to help you do that within your existing Bump.sh-powered Git-based OpenAPI workflow.

## What is Microcks?

Microcks is a mocking and testing tool which helps you turn your OpenAPI into something that clients can experiment with and give you feedback which can be turned into changes quickly. You can update the OpenAPI, make some changes, deploy the updated mock, and continue iterating until people feel confident in the direction, but at some point you’ll want to start writing code and building your real API.

Even if you’re not using the API design first workflow, if you have OpenAPI and an API, you need to make sure the two agree. This concept is known as contract testing. API developers have been scared of contract testing for decades because its a faff to set up, but when you’re using OpenAPI you already have a contract, so all you need to do is compare some real requests and responses to the API and see if they match the API, catching mistakes in both your API implementation and the OpenAPI which powers your API documentation, SDK, and everything else. 

## Step 1: Set up Microcks

First you'll need to get Microcks set up, and that can be done with Docker, or it could be a hosted installation that lets your whole team/organization work with it. Setting Microcks up for testing is the same process as setting [Microcks up for mocking](_guides/bump-sh-tutorials/mocking-with-microcks.md), so follow that guide and come back here when you're done.

[](/images/guides/mocking-with-microcks/microcks-api-view.png)

Once Microcks knows about your API(s), we are almost ready to run compliance/contract testing. This means comparing the OpenAPI and the real API implementation, which of course means we'll need to have the API running on a URL where Microcks can access it.

## Step 2: (Optional) Make Local APIs Available for Testing

If you already have your API deployed then you are well on your way, but when if your API is running on localhost then Microcks might have a rough time finding it. To fix this I used [ngrok](https://ngrok.com/), a free and amazing tool which allows you to expose local HTTP servers to traffic anywhere via a HTTP tunnel. 

Once ngrok is installed and you’ve created a free account, you can run your HTTP server and get ngrok to do it’s thing via a terminal command. 

For example, a HTTP API running on port 8080 could do this:

```
$ ngrok http http://localhost:8080/
```

Ngrok will output something like this in response:

```
Session Status                online
Account                       Phil Sturgeon (Plan: Free)
Version                       3.14.0
Region                        Europe (eu)
Latency                       36ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://8eab-81-187-79-196.ngrok-free.app -> http://localhost:8080/
```

Copy that `https://8eab-81-187-79-196.ngrok-free.app` (which will change each time you run ngrok) and we can use that to point Microcks at where to test. 

Of course if you have your API deployed already then you can just take that URL which might be `https://api-beta.example.com/`.

## Step 3: Trigger a Test Run

On the Microcks dashboard click on the API you want to test, then click “+ New Test”. The New Test screen asks for a Test Endpoint, which will be the base of the service you want to test, where each OpenAPI path begins. 

![](/images/guides/microcks-testing/test-runner.png)

You also need to select a Runner, and Microcks has a few options here:

- HTTP - A generic runner for any old HTTP API.
- SOAP UI - Handy for working with old school SOAP APIs.
- Postman - Work with Postman testing using whatever tests are defined in the collection if you imported one.
- OpenAPI Schema - Use an OpenAPI description to handle contract testing a HTTP API.

Pick that last one, and hit “Launch test”. Microcks will now send a test request to every operation in your OpenAPI document, based on the data available in OpenAPI and any examples defined for parameters and request bodies.

For every operation that successfully ran, you’ll see a green tick, and others will show a red tick. 

![](/images/guides/microcks-testing/microcks-test-results.png)

Click “Full results” and expand each result to see what worked and what didn’t. For a success you will see a green tick, and the HTTP headers and the response body.

![](/images/guides/microcks-testing/test-result-expanded.png)

Failure results can come in many forms, but could highlight failures like schema mismatches.

![](/images/guides/microcks-testing/test-details-missing.jpg)

Microcks can even spot unexpected HTTP statuses.

![](/images/guides/microcks-testing/mismatched-status.png)

Here the contract testing has highlighted an important mistake: OpenAPI says that a 201 is supposed to be returned, but a 200 is being returned instead! Is the API wrong or is the OpenAPI wrong? You can now decide, and change one or the other, then run the tests again.

It’s also clear something is wrong with the response, because there is no data being returned, only the link, and the link is showing `undefined` instead of putting the UUID. Lots to fix here! 

## Different Types of Failures

Microcks can discover lots of types of mismatch.

- The HTTP response body Microcks gets could contain properties which have different data to that defined in the schema.

- The OpenAPI defines a property as required, but is missing in the response. 

- The OpenAPI defines a status code as being expected, but a different one is returned.

## Conformance Scores

All of these types of problem and more come together to provide a conformance index, and a conformance score. 

> The Conformance index is a kind of grade that estimates how your API contract (a.k.a API description) is actually covered by the samples you’ve attached to it. We compute this index based on the number of samples you’ve got on each operation, the complexity of dispatching rules of these operation and so on… It represents the maximum possible conformance score you may achieve if all your tests are successful.

> The Conformance score is the current score that has been computed during your last test execution. We also added a trend computation if things are going better or worse comparing to your history of tests on this API.

This is especially useful if you have defined request and response pairs, by providing examples with matching names in OpenAPI for both `requestBodies` and `responses`.

```yaml
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BookingPayment'
            examples:
              Card:
                summary: Card Payment
                value:
                  amount: 49.99
                  currency: gbp
                  source:
                    object: card
                    name: J. Doe
                    number: '4242424242424242'
                    cvc: 123

      responses:
        '200':
          description: Payment successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/BookingPayment'
              examples:
                Card:
                  summary: Card Payment
                  value:
                    id: 2e3b4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a
                    amount: 49.99
                    currency: gbp
                    source:
                      object: card
                      name: J. Doe
                      number: '************4242'
                      cvc: 123
                    status: succeeded
```

Microcks knows that both the names `Card` are the same for a request and response, and so it can provide a more accurate score for whether those examples are accurate. 

If they're not accurate, then either the OpenAPI is wrong, or the API is wrong, and you can decide on the which one needs to be updated.
