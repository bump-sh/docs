class Shared::Pagination < Bridgetown::Component
  def initialize(paginator:)
    @paginator = paginator
    @site = Bridgetown::Current.site
  end
end
