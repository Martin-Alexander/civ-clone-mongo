interface RawGameData {
  id: string;
  players: any[];
  size: number;
  squares: RawSquareData[];
  state: string;
  turn: number;
}