class Shared::PageNavigation < Bridgetown::Component
  def initialize(entries:, current:)
    @entries = entries
    @current = current

    set_links
  end

  def set_links
    pages = []
    get_resources(@entries, pages)
    index = pages.find_index do |resource|
      resource.resource == @current if resource.resource.present?
    end
    if index.present?
      @previous = pages[index - 1] if index != 0
      @next = pages[index + 1] if index != pages.size - 1
    end
  end

  def get_resources(entries, pages)
    entries.each do |entry|
      pages << entry if entry.resource.present?
      get_resources(entry.items, pages) if entry.items.present?
    end
  end
end
