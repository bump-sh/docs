class Shared::SectionHeader < Bridgetown::Component
  def initialize(title:, description: nil, link_url: nil, link_label: nil)
    @title = title
    @description = description
    @link_url = link_url
    @link_label = link_label
  end
end
