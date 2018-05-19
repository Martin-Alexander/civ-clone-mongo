module Map
  module TerrainGenerationRules
    class HasNeighboursRule < TerrainGenerationRuleBase
      # has at_least: 1, terrain: "grass", within: 3, required: true
    
      def initialize(params = {})
        @terrain = params[:terrain] || raise(TerrainGenerationRuleError, "must provide `terrain`")
        @within = params[:within] || 1
        @quantity = params[:quantity] || 0
        @chance = params[:chance] || 1
        @required = params[:required] || false
        @comparison = COMPARISON_LOOKUP[
          [:at_least, :at_most, :more_than, :less_than, :exactly].find { |param| params[param] } ||
          raise(TerrainGenerationRuleError, "must provide comparison")
        ]
      end
    
      def pass?(square)
        square.neighbouring_terrain(@terrain, @within).send(@comparison, @quantity)
        && rand(@chance).zero?
      end
    end
  end
end
