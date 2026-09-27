import { Controller } from "@hotwired/stimulus"

// Collapses and expands a sidebar section. The server renders the initial
// state: only the sections holding the current page start expanded.
export default class Sidebar extends Controller {
  toggle(event) {
    const button = event.currentTarget
    const list = document.getElementById(button.getAttribute("aria-controls"))
    list.hidden = !list.hidden
    button.setAttribute("aria-expanded", !list.hidden)
  }
}
