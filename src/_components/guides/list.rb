class Guides::List < Bridgetown::Component
  def initialize(resources:, category_name:, css_classes: "", remaining_count: 0)
    @resources = resources
    @category_name = category_name
    @css_classes = css_classes
    @remaining_count = remaining_count
  end
end
