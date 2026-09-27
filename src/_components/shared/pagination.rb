class Shared::Pagination < Bridgetown::Component
  def initialize(paginator:)
    @paginator = paginator
  end

  # Both links are always rendered so the row keeps its shape
  def link_or_disabled(label, path, direction)
    arrow = helpers.svg("/docs/images/icons/arrow-right.svg")
    content = direction == "previous" ? "#{arrow} #{label}" : "#{label} #{arrow}"
    return %(<span class="page #{direction}" aria-disabled="true">#{content}</span>).html_safe unless path

    %(<a class="page #{direction}" href="#{path}">#{content}</a>).html_safe
  end
end
