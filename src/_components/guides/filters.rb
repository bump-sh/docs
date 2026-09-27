class Guides::Filters < Bridgetown::Component
  def initialize(categories:, current: nil)
    @categories = categories
    @current = current
  end

  def current?(category)
    Bridgetown::Utils.slugify(category.name) == Bridgetown::Utils.slugify(@current.to_s)
  end
end
