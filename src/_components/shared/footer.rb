class Shared::Footer < Bridgetown::Component
  def initialize(show:)
    @show = show
    @site = Bridgetown::Current.site
  end

  def render?
    @show
  end
end
