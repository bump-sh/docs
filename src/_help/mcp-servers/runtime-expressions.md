---
title: Runtime expressions
---

- TOC
{:toc}

Runtime expressions let you dynamically reference values during workflow execution: inputs from the caller, responses from previous steps, secrets, and more. They are used in both [Flower](/help/mcp-servers/specification-support/flower-support) and Arazzo workflow definitions.

Expressions start with a `$` prefix and are resolved at runtime.

## Expression variables

### Flow inputs (`$inputs`)

Access values passed by the caller when invoking a flow.

```yaml
query:
  q: $inputs.city
```

Nested access and array indexing are supported (see [Accessing data](#accessing-data) for all syntaxes):

| Expression | Description |
|---|---|
| `$inputs.city` | Top-level input |
| `$inputs.address.zipcode` | Nested object property |
| `$inputs.items.0.name` | Array element (dot notation) |
| `$inputs.items[0].name` | Array element (JMESPath) |

### Current step response (`$response`)

Reference the HTTP response of the current step.

```yaml
outputs:
  lat: $response.body.0.lat
  lon: $response.body.0.lon
  status: $response.status
```

| Path | Description |
|---|---|
| `$response.body` | Parsed response body (JSON) |
| `$response.body.<path>` | Deep access into the body |
| `$response.status` | HTTP status code |
| `$response.headers` | Response headers |
| `$statusCode` | Shortcut for `$response.status` |
| `$status` | Shortcut for `$response.status` |

### Current step request (`$request`)

Reference the request sent for the current step.

| Path | Description |
|---|---|
| `$request.method` | HTTP method (`GET`, `POST`, etc.) |
| `$request.url` | Full URL including query string |
| `$request.query` | Query parameters |
| `$request.headers` | Request headers |
| `$request.body` | Request body |
| `$method` | Shortcut for `$request.method` |
| `$url` | Shortcut for `$request.url` |

### Current step outputs (`$outputs`)

Reference resolved outputs of the current step. Useful when an output depends on another output's value.

```yaml
outputs:
  lat: $response.body.0.lat
  coordinates: "$outputs.lat, $response.body.0.lon"
```

### Previous step results (`$steps`)

Access the request, response, or outputs of a previously executed step.

```yaml
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

  - id: get_weather
    request:
      method: GET
      url: https://api.open-meteo.com/v1/forecast
      query:
        latitude: $steps.get_lat_lon.outputs.lat
```

The pattern is `$steps.<step_id>.<property>.<path>` where `<property>` is one of:

| Pattern | Description |
|---|---|
| `$steps.<id>.outputs.<key>` | A resolved output value |
| `$steps.<id>.response.body.<path>` | Response body access |
| `$steps.<id>.response.status` | Response status code |
| `$steps.<id>.request.url` | Request URL |

### Server secrets (`$secrets`)

Reference secrets stored on the server. Secret values are never included in workflow outputs.

```yaml
headers:
  Authorization: "Bearer $secrets.API_KEY"
```

Secret names must start with a letter, followed by letters, digits, or underscores (e.g. `API_KEY`, `myToken2`).

> See [Secrets](/help/mcp-servers/secrets) for how to configure secrets on your MCP server.
{: .info}

### Current user token (`$current_user.token`)

Returns the OAuth token of the currently authenticated user. Only available on [private MCP servers](/help/mcp-servers/access-management/). Useful for forwarding the user's identity to external APIs.

```yaml
headers:
  Authorization: "Bearer $current_user.token"
```


## Accessing data

Two syntaxes are available:

- **Dot notation** covers property access and array indexing. Sufficient for most use cases.
- **JMESPath** adds projections, filtering, slicing, and functions for advanced queries.

Both work with any expression variable (`$response`, `$inputs`, `$steps`, etc.).

### Dot notation

```
$response.body.current.temperature_2m     # object property
$response.body.0.lat                      # array element (0-based)
$response.body.users.0.address.city       # combined
```

### JMESPath

> JMESPath support is a Bump.sh extension. It is not part of the Arazzo specification.
{: .warning}

When dot notation is not enough, Bump.sh supports [JMESPath](https://jmespath.org/), a query language for JSON. An expression is automatically treated as JMESPath when it contains bracket syntax (`[*]`, `[0]`, `[?...]`, `[0:3]`) or a function call (`avg(...)`, `length(...)`, etc.).

#### Projections (`[*]`)

Extract a property from every element of an array:

```yaml
# Given response body: {"users": [{"name": "Alice"}, {"name": "Bob"}]}
outputs:
  names: $response.body.users[*].name
  # -> ["Alice", "Bob"]
```

#### Indexing (`[n]`)

```yaml
outputs:
  first_user: $response.body.users[0].name
  # -> "Alice"
```

#### Slicing (`[start:end]`)

```yaml
outputs:
  first_three: $response.body.items[0:3]
```

#### Filtering (`[?condition]`)

Select array elements matching a condition:

```yaml
# Given: [{"name": "Alice", "age": 25}, {"name": "Bob", "age": 35}]
outputs:
  seniors: $response.body.users[?age > `30`].name
  # -> ["Bob"]
```

> Literal numbers in filter conditions must be wrapped in backticks (`` `30` ``), as per JMESPath syntax.
{: .info}

#### Functions

```yaml
outputs:
  avg_temp: avg($response.body.hourly.temperature_2m)
  count: length($response.body.items)
```

**Numeric**

| Function | Description | Example |
|---|---|---|
| `abs(val)` | Absolute value | `abs($inputs.delta)` |
| `avg(arr)` | Average of a numeric array | `avg($response.body.temps[*])` |
| `ceil(num)` | Round up | `ceil($response.body.score)` |
| `floor(num)` | Round down | `floor($response.body.score)` |
| `sum(arr)` | Sum of a numeric array | `sum($response.body.prices[*])` |

**Array and object**

| Function | Description | Example |
|---|---|---|
| `length(val)` | Length of array, object, or string | `length($response.body.items)` |
| `keys(obj)` | Keys of an object | `keys($response.body.config)` |
| `values(obj)` | Values of an object | `values($response.body.config)` |
| `sort(arr)` | Sort an array | `sort($response.body.scores[*])` |
| `sort_by(arr, &expr)` | Sort by expression | `sort_by($response.body.users[*], &age)` |
| `max(arr)` | Maximum value | `max($response.body.scores[*])` |
| `max_by(arr, &expr)` | Max by expression | `max_by($response.body.users[*], &age)` |
| `min(arr)` | Minimum value | `min($response.body.scores[*])` |
| `min_by(arr, &expr)` | Min by expression | `min_by($response.body.users[*], &age)` |
| `reverse(arr)` | Reverse array or string | `reverse($response.body.items)` |
| `flatten(arr)` | Flatten nested arrays (1 level) | `flatten($response.body.nested)` |
| `to_array(val)` | Wrap value in an array | `to_array($inputs.value)` |

**String**

| Function | Description | Example |
|---|---|---|
| `to_string(val)` | Convert to string | `to_string($response.body.id)` |
| `to_number(val)` | Convert to number | `to_number($response.body.count)` |

**Type**

| Function | Description | Example |
|---|---|---|
| `type(val)` | Returns the JSON type of a value | `type($response.body.result)` |

> Nested function calls (like `length(sort($ref[*]))`) are not supported.
{: .warning}

## String interpolation

Multiple expressions can coexist in a single string:

```yaml
outputs:
  summary: "$steps.get_weather.outputs.temperature in $inputs.city"
  # -> "22.5 in Marseille"
```

> String interpolation only works with dot notation expressions. JMESPath expressions (containing `[*]`, `[0]`, functions, etc.) are resolved as a whole and cannot be combined with other expressions in the same string.
{: .warning}

## Conditions

Expressions inside `when` clauses are resolved, then evaluated with standard operators.

```yaml
actions:
  - when: "$statusCode == 200"
    do: next
  - when: "$statusCode == 202"
    do: retry
    wait: 2
  - when: "$response.body.status == 'pending'"
    do: retry
```

Supported operators: `==`, `!=`, `>`, `<`, `>=`, `<=`, `AND`, `OR`, `!`.


## Complete example

```yaml
flower: "0.1"
id: weather
title: Get the weather for a specific city

flows:
  - id: weather_forecast
    description: Get the weather forecast for a specific city
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

      - id: get_weather_forecast
        request:
          method: GET
          url: https://api.open-meteo.com/v1/forecast
          query:
            latitude: $steps.get_lat_lon.outputs.lat
            longitude: $steps.get_lat_lon.outputs.lon
            daily: temperature_2m_min,temperature_2m_max
            hourly: temperature_2m
        outputs:
          temperature_avg: avg($response.body.hourly.temperature_2m)
          temperature_min: $response.body.daily.temperature_2m_min
          temperature_max: $response.body.daily.temperature_2m_max
        actions:
          - when: "$statusCode == 200"
            do: next
          - when: "$statusCode == 429"
            do: retry
            wait: 10

    outputs:
      temperature_avg: $steps.get_weather_forecast.outputs.temperature_avg
      temperature_min: $steps.get_weather_forecast.outputs.temperature_min
      temperature_max: $steps.get_weather_forecast.outputs.temperature_max
```
