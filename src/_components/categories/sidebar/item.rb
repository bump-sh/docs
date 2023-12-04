class Categories::Sidebar::Item < Bridgetown::Component
  def initialize(category:, current: false)
    @category = category
    @current = current
  end

  def slugified_name
    Bridgetown::Utils.slugify(@category.name)
  end

  def is_current?
    slugified_name == Bridgetown::Utils.slugify(@current)
  end
end
