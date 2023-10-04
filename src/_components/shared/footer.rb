class Shared::Footer < Bridgetown::Component
  def initialize(hide: false)
    @hide = hide
    @site = Bridgetown::Current.site
  end

  def render?
    !@hide
  end
end
