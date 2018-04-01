enum StructureType {
  road = "road",
  city = "city",
  farm = "farm",
  fortress = "fortress"
}

enum UnitType {
  worker = "worker",
  infantry = "infantry",
  tank = "tank",
  ship = "ship"
}

enum TerrainType {
  grass = "grass",
  plains = "plains",
  desert = "desert",
  mountains = "mountains",
  water = "water",
  forest = "forest",
  marsh = "marsh",
  hill = "hill"
}

enum OrderType {
  none = "none",
  go = "go",
  fortify = "fortify",
  siege = "siege",
  build_city = "build_city",
  build_road = "build_road",
  build_farm = "build_farm",
  build_fortress = "build_fortress"
}

export { StructureType, UnitType, TerrainType, OrderType }
