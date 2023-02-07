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
              src: "https://cdn.usefathom.com/script.js",
              dataSite: siteId,
              defer: true
            }
          },
        ],
      };
    },
  };
};
