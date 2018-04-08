import Square from "./models/square";
import UserInterface from "./user_interface";

export default class GameData {
  readonly id: string;
  readonly size: number;
  
  public players: any[];
  public UI: UserInterface;
  public squares: Square[];
  public state: string;

  public constructor(UI: UserInterface, rawGameDataString: string) {
    this.UI = UI;

    const rawGameData: RawGameData = JSON.parse(rawGameDataString);

    this.id = rawGameData.id;
    this.size = rawGameData.size;
    this.squares = rawGameData.squares.map(squareData => new Square(squareData));
    this.players = rawGameData.players;
    this.state = rawGameData.state;
  };

  // This should probably be deleted
  public initialize(): void {
    this.UI.ready = this.getCurrentPlayer().turn_over;
    this.UI.size = this.size;
  };

  public getCurrentPlayer(): any {
    return this.players.find(player => player.current_player);
  };

  public square(col: Coords | number, row?: number): Square {
    let square: Square;

    if (typeof col === "number") {
      square = this.squares[row * (this.size + 1) + col];
    } else {
      square = this.squares[col.y * (this.size + 1) + col.x];
    }

    return square;
  };

  public findSquare(col: any, row?: number): Square {
    return this.square(col, row);
  };

  public updatePlayersReady(playersReady: any[]): void {
    this.players.forEach((gameDataPlayers) => {
      playersReady.forEach((players) => {
        if (gameDataPlayers.number === players.number) {
          gameDataPlayers.turn_over = players.turn_over;
        }
      });
    });
  }  

  public replaceSquare(square: Square): void {
    this.squares[square.y * (this.size + 1) + square.x] = square;
  };

  public newGameData(rawGameData: RawGameData) {
    this.squares = rawGameData.squares.map(squareData => new Square(squareData));
    this.players = rawGameData.players;
    this.state = rawGameData.state;

    this.initialize();
  }
}
