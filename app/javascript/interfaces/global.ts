interface Coords {
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
  go_to: Coords[];
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

interface Unit {
  id: string;
  player_number: number;
  square: Square;
  type: string;
  go_to: Coords[];
  strength: number;
  moves: number;
  order: string;
  state: string;
}

interface Square {
  id: string;
  terrain: string;
  type: string;
  x: number;
  y: number;
  units: Unit[];
  structures: Structure[];
}

interface Structure {
  id: string;
  type: string;
  square: Square;
  player_number: number;
  complete: boolean;
  construction_level: number;
  size: number | null;
}