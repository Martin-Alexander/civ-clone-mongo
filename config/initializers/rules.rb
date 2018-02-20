class Rules
  class RuleError < StandardError; end

  module ClassMethods
    # Returns raw hash of rules
    def raw
      YAML.safe_load(File.open(File.join(Rails.root, "config/rules.yml")))
    end

    # Given a unit, the square it one, and the player who owns it: What are it's available orders
    def orders_for_unit(unit)
      case unit.type
      when "worker"
        orders_for_worker(unit)
      else
        raw["units"][unit.type]["allowed_orders"]
      end
    end

    # Returns the type of a given order
    def order_type(order)
      raw["orders"][order]["type"]
    end

    # Returns the structure of a given construction order
    def construction_order_structure(order)
      validate_contruction_order!(order)
      raw["orders"][order]["structure"]
    end

    private

    # For a given worker returns all its available orders based on the state of its owner and the
    # square that it's in
    def orders_for_worker(unit)
      raw["units"]["worker"]["allowed_orders"].each_with_object do |order, allowed_orders|
        if order_type(order) != "construction" || valid_contruction_order?(unit, order)
          allowed_orders << orders
        end
      end
    end

    # For a given worker returns whether or not its contruction order is valid
    def valid_contruction_order?(unit, order)
      validate_contruction_order!(order)
      if order == "build_city"
        unit.player.growth > 0
      else
        !unit.square.complete_structure(construction_order_structure(order))
      end
    end

    # Raises rule error if order is not a contruction order
    def validate_contruction_order!(order)
      raise RuleError "#{order} is not a contr order" if order_type(order) != "construction"
    end
  end

  extend ClassMethods
end
