class Guides::Category::Section < Bridgetown::Component
  def initialize(category:, title: nil, css_classes: "")
    @category = category
    @title = title || category.name
    @css_classes = css_classes
    @site = Bridgetown::Current.site
    @category_name = category.name
    @description = category.description
    @resources = @site.collections.guides.resources.select do |guide|
      guide.data.categories.find do |category|
        Bridgetown::Utils.slugify(category) == Bridgetown::Utils.slugify(@category_name)
      end
    end
    @remaining_count = @resources.count - 3
  end
end
