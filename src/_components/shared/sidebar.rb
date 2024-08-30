class Shared::Sidebar < Bridgetown::Component
  def initialize(data:, current:)
    @data = data
    @current = current
    @site = Bridgetown::Current.site
  end
end
