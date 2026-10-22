---
title: "AsyncAPI 3 support"
tags: [New]
image: /docs/images/changelog/asyncapi-3-support.png
---

![Bump.sh now renders AsyncAPI 3 documents](/docs/images/changelog/asyncapi-3-support.png)

AsyncAPI 3 changed the way event-driven APIs are described: operations are no longer nested in channels, `send` and `receive` replace the ambiguous `publish` and `subscribe`, request/reply becomes a first-class pattern, and channels and servers get a clearer structure. Bump.sh now supports AsyncAPI 3 documents: deploy them the same way as your other API documents.

If you didn't explore this version yet, our [AsyncAPI 3 cheat sheet](/guides/asyncapi/cheatsheet/) is a good place to start.

## Operations first

In AsyncAPI 3, operations are declared on their own and point to a channel. Your documentation follows the same logic: each operation is listed in an "Operations" section, with a `send` or `receive` badge telling your users at a glance whether your application sends or receives the message.

```yaml
channels:
  tripQuoteRequests:
    address: trips.quotes.requests
    description: Quote requests sent by clients to the pricing service.
    messages:
      tripQuoteRequested:
        $ref: '#/components/messages/TripQuoteRequested'

operations:
  requestTripQuote:
    action: send
    title: Request a trip quote
    channel:
      $ref: '#/channels/tripQuoteRequests'
    messages:
      - $ref: '#/channels/tripQuoteRequests/messages/tripQuoteRequested'
```

![An operation in the Operations navigation, with its send badge](/docs/images/changelog/asyncapi-3-support-operations.png)

Operations are grouped by tag, or by channel name when they have no tags. All the usual [navigation options](/help/customization-options/operations-navigation/) remain available, including [`x-tagGroups`](/help/customization-options/sections/).

## Operation replies

Many event-driven APIs expect an answer: a client sends a request on a channel and waits for the reply on another one. AsyncAPI 3 describes this pattern natively by adding a `reply` to the operation.

```yaml
operations:
  requestTripQuote:
    action: send
    channel:
      $ref: '#/channels/tripQuoteRequests'
    reply:
      channel:
        $ref: '#/channels/tripQuoteReplies'
      messages:
        - $ref: '#/channels/tripQuoteReplies/messages/tripQuote'
```

Your documentation now displays this reply: a new "Reply" block appears right below the operation, showing the reply's address, messages, parameters and bindings. The request and its expected answer are documented side by side.

![The Reply block of an operation](/docs/images/changelog/asyncapi-3-support-reply.png)

## And more

- **Runtime addresses**: a channel without an `address` is displayed as `{dynamicAddress}`, and a reply `address.location` (e.g. `$message.header#/replyTo`) is displayed instead of the reply channel address.
- **Channel messages**: when an operation lists no `messages`, all the messages of its channel are displayed.
- **`title` and `summary`**: displayed for channels and servers. Operations use their `title`, or their `summary` when no title is set.
- **Servers**: their URL is built from `protocol`, `host` and `pathname`.
- **Traits**: operation and message traits are applied following AsyncAPI 3 rules, where a trait never overrides a value already defined on its target.
- **External docs**: on the `info` object, servers, operations, channels and messages.
- **OAuth 2 `availableScopes`**: displayed for each flow, with the scopes required by a security scheme.

The full list of supported fields, and those not supported yet, is available in the [help center](/help/specification-support/asyncapi-support/#asyncapi-3).

Questions or feedback about AsyncAPI 3? Write to us at [hello@bump.sh](mailto:hello@bump.sh).
