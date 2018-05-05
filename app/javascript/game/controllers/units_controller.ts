import UserInterface        from "./../user_interface";
import GameData             from "./../game_data";
import NetworkController    from "./network_controller";
import ReachableSquares     from "./../services/a_star/calculations/reachable_squares";
import Square from "../models/square";
import Unit from "../models/unit";

// The purpose of this controller is the gather the relevant information the the UI state and
// from the game data to construct the appropriate instructions for the network controller and
// eventually the animations controller when client-side unit-move "prediction" is implemented
export default class UnitsController {
  public UI: UserInterface;
  public gameData: GameData;
  public networkController: NetworkController;
  public destinationSquare: Square;

  constructor(UI: UserInterface, gameData: GameData, networkController: NetworkController) {
    this.UI = UI;
    this.gameData = gameData;
    this.networkController = networkController;    
  };

  public move(): void {
    if (this.UI.currentPath.length > 1) { 
      this.destinationSquare = this.gameData.findSquare(this.UI.currentPath[this.UI.currentPath.length - 1]);
      this.determineAndSendUnitCommand();
  
      this.UI.selection.structure = null;
      this.UI.selection.square = null;
      this.UI.selection.unit = null;
      this.UI.currentPath = null;
      this.UI.reachableSquares= null;
    }  
  };

  public determineAndSendUnitCommand(): void {
    if (this.allowedToMerge()) {
      this.pieceMerge();
    } else {
      this.pieceMove();
    }
  };

  public pieceMove(): void {
    this.networkController.pieceMove({
      unit: this.UI.selection.unit.id,
      path: this.UI.currentPath,
    });  
  };

  public pieceMerge(): void {
    this.networkController.pieceMerge({
      unit: this.UI.selection.unit.id,
      path: this.UI.currentPath,
    });  
  };

  public destinationIsImmediatelyReachable(): boolean {
    const reachableSquares = ReachableSquares.run({
      squares: this.gameData.squares,
      unit: this.UI.selection.unit,
      startSquare: this.UI.selection.square,
      allSquaresAreDestinations: true,
      finishSquare: null,
      freshMoves: false
    });

    return reachableSquares.map((coordinates: any) => this.gameData.findSquare(coordinates)).includes(this.destinationSquare);
  };
  
  public allowedToMerge(): boolean {
    return this.destinationIsImmediatelyReachable() && 
    this.destinationSquare.hasMilitaryUnit() &&
    this.areOwnedBySamePlayer(this.destinationSquare.getMilitaryUnit(), this.UI.selection.unit) &&
    this.areTheSameUnit(this.destinationSquare.getMilitaryUnit(), this.UI.selection.unit);
  };

  public areOwnedBySamePlayer(firstUnit: Unit, secondUnit: Unit): boolean {
    return firstUnit.player_number === secondUnit.player_number;
  };

  public areTheSameUnit(firstUnit: Unit, secondUnit: Unit): boolean {
    return firstUnit.type === secondUnit.type;
  };

  public order(): void {
  
  };
}


