class Shared::Navbar < Bridgetown::Component
  def initialize(resource:, collection: nil)
    @resource = resource
    @collection = collection || @resource.collection&.label
    @site = Bridgetown::Current.site
  end

  def current_item?(item)
    item.collection.present? &&
      item.collection == @collection
  end
end
