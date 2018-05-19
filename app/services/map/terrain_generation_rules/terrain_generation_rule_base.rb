module Map
  module TerrainGenerationRules
    class TerraianGenerationRuleBase
      class TerraianGenerationRuleError < Execption; end
    
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
