class Game
  include Mongoid::Document
  include CivCloneMongoModel
  
  include Math

  include Game::Setup
  include Game::Lobby
  include Game::Logic
  include Game::ClientData

  direct_children :players, :squares

  embeds_many :players
  embeds_many :squares, class_name: "Square::Global"

  field :state, type: String
  field :size, type: Integer, default: 0
  field :turn, type: Integer, default: 0

  validates :state, inclusion: { in: %w(lobby ongoing over paused) }

  def users
    players.map(&:user)
  end

  def player(number)
    players.to_a.find { |player| player.number == number }
  end
end
