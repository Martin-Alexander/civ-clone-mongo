class Player
  module Lobby
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
