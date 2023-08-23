class Help::Sidebar < Bridgetown::Component
  def initialize(metadata:, resource:, page_list:)
    @metadata, @resource, @page_list = metadata, resource, page_list
    @site = Bridgetown::Current.site
  end

  def before_render
    @site = Bridgetown::Current.site
  end
end
