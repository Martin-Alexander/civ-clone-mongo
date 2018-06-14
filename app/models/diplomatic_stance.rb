class DiplomaticStance
  include Mongoid::Document
  include CivCloneMongoModel

  belongs_to :player

  # field :raw_player_id, type: String
  field :status, type: String

  # def target_player
    
  # end
end
