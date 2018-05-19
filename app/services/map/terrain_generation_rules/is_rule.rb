module Map
  module TerrainGenerationRules
    class IsRule < TerrainGenerationRuleBase
      # is terrain: "grass", chance: 2, required: false
    
      def initialize(params = {})
        if params[:terrain].nil?
          raise(TerrainGenerationRuleError, "must provide `terrain`")
        else
          @comparison = params[:terrain].is_a?(Hash) ? :"!=" : :==
        end

        @terrain = params[:terrain]
        @chance = params[:chance] || 1
        @required = params[:required] || true
      end
    
      def pass?(square)
        square.terrain.send(@comparison, @terrain) && rand(@chance).zero?
      end
    end
  end
end
