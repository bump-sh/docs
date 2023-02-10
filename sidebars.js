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
  help:
    [
      'help/index',
      'help/getting-started',
      'help/bump-cli',
      {
        type: 'category',
        label: 'Continuous Integration',
        link: {type: 'doc', id: 'help/continuous-integration/index'},
        collapsible: true,
        collapsed: true,
        items: [
          'help/continuous-integration/github-actions'
        ],
      },
      {
        type: 'category',
        label: 'Specifications Support',
        link: {type: 'doc', id: 'help/specifications-support/index'},
        collapsible: true,
        collapsed: true,
        items: [
          {
            type: 'category',
            label: 'OpenAPI support',
            link: {type: 'doc', id: 'help/specifications-support/openapi-support'},
            items: [
              'help/specifications-support/openapi-support/name-and-sort-resources',
              'help/specifications-support/openapi-support/webhooks'
            ]
          },
          'help/specifications-support/asyncapi-support',
          'help/specifications-support/markdown-support',
          'help/specifications-support/polymorphism',
          'help/specifications-support/references',
        ],
      },
      {
        type: 'category',
        label: 'API change management',
        link: {type: 'doc', id: 'help/api-change-management/index'},
        collapsible: true,
        collapsed: true,
        items: [
          'help/api-change-management/webhooks'
        ],
      },
      'help/branching',
      'help/hubs',
      'help/access-management',
      {
        type: 'category',
        label: 'Organizations',
        link: {type: 'doc', id: 'help/organizations/index'},
        collapsible: true,
        collapsed: true,
        items: ['help/organizations/single-sign-on-sso'],
      },
      'help/custom-domains',
      'help/meta-images',
      'help/faq',
    ]
};

module.exports = sidebars;
