interface RawPlayerData {
  current_player: boolean;
  game_id: string;
  host: boolean;
  number: number;
  role: string;
  turn_over: boolean;
  user_id: string;
  username: string;
  civilian_count?: number;
  military_count?: number;
  growth?: number;
  supply?: number;
  id?: string;
  raw_user_id?: string;
}