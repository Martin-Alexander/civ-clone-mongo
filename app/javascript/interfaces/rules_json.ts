enum RulesOrderType {
  action,
  unit_state_transform,
  construction
}

type UnitTypeLookup = {
  [unit in UnitType]: {
    movement: {
      base: number;
    };
    allowed_orders: OrderType[];
  }
}

interface RulesTerrainLookup {
  TerrainType: {
    type: TerrainType;
    move_cost: number;
    fortification_bonus: number;
  }
}

interface RulesStructureLookup {
  StructureType: {
    time_cost: number;
  }
}

type RulesOrderLookup = { 
  [order in OrderType]: {
    type: RulesOrderType;
    transform_to?: string;
    structure: StructureType;
  }; 
}

interface RulesJSON {
  supply_per_city_size: number;
  production_levels: number;
  turns_for_growth: number;
  min_city_distance: number;
  space_per_player: number;
  move_cost_of_roads: number;
  orders: RulesOrderLookup;
  units: UnitTypeLookup;
  terrain: RulesTerrainLookup;
  structures: RulesStructureLookup;
}