---
title: Integrate Bump.sh's docs in your search
---

- TOC
{:toc}

TBD

> An integrated search combined with the [Embed mode](/help/customization-options/embed-mode/) provides a fully embedded experience for your customers.
{: .info}

## Algolia
If you use Algolia for your global platform's search, the setup is straightforward. You might use it without knowing: for instance, it's embedded in Docusaurus, a well-known documentation platform.

Search integration works with both Algolia & Algolia DocSearch.

### Setup the crawler
You can choose to use your existing Algolia crawler, or [create a new one](https://www.algolia.com/doc/tools/crawler/getting-started/create-crawler). Unless you need isolation, We recommand updating your existing crawler with additional actions.

#### Crawler template 
Algolia uses templates to know how to crawl a page. You'll find below the template made for Bump.sh's documentation. Don't forget to modify the following variables: 
- `INDEX_NAME`: the name you want to give to your Algolia index,
- `DOC_URL`: the URLs of the documentation you want to crawl. You can add as many URLs as docs you want to crawl. **Verify that information with Algolia/Crawl a hub**

```json
 {
      indexName: "<INDEX_NAME>",
      pathsToMatch: ["<DOC_URLs>"],
      recordExtractor: ({ $, helpers, url }) => {
        // Remove "Body" headings before indexing
        $(".properties-list-title").each((i, el) => {
          if ($(el).text().trim() === "Body") {
            $(el).remove();
          }
        });

        // Find the main section (Topics, Endpoints, Webhooks) from navigation
        const $activeResource = $(
          ".navigation__resource-link.active, .navigation__resource-link.open",
        ).first();
        const $activeOperation = $(
          ".navigation__operation-link.active",
        ).first();

        let mainSection = "Documentation";
        let subsection = "";

        if ($activeResource.length > 0) {
          const $parentUl = $activeResource.closest("ul.navigation__resources");
          const $h2 = $parentUl.prev("h2");
          mainSection = $h2.text().trim() || "Documentation";
          subsection = $activeResource
            .clone()
            .children()
            .remove()
            .end()
            .text()
            .trim();
        } else if ($activeOperation.length > 0) {
          const parentId = $activeOperation.attr("data-menu-parent");
          const $parentResource = $(
            `.navigation__resource-link[data-section-id="${parentId}"]`,
          );
          const $parentUl = $parentResource.closest("ul.navigation__resources");
          const $h2 = $parentUl.prev("h2");
          mainSection = $h2.text().trim() || "Documentation";
          subsection = $parentResource
            .clone()
            .children()
            .remove()
            .end()
            .text()
            .trim();
        }

        // Use docsearch helper but ONLY target content area, not navigation
        const records = helpers.docsearch({
          recordProps: {
            lvl0: {
              selectors: "",
              defaultValue: "Documentation",
            },
            // Section and operation titles
            lvl1: [
              ".doc-section__header h1.doc-section-title",
              ".doc-section-title",
            ],
            lvl2: [
              ".operation h2.operation-title",
              ".doc-section-copy h2:not(.operation-title)",
              ".markdown-content h2", // Catches Authentication h2s
            ],
            lvl3: [
              ".properties-list-title",
              ".doc-section-copy h3",
              ".markdown-content h3",
            ],
            lvl4: [".doc-section-copy h4:not(.properties-list-title)"],
            lvl5: [".doc-section-copy h5"],
            lvl6: [".doc-section-copy h6"],
            content: [
              ".doc-section-copy p",
              ".doc-section-copy li",
              ".markdown-content p",
              ".markdown-content li",
            ],
          },
          aggregateContent: true,
          recordVersion: "v3",
        });

        // Remap the hierarchy
        return records.map((record) => {
          const sectionTitle = record.hierarchy.lvl1;

          // If lvl1 matches the subsection, it's a section header record
          const isSectionHeader =
            sectionTitle === subsection && record.type === "lvl1";

          return {
            ...record,
            hierarchy: {
              lvl0: mainSection,
              lvl1: subsection,
              // Keep the original hierarchy starting from lvl2
              lvl2: isSectionHeader ? null : record.hierarchy.lvl2,
              lvl3: isSectionHeader ? null : record.hierarchy.lvl3,
              lvl4: isSectionHeader ? null : record.hierarchy.lvl4,
              lvl5: isSectionHeader ? null : record.hierarchy.lvl5,
              lvl6: null,
            },
          };
        });
      },
    },
```

### Activate the search integration (TBD)
Use federated search with multiple indices, or use DocSearch UI pointing at the docs index. DocSearch supports multi-index search but any index using DocSearch must be structured in the DocSearch way.

## Specify result categories
Add category via URL-based actions (Endpoints, Webhooks, Docs, Topics) and facet on it. Additional filters can be added on the Crawler action so they can be added when the index gets updated/created.

### Crawl frequency
You can set up the crawl frequency of directly in your [crawler settings](https://www.algolia.com/doc/tools/crawler/getting-started/crawler-configuration-visual#configuration-settings). It could be once a day if you update your documentation a lot, or once a week for more stable ones.
You can add the crawling task as a step of your CI, and trigger a re-crawl after a new version of your API documentation has been released, using [Algolia Crawler API](https://crawler.algolia.com/api/1/doc/#/default/reindexCrawler).

### Activate Ask AI
**To be detailed by Algolia**
Does Ask AI use the same index?
Prefer a separate markdown/RAG index for best retrieval quality (dual indexing). But yes, it can use the same index.

## Using sitemaps & `x-metaTags`

## Questions
Multi docs/hub
Activate the search integration
Ask AI
sitemap_urls ?

Redirect to nested elements correctly?
Ensure id anchors on headings and store url with #anchor.

Use sitemaps instead of a crawler?
You can pass sitemaps to the Crawler and the Crawler will handle the index creation for you. If they have sitemaps and don't want to use the Crawler then they'd have to manually generate an index using the structure that DocSearch supports.
