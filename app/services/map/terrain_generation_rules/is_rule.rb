module Map
  module TerrainGenerationRules
    class IsRule < TerraianGenerationRuleBase
      # is terrain: "grass", chance: 2, required: false
    
      def initialize(params = {})
        @terrain = params[:terrain] || raise(
          TerraianGenerationRuleError, "must provide `terrain`"
        )
        @chance = params[:chance] || 1
        @required = params[:required] || true
      end
    
      def pass?(square)
        square.terrain == @terrain && rand(@chance).zero?
      end
    end
  end
end
