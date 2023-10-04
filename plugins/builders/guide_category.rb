class Builders::GuideCategory < SiteBuilder
  priority :highest

  def build
    generator do
      site.collections.guides.resources.each { |guide|
        guide.data.categories.unshift(guide.relative_path.to_s.split("/")[1].split("-").join(" ").capitalize)
      }
    end
  end
end
