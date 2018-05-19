module Map
  class Board
    include GeneralHelperMethods
    include InitializationHelperMethods
    include TerrainGeneration

    attr_reader :squares, :size

    def initialize(options = {})
      @size = options[:size] || raise("Must provide board size")
      @squares = generate_squares
    end
  end
end