---
title: Create and manage documentation
---

- TOC
{:toc}

## Where can I find my documentation?

By default, accessing your dashboard displays all your documentation.

![](/images/help/organization-view.png)

## Create a documentation

Creating documentation starts from your dashboard, using the button of the same name. You will then need to provide some essential information:

![](/images/help/doc-creation.png)

| Name     | The name of the documentation as it will appear to those who have access to it.     |
| API type     | Specify if your documentation pertains to a REST API or an Event-Driven API.     |
| Deployment method     | Allows you to choose the deployment type that best suits your workflow. You can modify it at any time.     |
| Slug | The slug allows you to define the URL of your documentation, in the format `https://bump.sh/your-username/your-slug`.     |
| Documentation Access         | Documentation can be either public and accessible to everyone or private, visible only to you and invited members.     |
| Hub | Specify if your doc should be published "stand-alone" or within a Hub |


The next step is to deploy the first API document of your documentation, for which you will need your API document: the API definition file.

![](/images/help/upload-document.png)

There are several methods for deploying the first and future API definitions of your documentation, which we will detail further in the next section.

## Group documentation under a Hub

Hubs are a convenient option to group multiple docs together, like a catalog. Note that adding a doc to a Hub may have it inherit the [Hub access management settings](/help/hubs/hub-settings/), and [UI cutomization settings](/help/hub/customize-ui).

Additionally, it is possible to group docs of a Hub per Category. Once a doc is created, go to the Settings of the doc, under Hubs settings.

You can set as many categories as needed per doc. Categories must be comma-separated. 


![](/images/help/doc-hub-settings.png)

> If at least one doc in a Hub has a category set, and that the [Hub setting](/help/hubs/hub-settings/#documentation-listing) "Group documentation by category" is selected, any doc without a category will not be displayed in the Hub.
{: .warning}


## Delete a documentation

You can delete documentation at any time from the Settings section of that documentation.

Deleting documentation involves the loss of all uploaded API definitions, the changelog, and the history.

> All deletions are final. We cannot restore or recover any portion of the data once it's deleted.
{: .warning}
