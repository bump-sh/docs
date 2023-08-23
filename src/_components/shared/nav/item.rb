class Shared::Nav::Item < Bridgetown::Component
  def initialize(title:, link:)
    @title, @link = title, link
  end
end
