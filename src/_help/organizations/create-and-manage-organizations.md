---
title: Create and manage organizations
---

- TOC
{:toc}

## How to create an organization

To create an organization, simply reach the account selection in menu in the top bar and click on "Create a new organization".

![](/images/help/org-dropdown.png)

You can also, from your settings and the Organization section, create a new organization and view the list of those you are a member of.

![](/images/help/create-org.png)

You will then be prompted to specify the organization's name (visible to all its members and guests) and its slug, which determines its URL (in the format bump.sh/your-organization-slug/).

![](/images/help/org-creation.png)

At this stage, you can also choose to move existing documentation and/or hubs to your new organization. These will retain the access settings they had before the migration.

## Add teammates to an organization

From the Members section in the settings of an organization, you can add new members, view the list of existing members, modify their roles, and check pending invitations.

To invite a new member, simply provide their email address and specify the role you wish to assign to them.

![](/images/help/org-add-member.png)

[Roles](/help/organizations/organization-access-management/#roles) allow you to precisely adjust what a member of your organization can or cannot do. You can change a member's role at any time.

> Please note that only the owner of the organization has access to billing and its options.
{: .info}

### Add teammates with SSO

If your plan allows it, you can add team members via SSO. More information is available in the [dedicated section here](/help/organizations/organization-access-management/#sso).

> Using SSO does not prevent you from inviting users via manual invitations.
{: .info}

## Remove members from an organization

Still from the Members section, you can easily remove a member from your organization by clicking on their role to the right of their name and email. The option to delete this member is available at the very end of the list that appears.

## Change URL/slug

Slug can be considered as the namespace of your organization, a human-readable URLs pointing to it.
Everything in your organization, from documentation to hubs, will be below the slug in the URL.
It will look like this: `https://bump.sh/your-slug/your-documentation`.

From the settings of your organization, you can quickly change the slug via the dedicated field.
Bump.sh does not automatically redirect to the new URL after changing the slug, so be sure to notify your users of this change.

> Modifying the slug changes the URL of all the documentation and Hubs inside your organization.
{: .warning}

## Transfer Ownership

The owner of an organization must transfer ownership to another admin member if they are leaving it. This operation can be performed by contacting us.

If you choose to close your Bump.sh account but are still the owner of an organization, a warning message will be displayed.

## Delete an organization (and consequences on existing docs)

This action can be initiated from the organization's settings, in the danger zone.

Deleting an organization is a significant decision with consequences for your documentation and organization members. It should be made with careful consideration. If you have any doubts or issues, feel free to contact us beforehand.

![](/images/help/org-danger-zone.png)

> Deleting an organization is permanent and irreversible; the documentation and hubs it contains will also be destroyed.
We cannot recover content that has been deleted.
{: .warning}