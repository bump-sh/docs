---
title: "An AsyncAPI Example: Building Your First Event-driven API"
authors: Michael Nyamande
image: images/guides/building-event-driven-async-api.png
canonical_url: https://bump.sh/blog/asyncapi-first-event-driven-api
excerpt: Follow this walkthrough tutorial and build and Event-driven API along its documentation.
---

Event-driven APIs are APIs that use events to enable real-time and asynchronous communication between different components of a system. This leads to a couple significant benefits right out of the gate:

* Clients receive real-time updates without constantly polling the server, which improves user experience.
* System components can communicate without being directly connected to each other, so API producers and consumers can be more loosely coupled.

## Why Use Event-driven APIs?

Let’s break those two ideas down a bit so you can really see what’s going on.

An *event* is any change in state or an update that a client might be interested in, like a new user registration or an update in the payment status of a transaction. In an event-driven system, a component known as the *publisher* sends an event to a message broker. The message broker sends the event to all the other components, known as *subscribers*, that have registered to receive that particular event. This allows the components of the system to communicate in real-time without being directly connected to each other.

![Event Driven Architecture](images/guides/event-driven-architecture.png)

As an example, picture a chat application. When a user sends a message, an event-driven API can immediately notify all the other users in the chat, allowing the message to display in their chat window without needing to refresh the page. In a traditional synchronous API, the client would need to poll the server to check for new messages very often and then update the user.  With event-driven APIs, clients receive real-time updates from the API without constantly polling for changes, making them more efficient when it comes to network resource usage. 

In a traditional synchronous request-response API, the components are tightly coupled. The consumer must make a request to the provider to receive data (say, for example, polling for new messages in a chat application). In an event-driven API, the components are decoupled. The publisher sends events to the message broker, which then broadcasts the events to the subscribers. The separate components can be more independent and flexible, since they don’t rely on direct communication with each other. 

However, in order for the system to work effectively, there must be a common understanding between the components regarding events and their data structures. This is where [AsyncAPI](https://www.asyncapi.com/) comes in; it helps define a [contract](https://bump.sh/blog/api-contracts-extended-introduction) that describes how the components communicate and behave effectively.

Let’s walk through the process of implementing an event-driven API using AsyncAPI, a specification for defining asynchronous APIs. We’ll also introduce [Bump.sh](https://bump.sh/), a tool for documenting and tracking event-driven APIs lifecycle/changes, and demonstrate how you can use it in conjunction with AsyncAPI files.

## Implementing a Node.js Event-Driven API with AsyncAPI

[AsyncAPI](https://www.asyncapi.com/) is a specification for defining the structure and behavior of event-driven APIs. It’s [similar to OpenAPI](https://www.asyncapi.com/blog/openapi-vs-asyncapi-burning-questions), a specification for defining REST APIs.

However, AsyncAPI has specific features for defining the events and subscriptions of an event-driven API. It provides a standardized way to describe the events, channels, and message formats used in an asynchronous API, making it easier for developers to understand and use that API. 

Before we begin the process of implementing a Node.js event-driven API described using AsyncAPI, there are a few prerequisites that you will need to have installed:

- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- **Optional:** [Mosquitto](https://mosquitto.org/), an open-source message broker that 				implements the [MQTT protocol](https://mqtt.org/mqtt-specification/); this tutorial uses the [public test server](​​https://test.mosquitto.org/)
 
Once you have these installed, you can follow the steps below to implement your event-driven API.

### 1. Create an AsyncAPI File 

First, create an AsyncAPI file. This will define the events and their corresponding data that you’ll use in your event-driven system. It also defines the structure and behavior of your asynchronous APIs.

AsyncAPI files are written in YAML or JSON and follow a specific format defined by the [AsyncAPI specification](https://www.asyncapi.com/docs/reference). An AsyncAPI file consists of several main components:

- `asyncapi`: Specifies the version of the AsyncAPI specification that the file follows; at time of writing, the latest available is v2.6.0, which is what this tutorial uses.
- `info`: Contains metadata about the API, such as the `title`,  the `version` or the `description` of your API.
- [`servers`](https://www.asyncapi.com/docs/concepts/server): Lists the servers that the API is available on, along with the protocol and any additional configuration required to use the server. In our testing API, that will be the network location of our message broker.
- [`channels`](https://www.asyncapi.com/docs/concepts/channel): Defines the channels that the API exposes, along with the operations that can be performed on each channel.
- `components`: Defines reusable components that can be used throughout the AsyncAPI file, such as [message](https://www.asyncapi.com/docs/concepts/message) payloads and security schemes. This section is optional, as you can define these components directly, but I do recommend it. As your AsyncAPI definition file starts to grow, this helps you avoid repeating yourself (e.g., when a message format is used in multiple channels).
  
The snippet below defines the first part of the AsyncAPI file for a chat application. It covers the general application descriptions:

```yaml
asyncapi: 2.6.0
info:
  title: Chat Application
  version: 1.0.0
servers:
  testing:
    url: test.mosquitto.org:1883
    protocol: mqtt
    description: Test broker
```

This AsyncAPI file defines a chat application using the AsyncAPI 2.6.0 version.

It also defines the `servers` block that specifies the network location of your message broker. The API application defined here uses the MQTT protocol and is available on the testing server at `test.mosquitto.org:1883`. This URL is a publicly available Mosquitto broker for test purposes; feel free to replace it with a local URL if you have Mosquitto installed on your environment.

The following section defines the channels available within the API. It defines the different operations the chat application can perform and their payloads.

```yaml
channels:
  chat:
    publish:
      operationId: onMessageReceieved
      message:
        name: text
        payload:
          type: string
    subscribe:
      operationId: sendMessage
      message:
        name: text
        payload:
          type: string
```

The channels section defines all the channels that the API exposes. In this case, there is a single channel called `chat` that exposes a `publish` and `subscribe` operation. The `publish` method allows clients to send messages to the chat application via the `chat` channel, while the `subscribe` method allows users to receive messages from the `chat` channel.

This might seem a bit counterintuitive as there are two sides to think about, the server application and the client. Instead, think about it this way: publish events are sent from the client to the application, while subscribe events are sent from the application to the clients.

> Read more about [pub-sub semantics here](https://www.asyncapi.com/blog/publish-subscribe-semantics), then check out [this proposal](https://github.com/asyncapi/spec/issues/618) that aims to resolve the confusion between publish and subscribe events. 

In the case of this tutorial, both operations have a very simple message payload of type `string`, which defines the text to be sent on the message. However, the message could be more complex and in this case [described with JSON schema](https://www.asyncapi.com/docs/reference/specification/v2.6.0#schemaObject).

You can review and copy [the full file here](https://gist.github.com/mikeyny/2ab889716486944ff1eba999b4108190).

### 2. Generate the Application Code with AsyncAPI Generator

After creating your AsyncAPI file, you can use the AsyncAPI Generator to automatically generate the code for your event-driven application. The AsyncAPI Generator is a command-line tool that can [generate code in multiple languages](https://github.com/asyncapi/generator#list-of-official-generator-templates), including JavaScript, Python, and Go.

To use the AsyncAPI Generator, you will first need to install it using npm:

```
npm install -g @asyncapi/generator
```

Once you have installed the AsyncAPI Generator, you can use it to generate the code for your event-driven application.

> The generated code is meant to be a starting point, not a comprehensive build-and-use solution.

The following command generates a functional node application from your AsyncAPI file. Make sure to replace the file and server names where appropriate.

```
ag asyncapi.yaml @asyncapi/nodejs-template -p server=testing  -o example
```

This command tells the AsyncAPI generator to generate Node.js code using the `asyncapi.yaml` file that you created in the previous step. The generator will generate the code for the testing server we have just defined with our AsyncAPI file, and output those new files to a folder named `example`. The AsyncAPI Generator supports code generation in [many different languages](https://github.com/asyncapi/generator#list-of-official-generator-templates) such as Node, Java, Python, and Go.

After running the command, you should have a full-fledged node application powering your event-driven application.

You can run the following to install the dependencies and run the application.

```bash
npm install
npm start
```
You should see the following output:

```bash
> node src/api/index.js

 SUB  Subscribed to chat
 PUB  Will eventually publish to chat
Chat Application 1.0.0 is ready!

🔗  MQTT adapter is connected!
```

### 3. Test the AsyncAPI Node.js Application

To test the application, you need to send messages to the broker as a publisher. You can do this using the `MQTT.js` library. Install it by running the following command in a separate terminal window:

```bash
npm install mqtt -g
```

Run the following command to send a message to the message broker. This command sends a publish command to the test broker on the `chat` channel defined in your AsyncAPI file.

```bash
mqtt pub -t 'chat' -h 'test.mosquitto.org' -m "Hello World"
```

After running this command, check the original window running the chat application, and you should see the following output:

```bash
← chat was received:
'{text: Hello World}'

```

This output means your application successfully received your message from the message broker. If you want to start implementing business logic, you can review the code in the example directory.

You will find the handler for the messages under `examples/src/api/handlers/chat.js`. The file should look like this:

```js
const handler = module.exports = {};

/**
 * 
 * @param {object} options
 * @param {object} options.message
 */
handler.onMessageReceieved = async ({message}) => {
  // Implement your business logic here...
};
/**
 * 
 * @param {object} options
 * @param {object} options.message
 */
handler.sendMessage = async ({message}) => {
  // Implement your business logic here...
};

```

## Using Bump.sh with AsyncAPI

By creating your AsyncAPI file, you actually also created an API contract ! You can [read all about them here](https://bump.sh/blog/api-contracts-extended-introduction) but in short, an API contract specifies the components and describes the behavior of an API, for instance available events and data or the rules for using the API.

You saw this earlier with the chat application implementation; you had to define the different channels as well as the operations that a client could perform on each channel.

Having a clear and formal API contract can ensure that the different components of an event-driven system can communicate and work together effectively. It can also make it easier to collaborate with other developers and teams, since everyone will have a clear understanding of the API and how it’s working.

You can use Bump.sh to document and keep track of the changes in your event-driven API via its AsyncAPI API contract. 

To use Bump.sh and generate your AsyncAPI based documentation, simply [create an account](https://bump.sh/users/sign_up?utm_source=bump&utm_medium=blog&utm_campaign=asyncapi-example-blog). Then you can simply drag and drop your AsyncAPI file in the onboarding flow.

After signing up, fill out the following form with the details of your API:

![Bump.sh onboarding screen](images/guides/bump-sh-onboarding-screen.png)

You can then proceed to upload your AsyncAPI file manually or using [Bump.sh CLI](https://github.com/bump-sh/cli).

To upload your file using the CLI start by installing it:
```bash
npm install -g bump-cli # using npm
yarn global add bump-cli # using yarn
```

Then preview your generated API documentation by running :
```bash
bump preview path/to/file.json/yml
```

The CLI will respond with an URL that, if visited, will let you visualize for a few minutes how your API documentation would render in Bump.sh.

When your AsyncAPI file is ready to be deployed, you can follow the simple steps of the [Getting Started](https://docs.bump.sh/help/getting-started/) to have your API documentation live and ready to share.

You can also connect the Bump.sh CLI to CI/CD tools, and there is even a GitHub Action you can add to any project. Which will allow you to automatically track and inform about API changes and deploy new versions of your API, among other cool possibilities you can read about on the [Bump.sh page in GitHub marketplace](https://github.com/marketplace/actions/bump-sh)

## Conclusion

Event-driven APIs lead to real-time, responsive, and loosely-coupled systems, and AsyncAPI is a great way to define those APIs. By using AsyncAPI and Bump.sh together, you can create high-quality documentation for all your event-driven APIs.

Feel free to reach out to us if you have feedback, comments, or suggestions you’d like to share!
