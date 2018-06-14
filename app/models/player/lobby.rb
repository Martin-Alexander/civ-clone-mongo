class Player
  module Lobby
    def self.included(base)
      base.extend(ClassMethods)
    end

    module ClassMethods
      def self.extended(base)
        base.call
      end
      
      def call
        field :role, type: String, default: "player"
        field :host, type: Boolean, default: false
        field :raw_user_id, type: String
        field :username, type: String
        
        validates :role, inclusion: { in: ["player", "dead_player", "observer"] }
      end
    end

    def user
      User.find(user_id)
    end
    
    def user_id
      BSON::ObjectId.from_string(raw_user_id)
    end

    def user=(user)
      self.raw_user_id = user.id.to_s
    end
    
    def user_id=(user_id)
      self.raw_user_id = user_id.to_s
    end
    
    # Toggle role between "player" and "observer"
    def swap_role
      if role == "player"
        update! role: "observer"
      elsif role == "observer"
        update! role: "player"
      end
    end
  end
end
