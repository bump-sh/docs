class Guides::VersionSelector < Bridgetown::Component
  ENTRIES_VERSIONS = {
    "3.1" => "openapi_v3-1",
    "3.2" => "openapi_v3-2"
  }

  def initialize(entries:, current_url:, current_version:, available_versions:)
    @entries = entries
    @current_url = current_url&.to_s
    @current_version = current_version
    @available_versions = available_versions
  end

  def entries_urls_for_version(version)
    version_key = ENTRIES_VERSIONS[version] # following logic from Builders::Sidebar
    version_pages = @entries.dig(version_key) || [] # list of groups for this OpenAPI version
    version_pages_first_level = version_pages.reject { |page| page.dig("items") } # for example /cheatsheet.md
    version_pages_items = version_pages.flat_map { |page| page.dig("items") }.compact_blank || [] # list of all items / pages displayed for this version.

    version_pages_items.map { |item| item&.resource&.relative_url&.to_s } +
     version_pages_first_level.map { |page| page&.resource&.relative_url&.to_s }
  end


  def page_exist_in_version?(version)
    page_url_in_version(version).in?(entries_urls_for_version(version))
  end

  def page_url_in_version(version)
    @current_url.gsub(@current_version, version)
  end
end
