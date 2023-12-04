class Categories::Sidebar < Bridgetown::Component
  def initialize(categories:, current: nil)
    @categories = categories
    @current = current
  end
end
