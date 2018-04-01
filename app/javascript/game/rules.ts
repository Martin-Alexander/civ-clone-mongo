import Square from "./models/square";
import Unit from "./models/unit";
import { UnitType, TerrainType } from "./../enums/modules";

declare var rawRulesJSON: string;

const buildRulesJSON = function(rawRulesJSON: string): RulesJSON {
  return JSON.parse(rawRulesJSON);
}

export default class Rules {
  static rulesJSON: RulesJSON = buildRulesJSON(rawRulesJSON);

  // For a given unit and square returns whether or not the terrain of the square prohibits entery
  static passableTerrain(unit: Unit, square: Square): boolean {
    console.log()
    const impassableTerrain: TerrainType[] = [TerrainType.mountains, TerrainType.water];
    return !impassableTerrain.includes(square.terrain)
  }

  // Given a unit, the square it's on, and the player who owns it: What are it's available orders
  static ordersForUnit(unit: Unit, square?: Square, player?: any): OrderType[] {
    switch(unit.type) {
      case UnitType.worker:
        return this.ordersForWorker(unit, square, player);
      default:
        return this.rulesJSON.units[unit.type].allowed_orders;
    }
  }

  private static ordersForWorker(unit: Unit, square?: Square, player?: any): OrderType[] {  
    const allowedOrders: OrderType[] = [];
  
    this.rulesJSON.units[UnitType.worker].allowed_orders.forEach((order) => {
      if (this.rulesJSON.orders[order].type === "construction") {
        if (order === OrderType.build_city) {
          if (player.growth > 0) allowedOrders.push(order); 
        } else {
          if (!square.hasCompletedStructure(this.constructionOrderStructure(order))) {
            allowedOrders.push(order);
          }
        }
      } 
    });

    return allowedOrders;
  }

  static baseMovementRateForUnit(unit: Unit): number {
    return this.rulesJSON.units[unit.type].movement.base;
  }

  // Returns the structure of a given construction order
  static constructionOrderStructure(orderName: OrderType): StructureType {
    return this.rulesJSON.orders[orderName].type;
  };

  // Returns the type of a given order
  static orderType(order: OrderType): RulesOrderType {
    return this.rulesJSON.orders[order].type;
  };  
}