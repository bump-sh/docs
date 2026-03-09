---
layout: guides
title: Guides
page_class: guides
paginate:
  collection: guides
---

<div class="highlight-banners-row">
  <%= render Shared::HighlightBanner.new(
    title: "OpenAPI complete guide",
    image: "/docs/images/logos/openapi.svg",
    link_url: "/openapi/v3.2/",
    link_label: "Discover the guide") do %>
      <p>Discover the reasons behind the creation of OpenAPI, its capabilities and how to make a good OpenAPI document, from design to maintenance.</p>
  <% end %>

  <%= render Shared::HighlightBanner.new(
    title: "Arazzo complete guide",
    image: "/docs/images/logos/arazzo.svg",
    link_url: "/arazzo/v1.0/",
    link_label: "Discover the guide") do %>
      <p>Get an in-depth overview of Arazzo, and learn how to design and maintain an Arazzo document that can be used to automate real workflows.</p>
  <% end %>
</div>
