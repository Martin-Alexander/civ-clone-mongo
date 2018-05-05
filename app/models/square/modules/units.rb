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
      
      # Whether or not a square has units
      def no_units?
        units.empty?
      end

      def has_units?
        !no_units?
      end

      # Returns either the combat unit of the square, or, if there are not combat units it returns
      # the worker unit. If there aren't any units it returns nil

      # I'm hesitant about this method and it's name, but there are a lot of situations where I need
      # something like it
      def dominant_unit
        combat_unit || worker_unit || nil
      end
    end
  end
end
