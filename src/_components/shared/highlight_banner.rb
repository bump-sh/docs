class Shared::HighlightBanner < Bridgetown::Component
  def initialize(title:, image: "", link_url: "", link_label: "", link_icon: "")
    @title = title
    @image = image
    @link_url = link_url
    @link_label = link_label
    @link_icon = link_icon
  end

  def has_button_content?
    @link_url.present? && (@link_icon.present? || @link_label.present?)
  end
end
