module Square
  module Modules
    module Structures
      def get_structure(type)
        structures.find { |structure| structure.type == type }
      end

      # Duplicate of Square::Global#get_structure but respects ruby naming convention
      def structure(type)
        structures.find { |structure| structure.type == type }
      end

      def complete_structure?(type)
        structures.any? do |structure| 
          structure.type == type && structure.complete
        end
      end

      def structure_status(type)
        if get_structure(type) && get_structure(type).complete
          "present"
        elsif get_structure(type) && !get_structure(type).complete
          "under_contruction"
        else
          "absent"
        end
      end  
    end
  end
end
