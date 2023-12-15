---
title: Deploying docs from FastAPI
authors: phil
excerpt: Generating OpenAPI for Go APIs
---

[Huma](https://huma.rocks/) is a Golang framework that allows you to create APIs, and automatically generates their documentation, based on the OpenAPI specification.

## Deploying docs from your local machine

The following assumes your local machine is configured with Golang and you have a Huma app running on your local machine, and that your main file is named `main.go`. If you don't have a Huma app set up, follow their [Your First API guide](https://huma.rocks/tutorial/your-first-api/).

1. [Create and name](https://bump.sh/docs/new?utm_source=bump&utm_medium=content_hub&utm_campaign=getting_started) your first API documentation. Then, retrieve the name and token of this documentation from the _CI deployment_ settings page.

2. Install the Bump.sh CLI with [npm](https://docs.npmjs.com/cli/v9/configuring-npm/install?v=true) as below, or use [alternative options](/help/bump-cli), with

```bash
npm install -g bump-cli
```

3. Launch your local server with

```bash
go run .
```

This will run not only the application, but it will make API documentation available on <http://127.0.0.1:8000/>.

4. Deploy your doc to Bump.sh with

```bash
bump deploy http://127.0.0.1:8888/openapi.yaml \
  --doc my-documentation-name \
  --token my-documentation-token
```

If for any reason you are unable to download that `openapi.yaml` from a URL despite being able to access it, it's likely some odd network proxy settings on your machine or wifi. Grab it directly with wget or similar.


```bash
$ wget http://127.0.0.1:8888/openapi.yaml

2023-12-15 11:29:55 (240 MB/s) - ‘openapi.yaml’ saved [3018]

$ bump openapi.yaml \
  --doc my-documentation-name \
  --token my-documentation-token
```

That's it! Enjoy the comfort of Bump.sh to browse through your API doc, and [customize it to your needs](/help/getting-started/quick-start#customization-options).
