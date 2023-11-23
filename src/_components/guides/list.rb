class Guides::List < Bridgetown::Component
  def initialize(resources:, category_name:, css_classes: "", show_browse_button: false)
    @resources = resources
    @category_name = category_name
    @css_classes = css_classes
    @show_browse_button = show_browse_button
  end
end
