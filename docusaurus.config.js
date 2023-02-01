// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Bump.sh',
  tagline: 'Much more than stunning docs. For all your APIs.',
  url: 'https://preview.help.bump.sh',
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
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/bump-sh/docs/tree/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [require.resolve('docusaurus-lunr-search')],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Bump.sh',
        logo: {
          alt: 'Bump.sh Logo',
          src: 'img/logo-bump-circle.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'home',
            position: 'left',
            label: 'Help',
          },
          {
            href: 'https://github.com/bump-sh/docs',
            label: 'GitHub',
            position: 'right',
          },
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
              }
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
};

module.exports = config;
