---
title: Organization access management
---

- TOC
{:toc}

## Roles

The roles allow you to precisely choose which permissions to assign to members of your organization. The details of permissions by role are available below:

| Role/Permission          | Admin | Maintainer | Viewer |
|:-------------------------|:------|:-----------|:-------|
| Documentation access     | ✓     | ✓          | ✓      |
| Hubs access              | ✓     | ✓          | ✓      |
| Documentation management | ✓     | ✓          |        |
| Hubs management          | ✓     | ✓          |        |
| Invite external guests   | ✓     | ✓          |        |
| Organization management  | ✓     |            |        |
| Member management        | ✓     |            |        |

A member's role can be changed at any time through the organization's list of members. The menu located to the right of each member allows you to change their role.

![](/images/help/org-members.png)

## SSO

Bump.sh supports Single Sign-On through your identity providers, to ease who in your organization can access admin permissions.

Our Single Sign-On feature relies on WorkOS, which supports a [wide variety of integrations](https://workos.com/docs/integrations) with third-party identity and access management solutions (e.g. generic SAML, SCIM, OpenID, as well as Auth0, Okta, Keycloak, Azure AD, Google SAML and more).

Once an SSO connection is set up, a link pointing to a login page is available in the dashboard, allowing you to easily share it.

This page can be customized with a logo and specific button labels and descriptions (contact us in this latter case).

The login page will systematically appear when attempting to access via the direct URL of a documentation or a hub behind this SSO, if one is not already authenticated.

> SSO is available in our [custom plans](https://bump.sh/pricing/).
{: .info}

### How to setup SSO

Enabling SSO typically involves two steps: one on the Bump.sh side and one on your identity provider's side.

To activate SSO for your organization, the organization's owner must contact our support team.

The configuration step for your identity provider depends on the specific provider you are using. You can refer to the [various guides provided by WorkOS](https://workos.com/docs/integrations) to follow the necessary steps.

> By default, all users who get access to Bump.sh via the configured SSO will have the “Viewer” Role/Permission.
{: .info}

### Operation with Bump.sh

Once the SSO connection(s) are set up, your private documentation or hubs will only be accessible to authenticated users. You will find the link to the SSO login page in the settings of your organization.
This SSO login link redirects to the dashboard. 

The login page will be displayed each time an unauthenticated user attempts to access a private documentation or hub.

The will always redirect to the initially targeted URL (for example, if a logged-out user uses a URL to access a specific documentation, they will be redirected to that documentation after authentication via SSO).