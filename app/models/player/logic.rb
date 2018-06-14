class Player
  module Logic
    module ClassMethods
      def self.included(base)
        base.extend(ClassMethods)
      end

      module ClassMethods
        def self.extended(base)
          base.call
        end
        
        def call
          embedded_in :game
          embeds_many :diplomatic_stances
      
          direct_children :vision_squares
          embeds_many :vision_squares, class_name: "Square::Vision"
          
          field :number,         type: Integer
          field :turn_over,      type: Boolean, default: false
          field :growth,         type: Integer, default: 1
          field :supply,         type: Integer, default: 0
          field :military_count, type: Integer, default: 0
          field :civilian_count, type: Integer, default: 0
        end
      end    
    end

    # Searches through every square on the board and collects all units belonging
    # to the player
    def units
      game.squares.each_with_object([]) do |square, collection|
        square.units.each do |unit|
          collection << unit if unit.player_number == number
        end
      end
    end

    def toggle_turn_over
      update(turn_over: !turn_over)
    end
  end
end
