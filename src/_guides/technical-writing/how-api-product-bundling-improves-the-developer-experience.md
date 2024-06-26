---
title: How API Product Bundling Improves the Developer Experience
authors: james
excerpt: How to package API products to empower a specific role or audience while improving the developer experience.
---

Developer experience (DX) is a critical element of any API product. A well-designed and intuitive API not only attracts developers but also empowers them to build innovative applications and integrations. In some cases, organizations may have a large number of APIs that address the needs of multiple audiences. This article explores how API product bundling, a strategic approach to packaging APIs, can significantly enhance DX.

## Background: The API-Related Challenges Encountered at a Global Hotel Chain

Several years ago, I collaborated with a world-wide hotel chain embarking on growing their new API platform. This initiative was aimed at enabling seamless integration with partners and third-party developers, thereby fostering a broader ecosystem around their services. 

Not long after the API platform started to grow from internal developers to partners, we encountered a challenge. How do we offer a subset of our APIs to specific partners? For example, Online Travel Agencies (OTAs) need to view room availability with their pricing along with booking rooms sold on their website. However, they should not have access to loyalty program details or other internal operation details. Loyalty partners may wish to look up the points for a program member to exchange them for other rewards on their website, but they shouldn’t be able to book reservations. Of course, the hotel web and mobile apps need access to nearly all API capabilities.

This is where we leveraged API product bundling to help us limit the availability of API documentation presented to each of our partners, based on what they were allowed to use. 

## The Power of Bundling with Purpose

API product bundling, when implemented strategically, offers a powerful solution to address these challenges. The core concept lies in packaging a collection of APIs into curated bundles that cater to specific developer needs. This approach offers several advantages:

**Improved Developer Discovery**: By creating well-defined bundles with clear use cases, developers can easily identify the API operations most relevant to their project. This streamlines the discovery process and reduces the time spent deciphering individual API functionalities.

**Enhanced Developer Onboarding**: Bundled APIs can be accompanied by tailored documentation, code samples, and tutorials specifically designed for the intended developer segment. This facilitates a smooth onboarding experience, allowing developers to start building integrations quickly.

**Limiting API Scope**: Developers are provided only with the API documentation that they will be able to use. This avoids those uncomfortable experiences where a developer starts to use an API in a development environment, only to find out they won’t be allowed to use it in production. 


## API Bundling for the Global Hotel Chain

API bundling initially started with two bundles: one for internal developers, along with a dedicated bundle that was created specifically for OTA partners. This kept things manageable initially, as API reference documentation was separated into two separate bundles and offered as separate developer portals. 

The OTA bundle might grant access to functionalities related to room availability, pricing, and reservation creation, while restricting access to operations that could potentially impact brand image or pricing strategies – for example, modifying existing reservations or managing loyalty programs. This ensures that OTAs have the necessary tools to sell rooms effectively without compromising the hotel chain's control over its offerings.

Through the use of some fancy automation scripts, we generated two sets of reference documentation, one for each bundle, that contains the specific API operations they were allowed to use. The link to the OTA reference documentation was shared with their partners, while the internal developer portal was offered for internal app development. 

Over time, we realized that we would need to add three more bundles to address various partners in the marketplace. While we were able to keep the bundle count stable at five, the complexity only increased when generating API documentation for these additional bundles. Add in getting started guides and developer cookbooks, and we had some complex documentation management efforts underway. This led us to generate separate developer portals for each bundle. 

## Beyond Reference Documentation: The Power of Developer Portals

While well-structured reference documentation is crucial for a positive DX, API product bundling can be further enhanced by leveraging dedicated developer portals. These portals act as a central hub for developers to discover, explore, and integrate with APIs available in their specific bundle. In the context of my experience with the hotel chain, a developer portal with the following functionalities significantly improved DX:

**Bundle Showcase**: The portal could prominently feature their API product bundle, clearly outlining the API capabilities  associated with their specific area of focus. No confusion about which APIs they should use or which APIs they would never be allowed to integrate. 

**Interactive Documentation**: Interactive documentation within the portal could allow developers to explore their specific set of API operations within a bundle and test them in a sandbox environment. This would significantly reduce the learning curve and expedite integration.

**Tailored Getting Started Guides**: The portal leveraged the focused nature of each bundle by offering tailored getting started guides that addressed their common use cases. In addition, each product bundle was able to leverage specific terminology based on their partner perspective. This helped to accelerate integration by offering specific examples that addressed their needs, rather than generic solutions that didn’t resonate with their understanding and problem space. 

The result was five dedicated API developer portals that had a level of automation to generate them. Their partners found that the experience was smooth and much faster to get up-to-speed on their specific APIs. Plus, executives within the global hotel chain were so excited that they shared the portals with anyone that would listen (and some that didn’t). 

However, what came with it was the added complexity of technical writing to accommodate these varying perspectives and a complex build process that had to be maintained by a single developer. The cost of maintaining the separate portals was higher than they had expected. 

## Leveraging Existing Solutions: Cost Savings and Efficiency

One additional aspect worth mentioning is the potential cost savings associated with leveraging a platform like Bump.sh, which offers multiple API consumer hubs for managing and scaling API integrations. Utilizing such a platform could have potentially saved the hotel chain over $150k in internal development efforts per year required to maintain their internal portal generation code by streamlining the management of developer portals using API consumer hubs tailored for each need.

## Recommendations for Implementing API Product Bundles

For organizations that wish to create their own API product bundles, several actions can be taken to ensure a streamlined, secure, and user-friendly experience. Here are key steps to consider:

1. **Establish API Hubs and Categorize Documentation**

Creating [centralized API hubs](https://docs.bump.sh/help/hubs/) is essential for managing multiple API product bundles effectively. These hubs serve as the entry point for developers and partners, offering a comprehensive overview of available APIs. 

In some cases, you may have documentation that belongs in one or more portals. In this case, consider [assigning topics](https://docs.bump.sh/help/enhance-documentation-content/topics/) to your documentation that can then be used to publish related documentation to the proper portals. 

2. **Implement User Access Management**

Managing user access at both the portal and document levels is crucial for maintaining security and ensuring that developers only see the APIs they are authorized to use.

   - **Per Portal Management**: Set up different portals or access points for various audiences, such as internal developers, partners, or third-party developers. Each portal should display only the relevant API bundles and documentation.
   - **Per Doc Management**: Within these portals, control access at the individual document level. This ensures that sensitive or advanced API functionalities are only accessible to authorized users. FYI, this would have helped us reduce the number of API portals that we required. 

3. **Utilize OpenAPI Specification Overlays**

OpenAPI Specification (OAS) overlays are a powerful tool for extending and modifying API definitions without changing the underlying OAS document. They enable more flexible and dynamic documentation and API management.
Use OAS overlays to customize the documentation view for different audiences. This can include adding additional descriptions, usage examples, or constraints that are specific to a particular bundle or user segment.

4. **Support for APIs.json**

APIs.json is a discovery format for APIs that [makes it easier for developers](https://bump.sh/blog/make-your-apis-discoverable-with-apis-json) to find and understand available APIs. Supporting APIs.json can enhance the visibility and usability of your API bundles.

Create an APIs.json file that lists all your API bundles and includes metadata such as titles, descriptions, and links to documentation. This file should be kept up-to-date and easily accessible to ensure developers can quickly discover the APIs they need.

Combining these actions forms a holistic approach to creating and managing API bundles:

- **Centralized Hubs**: Establish API hubs as the go-to resource for developers, with well-organized documentation and clear navigation.
- **Access Management**: Implement robust user access controls to safeguard sensitive information and ensure developers only see what they need.
- **Dynamic Documentation**: Leverage OAS overlays to keep documentation dynamic and relevant, accommodating different user needs and API versions.
- **Discovery Format**: Utilize APIs.json to enhance discoverability and streamline access to your API offerings.

## Conclusion

API product bundling, when implemented thoughtfully, serves as a powerful tool to enhance developer experience. By offering curated bundles with clear use cases, granular access control, and leveraging developer portals, organizations can empower developers to build innovative integrations that unlock the true potential of their APIs. 
