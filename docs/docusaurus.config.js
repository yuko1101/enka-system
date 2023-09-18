// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Enka System',
  tagline: 'A Node.js library that handles the foundation of Enka.Network API.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://your-docusaurus-test-site.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: process.env.npm_config_base_url ?? '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'yuko1101', // Usually your GitHub org/user name.
  projectName: 'enka-system', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

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
          remarkPlugins: [require("remark-breaks")],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'Enka System',
        logo: {
          alt: 'Enka System Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Get Started',
          },
          {
            type: 'doc',
            docId: 'api/EnkaSystem',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Contents',
            items: [
              {
                label: 'Get Started',
                to: '/docs/intro',
              },
              {
                label: 'Documentation',
                to: '/docs/api/EnkaSystem',
              }
            ],
          },
          {
            title: 'GitHub',
            items: [
              {
                label: 'Repository',
                href: 'https://github.com/yuko1101/enka-system',
              },
              {
                label: 'Issues',
                href: 'https://github.com/yuko1101/enka-system/issues',
              },
              {
                label: 'Pull Requests',
                href: 'https://github.com/yuko1101/enka-system/pulls',
              },
            ],
          },
          {
            title: 'Other Links',
            items: [
              {
                label: 'npm',
                href: 'https://www.npmjs.com/package/enka-system',
              },
              {
                label: 'Enka.Network',
                href: 'https://enka.network',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} enka-system, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
