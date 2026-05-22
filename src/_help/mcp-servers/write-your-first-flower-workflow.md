---
title: Write your first Flower workflow
---

- TOC
{:toc}

This guide provides a step-by-step explanation of how to define an API workflow to achieve real-world goals using the Flower specification. For a complete reference of all properties, see [Flower support](/help/mcp-servers/specification-support/flower-support).

## How to design your workflows

Before writing a single line of YAML, take the time to define your use cases. The first question you should ask yourself is: what tasks most of my users (either humans or agents) want to achieve using my APIs, or my UI? It could be looking at analytics, checking the gross revenue for the last 30 days, finding a product in a catalog, ...

Once that question is behind you, think about:
- The API call chain needed to achieve the workflow. Does your API currently have the capabilities to execute that workflow? 
- The inputs the workflow will need.
- What are the expected outputs from the user/AI?

If that's the first time you design workflows for an MCP server, start simple: focus on the two or three workflows that will be the most useful to your users. Ideally, these first workflows are read-only.

> The closer your workflows stay to real user needs, the more effectively AI tools will use them, and the less guesswork they'll need.
{: .info}

## Generate a Flower document using AI

We recommend following this getting started to get a hand on the specification, but you can also generate a Flower document using an LLM. To do so:
- Describe what you want to achieve with these workflows (book a train ticket, retrieve analytics from different sources, ...).
- Provide a link to your API documentation or your API document.
- Give the LLM context about the Flower specification:
  - [Flower support reference](https://docs.bump.sh/help/mcp-servers/specification-support/flower-support/)
  - [Flower schema](https://github.com/bump-sh/flower-spec)
  - [Flower document examples](https://github.com/bump-sh/flower-spec/tree/main/examples)

## Learn the basics

### Set the global structure

Create a new YAML file and add the following root properties:

```yaml
flower: "0.1"
id: weather 
title: Get the weather for a specific city 
description: >
  Fetches the current weather for any city in the world.
flows:
  - ...
```

- `flower` declares the specification version. Last version is `"0.1"`.
- `id` is a unique identifier for this workflow set. Use lowercase letters, numbers, and hyphens.
- `title` and `description` help AI agents and LLMs understand what can be achieved with your MCP server.
- `flows` holds the list of flows. You will define them in the next steps.

### Define your first flow

A flow is a sequence of API calls (or steps in Flower). Replace the placeholder `- ...` from above with your first flow. Try to keep it simple for your first document, so you easily get the full picture.

```yaml
flows:
  - id: weather_current
    description: >
      Get the current temperature and rain for a specific city.
      Returns temperature in Celsius and current rain in mm.
    inputs:
      properties:
        city:
          type: string
          description: The name of the city (e.g. Paris, Tokyo)
      required:
        - city
    steps:
      - ...
```

- `id` identifies the flow. It's also the tool name exposed by your MCP server.
- `description` is read by AI agents and LLMs to decide when and how to invoke the flow. It's dedicated to non-human readers: describe what it returns, not just what it does.
- `inputs` uses [JSON Schema](https://json-schema.org/) to declare what parameters the flow accepts. List mandatory ones under `required`.

> A precise `description` makes a big difference. Vague descriptions lead AI tools to call the wrong flow or pass incorrect inputs.
{: .info}

### Add a step

Steps are where the HTTP calls happen. Each step makes one request and optionally extracts values from the response. A flow is usually made of multiple steps, but we'll only add one for now to focus on its content. Replace the placeholder `- ...` from above with your first step:

```yaml
flows:
  - id: weather_current
    ...
    steps:
      - id: get_lat_lon
        request:
          method: GET
          url: https://nominatim.openstreetmap.org/search
          headers:
            Authorization: "Bearer $secrets.my-api-key"
          query:
            q: $inputs.city
            format: jsonv2
        outputs:
          lat: $response.body.0.lat
          lon: $response.body.0.lon
```

A few things to notice:
-  `$secrets.my-api-key` injects a [secret](/help/mcp-servers/secrets/) stored on Bump.sh. 
- `$inputs.city` is a **runtime expression** that injects a value provided either by an AI agent or a human through its LLM. Expressions always start with `$`. See [Runtime expressions](/help/mcp-servers/runtime-expressions) for the full reference.
- `query` maps to URL query parameters. The request above resolves to `GET /search?q=Paris&format=jsonv2` when `city` is `Paris`.
- `outputs` extracts values from the response. `$response.body.0.lat` reads the `lat` property from the first element of the response array.

### Define global outputs

Flows return data to the API tool through a top-level `outputs` map. Add one at the end of your flow:

```yaml
flows:
  - id: weather_current
    steps:
      - id: get_lat_lon
        ...
    outputs:
      lat: $steps.get_lat_lon.outputs.lat
      lon: $steps.get_lat_lon.outputs.lon
```

`$steps.get_lat_lon.outputs.lat` follows the pattern `$steps.<step_id>.outputs.<key>`. 

> Even if the API returns more information, only values declared as outputs are returned to the AI tool. 
{: .info}

Congratulations! You have your first valid, deployable Flower document. It calls one API and returns two values. Let's make it more useful and robust.

## Define a reliable, multi-step workflow

### Chain steps together

Workflows power comes from passing data between steps to achieve a real business goal. Reference a previous step's outputs using `$steps.<step_id>.outputs.<key>` in the next step's request.

Add a second step that takes the coordinates from `get_lat_lon` and calls the weather API:

```yaml
    steps:
      - id: get_lat_lon
        ...
        outputs:
          lat: $response.body.0.lat
          lon: $response.body.0.lon
      - id: get_weather_current
        request:
          method: GET
          url: https://api.open-meteo.com/v1/forecast
          query:
            latitude: $steps.get_lat_lon.outputs.lat
            longitude: $steps.get_lat_lon.outputs.lon
            current: temperature_2m,wind_speed_10m,rain
            timezone: Europe/Berlin
        outputs:
          temperature: $response.body.current.temperature_2m
          rain: $response.body.current.rain
    outputs:
      temperature: $steps.get_weather_current.outputs.temperature
      rain: $steps.get_weather_current.outputs.rain
```

Steps run sequentially. Each step can reference the outputs of any step that ran before it.

### Add conditions and handle errors 

By default, a step completes and the flow moves on. `actions` let you change that behavior based on the response. They are evaluated in order: the first matching one is executed.

```yaml
    steps:
      - id: get_lat_lon
        ...
        actions:
          - when: "$statusCode == 404"
            do: end
          - when: "$statusCode == 429"
            do: retry
            wait: 5
            max_retry: 3
          - do: next
```

Let's break down the actions:
- If the API returns a 404, the flow stops here.
- If the API returns a 429, the step is retried after 5 seconds. 3 retries maximum.
- Otherwise, the next step starts.

You can have conditions on response body values, not just status codes:

```yaml
actions:
  - when: "$response.body.error == true"
    do: end
  - do: next
```

> See [Runtime expressions](/help/mcp-servers/runtime-expressions) to see how response values can be transformed and used as a condition to define the next step.
{: .info}

| Action | What it does |
|--------|-------------|
| `end` | Terminates the flow and returns collected outputs so far. |
| `retry` | Re-runs the same step. `wait` (seconds) and `max_retry` are optional. |
| `next` | Continues to the following step. |
| `goto` | Jumps to a specific step by its `id`. |

> The last action in the list is typically a catch-all with no `when` clause. 
{: .info}

### Authenticate with protected APIs

It's not the case in our example, but if the API you're calling requires authentication, create a [secret](/help/mcp-servers/secrets/) on Bump.sh to store the key securely. 

Reference it with the `$secrets.{name}` expression. You can also use `$currentUser.token` to directly retrieve the authenticated user's token.

For example, if the API expects the key in a request header, add it in the step `request.headers`:

```yaml
flows:
  - id: weather_current
    steps:
      - id: fetch_weather
        request:
          method: GET
          url: https://api.example.com/weather
          headers:
            Authorization: "Bearer $secrets.my-api-key"
```

> The secret is injected at runtime and never sent to the AI tool.
{: .info}

## Complete example

Here is the full workflow built step by step in this guide:

```yaml
flower: "0.1"
id: weather
title: Get the weather for a specific city
description: >
  Fetches the current weather for any city in the world.

flows:
  - id: weather_current
    description: >
      Get the current temperature and rain for a specific city.
      Returns temperature in Celsius and rain in mm.
    inputs:
      properties:
        city:
          type: string
          description: The name of the city (e.g. Paris, Tokyo)
      required:
        - city

    steps:
      - id: get_lat_lon
        request:
          method: GET
          url: https://nominatim.openstreetmap.org/search
          query:
            q: $inputs.city
            format: jsonv2
        outputs:
          lat: $response.body.0.lat
          lon: $response.body.0.lon
        actions:
          - when: "$statusCode == 404"
            do: end
          - do: next

      - id: get_weather_current
        request:
          method: GET
          url: https://api.open-meteo.com/v1/forecast
          query:
            latitude: $steps.get_lat_lon.outputs.lat
            longitude: $steps.get_lat_lon.outputs.lon
            current: temperature_2m,wind_speed_10m,rain
            timezone: Europe/Berlin
        outputs:
          temperature: $response.body.current.temperature_2m
          rain: $response.body.current.rain
        actions:
          - when: "$statusCode == 429"
            do: retry
            wait: 5
            max_retry: 3
          - do: next

    outputs:
      temperature: $steps.get_weather_current.outputs.temperature
      rain: $steps.get_weather_current.outputs.rain
```

## Next steps

- [Deploy this file](/help/mcp-servers/deploy-workflows/) to your MCP server.
- Store API keys safely using [secrets](/help/mcp-servers/secrets/).
- Add more flows to the same file following the same pattern.
- Learn how to do more complex data transformation and create condition trees using [Runtime expressions](/help/mcp-servers/runtime-expressions).
- Read the full [Flower specification reference](/help/mcp-servers/specification-support/flower-support/) for all available properties and options.
