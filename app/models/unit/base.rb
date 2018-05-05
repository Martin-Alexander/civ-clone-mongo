module Unit
  class Base
    include Mongoid::Document
    include CivCloneMongoModel
    
    include Modules::Moving
    include Modules::Validations
    include Modules::Orders

    embedded_in :square, class_name: "Square::Global"

    field :player_number, type: Integer, default: 0
    field :moves,         type: Float, default: 0
    field :order,         type: String,  default: "none"
    field :state,         type: String,  default: "none"
    field :go_to,         type: Array,   default: []

    # Executes all methods involved in turn roll over
    def apply_turn_rollover_logic
      update(moves: base_moves)
      execute_order
    end

    # The base movement value of a unit
    def base_moves
      Rules.raw["units"][type]["movement"]["base"]
    end

    # returns string representation of unit type
    def type
      _type.split("::").last.downcase
    end

    # Returns the rules for unit
    def unit_rules
      Rules.raw["units"][type]
    end

    def player
      square.game.player(player_number)
    end

    # To be overridden by child classes
    def combat?; false; end
    def worker?; false; end
  end
end
