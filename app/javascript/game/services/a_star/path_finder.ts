import TurnMoveFinder                from "./calculations/turn_move_finder";
import TotalPathFinder               from "./total_path_finder";
import GameData from "../../game_data";
import Unit from "../../models/unit";
import Square from "../../models/square";

export default class PathFinder {
  public static fun(gameData: GameData, unit: Unit, destinationSquare: Square) {
    const turnMoveCoordinates = TurnMoveFinder.run(gameData, unit, destinationSquare);
    return TotalPathFinder.run(gameData, unit, turnMoveCoordinates);
  }
}
