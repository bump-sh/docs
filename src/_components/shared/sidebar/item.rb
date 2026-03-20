class Shared::Sidebar::Item < Bridgetown::Component
  def initialize(page:, current:, parent_id: nil)
    @page = page
    @current = current
    @parent_id = parent_id
    @resource = @page[:resource]
    @icon = @page[:icon]
    @label = @page[:label]
    @items = @page[:items]
    @is_current = @resource&.path == @current.path
    @is_parent = is_parent
  end

  def category_id
    if @parent_id
      "#{@parent_id}--#{@label.parameterize}"
    else
      @label.parameterize
    end
  end

  def is_parent
    if @items.present?
      current_child = @items&.find do |item|
        item[:resource].path == @current.path if item[:resource].present?
      end
      return !!current_child
    end
  end
end
