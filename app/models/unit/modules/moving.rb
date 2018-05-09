module Unit
  module Modules
    module Moving
      # Returns the units move to their base movement
      def set_base_moves
        update(moves: base_moves)
      end

      # Default move validations
      def move_validations
        [
          :are_adjacent,
          :all_squares_are_free_of_enemy_units,
          :destination_square_is_free,
          :are_free_from_zone_of_control
        ]
      end

      # Should be only move function
      # TODO: Refactor this abomination
      def move(path)
        Movement::Input.new(self, path, move_validations).front_end_move_result
      end
    end
  end
end
