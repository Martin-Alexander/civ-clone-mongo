import Square from "../models/square";
import Unit from "../models/unit";

export default interface ReachableSquaresParams {
  squares: Square[];
  finishSquare: Square;
  startSquare: Square;
  allSquaresAreDestinations: boolean;
  freshMoves: boolean;
  unit: Unit;
}