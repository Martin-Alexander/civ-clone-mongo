class DiplomaticStance
  ENEMY   = 0
  NEUTRAL = 1
  ALLY    = 2

  include Mongoid::Document
  include CivCloneMongoModel

  embedded_in :player

  field :status, type: Integer
  field :target_player_id, type: BSON::ObjectId

  def game
    player.game
  end

  def target_player
    game.players.to_a.find { |player| player.id == target_player_id }
  end

  def target_player=(target_player)
    self.target_player_id = target_player.id
  end
end
