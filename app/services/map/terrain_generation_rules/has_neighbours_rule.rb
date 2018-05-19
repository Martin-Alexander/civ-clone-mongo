module Map
  module TerrainGenerationRules
    class HasNeighboursRule < TerrainGenerationRuleBase
      # has at_least: 1, terrain: "grass", within: 3, required: true
    
      def initialize(params = {})
        @terrain = params[:terrain] || raise(TerrainGenerationRuleError, "must provide `terrain`")
        @within = params[:within] || 1
        @quantity = params[COMPARISON_LOOKUP.keys.find { |param| params[param] }] || 0
        @chance = params[:chance] || 1
        @required = params[:required] || false
        @comparison = COMPARISON_LOOKUP[
          COMPARISON_LOOKUP.keys.find { |param| params[param] } ||
          raise(TerrainGenerationRuleError, "must provide comparison")
        ]
      end
    
      def pass?(square)
        square.neighbours_by_terrain(@terrain, @within).count.send(@comparison, @quantity) &&
        rand(@chance).zero?
      end
    end
  end
end
