interface RawGameData {
  id: string;
  players: RawPlayerData[];
  size: number;
  squares: RawSquareData[];
  state: string;
  turn: number;
}