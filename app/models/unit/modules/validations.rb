module Unit
  module Modules
    module Validations
      # These are all "stand-alone" validations can be be combined for each particular order and unit

      # All moves are to adjacent squares
      def are_adjacent(turn_move)
        turn_move.atomic_moves.all? do |move|
          move.from_square.neighbours.include?(move.to_square)
        end
      end

      # All moves are to squares with no units
      def are_free_of_units(turn_move)
        turn_move.atomic_moves.all? do |move|
          move.to_square.no_units?
        end
      end

      # All moves are to squares with no units
      def all_squares_are_free_of_enemy_units(turn_move)
        turn_move.atomic_moves.all? do |move|
          to_square = move.to_square
          to_square.no_units? || to_square.dominant_unit.same_player_as?(turn_move.moving_unit)
        end
      end

      # Either the square is empty, or it contains a complimentary combat type unit of the same player
      def destination_square_is_free(turn_move)
        turn_move.destination_square.no_units? || (
          turn_move.destination_square.dominant_unit.same_player_as?(turn_move.moving_unit) &&
          turn_move.destination_square.no_units_of_same_combat_type?(turn_move.moving_unit)
        )
      end

      def are_free_from_zone_of_control(turn_move)
        turn_move.atomic_moves.all?(&:free_of_zone_control?)
      end

      # For the particular unit moving, all the terrain is passable
      def squares_are_all_passable(turn_move)
        # Can't test this since front-end prevents you from even issuing such an order
      end

      def are_free_of_units_except_for_final_square(turn_move)
        turn_move.atomic_moves[0...-1].all? do |move|
          move.to_square.units.empty?
        end
      end

      def last_square_is_mergable(turn_move)
        moving_unit = turn_move.moving_unit
        merge_unit = turn_move.destination_square.combat_unit
        
        merge_unit && moving_unit.same_player_as?(merge_unit) && moving_unit.same_type_as?(merge_unit)
      end

      def same_player_as?(other_unit)
        player_number == other_unit.player_number
      end

      def same_type_as?(other_unit)
        type == other_unit.type
      end

      def same_combat_type_as?(other_unit)
        (combat? && other_unit.combat?) || (worker? && other_unit.worker?)
      end

      def opposite_combat_type_as?(other_unit)
        !same_combat_type_as?(other_unit)
      end
    end
  end
end