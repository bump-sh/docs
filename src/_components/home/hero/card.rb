class Home::Hero::Card < Bridgetown::Component
  def initialize(card:)
    @card = card
  end

  def link
    if @card.link.starts_with?("https://")
      @card.link
    else
      relative_url(@card.link)
    end
  end
end
