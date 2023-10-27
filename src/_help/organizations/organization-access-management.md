---
title: Organization Access Management
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
| Organization management  | ✓     |            |        |
| Member management        | ✓     |            |        |

A member's role can be changed at any time through the organization's list of members. The menu located to the right of each member allows you to change their role.

![](/images/help/org-members.png)

## SSO

Bump.sh supports Single Sign-On through your identity providers, to ease who in your organization can access admin permissions.

Our Single Sign-On feature relies on WorkOS, which supports a [wide variety of integrations](https://workos.com/docs/integrations) with third-party Identity and Access Management solutions (e.g. generic SAML, SCIM, OpenID, as well as Auth0, Okta, Keycloak, Azure AD, Google SAML and more).

> SSO is a feature available from our Business plan.
{: .info}

### How to setup SSO

Enabling SSO typically involves two steps: one on the Bump.sh side and one on your identity provider's side.

To activate SSO for your organization, the organization's owner must contact our support team, who will send them a configuration email.

The configuration step for your identity provider depends on the specific provider you are using. You can refer to the [various guides provided by WorkOS](https://workos.com/docs/integrations) to follow the necessary steps.

> By default, all users who get access to Bump.sh via the configured SSO will have the “Viewer” Role/Permission.
{: .info}

