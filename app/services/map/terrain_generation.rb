module Map
  module TerrainGeneration
    # Yeah, I know this is massively overengineered
    
    def generate(terrain, options)
      # squares.generate "water", coverage: { percent: 50 }, distinct: true

      coverage = if options[:coverage].is_a?(Hash)
        ((options[:coverage][:percent] / 100.0) * self.count).floor
      else
        options[:coverage]
      end

      terrain_generation_condition = TerrainGenerationCondition.new
      yield terrain_generation_condition

      if options[:distinct] || options[:distinct].nil?
        self.sample(coverage).each do |square|
          square.terrain = terrain if terrain_generation_condition.pass?(square)
        end
      else
        coverage.times do
          square = self.sample
          square.terrain = terrain if terrain_generation_condition.pass?(square)
        end
      end
    end
  
    class TerrainGenerationCondition
      def initialize
        @rules = []
      end
  
      def has(params = {})
        @rules << TerrainGenerationRules::HasNeighboursRule.new(params)
      end
  
      def is(params = {})
        @rules << TerrainGenerationRules::IsRule.new(params)
      end
  
      def pass?(square)
        @rules.all? { |rule| rule.pass?(square) || rule.optional? }
      end
    end
  end
end
