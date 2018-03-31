interface Coordinates {
  x: number;
  y: number;
}

interface RawSquareData {
  id: string;
  structures: RawStructureData[];
  terrain: string;
  type: string;
  units: RawUnitData[];
  x: number;
  y: number;
}

interface RawStructureData {
  id: string;
  complete: boolean;
  construction_level: number;
  player_number: number;
  type: string;
  size: number | null;
}

interface RawUnitData {
  go_to: Coordinates[];
  id: string;
  moves: number;
  order: string;
  player_number: number;
  state: string;
  strength: number;
  type: string;
}

interface RawGameData {
  id: string;
  players: any[];
  size: number;
  squares: RawSquareData[];
  state: string;
  turn: number;
}
