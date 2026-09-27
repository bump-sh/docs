class Shared::Sidebar::Item < Bridgetown::Component
  def initialize(page:, current:, parent_id: nil)
    @current = current
    @parent_id = parent_id
    @resource = page[:resource]
    @icon = page[:icon]
    @label = page[:label]
    @items = page[:items]
  end

  def category_id
    [@parent_id, @label.parameterize].compact.join("--")
  end

  def current?
    @resource&.path == @current.path
  end

  # A section opens when the current page is itself or one of its descendants
  def expanded?
    current? || contains_current?(@items)
  end

  private

  def contains_current?(items)
    return false if items.blank?

    items.any? do |item|
      item[:resource]&.path == @current.path || contains_current?(item[:items])
    end
  end
end
