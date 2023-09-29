class Shared::Hero < Bridgetown::Component
  def initialize(title:, description: nil)
    @title, @description = title, description
  end
end
