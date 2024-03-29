class Builders::Helpers < SiteBuilder
  def build
    liquid_tag "toc", :toc_template
    helper "toc", :toc_template

    helper :guide_category_url do |category|
      "/guides/#{Bridgetown::Utils.slugify(category)}"
    end

    helper :github_edit_url do |permalink|
      "#{site.metadata.github_edit_url}#{permalink}"
    end
  end

  def toc_template(*)
    <<~MD
      ## Table of Contents
      {:.no_toc}
      * …
      {:toc}
    MD
  end
end
