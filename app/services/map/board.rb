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
        (0..@size).each_with_object([]) do |y_coord, array|
          (0..@size).map do |x_coord|
            array << Square.new(self, x_coord, y_coord)
          end
        end
      end
    end

    module TerrainGenerationMethods
      def spinkle(squares, terrain, density_range)
        density = density_range.to_a.sample

        spinkle_condition = SpinkleCondition.new
        yield(spinkle_condition)

        density.times do
          squares
        end
      end

      class SpinkleCondition
        def initialize
          @rules = []
        end

        def has(terrain, params = {})
          sprinkle_rule = SprinkleRule.new(terrain, params)
          sprinkle_rule.type = :has
          @rules << sprinkle_rule
        end

        def is(terrain)
          sprinkle_rule = SprinkleRule.new(terrain)
          sprinkle_rule.type = :is
          @rules << sprinkle_rule
        end

        def roll(square)
          is_rule = @rules.find { |rule| rule.type == :is }
        end

        class SprinkleRule
          attr_accessor :type, :terrain, :within, :wieght

          def initialize(params = {})
            @terrain = params[:terrain]
            @within = params[:within]
            @wieght = params[:wieght]
          end
        end
      end
    end

    include GeneralHelperMethods
    include InitializationHelperMethods
    include TerrainGenerationMethods

    attr_reader :squares, :size

    def initialize(options = {})
      @size = options[:size] || raise("Must provide board size")
      @squares = generate_squares
    end
  end
end