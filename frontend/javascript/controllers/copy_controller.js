import { Controller } from "@hotwired/stimulus"

export default class Copy extends Controller {
  copy(event) {
    const link = event.target.getAttribute("href")
    if (link) {
      navigator.clipboard.writeText(window.location.href.split("#")[0] + link)
    }
  }

  // Copies data-copy-text-param and flags the button as copied for a moment
  text(event) {
    const button = event.currentTarget
    navigator.clipboard.writeText(event.params.text)
    button.dataset.copied = "true"
    setTimeout(() => delete button.dataset.copied, 1500)
  }
}
