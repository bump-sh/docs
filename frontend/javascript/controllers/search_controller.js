import { Controller } from "@hotwired/stimulus"

// Cmd/Ctrl+K focuses the input; Escape or a click outside closes the
// results, which reopen when the input gets the focus back.
export default class Search extends Controller {
  static targets = ["input", "results"]

  focus(event) {
    event.preventDefault()
    this.inputTarget.focus()
  }

  open() {
    this.resultsTarget.showResultsForQuery(this.inputTarget.value)
  }

  close() {
    this.resultsTarget.showResultsForQuery("")
    this.inputTarget.blur()
  }

  closeOutside(event) {
    if (!this.element.contains(event.target)) this.close()
  }
}
