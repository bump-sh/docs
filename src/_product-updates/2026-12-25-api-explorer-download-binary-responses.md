---
title: "API Explorer - Download binary responses"
tags: [Improvement]
image: /docs/images/changelog/api-explorer-download-binary-responses.png
---

![Animated GIF of the API Explorer sending a request and displaying the GIF response, with its download block](/docs/images/changelog/api-explorer-download-binary-responses.gif)

Some APIs don't return JSON: they generate invoices, export reports, or serve archives and media. Until now, the API Explorer displayed these responses as unreadable text. Your API consumers can now download them, and test these operations from end to end, directly from your documentation.

## Download any file

When an operation returns a file, such as a PDF, a ZIP archive or a spreadsheet, the response module displays a download block: the file name, its media type and size, and a “Download” button.

The file is named after the date and time of the response, with the extension matching its media type, for example `response-20261127134859.pdf`.

## More image formats

The API Explorer already displayed PNG and JPEG responses. GIF and WebP images are now displayed too, and every image can be downloaded.

The list of supported media types is available in our [help center](/help/documentation-experience/api-explorer/#files).

As always, don't hesitate to reach out at [hello@bump.sh](mailto:hello@bump.sh) if you have any feedback!
