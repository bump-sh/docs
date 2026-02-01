import { Controller } from "@hotwired/stimulus"
export default class Toggle extends Controller {
  static targets = ["button", "item"]

  connect() {
    this.handleClickOutside = this.handleClickOutside.bind(this)
    document.addEventListener('click', this.handleClickOutside)
  }

  disconnect() {
    document.removeEventListener('click', this.handleClickOutside)
  }

  handleClickOutside(event) {
    if (this.itemTarget.getAttribute("data-toggle-active") === "true" &&
      !this.element.contains(event.target)) {
      this.close()
    }
  }

  click(event) {
    event.stopPropagation()

    if (this.itemTarget.getAttribute("data-toggle-active") === "true") {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    this.buttonTarget.setAttribute("aria-pressed", true)
    this.buttonTarget.setAttribute("aria-expanded", true)
    this.itemTarget.setAttribute("data-toggle-active", true)
    this.element.setAttribute("data-toggle-active", true)
  }

  close() {
    this.buttonTarget.setAttribute("aria-pressed", false)
    this.buttonTarget.setAttribute("aria-expanded", false)
    this.itemTarget.setAttribute("data-toggle-active", false)
    this.element.setAttribute("data-toggle-active", false)
  }
}
