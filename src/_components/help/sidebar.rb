class Help::Sidebar < Bridgetown::Component
  def initialize(metadata:, current:)
    @metadata = metadata
    @current = current
    @site = Bridgetown::Current.site
  end
end
