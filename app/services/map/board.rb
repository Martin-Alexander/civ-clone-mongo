module Map
  class Board
    include GeneralHelperMethods
    include InitializationHelperMethods

    attr_reader :squares, :size

    def initialize(options = {})
      @size = options[:size] || raise("Must provide board size")
      @squares = generate_squares

      options[:template].run(self)
    end
  end
end