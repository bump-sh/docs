class Help::Sidebar < Bridgetown::Component
  def initialize(metadata:, resource:, page_list:)
    @metadata = metadata
    @resource = resource
    @page_list = page_list
    @site = Bridgetown::Current.site
  end
end
