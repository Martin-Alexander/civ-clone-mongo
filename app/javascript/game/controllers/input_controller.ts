import { ReachableSquares } from "./../services/a_star/calculations/reachable_squares";
import { PathFinder }       from "./../services/a_star/path_finder";
import { AStar }            from "./../services/a_star/calculations/a_star";
import UserInterface        from "./../user_interface";
import NetworkController    from "./network_controller";
import UnitsController      from "./units_controller";
import ReactController      from "./react_controller";
import GameData             from "../game_data";
import Square               from "../models/square";
import { StructureType }    from "./../../enums/structure_type";

export default class InputController {
  readonly UI: UserInterface;
  readonly gameData: GameData;
  readonly networkController: NetworkController;
  readonly reactController: ReactController;
  readonly unitsController: UnitsController;

  constructor(UI: UserInterface, gameData: GameData, networkController: NetworkController, reactController: ReactController, unitsController: UnitsController) {
    this.UI                   = UI;
    this.gameData             = gameData;
    this.networkController    = networkController;
    this.reactController      = reactController;
    this.unitsController      = unitsController
  };

  public setTileMousePosition(squareCoordinates: Coords): boolean {
    if (!this.authorized("setTileMousePosition")) { return false; }

    this.UI.tileMousePosition = this.gameData.square(squareCoordinates);

    this.reactController.updateUI();

    return true;
  };

  // Selecting a square and cycling through units & structures
  public selectSquare(): boolean {
    if (!this.authorized("selectSquare")) { return false; }
  
    const selectedSquare = this.squareClickedOn();
  
    // Selecting the same square twice will no longer deselected it
    if (selectedSquare.units.length > 0 || selectedSquare.hasStructure(StructureType.city)) {
      this.UI.selection.square = selectedSquare;
      this.selectUnit(selectedSquare);
      this.selectStructure(selectedSquare);
    } else {
      this.UI.selection.structure = null;
      this.UI.selection.square = null;
      this.UI.selection.unit = null;
      this.UI.reachableSquares = null;
    }
  
    this.reactController.updateUI();
    this.reactController.updateUI();

    return true;
  };

  // Console logs the square object that was clicked on
  infoClick(): void {
    console.log(this.squareClickedOn());
  };

  // Pressing the right mouse button to begin unit movement path finding
  public pathFindBegin(): boolean {
    if (!this.authorized("pathFindBegin")) { return false; }
    if (!this.UI.selection.unit) { return false; }
    if (!this.UI.selection.square.isOwnedBy(this.gameData.getCurrentPlayer())) { return false; }
  
    if (this.UI.selection.square && this.UI.selection.square.units[0]) { 
      this.drawPathLine();
    }

    return true;
  };

  // Moving the mouse while holding down the right mouse button
  public pathUpdate(): boolean {
    if (!this.authorized("pathUpdate")) { return false; }
    if (!this.UI.selection.unit) { return false; }
    if (!this.UI.selection.square.isOwnedBy(this.gameData.getCurrentPlayer())) { return false; }
  
    if (this.UI.selection.square && this.UI.currentPath) {
      this.drawPathLine();
    }

    return true;
  };

  // Releasing the right mouse button and issuing a unit move or canceling
  public moveUnit() {
    if (!this.authorized("moveUnit")) { return false; }
    if (!this.UI.selection.unit) { return false; }
    if (!this.UI.selection.square.isOwnedBy(this.gameData.getCurrentPlayer())) { return false; }
    if (this.UI.selection.square.equalTo(this.UI.tileMousePosition)) { 
      this.UI.clearAllSelection();
      return false;
    }
  
    this.unitsController.move();
  
    this.reactController.updateUI();

    return true;
  };

  public drawPathLine(): boolean {
    if (!this.authorized("drawPathLine")) { return false; }
    if (!this.UI.selection.unit) { return false; }
    if (!this.UI.selection.square.isOwnedBy(this.gameData.getCurrentPlayer())) { return false; }
  
    this.UI.currentPath = PathFinder.run(
      this.gameData,
      this.UI.selection.unit,
      this.squareClickedOn()
    );
  
    this.reactController.updateUI();

    return true;
  }
  
  // Tell server to initiate next turn
  public nextTurn():boolean {
    if (!this.authorized("nextTurn")) { return false; }
    
    // this.UI.ongoingTurnTransition = true;
    this.networkController.nextTurn();

    return true;
  };

  public giveOrder(order: OrderType): boolean {
    if (!this.authorized("giveOrder")) { return false; }
  
    this.networkController.giveOrder({
      square_coords: this.UI.selection.square.getCoordinates(),
      unit: this.UI.selection.unit.id,
      order: order
    });

    return true;
  };

  // Querries gameData for the square corresponding to the tile that the mouse is over
  public squareClickedOn(): Square {
    return this.gameData.square(this.UI.tileMousePosition.x, this.UI.tileMousePosition.y);
  };

  public setProduction(): void {
    this.networkController.setProduction(this.UI.selection.structure, this.UI.selection.square);
  };

  private functionIsAllowed = function(functionName: string, allowedFunctionRules: any): boolean {
    if (allowedFunctionRules.type === "inclusion") {
      return allowedFunctionRules.functionNames.includes(functionName);
    } else if (allowedFunctionRules.type === "exclusion") {
      return !allowedFunctionRules.functionNames.includes(functionName);
    }
  };

  private authorized(functionName: string): boolean {
    let allowedFunctionRules;
  
    if (this.UI.ongoingTurnTransition) {
      allowedFunctionRules = {
        type: "inclusion",
        functionNames: ["setTileMousePosition"]
      }
    } else if (this.UI.ready) {
      allowedFunctionRules = {
        type: "inclusion",
        functionNames: ["setTileMousePosition", "nextTurn", "selectSquare"]
      }    
    } else {
      allowedFunctionRules = {
        type: "exclusion",
        functionNames: []
      }    
    }
  
    return this.functionIsAllowed(functionName, allowedFunctionRules);
  };

  // Allows for the cycling selection of units
  private selectUnit(selectedSquare: Square): boolean {
    // Don't select unit if here aren't any units 
    if (this.UI.selection.square.units.length == 0) { 
      this.UI.selection.unit = null;
      return false; 
    }
  
    // If there's already a unit from this square selected or there's no unit selected
    if (this.UI.selection.unit && selectedSquare == this.UI.selection.square) {
      const indexOfAlreadySelectedUnit = this.UI.selection.square.units.indexOf(this.UI.selection.unit);
      if (indexOfAlreadySelectedUnit == this.UI.selection.square.units.length - 1) {
        this.UI.selection.unit = null;
        this.UI.selection.square = null;
        this.UI.reachableSquares = null;
      } else {
        this.UI.selection.unit = this.UI.selection.square.units[indexOfAlreadySelectedUnit + 1];
      }
    } else {
      this.UI.selection.unit = this.UI.selection.square.units[0];
    }
  
    if (this.UI.selection.unit) {
      this.UI.reachableSquares = this.findReachableSquares();
    }

    return true;
  };

  private selectStructure(selectedSquare: Square): void {
    if (
      selectedSquare.hasStructure(StructureType.city) && 
      selectedSquare.getStructure(StructureType.city).player_number == this.gameData.getCurrentPlayer().number &&
      selectedSquare.getStructure(StructureType.city) != this.UI.selection.structure
    ) {
      this.UI.selection.structure = selectedSquare.getStructure(StructureType.city);
    } else {
      this.UI.selection.structure = null;
      if (!this.UI.selection.unit) { this.UI.selection.square = null; }
    }
  };
  
  private findReachableSquares(): Square[] {
    const reachableSquares = ReachableSquares.run({
      squares: this.gameData.squares,
      unit: this.UI.selection.unit,
      startSquare: this.UI.selection.square
    });

    return reachableSquares.map(squareCooridinates => this.gameData.findSquare(squareCooridinates));
  };
}
