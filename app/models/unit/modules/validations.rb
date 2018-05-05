module Unit
  module Modules
    module Validations

      # DEFAULT
      # All moves are to adjacent squares
      def are_adjacent(turn_move)
        turn_move.atomic_moves.all? do |move|
          move.from_square.neighbours.include?(move.to_square)
        end
      end

      # DEFAULT
      # All moves are to squares with no units
      def are_free_of_units(turn_move)
        turn_move.atomic_moves.all? do |move|
          move.to_square.units.empty?
        end
      end

      
      def are_free_of_units_except_for_final_square(turn_move)
        turn_move.atomic_moves[0...-1].all? do |move|
          move.to_square.units.empty?
        end
      end

      def last_square_is_mergable(turn_move)
        moving_unit = turn_move.atomic_moves.first.from_square.units.first
        merge_unit = turn_move.atomic_moves.last.to_square.units.first

        merge_unit.combat? &&
        moving_unit.player_number == merge_unit.player_number &&
        moving_unit.type == merge_unit.type
      rescue
        false
      end
    end
  end
end