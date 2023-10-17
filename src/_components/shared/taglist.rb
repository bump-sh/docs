class Shared::Taglist < Bridgetown::Component
  def initialize(tags:)
    @tags = tags
  end

  def render?
    @tags.present?
  end
end
