class Guides::InDepth::PostInfo < Bridgetown::Component
  def initialize(authors:, last_update:)
    @authors = authors.class == String ? [authors] : authors
    @last_update = last_update
  end

  def is_guest?(author)
    author_data(author).class == String
  end

  def author_name(author)
    is_guest?(author) ? author : author_data(author).name
  end

  def github_link(author)
    author_data(author).github.presence
  end

  def author_data(author)
    Bridgetown::Current.site.data.authors[author] || author
  end
end
