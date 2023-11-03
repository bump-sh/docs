class Help::Sidebar::Item < Bridgetown::Component
  def initialize(page:, current:)
    @page = page
    @current = current
    @resource = @page[:resource]
    @icon = @page[:icon]
    @label = @page[:label]
    @items = @page[:items]
    @is_current = @resource&.path == @current.path
    @is_parent = is_parent
  end

  def category_id
    @label.parameterize
  end

  def is_parent
    if @items.present?
      current_child = @items&.find do |item|
        item[:resource].path == @current.path
      end
      return !!current_child
    end
  end
end
