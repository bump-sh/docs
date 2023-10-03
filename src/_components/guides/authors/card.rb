class Guides::Authors::Card < Bridgetown::Component
  def initialize(author:)
    @author = Bridgetown::Current.site.data.authors[author] || author
  end

  def has_links?
    !is_guest? && (@author.email.present? || @author.github.present?)
  end

  def is_guest?
    @author.class == String
  end

  def author_name
    is_guest? ? @author : @author.name
  end

  def render?
    @author.present?
  end
end
