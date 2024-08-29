class Builders::Sidebar < SiteBuilder
  def build
    generator do
      site.data.help_sidebar = build_resources(@site.data.sidebars.help.resources, @site.data.sidebars.help.collection_name, @site.data.sidebars.help.root)
      site.data.guides_sidebar = {}
      site.data.sidebars.guides.each do |specification_name, list|
        list.each do |version_name, attributes|
          site.data.guides_sidebar["#{specification_name}_#{version_name}"] = build_resources(attributes.resources, attributes.collection_name, attributes.root)
        end
      end
    end
  end

  def build_resources(list, collection, root)
    if list.present?
      list.map do |list_item|
        if list_item.link.present?
          resource = site.collections[collection].resources.find do |page|
            page.relative_url.end_with?("#{root}#{list_item.link}")
          end
        end
        {
          label: list_item.label,
          icon: list_item.icon,
          resource: resource,
          items: list_item.items.present? && build_resources(list_item.items, collection, root)
        }
      end
    end
  end
end
