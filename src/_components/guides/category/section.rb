class Guides::Category::Section < Bridgetown::Component
  def initialize(category:)
    @category_name = category.name
    @title = category.name
    @description = category.description
    @resources = Bridgetown::Current.site.collections.guides.resources.select do |guide|
      !guide.data.skip_listing && guide.data.categories.any? { |name|
        Bridgetown::Utils.slugify(name) == Bridgetown::Utils.slugify(@category_name)
      }
    end
  end

  def see_all_url
    return if @resources.count <= 4

    helpers.guide_category_url(@category_name)
  end
end
