---
title: Introducing Bump.sh MCP platform
tags: [New]
image: /docs/images/changelog/mcp-servers-announcement.png
---
![mcp-servers-announcement.png](/docs/images/changelog/mcp-servers-announcement.png)

APIs are no longer consumed only by humans. AI agents need to interact with them too, in a reliable and controlled way.

Most approaches today rely on naive OpenAPI-to-MCP transformations: individual endpoints exposed as tools, no orchestration, no security layer. The result is fragile, hard to maintain, and risky to run in production.

__This is why we have built the Bump.sh MCP Platform: thanks to declarative workflows, you can now turn your APIs into deterministic, production-ready [MCP](https://modelcontextprotocol.io/docs/getting-started/intro) servers. No guessing at runtime, no glue code, no credentials leaking to the LLM__.

## Not a simple OpenAPI-to-MCP conversion

Bump.sh MCP servers expose ready-to-use workflows, not individual endpoints. You define the goals your API users can achieve (e.g. "book a train trip"), and the MCP server follows the workflow you defined, step by step.

This means you keep full control of the orchestration. AI tools consume fewer tokens, and the execution is predictable and repeatable.

## Declarative by design

Your MCP servers are based on workflow documents written in YAML. No hidden logic: everything is versionable, reviewable, and CI/CD-friendly. If you already use Bump.sh for API documentation, the experience is the same: update your definition, deploy from your CI, iterate with your team. 

Two specifications are supported:
* [Arazzo](https://docs.bump.sh/arazzo/v1.0/) (the OpenAPI Initiative standard) if you already have OpenAPI definitions
* [Flower](/help/mcp-servers/specification-support/flower-support/), our lightweight specification for simple cases where no OpenAPI document is needed

## Built-in security

Credentials never go through the LLM. Store your API keys using [Secrets](/help/mcp-servers/secrets/): they stay server-side, only used to authenticate requests to your APIs.

MCP servers can be private, just like API docs. Manage who gets access directly in Bump.sh or using your own custom authentication server. Thanks to our integrated OAuth support, your users authenticate in one click, directly in their AI tools.

When an AI agent calls your MCP server, the data plane is the component that executes your workflows and forwards requests to your APIs. It runs on a server separated from Bump.sh's main infrastructure, and no sensitive data is stored or logged. By default (on self-service plans), the data plane is hosted by Bump.sh. For custom plans, you can host it in your own infrastructure to get full control over your data.

## Observability and debugging

When things go wrong with API workflows, identifying the root cause can get tricky. Each MCP server comes with a built-in live debugger that lets you follow each step of a workflow execution in real time. [Debug sessions](/help/mcp-servers/debug-sessions/) are secured and fully historized: you know exactly who triggered a session and when, giving you a complete audit trail of your debugging activity.

## Join the closed beta

Bump.sh MCP Platform is currently in closed beta. [Sign up here](https://survey.typeform.com/to/SQLtxk7j) to get early access and help us shape the product.

If you have any questions or feedback, [reach out to us](mailto:hello@bump.sh) anytime.
