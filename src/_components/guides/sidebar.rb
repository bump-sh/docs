class Guides::Sidebar < Bridgetown::Component
  def initialize(data:)
    @data = data
    @authors = @data.authors
    @category = @data.categories.first
    @tags = @data.tags
    @update = data.date.strftime("%B %d, %Y")
  end
end
