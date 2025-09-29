---
title: Organize API Endpoints with OpenAPI Tags
authors: phil
image: images/guides/tags-organize-endpoints.png
excerpt: Learn tips and tricks to group related endpoints in a meaningful way.
date: 2025-05-16
---

- TOC
{:toc}

Tags are a great way to organize the API endpoints in your OpenAPI documents.

Typically, OpenAPI tags are used to group related endpoints in a meaningful way, such as by business function or logical objects. When using tags, you define an array of tags at the root of your document, like this:

```yaml
tags:
  - name: stations
    summary: Stations

  - name: trips
    summary: Trips

  - name: bookings
    summary: Bookings

  - name: payments
    summary: Payments
```

Once you've created these tags, you can use them to group related endpoints in your API using the `tags` property on the endpoint as follows:

```yaml
paths:
  /stations:
    get:
      summary: Get a list of train stations
      tags: [stations]
  /trips:
    get:
      summary: Get available train trips
      tags: [trips]
```

You can also apply multiple tags to an operation:

```yaml
paths:
  /bookings/{bookingId}/payment:
    post:
      summary: Pay for a Booking
      tags: [bookings, payments]
```

## Describing Tags for Better Documentation

When specifying your tags in the root level of an OpenAPI document, you can give context to the tag using the `description` property.

Let’s take the [Train Travel API](https://bump.sh/bump-examples/doc/train-travel-api) as an example. Here is how the tags are created as described:

```yaml
tags:
  - name: stations
    summary: Stations
    description: | 
      Find and filter train stations across Europe, including their location
      and local timezone.

  - name: trips
    summary: Trips
    description: | 
      Timetables and routes for train trips between stations, including pricing
      and availability.
  
  - name: bookings
    summary: Bookings
    description: | 
      Create and manage bookings for train trips, including passenger details
      and optional extras.
  
  - name: payments
    summary: Payments
    description: |
      Pay for bookings using a card or bank account, and view payment
      status and history.

      > warn
      > Bookings usually expire within 1 hour so you'll need to make your payment
      > before the expiry date 
```

![The payments tag is showing the summary "Payments" in a header, with a HTML rendered description and warning box for the warn quote block.](/images/guides/openapi/specification/v3.2/bump-tag-description.png)
[*See it live*](https://bump.sh/bump-examples/doc/train-travel-api/operation/operation-create-booking-payment)

Note that [you can use Markdown](/help/enhance-documentation-content/markdown-support/) in the `description` field to better describe your tags.

## Tags Linking to Additional Documentation

While the `description` property is excellent for giving a little more information about a specific tag, you might need to provide additional documentation if the business logic or object represented by the tag is complex and requires further explanation. Let’s take our Diffs example from above. You can provide a link to an external web page where you offer a more detailed explanation using the `externalDocs` property.

In the code snippet below, the `externalDocs` property provides a link to a URL using the `url` property. A description for the URL can also be specified using the `description` property.

```yaml
tags:
  - name: stations
    description: Find and filter train stations across Europe, including their location and local timezone.
    externalDocs:
      description: Working with Stations
      url: /docs/guides/working-with-stations
```

When you generate API documentation for the API contract above, you'll see the link rendered like this:

![How the externalDocs property is displayed in generated API documentation.](/images/guides/tag-with-externaldocs.png)

## Tags Ordering Groups in Documentation

When specifying OpenAPI tags in the root of your API contract, the order in which you list the tags will define the order in which they appear in the generated documentation. This ordering lets you sort the tags meaningfully.

```yaml
tags:
  - name: stations
    summary: Stations
    description: Find and filter train stations across Europe, including their location and local timezone.
  - name: trips
    summary: Trips
    description: Timetables and routes for train trips between stations, including pricing and availability.
  - name: bookings
    summary: Bookings
    description: Create and manage bookings for train trips, including passenger details and optional extras.
  - name: payments
    summary: Payments
    description: Pay for bookings using a card or bank account, and view payment status and history.

      > warn
      > Bookings usually expire within 1 hour so you'll need to make your payment
      > before the expiry date
```

When you generate API documentation, you'll notice the documentation orders the endpoint groups in the same way:

![How tags are ordered in generated API documentation](/images/guides/tags_order.png)
[*See it live*](https://bump.sh/demo/doc/bump)

Note that [Bump.sh helps you order your endpoints and webhooks](/help/specifications-support/openapi-support/name-and-sort-resources/#group-by-tag) using a "Group by tag" operation. It is actually the default behaviour of Bump.sh when you have these tags defined and have not selected an other sorting option for your Bump.sh API documentation.

Now that you understand what tags are and their benefits, you'll see some best practices you should follow when using OpenAPI tags in API contracts.

## Different Kinds of Tags

Using the `kind` keyword for tags added in OpenAPI v3.2, tags can be categorized for different purposes.

Any string value can be used; common uses are `nav` for Navigation, `badge` for visible badges, `audience` for APIs used by different groups.

```yaml
tags: 
  # Navigation Tags
  - name: stations
    summary: Stations
    kind: nav

  - name: trips
    summary: Trips
    kind: nav
  
  - name: bookings
    summary: Bookings
    kind: nav
  
  - name: payments
    summary: Payments
    kind: nav

  # Audience Tags
  - name: beta
    kind: audience

  - name: internal
    kind: audience

  - name: public
    kind: audience
```

A [registry of the most commonly used values](https://spec.openapis.org/registry/tag-kind/) is available here, and more conventions will appear over time.

## Nested Tag Structures

By default using tags creates a flat grouping of operations, which is usually enough for smaller APIs, but larger APIs with hundreds of operations might need more structure especially for navigation purposes.

OpenAPI v3.2 introduced the `parent` keyword, which allows for tags to be given a parent-child relationship.

```yaml
tags: 
  - name: stations
    summary: Stations
    kind: nav
  
  - name: bookings
    summary: Bookings
    kind: nav
  
  - name: payments
    summary: Payments
    kind: nav
    parent: bookings
```

How this gets implemented by different tools is up to the tooling maintainers to decide, but the most common implementation for API documentation tools, especially for `kind: nav`, will be to treat "no parent" tags as top-level navigation, and nested items as expandable groups.

## OpenAPI Tags Best Practices

### Tag Everything

To ensure your endpoints remain logically grouped and ordered, always tag every endpoint, even if it means creating a tag for a single endpoint.

Untagged endpoints will not show up under any big section represented by a tag of your documentation generated by Bump.sh or most other tools, so things can "go missing" if you only tag some endpoints.

### Make Every Tag Unique

When defining the list of tags in the root of your API contract, make sure not to duplicate tag names. Since the tag's `name` property links an endpoint to a tag, duplicate names are likely to confuse developers looking at the API contract.

The code snippet below contains the root Tag Object in an API contract. Notice how the `Validations` tag has been duplicated, and the second definition contains a different description to the first:

```yaml
tags:
  - name: version
    summary: Versions
    description: Deploy your API contracts
  - name: validation
    summary: Validations
    description: Check & validate your API contracts
  - name: hub
    summary: Hubs
    description: Interact with your Hubs
  - name: validation
    summary: Validations
    description: Validate your API status
```

These duplicate tags would confuse anyone trying to understand your API contract, as they wouldn't know which of the two tag definitions an endpoint belongs to.

Instead, make sure you define and describe every tag only once in the root Tag Object, like in the snippet below:

```yaml
tags:
  - name: versions
    summary: Versions
    description: Deploy your API contracts
  - name: validations
    summary: Validations
    description: Check & validate your API contracts
  - name: hubs
    summary: Hubs
    description: Interact with your Hubs
```

### Define All Your OpenAPI Tags Before Use

The OpenAPI specification [doesn't require you to define all your tags in the root Tag Object of your API contract](https://spec.openapis.org/oas/v3.1.0#:~:text=A%20list%20of,MUST%20be%20unique). This means you can add a tag to an endpoint without listing it in the root Tag Object, but this is a bad idea. You won't be able to control what order the OpenAPI tags should appear in, and you won't be able to add a description or provide a link to external documentation for that tag. It can also confuse developers browsing the API documentation as they won't see a list of all the tags used in the API description.

As an example, consider the code snippet below where the `Previews` and the `Ping` tags has not been included in the root Tag Object:

```yaml
tags:
  - name: diffs
    summary: Diffs
    description: Diff summary of changes in the API
  # Missing Previews tag
  # Missing Ping tag
  - name: versions
    summary: Versions
    description: Deploy your API contracts
  - name: validations
    summary: Validations
    description: Check & validate your API contracts
  - name: hubs
    summary: Hubs
    description: Interact with your Hubs

paths:
  /diffs:
    post:
      tags: [ diffs ]
  /diffs/{id}:
    get:
      tags: [ diffs ]
  /hubs/{hub_id_or_slug}:
    get:
      tags: [ hubs ]
  /versions:
    post:
      tags: [ versions ]
  /validations:
    post:
      tags: [ validations ]
  /previews:
    post:
      tags: [ previews ]
  /previews/{preview_id}:
    put:
      tags: [ previews ]
  /versions/{version_id}:
    get:
      tags: [ versions ]
  /ping:
    get:
      tags: [ ping ]
```

When you generate the documentation, notice how the `Previews` and `Ping` sections are at the bottom of the list.

![Previews and Ping sections displayed at the bottom](/images/guides/preview_pings_sections.png)

This incorrect ordering and lack of description will make this section much harder to understand for a developer consuming your API.

On the other hand, notice how every endpoint in the OpenAPI below has a tag also defined in the root Tag Object:

```yaml
tags:
  - name: diffs
    summary: Diffs
    description: Diff summary of changes in the API
  - name: ping
    summary: Ping
    description: Check the API status
  - name: previews
    summary: Previews
    description: Preview changes to an API Documentation
  - name: versions
    summary: Versions
    description: Deploy your API contracts
  - name: validations
    summary: Validations
    description: Check & validate your API contracts
  - name: hubs
    summary: Hubs
    description: Interact with your Hubs

paths:
  /diffs:
    post:
      tags: [ diffs ]
  /diffs/{id}:
    get:
      tags: [ diffs ]
  /hubs/{hub_id_or_slug}:
    get:
      tags: [ hubs ]
  /versions:
    post:
      tags: [ versions ]
  /validations:
    post:
      tags: [ validations ]
  /previews:
    post:
      tags: [ previews ]
  /previews/{preview_id}:
    put:
      tags: [ previews ]
  /versions/{version_id}:
    get:
      tags: [ versions ]
  /ping:
    get:
      tags: [ ping ]
```

By doing this, your documentation will display the endpoint groups in the correct order along with the tag’s description.

![Generated documentation with every tag described in the root Tag Object](/images/guides/tags_order.png)

## Conclusion

In this article, you learned more about OpenAPI tags and their value in an API description. You also learned that you can add human-readable labels, descriptions, and external documentation links to the tag, along with more advanced usage like categorization and nesting. This article has also shown you some best practices to follow when using tags that can improve the quality of your generated documentation.
