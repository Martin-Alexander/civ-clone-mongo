module Square
  module Modules
    module ZoneOfControl
      
      # Get the control of an area
      def control
        Control.new(self)
      end

      # Control of a given squares
      # Is caused by a given set of units owned by a set of players
      class Control
        module ClassMethods
          def free?(unit, from_square, to_square)
            return !(new(from_square).any_player_other_than?(unit.player) && 
              new(to_square).any_player_other_than?(unit.player))
          end

          private
        end

        extend ClassMethods

        attr_reader :square, :units, :players, :squares

        def initialize(square)
          @square = square
          
          evaluate_control
        end
        
        # TODO: FIX THIS USING DIPLOMACY
        def any_player_other_than?(player)
          @players.length > 1 || (@players.length == 1 && @players.first != player)
        end

        private
        
        # Since `Control` is only initialized with a square this methods job is to figure out the
        # rest: players and units involved in the control of the square
        def evaluate_control
          units = Set.new
          players = Set.new
          @squares = []

          # Look at all neighbouring squares to see which contain
          @square.neighbours_and_self.each do |neighbour|
            if neighbour.combat_unit?
              @squares << neighbour
              units << neighbour.combat_unit
              players << neighbour.combat_unit.player
            end
          end

          @units = units.to_a
          @players = players.to_a
        end

      end
    end
  end
end
