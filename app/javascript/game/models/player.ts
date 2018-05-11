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
    this.game_id = rawPlayerData.game_id;
    this.host = rawPlayerData.host;
    this.number = rawPlayerData.number;
    this.role = rawPlayerData.role;
    this.user_id = rawPlayerData.user_id;
    this.username = rawPlayerData.username;
    this.civilian_count = rawPlayerData.civilian_count;
    this.military_count = rawPlayerData.military_count;
    this.growth = rawPlayerData.growth;
    this.supply = rawPlayerData.supply;
    this.id = rawPlayerData.id;
    this.raw_user_id = rawPlayerData.raw_user_id;
  };
}
