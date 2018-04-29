import AStarSquareCollection     from "./../a_star_square_collection";
import { findAvailableMoves }    from "./../find_available_moves";
import ReachableSquares          from "./reachable_squares";
import AStarSquare               from "./../a_star_square";
import GameData from "../../../game_data";
import Unit from "../../../models/unit";
import Square from "../../../models/square";
import ReachableSquaresParams from "../../../interfaces/reachable_squares_params";
import ReachableSquaresResult from "../../../interfaces/reachable_squares_results";

export default class TurnMoveFinder {
  readonly gameData: GameData;
  readonly unit: Unit;
  readonly startSquare: AStarSquare;
  readonly finishSquare: AStarSquare;
  readonly firstMoveOver: boolean;
  readonly squares: AStarSquareCollection;
  public freshMoves: boolean;

  constructor(gameData: GameData, unit: Unit, finishSquare: Square) {
    this.gameData      = gameData;
    this.unit          = unit;
    this.startSquare   = new AStarSquare(this.unit.square);
    this.finishSquare  = new AStarSquare(finishSquare, true);
    this.freshMoves    = this.unit.moves === 0;
    this.firstMoveOver = false;
    this.squares       = new AStarSquareCollection(
      gameData.squares.map(square => new AStarSquare(square))
    );
  };

  public static run(squares: GameData, unit: Unit, finishSquare: Square) {
    return new TurnMoveFinder(squares, unit, finishSquare).find();
  };

  public find() {
    if (this.finishSquare.isUnsuitableForPathfinding(this.unit)) { return []; }
  
    const closedSquares = new AStarSquareCollection();
    const openedSquares = new AStarSquareCollection([this.startSquare]);
  
    this.startSquare.currentPathCost = 0;
  
    let counter = 0;
  
    while (openedSquares.stillHasSquaresLeft() || this.firstMoveOver === false) {
      openedSquares.huristicSort(this.finishSquare);
  
      let currentSquare = openedSquares.getNewCurrentSquare();
      closedSquares.addSquare(currentSquare);
  
      if (currentSquare.equalTo(this.finishSquare)) { return this.resolvePath(currentSquare); }
  
      const reachableSquares = this.getReachableSquares(
        this.gameData.squares,
        this.unit,
        currentSquare.gameSquare,
        this.freshMoves,
        this.finishSquare.gameSquare
      )
  
      const availableMoves = findAvailableMoves(this.unit, this.freshMoves);
  
      reachableSquares.forEach((square) => {
        if ((currentSquare.equalTo(square) && counter == 0) || 
            (openedSquares.doesNotInclude(square) && closedSquares.doesNotInclude(square))) {
  
          openedSquares.addSquare(square);
  
          if (currentSquare.currentPathCost < square.currentPathCost) {
  
            square.pathVia = currentSquare;
            square.currentPathCost = currentSquare.currentPathCost + availableMoves;
          }
        }
      });
  
      counter++;
      this.freshMoves = true;
    }
  };

  public getReachableSquares(squares: Square[], unit: Unit, currentSquare: Square, freshMoves: boolean, finishSquare: Square): AStarSquare[] {
    const params: ReachableSquaresParams = {
      squares: squares,
      unit: unit,
      startSquare: currentSquare,
      freshMoves: freshMoves,
      finishSquare: finishSquare,
      allSquaresAreDestinations: false
    }
    
    const neighbourCoordinates: ReachableSquaresResult[] = ReachableSquares.run(params)
  
    return neighbourCoordinates.map((coordinates) => { 
      const square = this.squares.findSquare(coordinates.x, coordinates.y);
      square.moveToCost = coordinates.moveToCost
      return square;
    });
  };

  private resolvePath(square: AStarSquare): Coords[] {
    const path: Coords[] = [];
    let currentSquare = square;
  
    while (currentSquare !== null) {
      path.unshift({
        x: currentSquare.x,
        y: currentSquare.y
      });
  
      currentSquare = currentSquare.pathVia;
    }
  
    return path;
  }
}
