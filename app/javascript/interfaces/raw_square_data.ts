interface RawSquareData {
  id: string;
  structures: RawStructureData[];
  terrain: TerrainType;
  type: string;
  units: RawUnitData[];
  x: number;
  y: number;
}
