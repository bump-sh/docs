module.exports = function pluginFathom(context, options) {
  const isProd = process.env.NODE_ENV === 'production';

  const siteId = options.siteId;

  return {
    name: 'docusaurus-plugin-fathom',

    contentLoaded({actions}) {
      actions.setGlobalData(options);
    },

    injectHtmlTags() {
      if (!isProd) {
        return {};
      }
      return {
        headTags: [
          {
            tagName: "script",
            attributes: {
              src: "https://meadowlark.bump.sh/script.js",
              "data-site": siteId,
              "data-spa": "auto",
              defer: true
            }
          },
        ],
      };
    },
  };
};
