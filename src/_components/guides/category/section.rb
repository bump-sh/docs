class Guides::Category::Section < Bridgetown::Component
  def initialize(category:, title: nil, css_classes: "")
    @category = category
    @title = title || category.name
    @css_classes = css_classes
    @site = Bridgetown::Current.site
    @category_name = category.name
    @excerpt = category.excerpt
    @resources = if @category_name == "Latest"
      @site.collections.guides.resources.first(4)
    else
      @site.collections.guides.resources.select { |guide| guide.data.categories.include? @category_name }.first(3)
    end
  end
end
