class Player
  module Logic
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
