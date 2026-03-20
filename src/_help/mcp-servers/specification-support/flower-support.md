---
title: Flower support
---

- TOC
{:toc}

Flower is the internal specification powering the Bump.sh [data plane](/help/mcp-servers/#data-plane). It was designed to keep workflow files as simple as possible, with no external dependencies. For a standardized approach to defining API workflows, we recommend using [Arazzo](/arazzo/v1.0/), the workflow specification from the OpenAPI Initiative.

That said, thanks to its simplicity, Flower can replace Arazzo for small projects that don't require linking to OpenAPI files, or to describe workflows calling external APIs for which you don't have an OpenAPI document.

The specification, along with a JSON Schema for validation and a set of utilities, is available on [GitHub](https://github.com/bump-sh/flower-spec).

## Quick example

This workflow looks up the current weather for a city by chaining two API calls:

```yaml
flower: "0.1"
id: weather
title: Get the weather for a specific city

flows:
  - id: weather_current
    description: Get the current weather for a specific city
    inputs:
      properties:
        city:
          type: string
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

      - id: get_weather_current
        request:
          method: GET
          url: https://api.open-meteo.com/v1/forecast
          query:
            latitude: $steps.get_lat_lon.outputs.lat
            longitude: $steps.get_lat_lon.outputs.lon
            current: temperature_2m,is_day,wind_speed_10m
        outputs:
          temperature: $response.body.current.temperature_2m

    outputs:
      temperature: $steps.get_weather_current.outputs.temperature
```

A Flower document defines a set of **flows**, each composed of sequential **steps**. Each step makes an HTTP request and extracts outputs that subsequent steps can reference. Flower documents can be written in YAML or JSON. YAML is recommended for readability.

## Root properties

| Property | Required | Description |
|----------|----------|-------------|
| `flower` | Yes | Specification version. Currently `"0.1"`. |
| `id` | Yes | Unique identifier for this workflow set. Use lowercase letters, numbers, and hyphens. |
| `title` | No | Human-readable title. |
| `description` | No | What this workflow set does. |
| `flows` | Yes | Array of flow definitions. |

```yaml
flower: "0.1"
id: weather-service
title: Weather Information Service
description: Provides current weather and forecast information
flows:
  - ...
```

## Flows

A flow accepts inputs, executes a series of steps, and produces outputs.

| Property | Required | Description |
|----------|----------|-------------|
| `id` | Yes | Unique identifier within the workflow set. |
| `description` | No | What this flow does. |
| `inputs` | No | Input parameters, defined using [JSON Schema](https://json-schema.org/) format. |
| `steps` | Yes | Array of step definitions, executed sequentially. |
| `outputs` | No | Values extracted from step results using [runtime expressions](#runtime-expressions). |

### Inputs

Inputs use JSON Schema to validate the parameters a flow accepts.

```yaml
inputs:
  properties:
    city:
      type: string
      description: The name of the city
    format:
      type: string
      enum: [celsius, fahrenheit]
      default: celsius
  required:
    - city
```

Supported JSON Schema properties: `type` (`string`, `number`, `boolean`, `array`, `object`), `description`, `enum`, `default`, `required`.

### Outputs

Flow outputs extract data from step results. Each key maps to a [runtime expression](#runtime-expressions).

```yaml
outputs:
  temperature: $steps.get-weather.outputs.temperature
  city_name: $steps.get-coords.outputs.city
```

## Steps

A step represents a single HTTP request. Steps run sequentially within a flow.

| Property | Required | Description |
|----------|----------|-------------|
| `id` | Yes | Unique identifier within the flow. Referenced by subsequent steps. |
| `request` | Yes | The HTTP request to execute. |
| `outputs` | No | Values extracted from the response. |
| `actions` | No | Conditional logic for flow control after this step. |

### Request

| Property | Required | Description |
|----------|----------|-------------|
| `method` | Yes | HTTP method: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`. |
| `url` | Yes | Endpoint URL. Supports [runtime expressions](#runtime-expressions). |
| `headers` | No | HTTP headers as key-value pairs. Values can use runtime expressions. |
| `query` | No | Query parameters as key-value pairs. |
| `body` | No | Request body (object or string). Typically used with `POST`, `PUT`, `PATCH`. |

```yaml
steps:
  - id: create_diff
    request:
      method: POST
      url: https://bump.sh/api/v1/diffs
      body:
        previous_url: "$inputs.left_url"
        url: "$inputs.right_url"
    outputs:
      id: $response.body.id
```

### Step outputs

Outputs extract values from the HTTP response using [runtime expressions](#runtime-expressions). They become available to subsequent steps via `$steps.<step_id>.outputs.<key>`.

```yaml
outputs:
  lat: $response.body.0.lat
  lon: $response.body.0.lon
```

## Actions

Actions control flow execution after a step completes. They are evaluated in order: the first matching action is executed.

Each action has two properties:
- **`when`** (optional): A condition expression. If omitted, the action always matches.
- **`do`** (required): The action type.

| Action type | Description | Extra properties |
|-------------|-------------|------------------|
| `next` | Continue to the next step. | |
| `retry` | Retry the current step. | `wait` (seconds, default: 5), `max_retry` (default: 5) |
| `goto` | Jump to a different step. | `step` (target step ID) |
| `end` | Terminate the flow and return outputs. | |

```yaml
actions:
  - when: "$statusCode == 202"
    do: retry
    wait: 2
    max_retry: 5
  - when: "$response.body.error"
    do: end
  - do: next
```

## Runtime expressions

Runtime expressions reference dynamic data during execution. They use a `$` prefix with dot notation.

| Expression | Description |
|------------|-------------|
| `$inputs.city` | Flow input parameter. |
| `$response.body.field` | Current step's response body. |
| `$response.body.0.lat` | Array index access. |
| `$steps.step_id.outputs.key` | Output from a previous step. |
| `$statusCode` | HTTP status code of the current response. |
| `$secrets.name` | Secret value (never exposed in outputs). |

For the complete reference (JMESPath queries, conditions, resolution order), see [Runtime expressions](/help/mcp-servers/runtime-expressions).

## Full example: API diff with retry

This workflow creates an API diff and polls until the result is ready:

```yaml
flower: "0.1"
id: bump
title: Bump.sh API diff

flows:
  - id: diff
    description: Get a diff between 2 API documents
    inputs:
      properties:
        left_url:
          type: string
          description: First API contract URL
        right_url:
          type: string
          description: Second API contract URL
      required:
        - left_url
        - right_url

    steps:
      - id: create_diff
        request:
          method: POST
          url: https://bump.sh/api/v1/diffs
          body:
            previous_url: "$inputs.left_url"
            url: "$inputs.right_url"
        outputs:
          id: $response.body.id

      - id: get_diff
        request:
          method: GET
          url: https://bump.sh/api/v1/diffs/$steps.create_diff.outputs.id
        outputs:
          result: $response.body.markdown
          breaking: $response.body.breaking
        actions:
          - when: "$statusCode == 202"
            do: retry
            wait: 2
          - do: next

    outputs:
      breaking: $steps.get_diff.outputs.breaking
      result: $steps.get_diff.outputs.result
```
