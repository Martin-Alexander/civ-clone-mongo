import AStarSquare               from "./../a_star_square";
import BoardMethods              from "./../board_methods";
import AStarSquareCollection     from "./../a_star_square_collection";
import { findAvailableMoves }    from "./../find_available_moves";
import Unit from "../../../models/unit";
import Square from "../../../models/square";

interface ReachableSquaresParams {
  squares: Square[];
  finishSquare: Square;
  startSquare: Square;
  allSquaresAreDestinations: boolean;
  freshMoves: boolean;
  unit: Unit;
}

interface ReachableSquaresResult {
  x: number;
  y: number;
  moveToCost: number;
}

// The purpose is, for a given unit and square, return all the squares that it is capable of
// reaching in a single turn
export default class ReachableSquares extends BoardMethods {
  readonly unit: Unit;
  readonly squares: AStarSquareCollection;
  readonly startSquare: AStarSquare;
  readonly freshMoves: boolean;

  constructor(squares: AStarSquareCollection, unit: Unit, startSquare: Square, freshMoves: boolean) {
    super();

    this.unit = unit;
    this.startSquare = new AStarSquare(startSquare);
    this.squares = squares;
    this.freshMoves = freshMoves;
  };

  // ReachableSquares is used by calling the method `run` which takes in an array of game squares,
  // converts them into a grid of AStarSquares, and returns all reachable squares of a given unit
  // squares :gameData.squares, unit :unit, startSquare :aStarSquare, freshMoves :bool, finishSquare :bool, allSquaresAreDestinations :bool
  static run(params: ReachableSquaresParams) {
    const aStarSquares = AStarSquareCollection.generateFromGameSquares(params.squares, params.finishSquare, params.allSquaresAreDestinations);
    return new ReachableSquares(aStarSquares, params.unit, params.startSquare, params.freshMoves).find();
  };
  
  public find(): ReachableSquaresResult[] {
    // The heavy lifting happens here
    // Similar to the plain AStar function, we store to-be explored squares in `opennedSquares`...
    const openedSquares    = new AStarSquareCollection([this.startSquare]);
  
    // ...and already explored squares in closed squares
    const closedSquares    = new AStarSquareCollection();
  
    // This stores all squares that are reachable and is the ultimate product of this function
    const reachableSquares = new AStarSquareCollection();
  
    // Calculates how many moves the unit has for this algorithm to spend looking for reachable
    // squares
    const availableMoves   = findAvailableMoves(this.unit, this.freshMoves)
  
    this.startSquare.currentPathCost = 0;
  
    while (openedSquares.stillHasSquaresLeft()) {
      // There is not sorting in this case, because there is not destination square and so no need
  
      const currentSquare = openedSquares.getNewCurrentSquare();
      closedSquares.addSquare(currentSquare);
  
      const neighbours = this.getNeighboursOf(currentSquare);
  
      neighbours.forEach((neighbour) => {
        // Proceed if the "neighbouring" square is the current square
        // Or if 1) this square is better than the best alternative, and 2) the unit has enough moves
        // to reach it
        if (currentSquare.equalTo(neighbour) ||
            (neighbour.moveCost(this.unit, currentSquare) + currentSquare.currentPathCost < neighbour.currentPathCost
            && neighbour.moveCost(this.unit, currentSquare) + currentSquare.currentPathCost <= availableMoves)) {
  
          if (openedSquares.doesNotInclude(neighbour) && closedSquares.doesNotInclude(neighbour)) {
            openedSquares.addSquare(neighbour);
          }
  
          // Record how many moves it takes to reach this square
          neighbour.currentPathCost = neighbour.moveCost(this.unit, currentSquare) + currentSquare.currentPathCost;
  
          // And add it to the set of reachable squares
          reachableSquares.addSquare(neighbour); 
        }
      });
    }

    // Once all reachable squares have been explored transform 
    return this.transformToCoordinates(reachableSquares);
  }

  private getNeighboursOf(currentSquare: AStarSquare): AStarSquare[] {
    return this.neighboursAndCurrentSquare(currentSquare)
  };

  // Transforms each square in the set of reachable squares to just its coordinates and the cost of
  // reaching it
  private transformToCoordinates(squares: AStarSquare[]): ReachableSquaresResult[] {
    return squares.map(square => ({ x: square.x, y: square.y, moveToCost: square.currentPathCost }));
  };
}
