# Release management

Any new deployment made from the [web console](/getting-started/quick-start.md#step-2-upload-your-file), or from the [CLI](/bump-cli.md#deploy-a-file), or from the [Github Action](/continuous-integration/github-actions.md#deploy-on-git-push), will be visible in your deployments history list from your documentation dashboard, by selecting the Deployments tab.

<div style={{textAlign: 'center'}}>

![](/files/help/deployments-list.png)

</div>

On this list your can see the state of each deployment (`enqueued`, `deploying`, `deployed` or `errored`) and also their status (`Released` or `Not released`).

This help page describes the two possible release management flows on Bump.sh. You can choose between _[Automatic Release](#automatic-releases)_ (default for every new documentation) or _[Manual Release](#manual-releases)_.

## Automatic releases

:::info
This is the default release mode for every newly created documentation
:::

Automatic release mode will publish any new deployed version to your documentation without the need for manual intervention. Everytime you send a new definition file to your documentation, changes will be made to both:

- Your main documentation page. Which will be updated with the latest deployed version.
- Your documentation changelog page. Which will be updated with the newly released API change.

## Manual releases

:::caution
This release mode has recently been introduced to Bump.sh and is still in beta. Please <a class="intercom-launcher-selector" href="mailto:help@bump.sh">contact us</a> for any questions or feedback on this feature.
:::

From your documentation settings, reach the _Manual Release_ section and enable the setting.

<div style={{textAlign: 'center'}}>

![](/files/help/manual-release-toggle.png)

</div>

From now on, every new deployment will appear in your deployments list with the `Not released` status. As long as it remains in this status, the new version is not visible to consumers and the changelog remains unchanged.

<div style={{textAlign: 'center'}}>

![](/files/help/deployments-list-not-released.png)

</div>

With Manual Release mode, you can thus work on new deployments without impacting your documentation, nor your API consumers. And decide, when ready, to release the exact change you wish to publish on your documentation.

## How to release a deployment

In the deployments list tab, you can select a `Not released` deployment. From the selected deployment page, you can then decide to release whenever you need to publish your change by selecting the “Prepare Release” button.

![](/files/help/deployment-release-button.png)

Before releasing your change, you can optionally customise the title and the description of your change which will be displayed in your API changelog once released.

![](/files/help/deployment-release-form.png)

Description of a release can be written with [Markdown syntax](/specifications-support/markdown-support.md) if needed.

## How to unrelease a deployment

In the deployments list tab, you can select any `Released` deployment. From the selected deployment page, you can then decide to unrelease a previously published change by selecting the “Unrelease” button in the `…` button.

![Screenshot of the Unrelease button in deployment page](/files/help/unrelease-button.png)

:::caution
Unreleasing a deployment will affect the next released deployment by recomputing its change with the previously released deployment
:::
