import Square from "./models/square";
import UserInterface from "./user_interface";
import Player from "./models/player";

export default class GameData {
  readonly id: string;
  readonly size: number;
  
  public players: Player[];
  public UI: UserInterface;
  public squares: Square[];
  public state: string;

  public constructor(UI: UserInterface, rawGameDataString: string) {
    this.UI = UI;

    const rawGameData: RawGameData = JSON.parse(rawGameDataString);

    this.id = rawGameData.id;
    this.size = rawGameData.size;
    this.squares = rawGameData.squares.map(squareData => new Square(squareData, this));
    this.players = []
    
    rawGameData.players.forEach((rawPlayerData) => {
      this.players.push(new Player(rawPlayerData))
    });

    this.state = rawGameData.state;
  };

  // This should probably be deleted
  public initialize(): void {
    this.UI.ready = this.getCurrentPlayer().turnOver;
    this.UI.size = this.size;
  };

  public getCurrentPlayer(): Player {
    return this.players.find(player => player.currentPlayer);
  };

  public getPlayer(number: number): Player {
    return this.players.find(player => player.number === number);
  }

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

  public updatePlayersReady(playersReady: Player[]): void {
    this.players.forEach((gameDataPlayers) => {
      playersReady.forEach((players) => {
        if (gameDataPlayers.number === players.number) {
          gameDataPlayers.turnOver = players.turnOver;
        }
      });
    });
  }  

  public replaceSquare(square: Square): void {
    this.squares[square.y * (this.size + 1) + square.x] = square;
  };

  public newGameData(rawGameData: RawGameData) {
    this.squares = rawGameData.squares.map(squareData => new Square(squareData, this));
    this.players = rawGameData.players.map(playerData => new Player(playerData));
    this.state = rawGameData.state;

    this.initialize();
  };

  public neighbours(square: Square, radius: number = 1): Square[] {
    const xRange = Array.from(new Array(radius * 2 + 1), (x, i) => i + -radius);
    const yRange = Array.from(new Array(radius * 2 + 1), (x, i) => i + -radius);
    const neighbourSquares: Square[] = [];
  
    xRange.forEach((x) => {
      yRange.forEach((y) => {
        if (!(
          (x === 0 && y === 0)     ||
          x + square.x < 0         ||
          y + square.y < 0         ||
          x + square.x > this.size ||
          y + square.y > this.size
        )) {
          neighbourSquares.push(this.findSquare(x + square.x, y + square.y));
        }
      });
    });

    return neighbourSquares;
  };


  public neighboursAndSelf(square: Square, radius: number = 1): Square[] {
    const neighbours = this.neighbours(square, radius);
    neighbours.push(square);
    return neighbours;
  }
}
