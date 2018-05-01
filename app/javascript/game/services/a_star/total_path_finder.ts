import AStar from "./calculations/a_star";
import GameData from "../../game_data";
import Unit from "../../models/unit";

export default class TotalPathFinder {
  readonly gameData: GameData;
  readonly unit: Unit;
  readonly coordinatePath: Coords[];

  constructor(gameData: GameData, unit: Unit, coordinatePath: Coords[]) {
    this.gameData       = gameData;
    this.unit           = unit;
    this.coordinatePath = coordinatePath;
  };

  public static run(gameData: GameData, unit: Unit, coordinatePath: Coords[]): Coords[] {
    return new TotalPathFinder(gameData, unit, coordinatePath).find();
  };

  public find(): Coords[] {
    const moves = this.splitCoordinatesIntoSqaurePairs();
    
    return this.buildFinalMovePath(moves);
  }
    
  private buildFinalMovePath(moves) {
    const movePaths = [];
    
    
    moves.forEach((move, index) => {
      const startSquare = this.gameData.findSquare(move.coordinates.start);
      const finishSquare = this.gameData.findSquare(move.coordinates.finish);
      
      const path = new AStar(this.gameData.squares, this.unit, startSquare, finishSquare).find();
    
      path[path.length - 1].moveNumber = move.moveNumber;
      
      if (index === 0) {
        movePaths.push(path);
      } else {
        movePaths.push(path.slice(1));
      }
    });
    
    return this.flatten(movePaths);
  };

  private flatten(array: any[]): any[] {
    const flattenedArray = [];
    
    array.forEach(element => element.forEach(subElement => flattenedArray.push(subElement)));
    
    return flattenedArray;
  };
  
  private splitCoordinatesIntoSqaurePairs(): any[] {
    const collector: any = [];
  
    this.coordinatePath.forEach((coordinate, index): boolean => {
      if (this.coordinatePath[index + 1] === undefined) { return false; }
  
      let moveIndexModifier = 1;
  
      if (this.unit.moves === 0) { moveIndexModifier = 2; }
      
      collector.push(
        {
          coordinates: {
            start: coordinate,
            finish: this.coordinatePath[index + 1]
          },
          moveNumber: index + moveIndexModifier
        }
      );

      return true;
    });
  
    return collector;
  }
}
