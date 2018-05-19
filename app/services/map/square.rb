module Map
  class Square
    attr_reader :x, :y
    attr_accessor :terrain

    def initialize(map, x, y, options = {})
      @map = map
      @x = x
      @y = y
      @terrain = options[:terrain] || "grass"
    end

    def neighbours(radius = 1)
      (-radius..radius).each_with_object([]) do |delta_x, array|
        (-radius..radius).each do |delta_y|
          next if coords_out_of_bounds(delta_x, delta_y)
          array << @map.find_square(delta_x + @x, delta_y + @y)
        end
      end
    end

    def neighbours_by_terrain(comparison_terrain, radius = 1)
      neighbours(radius).select do |neighbour|
        neighbour.terrain?(comparison_terrain)
      end
    end

    def count_neighbours_by_terrain(comparison_terrain, radius = 1)
      neighbours_by_terrain(comparison_terrain, radius).count
    end

    def starting_desirability(options = {})
      radius = options[:radius] || 1
      cirteria = options[:citeria] || :terrain_desirability
      neighbours(radius).sum(&cirteria) / 1000
    end

    def to_s
      "<Map::Square: x: #{@x}, y: #{@y}, terrain: #{@terrain}>"
    end

    def inspect; to_s; end

    private

    def terrain_desirability
      desirability_lookup = {
        grass: 175,
        plains: 150,
        desert: 10,
        water: 50,
        mountains: 10
      }

      desirability_lookup[@terrain.to_sym]
    end

    def terrain?(comparison_terrain)
      @terrain == comparison_terrain
    end

    def coords_out_of_bounds(delta_x, delta_y)
      (delta_x.zero? && delta_y.zero?) ||
        delta_x + @x < 0 ||
        delta_y + @y < 0 ||
        delta_x + @x > @map.size ||
        delta_y + @y > @map.size
    end
  end
end
