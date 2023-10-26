class Builders::Sidebar < SiteBuilder
  def build
    generator do
      site.data.help_sidebar = build_resources(@site.data.sidebar.help)
    end
  end

  def build_resources(list)
    if list.present?
      list.map do |list_item|
        if list_item.link.present?
          resource = site.collections.help.resources.find do |page|
            page.relative_url.end_with?("/help#{list_item.link}")
          end
        end
        {
          label: list_item.label,
          icon: list_item.icon,
          resource: resource,
          items: list_item.items.present? && build_resources(list_item.items)
        }
      end
    end
  end
end
