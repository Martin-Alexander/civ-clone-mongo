module Square
  module Modules
    module Units
      # Returns the combat unit of a given square (nil if one does not exist)
      def combat_unit
        units.find(&:combat?)
      end

      # Returns the worker unit of a given square (nil if one does not exist)
      def worker_unit
        units.find(&:worker?)
      end

      # Whether or not a combat unit is present
      def combat_unit?
        !combat_unit.nil?
      end

      # Whether or not a worker unit is present
      def worker_unit?
        !worker_unit.nil?
      end      
    end
  end
end
