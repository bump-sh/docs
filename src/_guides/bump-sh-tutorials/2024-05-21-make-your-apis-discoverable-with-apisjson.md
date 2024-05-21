---
title: "Make your APIs Discoverable with APIs.json"
authors: phil
excerpt: You've built a brilliant API, and you've taken the time to document it, now leverage API specifications to help share this API on API marketplaces.
--- 

You've built a brilliant API, and you've taken the time to document it, but how do you get this API advertised to potential users? After all, the more users that discover your API, the more business you're getting, so it's worth thinking about discoverability beyond a tweet and a blog. 

API Marketplaces like [API Layer](https://apilayer.com/) and [RapidAPI](https://rapidapi.com/) let you list APIs in a searchable directory so potential users can find them. There are quite a few API Marketplaces, and they seem to come and go over time, which means adding every one of your APIs to every marketplace (and keeping it all up-to-date) can be outrageously time consuming. Sure in years ago when most companies only had one API it might be an easy guess: `https://example.org/api` or `https://api.example.org/`, but as more and more APIs start popping up to handle various parts of the business with "creative codenames", keeping track of APIs can become more difficult internally and externally. 

Many API teams have created "API Catalogs" to list their own APIs, which is often a hand-built system or using something like [Bump.sh's Hubs](https://bump.sh/api-catalog), so it feels like the most logical approach is to use your API Catalog to create a shareable directory of _your_ APIs to other marketplaces and tools.

As with everything in the world of APIs there's a brilliant specification for doing this, but as with everything it has a very vague name: [APIs.json](https://apisjson.org/). Not to be confused with [JSON:API](https://jsonapi.org/), APIs.json is a specification that aims to solve API discoverability, created by Kin "API Evangelist" Lane and Steven Willmott. 

## How does APIs.json work?

APIs.json contains two simple concepts to help software find your APIs and learn about them.

1. a "Well Known" URL of `/apis.json` (or `/apis.yaml`).
2. a specific JSON/YAML data format for that URL.

Think of the `/apis.json` URL like `/robots.txt` or `/sitemap.xml`. In the same way that various crawlers and automated agents will use that information to find out what should be indexed on a particular domain, the `/apis.json` URL can help various agents discover what APIs are available on a given domain. 

The data for that endpoint looks a little something like this.

```json
{
  "name": "My Train Company",
  "description": "## Welcome to the Bump.sh demo!\r\n\r\n*Bump.sh is much more than stunning documentation, for all your APIs.*\r\n\r\nBrowse through **API Hubs** and our **sleek documentation experience**. Try out our **search feature**, and discover how **Bump highlights changes** when you iterate on APIs development.\r\n\r\n[Signup](https://bump.sh/users/sign_up) to deploy your own API docs in minutes, and discover all configuration options and integrations.",
  "url": "https://demo.bump.sh/apis",
  "created": "2019-12-12",
  "modified": "2024-05-16",
  "apis": [
    {
      "id": "321a5e75-ec49-422c-8c69-160847b9726c",
      "name": "Train Travel API",
      "slug": "trainbook",
      "url": "https://demo.bump.sh/doc/trainbook",
      "created": "2024-05-16",
      "modified": "2024-05-16",
      "description": "API for finding and booking train trips across Europe.",
      "version": "1.0.0",
      "properties": [
        {
          "type": "x-access-level",
          "data": "public"
        },
        {
          "type": "x-definition-type",
          "data": "REST"
        }
      ]
    },
    // ... other APIs ...
  ]
}
```

There's a lot to look at here, but basically there is some metadata about the collection of APIs, then an array of APIs. Let's start with the top level properties that describe the collection itself, and this is based on v0.16 of the specification.

- *name* (required): text string of human readable name for the collection of APIs
- *description* (required): text human readable description of the collection of APIs.
- *type* (optional): Type of collection (Index [of a single API], Collection [of multiple APIs], Blueprint [of a new API]).
- *image* (optional): Web URL leading to an image to be used to represent the collection of APIs defined in this file.
- *url* (required): Web URL indicating the location of the latest version of this file so it can be more portable.
- *tags* (optional): a handful of key words and phrases that describe your API collection.
- *created* (required): date of creation of the file
- *modified* (required): date of last modification of the file
- *specificationVersion* (required): version of the APIs.json specification in use.
- **apis** (optional): list of APIs identified in the file, each containing.

The `apis` collection being optional feels a little funny, but APIs.json can describe a single API 

explain more about the spec...


## Working with APIs.json in Bump.sh

Bump.sh will automatically create an `/apis.json` for anyone using Documentation Hubs. Hubs are a way of grouping APIs with shared access controls, and making them discoverable to anyone looking at any of them. A Hub could be for a team, a department, or for a product line that has multiple APIs that all communicate with each other.

For example, an organization with one mega-API might decide their API has become too much of a monolith, and start splitting it up. Creating a new Hub and renaming that one API to "Legacy API" will provide a space for the new APIs as they pop up.

How you use them is up to you, but to work with APIs.json you'll want to make a Hub.

![](/images/guides/try-requests-in-postman/new-hub.png)

Then add some APIs to that Hub on the API's Settings page.

![](/images/guides/try-requests-in-postman/add-api-to-hub.png)

Now head over to the Dashboard and click View Hub, and you'll be taken to a URL like `https://bump.sh/<org-slug>/hub/<hub-slug>`. To get the APIs.json endpoint you can append `/apis.json` onto the end of that URL, to produce `https://bump.sh/<org-slug>/hub/<hub-slug>/apis.json`.

![](/images/guides/try-requests-in-postman/apisjson.png)

Great! Now, the first thing we should do with this APIs.json is use it to help people find our APIs by submitting our APIs to APIs.io, "the search engine for APIs".

Head over to [APIs.io: Add](https://apis.io/add/), and paste your link into the URL box.

![](/images/guides/try-requests-in-postman/submit-apisio.png)
