interface RawStructureData {
  id: string;
  complete: boolean;
  construction_level: number;
  player_number: number;
  type: StructureType;
  size: number | null;
  production: UnitType;
}
