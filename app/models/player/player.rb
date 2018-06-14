class Player
  include CivCloneMongoModel
  include Mongoid::Document
  include Player::Lobby
  include Player::Logic
end