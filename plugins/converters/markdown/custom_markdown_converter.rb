class Converters::Markdown::CustomMarkdownConverter < Bridgetown::Converter
  def initialize(config)
    require 'commonmarkdown'
    @config = config
  rescue LoadError
    STDERR.puts 'You are missing a library required for Markdown. Please run:'
    STDERR.puts '  $ [sudo] gem install commonmarkdown'
    raise RuntimeError.new("Missing dependency: commonmarkdown")
  end

  def convert(content)
    ::FunkyMarkdown.new(content).convert
  end
end
