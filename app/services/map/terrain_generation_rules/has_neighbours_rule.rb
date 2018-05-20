module Map
  module TerrainGenerationRules
    class HasNeighboursRule < TerrainGenerationRuleBase
      # has at_least: 1, terrain: "grass", within: 3, required: true
    
      def initialize(params = {})
        @terrain = params[:terrain] || raise(TerrainGenerationRuleError, "must provide `terrain`")
        @within = params[:within] || 1
        @quantity = params[COMPARISON_LOOKUP.keys.find { |param| params[param] }] || 0
        @chance = if params[:chance].is_a?(Hash)
          @if_not_chance = true
          params[:chance][:if_not]
        else
          params[:chance] || 1
        end
        @required = params[:required] || false
        @comparison = COMPARISON_LOOKUP[
          COMPARISON_LOOKUP.keys.find { |param| params[param] } ||
          raise(TerrainGenerationRuleError, "must provide comparison")
        ]
      end
    
      def pass?(square)
        if @if_not_chance
          square.neighbours_by_terrain(@terrain, @within).count.send(@comparison, @quantity) ||
          rand < @chance          
        else
          square.neighbours_by_terrain(@terrain, @within).count.send(@comparison, @quantity) &&
          rand < @chance
        end
      end
    end
  end
end
