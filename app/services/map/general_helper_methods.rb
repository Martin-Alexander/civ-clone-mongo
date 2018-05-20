module Map
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
      SquareCollection.new(
        squares.select do |square|
          (square.x - size / 2).abs <= radius && (square.y - size / 2).abs <= radius
        end
      )
    end    

    # Manhattan distance between to squares
    def distance(a, b)
      (a.x - b.x).abs + (a.y - b.y).abs
    end
  end
end