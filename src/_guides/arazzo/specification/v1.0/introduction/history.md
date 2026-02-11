---
title: History and Evolution of Arazzo
authors: phil
excerpt: Learn about the origins of Arazzo, from early workflow experiments to becoming an official OpenAPI Initiative standard for API workflow descriptions.
date: 2025-01-24
---

- TOC
{:toc}

The Arazzo Specification represents years of evolution in API workflow documentation, emerging from real-world needs and community collaboration to become an official standard under the OpenAPI Initiative.

## The Birth of Arazzo

The first time Arazzo came up was on an OpenAPI community call somewhere in late 2021 where a bunch of the usual OpenAPI contributors were discussing the Special Interest Groups that could be formed under the OpenAPI Initiative. Along with groups for Overlays, Security, Travel, etc. one of the groups was Workflows. The idea was to explore how to standardize the way API workflows were defined.

There had been some loose atempts to do this with OpenAPI's `Links` where one operation can point to next potential steps, but this was not being utilized much and seemed problematic for trying to document complex workflows across multiple APIs. 

Popular open-source tools like [Strest](https://github.com/eykrehbein/strest) immediately jumped to mind for many of us, and there was more inspiration pulled from all sorts of similar concepts:

- GitHub Actions and other CI/CD workflow formats (steps, conditions, outputs).
- State machine concepts from computer science.
- Real-world API integration patterns observed in the field.

Generally the folks involved were well used to working with these sorts of tools, building and maintaining these sorts of tools, and had seen the pain points of trying to document workflows in written guides or sample codebases that quickly became outdated, so everyone got some good ideas into the mix.

In 2022 a formal proposal was drafted and presented to the OpenAPI Initiative, and a working group was formed to develop the specification further. This group included API designers, technical writers, tool developers, and other stakeholders who contributed their expertise to shape the emerging standard.

The specification was initially called "OpenAPI Workflows" but was later renamed to **Arazzo** to give it a distinct identity while maintaining its connection to the OpenAPI ecosystem. The name "Arazzo" (Italian for "tapestry") reflects how workflows weave together multiple API calls into a cohesive pattern.

### Version 1.0 Release (2024)

After extensive community review, tooling experiments, and real-world testing, Arazzo 1.0.0 was officially released in 2024 as a standard under the OpenAPI Initiative. This first version includes:

- **Core workflow structure** - Documents, workflows, and steps
- **Source descriptions** - Referencing OpenAPI and other API definitions
- **Runtime expressions** - Passing data between steps
- **Success and failure criteria** - Defining what constitutes success or failure
- **Parameters and request bodies** - Overriding or supplementing source definitions
- **Components and reusability** - Reducing duplication through references
- **Outputs** - Capturing and passing results between steps

## Adoption and Ecosystem

Arazzo has seen growing interest across the API community with most tooling vendors busily working on adding support, with the first two being Spectral and Speakeasy. The list of Arazzo-compatible tools continues to grow, and for the most up-to-date list check [OpenAPI.Tools: Arazzo](https://openapi.tools/collections/arazzo).

## The Future

Arazzo 1.1 is already underway with non-breaking improvements potentially including:

- Support for JSONPath as well as JSON Pointer and XPath.
- Supporting AsyncAPI for event-driven workflows.
- Allow workflow inputs to be passed in success and failure actions.

These iterative improvements aim to bring more flexibility and power to the specification while maintaining backward compatibility, whilst larger improvements are already being planned for a longer term Arazzo 2.0 release.

If you're interested in contributing or learning more, check out the [Arazzo GitHub repository](https://github.com/OAI/Arazzo-Specification/).
