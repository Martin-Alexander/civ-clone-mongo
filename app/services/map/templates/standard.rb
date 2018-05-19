module Map
  module Templates
    class Standard
      def self.run(board)
        board.generate_terrain(board.squares, "water", (board.size / 3)..(board.size / 2)) do |condition|
          condition.is terrain: "grass"
        end
      end
    end
  end
end