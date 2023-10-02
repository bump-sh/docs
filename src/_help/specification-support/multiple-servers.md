---
title: Multiple Servers
---

Both REST and Event-Driven APIs may run on different servers (production, staging, sandbox).

And both [OpenAPI](https://spec.openapis.org/oas/v3.1.0#server-object) and [AsyncAPI](https://www.asyncapi.com/docs/reference/specification/v2.6.0#serverObject) provide field `servers`, where more than one server can be defined.

With multiple servers support, it’s now possible to render these different servers in documentation.

## Setting multiple servers

Publishing the list of all of your servers in your documentation on Bump.sh is optional. In some cases, you might need to expose only the first server of the list.

To show the list of servers on your documentation, activate the setting from the **Settings** tab of your documentation administration panel:

![multiple servers setting](/images/help/multiple-servers--setting.png)


## Render multiple servers

When this setting is activated and your specification contains several servers, your documentation will display a list of all servers,
accessible from this url: `${documentation_url}/servers`

By default, the first server is used to generate all curl examples on your documentation.

Readers of the documentation can select a different server from this selection component:

![multiple servers component](/images/help/multiple-servers--component.png)

For REST API documentation, the url of selected server is used to generate curl examples.
For Event-Driven API documentation, protocol and protocol versions are updated depending on the selected server.

When sharing a link to the documentation as a reader, the `server_id` query parameter will be passed with the URL, so that the recipient will see the exact same information as the person who shared it.


> For REST APIs, alternative servers can be defined for every [OpenAPI Operation Object](https://spec.openapis.org/oas/v3.1.0#operation-object):
>
> Operation objects can include a `servers` field, which is an array of servers for this specific operation.
>
> > If an alternative server object is specified at the Path Item Object or Root level, it will be overridden by this value.
>
> It means this operation has its own and dedicated url to receive requests.
>
> Thus, of course, curl examples for these operations are not concerned by the selection of multiple servers: only this alternative server is displayed.
{: .info}
