import AStarSquare from "./a_star_square";
import Square from "../../models/square";

type DifferenceFunction = (a: AStarSquare, b: AStarSquare) => number;

// Represents a collection of AStarSquares
export default class AStarSquareCollection extends Array<AStarSquare> {
  readonly size: number;

  constructor(...args) {
    super(...args);

    this.size = Math.sqrt(this.length) - 1;
  };

  static generateFromGameSquares(gameSquares: Square[], finishSquare?: Square, allSquaresAreDestinations: boolean = false): AStarSquareCollection {
    const aStarSquares: AStarSquare[] = gameSquares.map((square): AStarSquare => {
      return new AStarSquare(square, ((finishSquare && finishSquare.equalTo(square)) || allSquaresAreDestinations));
    });

    return new AStarSquareCollection(aStarSquares);
  };
  
  // Similar to Ruby's Array#include? method
  public includes(square: AStarSquare): boolean {
    for(let i = 0; i < this.length; i++) {
      // if (square.equalTo(this[i])) return true;
    }
  
    return false;
  };

  // Sorts AStarSquares based on the AStar huristic of euclidian distance and current path cost
  huristicSort(endSquare: AStarSquare): void {
    this.baseSort(endSquare, (a, b) => {
      return a.estimatedTotalCost(endSquare) - b.estimatedTotalCost(endSquare);
    });
  }

  // // Sorts AStarSquares based soley on thier current path cost
  // AStarSquareCollection.prototype.moveCostSort = function() {
  //   this._baseSort(endSquare, (a, b) => {
  //     return a.currentPathCost - b.currentPathCost;
  //   });
  // }
  
  // AStarSquareCollection.prototype.hopHuristicSort = function(endSquare) {
  //   this._baseSort(endSquare, (a, b) => {
  //     return a.estimatedTotalHopCost(endSquare) - b.estimatedTotalHopCost(endSquare);
  //   });
  // }
  
  // AStarSquareCollection.prototype.pureHuristicSort = function(endSquare) {
  //   this._baseSort(endSquare, (a, b) => {
  //     return a.distanceToSquare(endSquare) - b.distanceToSquare(endSquare);
  //   });  
  // }
  
  // Sorts AStarSquares by a given difference function
  private baseSort(endSquare: AStarSquare, differenceFunction: DifferenceFunction): void {
    this.sort((a, b) => {
      const difference = differenceFunction(a, b);
      if (difference > 0) {
        return 1;
      } else if (difference < 0) {
        return -1;
      } else {
        return 0;
      }
    });
  };
  
  // AStarSquareCollection.prototype.turnMoveHuristicSort = function(endSquare) {
  //   this.sort((a, b) => {
  //     const difference = a.estimatedTotalCost(endSquare) - b.estimatedTotalCost(endSquare);
  //     if (difference > 0) {
  //       return 1;
  //     } else if (difference < 0) {
  //       return -1;
  //     } else if (difference == 0) {
  //       const moveCostDifference = a.moveToCost - b.moveToCost;
  //       if (moveCostDifference > 0) {
  //         return 1;
  //       } else if (moveCostDifference < 0) {
  //         return -1;
  //       } else {
  //         return 0;
  //       }
  //       return 0;
  //     }
  //   });
  // }

  // Performs a lookup based on AStarSquare coordinates
  // Should only be used when a AStarSquareCollection is representing an entire board
  public findSquare = function(x: number, y: number): AStarSquare {
    return this[y * (this.size + 1) + x];
  };

  // Adds a square to the collection
  public addSquare = function(square: AStarSquare): void {
    this.push(square);
  };

  // Returns the first square in the collection and removes it
  public getNewCurrentSquare(): AStarSquare {
    const newCurrentSquare = this[0];
    this.splice(0, 1);
  
    return newCurrentSquare;
  };
  
  // Returns whether or not the collection is emply
  public stillHasSquaresLeft(): boolean {
    return this.length > 0;
  };

  // // The inverserve of AStarSquareCollection.prototype.includes
  public doesNotInclude(square: AStarSquare): boolean {
    return !this.includes(square);
  };
}
