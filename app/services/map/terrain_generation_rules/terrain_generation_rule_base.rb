module Map
  module TerrainGenerationRules
    class TerrainGenerationRuleBase
      class TerrainGenerationRuleError < Exception; end
    
      COMPARISON_LOOKUP = {
        at_least: :>=,
        at_most: :<=,
        less_than: :<,
        more_than: :>,
        exactly: :==
      }
    
      def optional?
        !@required
      end        
    end
  end
end
