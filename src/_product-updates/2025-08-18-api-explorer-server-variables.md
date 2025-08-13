---
title: API Explorer - Server variables 
tags: [New]
image: /images/changelog/api-explorer-server-variables.png
---

![api-explorer-server-variables.png](/images/changelog/api-explorer-server-variables.png)

Server variables enable [API Explorer](/help/documentation-experience/api-explorer/) users  to customize the request server with predefined enums or custom strings. It's useful to specify a server region or a client specific instance, for example.

Variables are defined in a server object: 
```yaml
servers:
  - url: https://{region}.bump.sh/{docId}
    description: The production API server
    variables:
      docId:
        description: Can be found in your documentation settings.
      region:
        enum:
          - "east-eu"
          - "west-eu"
        default: "east-eu"
```

In this example, two variables were added:  
- `docId` is a string, and a description has been defined to help the API user find its value,
- `region` is an enumerated list, with `east-eu` being the default value.

The API Explorer renders each variable accordingly.
![Server variable topbar example](/images/changelog/api-explorer-server-variables-global-display.png)

[Learn more about it in our help center](/help/documentation-experience/api-explorer/#server-variables)

Any feedback on this feature? We're happy to hear them! Say hi at [hello@bump.sh](mailto:hello@bump.sh).