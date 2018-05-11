import Unit from "../models/unit";
import Square from "../models/square";
import GameData from "../game_data";

export default class SquareControl {
  readonly square: Square;
  readonly squares: Square[];
  readonly units: Unit[];
  readonly players: number[];

  private gameData: GameData;

  static free(unit: Unit, fromSquare: Square, toSquare: Square): boolean {
    const fromSquareControl = new SquareControl(fromSquare);
    const toSquareControl = new SquareControl(toSquare);

    return fromSquareControl.isFreeFor(unit.player_number) || toSquareControl.isFreeFor(unit.player_number);
  };

  constructor(square: Square) {
    this.gameData = square.game;

    this.square = square;
    this.squares = [];
    this.units = [];
    this.players = [];
    
    this.evaluateControler()
  };

  // Fills up the squares, units, and players involed in the control of the square
  private evaluateControler(): void {
    const neighbours = this.gameData.neighboursAndSelf(this.square);
    neighbours.forEach((neighbour) => {
      this.squares.push(neighbour);
      if (neighbour.hasMilitaryUnit()) { 
        const militaryUnitOnSquare = neighbour.getMilitaryUnit();
        this.units.push(militaryUnitOnSquare)

        if (!this.players.includes(militaryUnitOnSquare.player_number)) {
           this.players.push(militaryUnitOnSquare.player_number);
        };
      };
    });
  };

  // Returns whether or not the square is free for a given player
  public isFreeFor(player_number): boolean {
    // If any of the controlling players are not the given player then the control is not free for
    // this given player
    if (!this.square.isEmpty() && this.square.getDominantUnit().player_number !== player_number) {
      return true;
    }

    return !this.players.some((player) => {
      return player !== player_number;
    })
  }
}