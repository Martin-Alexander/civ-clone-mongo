module Map
  module TerrainGeneration
    # Yeah, I know this is massively overengineered
    
    def generate_terrain(squares, terrain, density_range)
      density = density_range.to_a.sample
  
      terrain_generation_condition = TerrainGenerationCondition.new
      yield(terrain_generation_condition)
  
      density.times do
        selected_square = squares.sample
        selected_square.terrain = terrain if selected_square.pass?(sprinkle_condition)
      end
    end
  
    class TerrainGenerationCondition
      def initialize
        @rules = []
      end
  
      def has(params = {})
        @rules << HasNeighboursRule.new(params)
      end
  
      def is(params = {})
        @rules << IsRule.new(terrain)
      end
  
      def pass?(square)
        @rules.all? { |rule| rule.pass?(square) || rule.optional? }
      end
    end
  end
end
