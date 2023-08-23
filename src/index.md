---
# Feel free to add content and custom Front Matter to this file.

layout: default
---

# Welcome to Bump.sh Help Center
Find everything you need to know for building the best ecosystem for your APIs.

<%= liquid_render "bridgetown_quick_search/search" %>

----

- [Getting started](help/getting-started) -- Learn about Bump.sh, how to deploy your first specification file and explore the possibilities.

----

## Core Concepts
- [Specification support](help/specifications-support/openapi-support) -- Which and how specifications are supported.
- [Change Management](help/api-change-management/index) -- Never miss any changes of your API, check them with the diff.

----

## Latest Guides
<ul>
  <% collections.posts.resources.each do |post| %>
    <li>
      <a href="<%= post.relative_url %>"><%= post.data.title %></a>
    </li>
  <% end %>
</ul>
