// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Bump.sh',
  tagline: 'Much more than stunning docs. For all your APIs.',
  url: 'https://docs.bump.sh',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'bump-sh', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.
  trailingSlash: true,

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'docs/help',
          routeBasePath: '/help',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/bump-sh/docs/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    require.resolve('docusaurus-lunr-search'),
    ['./src/docusaurus-plugin-fathom', {siteId: "SBIGOMQN"}],
    ['./src/docusaurus-plugin-intercom', {appId: "hxcxcbgc"}],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: 'Bump.sh Logo',
          src: 'img/bump-logo.svg',
          srcDark: 'img/bump-logo-wht.svg',
          href: '/help'
        },
        items: [
          {
            label: 'API reference',
            to: 'https://developers.bump.sh',
            position: 'right',
          },
          {
            label: 'Bump.sh',
            to: 'https://bump.sh',
            position: 'right',
          }
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Product',
            items: [
              {
                label: 'API Documentation',
                to: 'https://bump.sh/api-documentation',
              },
              {
                label: 'Change Management',
                to: 'https://bump.sh/api-change-management',
              },
              {
                label: 'Hubs',
                to: 'https://bump.sh/api-catalog',
              },
              {
                label: 'API Diff',
                href: 'https://api-diff.io/',
              },
            ],
          },
          {
            title: 'Specifications',
            items: [
              {
                label: 'OpenAPI (Swagger)',
                to: 'https://bump.sh/openapi',
              },
              {
                label: 'AsyncAPI',
                to: 'https://bump.sh/asyncapi',
              },
            ],
          },
          {
            title: 'Resources',
            items: [
              {
                label: 'Blog',
                to: 'https://bump.sh/blog',
              },
              {
                label: 'CLI',
                href: 'https://github.com/bump-sh/cli',
              },
              {
                label: 'Status',
                href: 'https://status.bump.sh/',
              },
              {
                label: 'API Reference',
                href: 'https://developers.bump.sh/',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} Bump.sh. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['ruby']
      },
    }),
  customFields: {
    bottomLinks: [
      {
        label: 'Privacy Policy',
        to: 'https://bump.sh/privacy-policy',
      },
      {
        label: 'Legal Mentions',
        to: 'https://bump.sh/legal-mentions',
      },
      {
        label: 'Terms of use',
        to: 'https://bump.sh/terms'
      }
    ],
    socialLinks: [
      {
        label: 'Github',
        icon: '/img/footer/github.svg',
        to: 'https://github.com/bump-sh'
      },
      {
        label: 'Twitter',
        icon: '/img/footer/twitter.svg',
        to: 'https://twitter.com/bump_hq'
      },
      {
        label: 'Linkedin',
        icon: '/img/footer/linkedin.svg',
        to: 'https://www.linkedin.com/company/bump-sh/'
      }
    ]
  }
};

module.exports = config;
