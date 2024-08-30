import { Controller } from "@hotwired/stimulus"

export default class Sidebar extends Controller {
  static targets = ["expandable"]

  connect() {
    this.expandableTargets.forEach(target => {
      if (!target.querySelector("[data-current-parent]") && !target.querySelector("[aria-current='true']") ) {
        target.setAttribute("aria-expanded", false);
      }
    })
  }

  toggle(event) {
    event.preventDefault()
    const button = event.currentTarget
    const targetId = button.getAttribute("aria-controls")
    const target = document.getElementById(targetId)
    if (target.getAttribute("aria-expanded") === "true") {
      target.setAttribute("aria-expanded", false)
      button.setAttribute("aria-label", "Hide list")
    } else {
      target.setAttribute("aria-expanded", true)
      button.setAttribute("aria-label", "Expand list")
    }
  }
}
