class Shared::Hero < Bridgetown::Component
  def initialize(title:, description: nil, tags: nil)
    @title = title
    @description = description
    @tags = tags
  end
end
