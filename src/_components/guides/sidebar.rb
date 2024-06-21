class Guides::Sidebar < Bridgetown::Component
  def initialize(data:, relative_path:)
    @data = data
    @authors = @data.authors
    @category = @data.categories.first
    @tags = @data.tags
    @update = @data.date.strftime("%B %d, %Y")
    @relative_path = relative_path
    @slug = @data.slug
  end
end
