class Guides::List < Bridgetown::Component
  def initialize(resources:, css_classes: "")
    @resources = resources
    @css_classes = css_classes
  end
end
