---
title: Documentation access management
---

- TOC
{:toc}

## Public or Private?

Bump.sh allows you to choose whether documentation is public or private.

By "public," we mean documentation that is accessible to any visitor who has access to it, either by finding it through a direct link or through a search engine.
Public documentation is indexed by search engines and can be found by anyone without any restrictions. It is not possible to restrict access to any part of your documentation; it will be fully accessible.

Private documentation, on the other hand, is only accessible to users who have been individually invited. There are two types of invited users: those who are part of the same organization and "external" guests.
They require user authentication to be accessible and are not indexed by search engines.

![](/images/help/documentation-access-choice.png)

## Private

### Members of an organization

Members of an organization have access to all the documentation contained within that organization.

Inviting a colleague or teammate to become a member of [your organization](/help/organizations/) can be done from the settings of that organization, by entering the email address in the dedicated form.

![](/images/help/org-add-member.png)

### Invite external guests

> Only admin and maintainer roles can invite external guests.
> {: .info}

To invite people from outside of your organization to access a private documentation, click on the `Share Access` button, which is visible in the settings of that documentation.

![](/images/help/share-access-button.png)

From there, you just need to enter the email address of the invited person.

![](/images/help/share-access.png)

They will receive an email inviting them to sign up on Bump.sh. This step is essential to ensure the security of access to your documentation.

## Public

Access to your public documentation is solely determined by its URL and its discoverability by search engines.

The slug is the portion of the URL that you can customize but you can also choose to use a custom domain instead:

- By default, on Bump.sh, your documentation will be available on this URL `https://bump.sh/your-slug/doc/your-documentation`
- With a custom domain, your documentation will be available on `https://www.custom.domain.com`

> Any changes to your slug/username will result in a change in the URL of your public documentation, without redirection from our side. Make sure to update the URLs you publish or share with your API users accordingly.
{: .warning}