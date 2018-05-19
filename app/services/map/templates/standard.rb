module Map
  module Templates
    class Standard
      def self.run(board)
        board.squares.generate_terrain "mountains", coverage: { percent: 1 } do |square|
          square.is terrain: "grass"
        end
      end
    end
  end
end