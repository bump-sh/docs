class Guides::List < Bridgetown::Component
  def initialize(resources:, css_classes: "")
    @resources, @css_classes = resources, css_classes
  end
end
