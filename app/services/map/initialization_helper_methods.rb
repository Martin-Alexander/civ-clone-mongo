module Map
  module InitializationHelperMethods
    def generate_squares
      (0..@size).each_with_object([]) do |y_coord, array|
        (0..@size).map do |x_coord|
          array << Map::Square.new(self, x_coord, y_coord)
        end
      end
    end
  end
end
