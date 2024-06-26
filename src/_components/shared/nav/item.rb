class Shared::Nav::Item < Bridgetown::Component
  def initialize(title:, link:, active: false)
    @title, @link, @active = title, link, active
  end
end
