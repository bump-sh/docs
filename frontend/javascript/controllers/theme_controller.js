import { Controller } from "@hotwired/stimulus"

// Flips data-theme on <html>: the stylesheet maps it to color-scheme.
// The saved choice is applied before first paint by an inline script in
// the <head> partial.
export default class Theme extends Controller {
  toggle() {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = theme
    localStorage.setItem("theme", theme)
  }
}
