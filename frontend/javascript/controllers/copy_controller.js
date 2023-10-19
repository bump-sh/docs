import { Controller } from "@hotwired/stimulus"

export default class Copy extends Controller {
  copy(event) {
    const link = event.target.getAttribute("href")
    if (link) {
      navigator.clipboard.writeText(window.location.href.split("#")[0] + link)
    }
  }
}
