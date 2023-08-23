import { Controller } from "@hotwired/stimulus"
export default class Toggle extends Controller {
  static targets = ["button", "item"]
  click() {
    if (this.itemTarget.getAttribute("data-toggle-active") === "true") {
      this.buttonTarget.setAttribute("aria-pressed", false)
      this.itemTarget.setAttribute("data-toggle-active", false)
    } else {
      this.buttonTarget.setAttribute("aria-pressed", true)
      this.itemTarget.setAttribute("data-toggle-active", true)
    }
  }
}
