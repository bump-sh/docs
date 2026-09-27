---
layout: default
title: Product Updates
page_class: updates
paginate:
  collection: product-updates
  per_page: 10
  sort_reverse: true
---

<main class="wrapper updates-page">
  <ul class="update-list">
    <% paginator.resources.each do |update| %>
      <li>
        <article class="update">
          <timeline-element>
            <div class="timeline-side">
              <%= time_tag update.date %>
            </div>
            <div class="timeline-content prose">
              <h2><a href="<%= update.relative_url %>"><%= update.data.title %></a></h2>
              <div class="tag-list">
                <% update.data.tags.each do |tag| %>
                  <span class="label" data-label-status="inverted"><%= tag %></span>
                <% end %>
              </div>
              <%= update.content %>
            </div>
          </timeline-element>
        </article>
      </li>
    <% end %>
  </ul>

  <%= render Shared::Pagination.new(paginator: paginator) %>
</main>
