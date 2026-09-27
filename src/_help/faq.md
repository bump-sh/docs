---
title: Frequently asked questions
---

- TOC
{:toc}

Short answers to the questions we hear most often about Bump.sh, from supported specifications to MCP servers and billing. Each answer links to the page that covers the topic in depth.

<% site.data.faq.each do |section| %>
## <%= section.title %>

<div class="faq" markdown="0">
<% section.questions.each do |item| %>
<details id="<%= Bridgetown::Utils.slugify(item.question) %>">
<summary><%= item.question %></summary>
<div class="faq-answer"><%= markdownify item.answer %></div>
</details>
<% end %>
</div>
<% end %>

## Security and confidentiality

Bump.sh has been designed from the ground up with security as a core principle. **Our platform never accesses your infrastructure or source code, and only processes data explicitly sent by you.**

We only handle two types of strictly controlled data:

* API and workflow documents explicitly provided by your teams through the dashboard, the API, the [open-source CLI](https://github.com/bump-sh/cli) or the [GitHub Action](https://github.com/bump-sh/github-action).
* User information (email, name, role), created automatically through SSO or manually in the application.

We implement industry-leading security practices, including WAF protection, continuous monitoring, daily dependency updates, regular staff security training, and authorized penetration tests conducted by our customers. As a French company, we fully comply with GDPR, following the data protection practices outlined in our [Data Processing Agreement (DPA)](https://bump.sh/dpa).

> Your question is not here? Write to [hello@bump.sh](mailto:hello@bump.sh), a member of the team answers every message.
{: .info}

<%
  faq_entities = site.data.faq.flat_map do |section|
    section.questions.map do |item|
      {"@type" => "Question", "name" => item.question, "acceptedAnswer" => {"@type" => "Answer", "text" => markdownify(item.answer)}}
    end
  end
%>
<script type="application/ld+json"><%= {"@context" => "https://schema.org", "@type" => "FAQPage", "mainEntity" => faq_entities}.to_json.html_safe %></script>
