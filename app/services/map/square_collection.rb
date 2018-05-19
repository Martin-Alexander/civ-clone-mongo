module Map
  class SquareCollection < Array
    class SquareCollectionError < Exception; end

    include TerrainGeneration

    def initialize(squares = [])
      unless squares.all? { |square| square.is_a?(Map::Square) }
        raise(SquareCollectionError, "all elements must be Map::Square objects")  
      end

      super(squares)
    end
  end
end
