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
    const targetId = event.currentTarget.getAttribute("aria-controls")
    const target = document.getElementById(targetId)
    target.getAttribute("aria-expanded") === "true" ? target.setAttribute("aria-expanded", false) : target.setAttribute("aria-expanded", true)
  }
}
