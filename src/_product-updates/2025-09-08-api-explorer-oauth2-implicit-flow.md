---
title: API Explorer - OAuth2 implicit flow support 
tags: [New]
---
Supporting the "implicit" OAuth2 security scheme allows for an automated login experience for your API consumers in the API Explorer.
To activate it, a vendor extension called `x-client-id` can be added to the definition file. Its value should be the ID of a dedicated OAuth client application created on your Authorization server to identify your API consumers.

The `x-client-id` property is added to your OAuth2 implicit flow object:
```yaml
components:
  securitySchemes:
    "OAuth2 implicit flow":
      type: oauth2
      flows:
        implicit:
          authorizationUrl: "https://auth.example.org/oauth"
          scopes: {}
          x-client-id: "123456abcdef"
```
![Animated gif of the Oauth2 implicit flow experience](/images/changelog/api-explorer-oauth2-implicit-flow.gif)
Example of the OAuth2 implicit flow experience for an API consumer already logged into the API's cloud platform.

[Learn more about it in our help center](/help/documentation-experience/api-explorer/#details-about-oauth2-flows)

As always, don't hesitate to reach out at [hello@bump.sh](mailto:hello@bump.sh) if you have any feedback!