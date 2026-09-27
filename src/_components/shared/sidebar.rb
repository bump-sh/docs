class Shared::Sidebar < Bridgetown::Component
  def initialize(data:, current:)
    @data = data
    @current = current
  end
end
