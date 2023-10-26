class Help::Sidebar::Item < Bridgetown::Component
  def initialize(page:, current:)
    @page = page
    @current = current
    @resource = @page[:resource]
    @is_current = @resource.present? && @resource.path == @current.path
    @icon = @page[:icon]
    @label = @page[:label]
    @items = @page[:items]
  end
end
