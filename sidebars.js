/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs:
    [
      'intro',
      'bump-cli',
      {
        type: 'category',
        label: 'Continuous Integration',
        link: {type: 'doc', id: 'continuous-integration'},
        collapsible: true,
        collapsed: false,
        items: [
          'continuous-integration/github-actions'
        ],
      },
      {
        type: 'category',
        label: 'Specifications Support',
        collapsible: false,
        collapsed: false,
        items: [
          {
            type: 'category',
            label: 'OpenAPI support',
            link: {type: 'doc', id: 'specifications-support/openapi-support'},
            items: [
              'specifications-support/openapi-support/name-and-sort-resources',
              'specifications-support/openapi-support/webhooks'
            ]
          },
          'specifications-support/asyncapi-support',
          'specifications-support/polymorphism',
        ],
      },
      {
        type: 'category',
        label: 'API change management',
        link: {type: 'doc', id: 'api-change-management'},
        collapsible: true,
        collapsed: true,
        items: [
          'api-change-management/webhooks'
        ],
      },
      'branching',
      'references',
      'markdown-support',
      'custom-domains',
      'meta-images',
      'hubs',
      {
        type: 'category',
        label: 'Organizations',
        link: {type: 'doc', id: 'organizations'},
        collapsible: true,
        collapsed: true,
        items: ['organizations/single-sign-on-sso'],
      },
      'access-management',
      'faq',
    ]
};

module.exports = sidebars;
