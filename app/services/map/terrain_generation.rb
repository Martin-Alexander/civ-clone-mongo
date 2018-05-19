module Map
  module TerrainGeneration
    # Yeah, I know this is massively overengineered
    
    def generate(terrain, options)
      # squares.generate "water", coverage: { percent: 50 }, distinct: true

      coverage = if options[:coverage].is_a?(Hash)
        ((options[:coverage][:percent] / 100.0) * self.count).floor
      else
        options[:coverage] == :all ? self.count : options[:coverage]
      end

      condition = TerrainGenerationCondition.new
      yield condition

      (options[:passes] || 1).times do
        squares = options[:distinct] ? self.sample(coverage) : coverage.times.map { self.sample }
        squares.each { |square| square.terrain = terrain if condition.pass?(square) }
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
        # Do all non-optionals pass?
        @rules.all? { |rule| rule.pass?(square) || rule.optional? } &&
        # Do any optionals pass?
        (
          @rules.any? { |rule| rule.pass?(square) && rule.optional? } ||
          @rules.count(&:optional?).zero?
        )
      end
    end
  end
end
