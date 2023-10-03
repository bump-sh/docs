class Guides::Authors::List < Bridgetown::Component
  def initialize(authors:)
    @authors = authors.class == String ? [authors] : authors
  end

  def render?
    @authors.present?
  end
end
