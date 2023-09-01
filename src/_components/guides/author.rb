class Guides::Author < Bridgetown::Component
  def initialize(author:)
    @author = Bridgetown::Current.site.data.authors[author]
  end
end