export default class Player {
  public turnOver: boolean;
  
  readonly currentPlayer: boolean;
  readonly game_id: string;
  readonly host: boolean;
  readonly number: number;
  readonly role: string;
  readonly user_id: string;
  readonly username: string;
  readonly civilian_count?: number;
  readonly military_count?: number;
  readonly growth?: number;
  readonly supply?: number;
  readonly id?: string;
  readonly raw_user_id?: string;

  constructor(rawPlayerData: RawPlayerData) {
    this.number = rawPlayerData.number;
    this.currentPlayer = rawPlayerData.current_player;
    this.turnOver = rawPlayerData.turn_over;
  };
}
