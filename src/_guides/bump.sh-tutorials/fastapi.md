---
title: Deploying docs from FastAPI
authors: [polo]
---

[FastAPI](https://fastapi.tiangolo.com/) is a Python framework that allows you to create APIs, and automatically generates their documentation, based on the OpenAPI specification.

## Deploying docs from your local machine

The following assumes your local machine is configured with Python and FastAPI, and that your main file is named `main.py`.

1. [Create and name](https://bump.sh/docs/new?utm_source=bump&utm_medium=content_hub&utm_campaign=getting_started) your first API documentation. Then, retrieve the name and token of this documentation from the _CI deployment_ settings page.

2. Install the Bump.sh CLI with [npm](https://docs.npmjs.com/cli/v9/configuring-npm/install?v=true) as below, or use [alternative options](/help/bump-cli), with

```bash
npm install -g bump-cli
```

3. Launch your local server with

```bash
uvicorn main:app --reload
```

Note: You might need, depending on how you usually run your Python commands, to prepend them with `python3 -m`.

4. Deploy your doc to Bump.sh with

```bash
bump deploy http://127.0.0.1:8000/openapi.json \
  --doc my-documentation-name \
  --token my-documentation-token
```

That's it! Enjoy the comfort of Bump.sh to browse through your API doc, and [customize it to your needs](/help/getting-started/quick-start#customization-options).
