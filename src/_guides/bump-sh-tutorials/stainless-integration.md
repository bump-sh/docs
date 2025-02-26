---
title: Integrate Stainless with bump.sh API docs
authors: dgellow
excerpt: Drive faster API integration, broader adoption, with robust and polished SDKs
date: 2025-02-26
---

Every developer wants to get up and running with an API as quickly as possible, and that means seeing code examples in their preferred language. With Stainless SDK integration in your bump.sh docs, you can automatically display idiomatic SDK code samples alongside your API reference documentation.

This guide will walk you through connecting Stainless-generated SDKs with your bump.sh documentation to create a seamless developer experience.

## Understanding Stainless SDK Integration

Stainless is a platform that generates ergonomic, idiomatic client libraries from your OpenAPI
specification. When integrated with bump.sh, Stainless can automatically inject code samples showing exactly how to call
each endpoint using your official SDKs.

Here's what the integration looks like:

1. Stainless analyzes your OpenAPI specification and generates SDKs
2. Stainless decorates your OpenAPI with code samples for each endpoint
3. bump.sh renders these samples in your API reference documentation

The result is an interactive documentation that shows both raw HTTP requests and language-specific SDK examples developers can copy-paste and
adapt to their need.

## Prerequisites

Before starting, make sure you have:

- An account on [Stainless](https://app.stainless.com/)
- An existing [bump.sh](https://bump.sh/) documentation project
- Your OpenAPI specification

## Setting Up Stainless for Your API

### Create Your SDK in Stainless Studio

1. Log in to the [Stainless dashboard](https://app.stainless.com/)
2. Click "New Project" and upload your OpenAPI specification
3. Stainless will analyze your API and create an initial SDK configuration

The Stainless Studio provides an immediate preview of your SDK structure based on your API's resources, endpoints, and models.

![Stainless SDK Studio showing SDK preview](/images/guides/stainless-integration/studio-preview.png)

### Configure Your SDK Resources

Stainless automatically organizes your API into logical resources, but you may want to adjust this organization to create the most intuitive experience for your users.

In the Studio, you can customize:

- Resource grouping and naming
- Method organization
- Model definitions
- Authentication mechanisms
- Auto-pagination
- and way more!

For example, if you have an endpoint `GET /users/{user_id}/posts`, Stainless might structure this as:

```typescript
// Default structure
client.users.posts.list(userId);

// Or you might prefer
client.posts.listByUser(userId);
```

The Studio lets you reorganize these resources to match your preferred SDK structure independently from your API endpoints.

### Generate Code Examples

In the Studio, add the following to your Stainless configuration file:

```yaml
openapi:
  code_samples: "bump.sh"
```

This tells Stainless to create a copy of your OpenAPI file extended with SDK code examples, in a format bump.sh can render.

### Create an API key

For the next step, you will need an API key to be able to interact with Stainless' API.

Go to your Stainless org page, select the "API Keys" tab, and create a new key.

![Form to create an API key to use Stainless API](/images/guides/stainless-integration/create-api-key.png)

Note: the API key should be considered secret and will only be shown once, be sure to copy and store it to a safe location,
such as a password manager.

Now go to the GitHub repository where your OpenAPI spec is located, and add a GitHub secret named `STAINLESS_API_KEY`,
with the key as value.

## Connecting Stainless with bump.sh

The most efficient way to keep your SDK in sync with your documentation is through CI/CD automation.
Stainless provides a
[GitHub Action](https://github.com/marketplace/actions/stainless-upload-openapi-specification) to simplify that process:

```yaml
name: Upload OpenAPI spec to Stainless and bump.sh

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  stainless:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Push spec and config to Stainless, output spec extended with code examples
        uses: stainless-api/upload-openapi-spec-action@main
        with:
          stainless_api_key: ${{ secrets.STAINLESS_API_KEY }}
          input_path: "path/to/my-company-openapi.json" # your original spec
          output_path: "path/to/my-company-openapi.documented.json" # will be the extended spec
          project_name: <your-stainless-project-name>

      - name: Deploy API documentation
        uses: bump-sh/github-action@v1
        with:
          doc: <your-bump-doc-id>
          token: ${{secrets.BUMP_TOKEN}}
          file: "path/to/my-company-openapi.documented.json" # be sure to point to the extended spec
```

This workflow:

1. Upload your OpenAPI specification file to Stainless, triggering new builds of your SDKs
2. Deploys the expetend specification file to bump.sh

By combining Stainless's SDK generation with bump.sh's documentation capabilities, you're providing developers with a seamless experience from discovery to implementation.
