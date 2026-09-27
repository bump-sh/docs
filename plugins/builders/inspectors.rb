class Builders::Inspectors < SiteBuilder
  def build
    inspect_html do |document|
      add_heading_anchors(document)
      move_toc_aside(document)
      wrap_tables(document)
    end
  end

  # Markdown tables keep their table layout (full width) and scroll
  # horizontally inside this wrapper when they overflow.
  def wrap_tables(document)
    document.query_selector_all(".prose table").each do |table|
      wrapper = document.create_element("div", class: "table-scroll")
      table.add_next_sibling(wrapper)
      wrapper << table.remove
    end
  end

  def add_heading_anchors(document)
    document.query_selector_all("main h2[id], main h3[id], main h4[id]").each do |heading|
      heading << document.create_text_node(" ")
      heading << document.create_element(
        "a", "#",
        href: "##{heading[:id]}",
        class: "heading-anchor",
        "data-action": "copy#copy"
      )
    end
  end

  # The kramdown TOC sits where the markdown declares it: on documentation
  # pages it becomes the sticky "On this page" column next to the article.
  def move_toc_aside(document)
    toc = document.query_selector(".doc-main #markdown-toc")
    return unless toc

    nav = document.create_element("nav", class: "doc-toc", "aria-label": "On this page")
    nav << document.create_element("p", "On this page", class: "doc-toc-title")
    nav << toc.remove
    document.query_selector(".doc-main") << nav
  end
end
