---
title: Security
---

- TOC
{:toc}

Bump.sh MCP servers are designed so that sensitive data never leaves the execution environment and is never exposed to the LLM. This page explains the architecture and the security measures in place.

## Architecture

Bump.sh MCP servers rely on two separate components:

- The **Bump.sh application** handles server configuration, workflow deployments, and access management. It never processes API calls or accesses secret values.
- The **data plane** is an isolated infrastructure that executes your workflows at runtime. It is the only component that resolves [secrets](/help/mcp-servers/secrets/), performs HTTP requests to external APIs, and handles responses.

Because the data plane executes API requests on behalf of the LLM, the LLM itself never directly calls APIs. This means credentials, tokens, and sensitive response data are never exposed to the model.

These two components communicate over encrypted channels (TLS) and are deployed independently.

> The default data plane is hosted on Bump.sh infrastructure. On Custom plans, it can be installed on-premise in your own infrastructure.
{: .info}

## What each component can access

| | Bump.sh application | Data plane |
|---|---|---|
| Server configuration | Yes | Yes |
| Workflow documents | Yes | Yes |
| Secret values (decrypted) | No | Yes, in memory at runtime only |
| API requests and responses | No | Yes, during execution only |
| Execution logs with sensitive data | No | No |

## Data handling

The data plane does not persist sensitive data. Specifically:

- **Secret values** are encrypted at rest (AES-256-GCM) and only decrypted in memory for the duration of a workflow execution. See [Secrets](/help/mcp-servers/secrets/) for details.
- **API responses** are processed in memory and discarded after each execution. They are not stored or forwarded to the Bump.sh application.
- **Logs** never contain secret values, request bodies, or response payloads.
