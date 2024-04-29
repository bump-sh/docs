---
title: Make HTTP Requests with Postman
authors: phil
excerpt: Integrate your OpenAPI-powered documentation with Postman to let customers "Try it Out" right from the API docs.
---

Seeing how an API works is the first step in an end-users journey to using the API, and the second step is making some test requests to get a feel for how it works. Some people like to do this with code, so code samples will be a good start for them, especially if you have an SDL. Other people like to do this with interactive HTTP clients, like [Postman](https://postman.com/).

Postman is one of the original modern API consoles. Users can create or import "collections" which are very similar to OpenAPI but focus more on actual requests and responses being saved, like a whole bunch of bookmarks in a browser. Those collections can be distributed in various ways, and it's becoming increasingly common for API providers to publish a read-only public Postman Collection for end-users to download, so they have a whole interactive API console ready to go.

This guide will go through getting started with Postman, creating a "Postman Collection" from the same OpenAPI that powers your documentation, to finally getting a "Run in Postman" button into your Bump.sh API docs.

## Step 1) Install Postman

[Download](https://www.postman.com/downloads/) and install Postman on your computer and load it up.

## Step 2) Create a Postman account

Create a new account (it's free), then if you're doing this for a business or organization other than yourself you can create a workspace your collections to live in.

![](/images/guides/try-it-out/postman-create-workspace.png)


## Step 3) Import OpenAPI 
