import { Controller } from "@hotwired/stimulus"
import { Widget } from "@bump-sh/agent-widget"

// Mounts a Bump.sh agent chat widget and lets a button in the page open it.
export default class Agent extends Controller {
  static values = {
    endpoint: String,
    title: String,
    placeholder: String,
    theme: Object,
  }

  connect() {
    this.widget = new Widget({
      endpoint: this.endpointValue,
      title: this.titleValue,
      placeholder: this.placeholderValue,
      theme: this.themeValue,
      launcher: false,
    })

    // The widget mounts itself on <body>: keep it out of Turbo's page snapshots
    // so navigating back doesn't restore a stale copy next to the new one.
    this.widget.element.setAttribute("data-turbo-temporary", "")
  }

  disconnect() {
    this.widget?.destroy()
    this.widget = undefined
  }

  toggle() {
    this.widget.toggle()
  }
}
