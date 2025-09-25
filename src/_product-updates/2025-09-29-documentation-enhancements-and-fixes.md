---
title: Documentation enhancements and fixes
tags: [Improvement]
---
While achieving milestones on larger projects, we’ve also made many quality-of-life enhancements and bug fixes. Here's the changelog:

Enhancements:
- [Custom meta tags](/help/specification-support/meta-tags/) can now be added to the head of your documentation,
- Dead anchors now redirect to their parent operation instead of the top of the documentation,
- In Embed mode, the search placeholders now specify their context (« Search API documentation » vs « Search hub »), so users can differentiate the global search from the documentaion portal search, 
- A confirmation modal has been added to the API Explorer before sending destructive requests to avoid unwanted losses,
- The scrolling experience has been globally reworked to ensure its stability,
- When using groups to categorize your API documentation inside your hub, you now have the option to only display the ones from the same category in the documentation selector of a documentation,
- The browser window.title is now automatically updated when scrolling between operations to display the current navigation context,
- Highlights now work for subtitles inside x-topics, and global/operation descriptions,
- [x-feedbackLink](/help/publish-documentation/feedback/) now works with Swagger 2.0 definition files,
- Groups in the navigation bar are now collapsible, to facilitate the navigation between groups containing many operations,
- The "add custom domain" module has been reworked to provide better explanations and error messages,
- Branches can now be [sorted alphabetically in ascending and descending order](/help/publish-documentation/branching/#sort-branches),
- Skeletons for previews have been enhanced,
- x-state badges can now have [custom colors](/help/specification-support/doc-badges/#custom-color),
- Accordions can now be added in Markdown using `<details>` and `<summary>` tags,
- A logo dedicated to dark mode can now be added to ensure brand consistency,
- The API Explorer beta is completed. 🎉 Thanks a lot to all of our testers. Your feedback has been invaluable and helped us build an even better feature for all.

Fixes:
- Fixed wrong breaking changes when the case of an HTTP header was modified but not its value,
- Fixed a trailing issue that caused the branch switch to return 404s in some contexts,
- Fixed multiple text alignments in documentation,
- Fixed an issue that prevented some descriptions from being displayed in the documentation when defined next to allOfs,
- Fixed an issue with alternatives preventing some generated examples from being displayed in some contexts,
- Fixed a bug with Mermaid rendering that prevented the use of ELK diagrams,
- Fixed an issue that displayed the "Show more" button in properties even when everything was already displayed in some contexts.

Feel free to reach out if you have any questions or features you think are missing from the product. Knock at [hello@bump.sh](mailto:hello@bump.sh).