---
title: Custom OAuth server and custom domain for your MCP servers
tags: [New]
---

Our last release add two new ways to make your MCP server integrate more deeply into your ecosystem.

## Bring your own OAuth server

Private MCP servers no longer require a Bump.sh account for your users. If you already run your own identity provider (Okta, Auth0, Keycloak, etc.), you can delegate authentication to it instead: your users sign in the way they already do, and get access to your MCP server without ever touching Bump.sh.

Just provide your OAuth authorization server URL in your MCP server settings, we'll handle the redirect. Learn more in the [help center](/help/mcp-servers/access-management/#private-mcp-servers-using-your-own-oauth-server).

![MCP server settings - Custom domain field.png](/docs/images/changelog/mcp-servers-custom-oauth.png)

## Custom domain

Your MCP server URL can now live under your own domain, as you do for your API docs. Simply set up a CNAME record and add the custom domain in your MCP server settings. More about it in the [help center](/help/mcp-servers/customization-options/custom-domain/).

![MCP server settings - Custom OAuth field.png](/docs/images/changelog/mcp-servers-custom-domains.png)

The MCP Platform is now out of beta and available on all plans. Go to your dashboard to give it a try! 
Any questions or feedback? Reach out at [hello@bump.sh](mailto:hello@bump.sh).