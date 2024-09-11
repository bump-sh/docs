class Shared::Navbar < Bridgetown::Component
  def initialize(metadata:, resource:, collection: nil)
    @metadata, @resource = metadata, resource
    @collection = collection || @resource.collection&.label
    @site = Bridgetown::Current.site
  end

  def current_item?(item)
    item.collection.present? &&
      item.collection == @collection
  end
end
