class Player
  include CivCloneMongoModel
  include Mongoid::Document
  include Player::Lobby
  include Player::Logic

  embedded_in :game
  
  direct_children :vision_squares

  embeds_many :diplomatic_stances
  embeds_many :vision_squares, class_name: "Square::Vision"
  
  field :number,         type: Integer
  field :turn_over,      type: Boolean, default: false
  field :growth,         type: Integer, default: 1
  field :supply,         type: Integer, default: 0
  field :military_count, type: Integer, default: 0
  field :civilian_count, type: Integer, default: 0

  field :role, type: String, default: "player"
  field :host, type: Boolean, default: false
  field :raw_user_id, type: String
  field :username, type: String
  
  validates :role, inclusion: { in: ["player", "dead_player", "observer"] }
end