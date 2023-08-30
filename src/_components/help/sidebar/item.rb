class Help::Sidebar::Item < Bridgetown::Component
  def initialize(page:, page_list:, resource:)
    @page, @page_list, @resource = page, page_list, resource
  end

  def item_resource
    @page_list.find { |page| page.relative_url.end_with?("/help#{@page.link}") } if @page.link.present?
  end

  def is_category?
    @page.type == "category"
  end

  def is_current?
    if item_resource.present?
      @resource.path == item_resource.path
    end
  end 
end