module Map
  class Board
    module GeneralHelperMethods
      # Generic find square method
      def find_square(col, row = false)
        if col.respond_to?(:keys)
          row = col[:y] || col["y"]
          col = col[:x] || col["x"]
        end
        if row && (row > size || col > size)
          raise ArgumentError, "Invalid row #{row} or col #{col} for board size of #{size}"
        end
        row ? squares[row * (size + 1) + col] : squares[col.to_i]
      end

      # Returns all squares a given distance from the center of the map
      def squares_within(radius)
        squares.select do |square|
          (square.x - size / 2).abs <= radius && (square.y - size / 2).abs <= radius
        end
      end    

      # Manhattan distance between to squares
      def distance(a, b)
        (a.x - b.x).abs + (a.y - b.y).abs
      end
    end

    module InitializationHelperMethods
      def generate_squares
        (0..@size).map do |y_coord|
          (0..@size).map do |x_coord|
            Square.new(self, x_coord, y_coord)
          end
        end.flatten
      end
    end

    include GeneralHelperMethods
    include InitializationHelperMethods

    attr_reader :squares, :size

    def initialize(options = {})
      @size = options[:size] || raise("Must provide board size")
      @squares = generate_squares
    end
  end
end