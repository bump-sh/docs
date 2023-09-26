class Guides::Category < Bridgetown::Component
  def initialize(resources:, title:, css_classes: "", position: nil)
    @resources = resources
    @title = title
    @css_classes = css_classes
    @position = position
  end
end
