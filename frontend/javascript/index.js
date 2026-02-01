import "$styles/index.css";
import "$styles/syntax-highlighting.css";
import * as Turbo from "@hotwired/turbo";
import { Application } from "@hotwired/stimulus";
import "bridgetown-lit-renderer";
import "bridgetown-quick-search";
import mermaid from "mermaid";

/**
 * Adds support for declarative shadow DOM. Requires your HTML <head> to include:
 * `<meta name="turbo-cache-control" content="no-cache" />`
 */
import * as TurboShadow from "turbo-shadow";

/**
 * Uncomment the line below to add transition animations when Turbo navigates.
 * Use data-turbo-transition="false" on your <main> element for pages where
 * you don't want any transition animation.
 */
// import "./turbo_transitions.js"

// Import all JavaScript & CSS files from src/_components
import components from "$components/**/*.{js,jsx,js.rb,css}";

window.Stimulus = Application.start();

import controllers from "./controllers/**/*.{js,js.rb}";
Object.entries(controllers).forEach(([filename, controller]) => {
  if (filename.includes("_controller.") || filename.includes("-controller.")) {
    const identifier = filename
      .replace("./controllers/", "")
      .replace(/[_-]controller\..*$/, "")
      .replace("_", "-")
      .replace("/", "--");

    Stimulus.register(identifier, controller.default);
  }
});

function renderMermaidDiagrams() {
  const mermaidCodeBlocks = document.querySelectorAll(
    "pre > code.language-mermaid:not([data-mermaid-processed])"
  );
  if (mermaidCodeBlocks.length === 0) return;

  mermaidCodeBlocks.forEach((codeEl) => {
    codeEl.setAttribute("data-mermaid-processed", "true");

    const preEl = codeEl.parentElement;
    if (!preEl) return;

    const container = document.createElement("div");
    container.className = "mermaid";
    container.textContent = codeEl.textContent;

    preEl.replaceWith(container);
  });

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: "strict",
    theme: "default",
  });

  mermaid.run({ querySelector: ".mermaid" });
}

document.addEventListener("turbo:load", renderMermaidDiagrams);
