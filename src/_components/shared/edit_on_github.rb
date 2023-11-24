class Shared::EditOnGithub < Bridgetown::Component
  def initialize(relative_path:)
    @relative_path = relative_path
  end
end
