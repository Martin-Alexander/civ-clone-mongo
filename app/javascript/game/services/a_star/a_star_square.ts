import Square from "../../models/square";
import Rules from "../../rules";
import Unit from "../../models/unit";
import { StructureType } from "../../../enums/modules"

export default class AStarSquare {
  readonly x: number;
  readonly y: number;
  readonly isDestinationSquare: boolean;

  public pathVia: AStarSquare;
  public gameSquare: Square;
  public moveToCost: number;
  public currentPathCost: number;
  
  static infinity(): number {
    return 9007199254740992;
  }

  constructor(gameSquare: Square, isDestinationSquare: boolean = false) {
    this.x                   = gameSquare.x;
    this.y                   = gameSquare.y;
    this.pathVia             = null;
    this.gameSquare          = gameSquare;
    this.moveToCost          = null;
    this.currentPathCost     = AStarSquare.infinity();
    this.isDestinationSquare = isDestinationSquare  
  };

  public estimatedTotalCost(destinationSquare: AStarSquare): number {
    return this.currentPathCost + (this.distanceToSquare(destinationSquare) * Rules.rulesJSON.move_cost_of_roads);
  };

  // public estimatedTotalHopCost = function(destinationSquare: AStarSquare): number {
  //   return this.currentPathCost + (this.distanceToSquare(destinationSquare) / 4);
  // };

  // // Recursive function that finds the ultimate gameSquare that a AStarSquare is suposed to point to
  // // I'm a bad programmer, I know...
  // AStarSquare.prototype.findGameSquare = function(square) {
  //   if (square.constructor.name === "AStarSquare") {
  //     return this.findGameSquare(square.gameSquare);
  //   } else {
  //     return square;
  //   }
  // }

  // Returns whether or not a given square is a valid pathfinding destination
  // For now it will just be a matter of terrain until non-move pathfinding is implemented (i.e., attcking and merging)
  public isUnsuitableForPathfinding(unit: Unit): boolean {
    return !Rules.passableTerrain(unit, this.gameSquare) || !this.isFreeOfUnitsOrIsTheDestinationSquare(unit);
  };

  public isFreeOfUnitsOrIsTheDestinationSquare(movingUnit: Unit): boolean {
    // return this.gameSquare.units.length === 0 || this.isDestinationSquare;
    return this.isFreeOfEnemenyUnits(movingUnit) || this.isDestinationSquare;
  };

  public isFreeOfEnemenyUnits(movingUnit: Unit): boolean {
    return this.gameSquare.isFreeOfEnemyUnits(movingUnit);
  }

  public isEmpty(): boolean {
    return this.gameSquare.isEmpty();
  }

  // Returns whether or not a given square has the same coordinates
  // Workds with any object that has an `x` and `y` property
  public equalTo(otherSquare: AStarSquare): boolean {
    return this.x === otherSquare.x && this.y === otherSquare.y;
  };

  // Computes and returns the move cost of a given unit moving from a given to square to this square
  public moveCost(unit: Unit, fromSquare: AStarSquare): number {
    // "Moving" to same square you're on costs all your movement points
    if (fromSquare.equalTo(this)) {
      return unit.moves;
  
    // You cannot move to an unreachable square
    } else if (this.isUnsuitableForPathfinding(unit)) {
      return AStarSquare.infinity();
  
    // Is connected to the from square by a road
    } else if (this.isConnectedToByARoad(fromSquare)) {
      return Rules.rulesJSON.move_cost_of_roads;
  
    } else {
      return Rules.rulesJSON.terrain[this.gameSquare.terrain].move_cost;
    }
  };

  // Calculates the Euclidian distance between two squares
  public distanceToSquare(square: AStarSquare): number {
    return Math.abs(this.x - square.x) + Math.abs(this.y - square.y);
  };

  // Returns whether or not the given square is unreachable
  // Returns false negatives
  // REPLACED WITH `AStarSquare.prototype.isUnsuitableForPathfinding`
  // AStarSquare.prototype.isUnreachable = function() {
  //   return(
  //     this.gameSquare.terrain === "mountains" ||
  //     this.gameSquare.terrain === "water" ||
  //     this.gameSquare.units.length !== 0
  //   );
  // }

  // Returns whether or no two square are connected by a road
  public isConnectedToByARoad(otherSquare: AStarSquare): boolean {
    return this.gameSquare.hasCompletedStructure(StructureType.road) && otherSquare.gameSquare.hasCompletedStructure(StructureType.road)
  };
};
