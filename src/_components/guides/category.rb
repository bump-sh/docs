class Guides::Category < Bridgetown::Component
  def initialize(resources:, title:, css_classes: "", position: nil)
    @resources, @title, @css_classes, @position = resources, title, css_classes, position
  end
end
