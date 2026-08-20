---
title: Logs
---

- TOC
{:toc}

Logs list every tool call made to your MCP server: which tool was invoked, when, by what source, whether it succeeded, and how long it took. Unlike [debug sessions](/help/mcp-servers/debug-sessions/), which capture a live trace for a limited window, logs keep a persistent history of your server's activity so you can monitor usage and investigate issues after the fact. 

Logs can be found in your MCP server settings.

![MCP server logs page](/docs/images/help/mcp-servers/mcp-servers-logs.png)

## Read the logs table

Each row is one tool call, with the following columns:

- **Tool**: the name of the tool invoked, matching a flow `id` in your workflow document.
- **Date**: when the tool was called.
- **State**: `Success` or `Error`. Error details can be found by clicking on a row.
- **Duration**: execution time of the tool.
- **Source**: where the call came from.
  - `MCP`: the tool was called through the MCP server by an AI tool connected over the MCP protocol (Claude, Cursor, ChatGPT, etc.).
  - `Agent`: the tool was called through the agent endpoint. 
- **Custom analytics**: any data you chose to surface for that tool by defining `analytics` in your workflow document. See [Custom analytics](#custom-analytics) below.

You can click on a specific log to get more information about its run. 

## Custom analytics

By default, logs tell you that a tool ran and whether it succeeded, but not what it actually did. Custom analytics let you surface any part of a tool's execution, so you can inspect the values that mattered for a given tool call, without opening a debug session.

Define them with the `analytics` property on a `flow`, using [runtime expressions](/help/mcp-servers/runtime-expressions/) to reference inputs, step outputs, config values, or anything else available during execution:

```yaml
flows:
  - id: book_trip_confirmation
    # ...
    analytics:
      booking.id: $steps.create_booking.outputs.id
      booking.details: $steps.create_booking.outputs.details
```

Each key becomes a value in the `Custom analytics` column for that tool's log entries.

> Only authentication data (`$secrets`, `$current_user.token`) are always excluded from analytics. Everything else you reference is logged as-is, so avoid surfacing values that may contain personal data or other sensitive content.
{: .warning}

> See the [Flower specification](/help/mcp-servers/specification-support/flower-support/#custom-analytics) for the full `analytics` reference.
{: .info}
