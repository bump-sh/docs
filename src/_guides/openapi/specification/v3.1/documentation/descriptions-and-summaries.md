---
title: Descriptions and Summaries
authors: phil
excerpt: Deliver on a great developer experience with improved OpenAPI descriptions and summaries.
date: 2024-08-07
---

Often, API documentation is left to the end of the schedule, which can lead to a rushed set of API reference documentation. This results in terse outlines of what endpoints and parameters exist, but leave out the specifics of your well-designed and implemented API operation. One of the major ways to improve the developer experience is to upgrade your OpenAPI from being a quick list of parameters into a store of import context and human knowledge with expanding descriptions and summaries.

## Example of Incomplete Documentation

For example, an operation might be described simply as `GET /users` with no further explanation, leaving users to guess what the endpoint does.

**Example Mistake:**

```yaml
paths:
  /bookings:
    get:
      summary: Get bookings
      parameters:
        - in: query
          name: offset
          schema:
            type: integer
            default: 10
      responses:
        200:
          description: "OK"
```

This is barely useful. The summary is repeating "Get bookings" like thats not clear from the "get" and the "/bookings" which would be displayed in most documentation tools by default. The summary is a chance to add more human information, like an alt tag or a caption, for things that aren't already there. 

Detailed and clear descriptions enhance understanding and usability. The improved version should thoroughly explain the operation, including its purpose, parameters, and response types.

**Improved Example:**

```yaml
paths:
  /bookings:
    get:
      summary: List bookings for user
      description: Returns a paginated list of trip bookings by the authenticated user.
      parameters:
        - in: query
          name: offset
          schema:
            type: integer
            default: 10
          description: > 
            Used for pagination, the offset parameter allows you to skip 
            through the dataset to load the next set of records.
      responses:
        200:
          description: "A paginated list of bookings with detailed information."
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Bookings'
```

Longer is not always better, and efforts to programmatically enforce the use of descriptions can lead to combative entries like "The User ID parameter contains an ID for a User" which no client wants to see. If you put some effort into building a culture around respecting the need for sharing context with your users, you can see quicker and more successful uptake of your API en masse. This has the handy benefit of reducing demands on the support teams as they have fewer confused users to help.

This example showed a few types of description, but you can put descriptions and summaries in quite a few places. Let's take a look.

## Parameter Descriptions

Parameters often seem really obvious to the author but not so much when somebody is quickly trying to integrate a single endpoint. For example, here `origin` and `destination` could be anything. Coordinates? City names? Station Codes? Station IDs?

```yaml
  /trips:
    get:
      parameters:
        - name: origin
          in: query
          description: The ID of the origin station.
          required: true
          schema:
            type: string
            format: uuid
        - name: destination
          in: query
          description: The ID of the destination station.
          required: true
          schema:
            type: string
            format: uuid
```

Here the descriptions make that perfectly clear, regardless of which API documentation tool ends up being used to render this information. 

Descriptions are also a handy place to be more specific with criteria for the data that may have been vague otherwise.

```yaml
  /trips:
    get:
      parameters:
      - name: date
        in: query
        description: The date and time of the trip in ISO 8601 format in origin station's timezone.
        required: true
        schema:
          type: string
          format: date-time
          examples: ['2024-02-01T09:00:00Z']
```

Here we have a `format: date-time` which should be displayed to users in API documentation and used in various other tools, and we have an example which shows what format it should look like, but if a user is then trying to configure their own code to use the right date format. If a client had to base it entirely off the example there is lots of room for error, but by clearly stating ISO 8601 in the description, a JavaScript user knows they could use `dateObj.toISOString()` instead of trying to make some other awkward format.

## Adding Descriptions to Tags

Tags are often underutilized, but they are a great way to [group operations](grouping-operations-with-tags.md) for more structured navigation in most API documentation tools. These tags are also a great place to write longer form context on what these tags actually mean in your domain specifically. For example, the word "Account" can mean 10 different things inside a large organization depending on the department and the function, so it's good to be super clear about what they are.

```yaml
tags:
  - name: Stations
    description: | 
      Find and filter train stations across Europe, including their location
      and local timezone.
  - name: Trips
    description: | 
      Timetables and routes for train trips between stations, including pricing
      and availability.
  - name: Bookings
    description: | 
      Create and manage bookings for train trips, including passenger details
      and optional extras.
  - name: Payments
    description: |
      Pay for bookings using a card or bank account, and view payment
      status and history.

      > warn
      > Bookings usually expire within 1 hour so you'll need to make your payment
      > before the expiry date 
```

Here not only are we explaining the words, but we are helping people find where particular information lives, and providing important context, like that `Bookings usually expire within 1 hour` which would not have been known to the client otherwise.


## Operations

APIs are rarely as simple as the CRUD ("Create, Read, Update, Delete") lense many API developers naturally try and view them through. They can sometimes start out that way, but keep these things in mind:

- Is the operation returning all records, or restricting data based on the authenticated user.
- Is the operation using pagination or not.
- Is there a default status being applied like `status=active`, and you need provide some other flag to change or remove the default. 

Once you get into it, there's usually quite a lot to say about an operation beyond "Get the Thing".

```yaml
  /trips:
    get:
      summary: Get available train trips
      description: Returns a list of available train trips between the specified origin and destination stations on the given date, and allows for filtering by bicycle and dog allowances.
      parameters:
        - name: origin
          in: query
          description: The ID of the origin station
          required: true
          schema:
            type: string
            format: uuid
            examples: [efdbb9d1-02c2-4bc3-afb7-6788d8782b1e]
        - name: destination
          in: query
          description: The ID of the destination station
          required: true
          schema:
            type: string
            format: uuid
            examples: [b2e783e1-c824-4d63-b37a-d8d698862f1d]
```

Here the summary is fairly light on details, because that's more of a title for the operation, but you can often elude to a fair bit within a few words, then expand on all that in the description.

```yaml
  /bookings:
    get:
      summary: List bookings for user
      description: Returns a paginated list of trip bookings by the authenticated user.
```

## Responses

Whether to go large in the response or not is not so clear cut. If you were explaining what was going to happen in the operation description, then the response is... that, which has already been explained. Duplicating that long form description in the response seems redundant.

Generally, a common practice is to keep descriptions short, and you can go two ways with this:

```yaml
  /bookings:
    get:
      summary: List existing bookings
      description: Returns a list of all trip bookings by the authenticated user.
      responses:
        '200':
          description: A list of bookings
        '401':
          description: Unknown user error
        '403':
          description: Forbidden from seeing list of bookings
```

This all seems a bit redundant, because the operation happy path is described at the top, and it's really the errors that need more explaining. Depending on [how you have errors set up](../advanced/error-formats.md), they should be explaining themselves, so this is really either the place for context which could not exist anywhere else, or a chance to just keep it simple.

```yaml
  /bookings:
    get:
      summary: List existing bookings
      description: Returns a list of all trip bookings by the authenticated user.
      responses:
        '200':
          description: OK
        '401':
          description: Unauthorized
        '403':
          description: Forbidden
```

This is essentially just repeating the HTTP status code because you need to write something, but you can do whatever you like. Essentially the advice would be: keep response descriptions short, unless there's some really important context which has to be given to that specific endpoint, and then do whatever your API documentation tool is happy with. If it prefers shorter descriptions maybe put that context in the operation description.
