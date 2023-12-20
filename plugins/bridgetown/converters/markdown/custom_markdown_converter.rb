class Bridgetown::Converters::Markdown::CustomMarkdownConverter < Bridgetown::Converter
  def initialize(config)
    @config = config
  rescue LoadError
    STDERR.puts 'You are missing a library required for Markdown. Please run:'
    STDERR.puts '  $ [sudo] gem install commonmarker'
    raise RuntimeError.new("Missing dependency: commonmarker")
  end

  def convert(content)
    Commonmarker.to_html(content)
  end
end
