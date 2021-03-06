import Square from "./../models/square";
import GameData from "./../game_data";
import UserInterface from "./../user_interface";
import ReactController from "./react_controller";
import AnimationData from "../models/animation_data";
import InputController from "./input_controller";

export default class GameDataController {
  readonly gameData: GameData;
  readonly UI: UserInterface;
  readonly reactController: ReactController;

  public inputController: InputController;

  constructor(gameData: GameData, UI: UserInterface, reactController: ReactController) {
    this.gameData = gameData;
    this.UI = UI;
    this.reactController = reactController;
  };
  
  public pieceMove(data: any, animationCallback: ((data: AnimationData, callback: animationCallbackFunction) => void)): boolean {
    if (!data.success) { return false; }
  
    this.replaceSquare(data.new_squares[0])
    if (data.new_squares[1]) {
      animationCallback(data, () => {
        this.replaceSquare(data.new_squares[1]);
        // const newSquare = this.replaceSquare(data.new_squares[1]);
        // const movedUnit = new Unit(data.moved_unit, newSquare);
        // if (movedUnit.moves > 0) { this.inputController.selectSquare(newSquare); }
      });
    }

    return true;
  };

  public updatePlayersReady(playerReadyInformation: PlayerReadyInformation[]): void {
    this.gameData.updatePlayersReady(playerReadyInformation);
    this.reactController.updateGameData();
  };

  public giveOrder(newSquare: Square): void {
    this.replaceSquare(newSquare);
    this.updateSelectedSquare();
  };

  public replaceSquare(square: Square): Square {
    const newSquare = new Square(square, this.gameData);
    this.gameData.replaceSquare(newSquare);
  
    return newSquare;
  };

  public newGameData(rawGameData: RawGameData) {
    this.gameData.newGameData(rawGameData);
    this.updateSelectedSquare();
    this.UI.ongoingTurnTransition = false;
    this.reactController.updateGameData();
  };

  public updateSelectedSquare(newSelectionSquare?: Square) {
    if (this.UI.selection.square || (newSelectionSquare && newSelectionSquare.units[0].moves > 0)) {
  
      if (typeof newSelectionSquare !== "undefined") {
        this.UI.selection.square = newSelectionSquare;
      } else {
        this.UI.selection.square = this.gameData.square(this.UI.selection.square);
      }
  
      this.UI.selection.unit = this.UI.selection.square.units[0];
      this.reactController.updateUI();
    }
  };
}
