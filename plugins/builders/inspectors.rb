class Builders::Inspectors < SiteBuilder
  def build
    inspect_html do |document|
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
  end
end
