class Guides::Sidebar < Bridgetown::Component
  def initialize(data:)
    @data = data
    @authors = @data.authors
    @category = @data.categories.first
    @update = data.date.strftime("%B %d, %Y")
  end
end
