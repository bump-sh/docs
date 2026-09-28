import { css, html } from "lit"
import { unsafeHTML } from "lit/directives/unsafe-html.js"
import { BridgetownSearchForm, BridgetownSearchResults } from "bridgetown-quick-search"

// The quick search engine, rendered like the API reference search:
// results grouped by collection, quiet hoverable rows, one-line preview.
export class DocsSearchForm extends BridgetownSearchForm {
  static {
    customElements.define("docs-search-form", this)
  }

  handleChange(event) {
    const query = event.currentTarget.value
    clearTimeout(this.debounce)
    this.debounce = setTimeout(() => this.querySelector("docs-search-results").showResultsForQuery(query), 250)
  }
}

// One index for the whole session: fetched and built on the first focus,
// shared between the header and the home search, kept across Turbo visits.
let sharedIndex

export class DocsSearchResults extends BridgetownSearchResults {
  static styles = [
    BridgetownSearchResults.styles,
    css`
      :host {
        font-size: var(--doc-font-size);
        margin-top: var(--spacing-1);
      }
      [part=inner] {
        background: var(--surface);
        border: var(--hairline);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-lg);
        color: var(--text);
        max-height: 60vh;
        padding: var(--spacing-2);
      }
      ul, li, p {
        margin: 0;
        padding: 0;
      }
      h2 {
        margin: 0;
        color: var(--text-secondary);
        font-size: var(--text-xxs);
        font-weight: var(--weight-medium);
        letter-spacing: 0.03em;
        padding: var(--spacing-2) var(--spacing-3) var(--spacing-1);
        text-transform: uppercase;
      }
      a {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-05);
        border-radius: var(--radius-md);
        color: inherit;
        padding: var(--spacing-2) var(--spacing-3);
        text-decoration: none;
        transition: background-color var(--duration) var(--easing);
      }
      a:hover, a:focus-visible {
        background-color: var(--surface-muted);
        outline: none;
      }
      .title {
        color: var(--title);
        font-weight: var(--weight-medium);
      }
      .preview, .empty {
        color: var(--text-secondary);
        font-size: var(--text-xs);
      }
      .preview {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .empty {
        padding: var(--spacing-2) var(--spacing-3);
      }
      strong {
        color: inherit;
        font-weight: var(--weight-semibold);
      }
    `
  ]

  // Nothing at connect time: the index loads when a search starts
  fetchSearchIndex() {}

  async loadIndex() {
    sharedIndex ||= BridgetownSearchResults.prototype.fetchSearchIndex.call(this)
      .then(() => ({ searchIndex: this.searchIndex, searchEngine: this.searchEngine }))
    Object.assign(this, await sharedIndex)
  }

  async showResultsForQuery(query) {
    await this.loadIndex()
    this.latestQuery = query
    this.showResults = query.length > 1
    this.results = this.showResults ? this.searchEngine.performSearch(query, this.snippetLength).slice(0, 10) : []
    this.requestUpdate()
  }

  // Results keep their score order, grouped under the collection they come from
  groupedResults() {
    const groups = new Map()
    this.results.forEach(result => {
      const item = this.searchIndex.find(entry => entry.url.trim() === result.url)
      const name = item.collection.name
      groups.set(name, [...(groups.get(name) || []), result])
    })
    return [...groups]
  }

  render() {
    this.repositionIfNecessary()
    return html`<ul part="inner" class="${this.showResults ? "show" : ""}">
      ${this.results.length ? "" : html`<li><p class="empty">No results for “${this.latestQuery}”</p></li>`}
      ${this.groupedResults().map(([name, results]) => html`
        <li>
          <h2>${name}</h2>
          <ul>
            ${results.map(result => html`
              <li><a href="${result.url}">
                <span class="title">${unsafeHTML(result.heading)}</span>
                <span class="preview">${unsafeHTML(result.preview)}</span>
              </a></li>
            `)}
          </ul>
        </li>
      `)}
    </ul>`
  }

  // Defined last: Lit reads the static styles when the element is defined
  static {
    customElements.define("docs-search-results", this)
  }
}
