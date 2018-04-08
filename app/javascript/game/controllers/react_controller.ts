import UserInterface from "./../user_interface";
import GameData from "./../game_data";
import NetworkController from "./network_controller";

interface Window {
  updateUI(UI: UserInterface): void;
  updateGameData(gameData: GameData): void;
}

declare const global: Window;

export default class ReactController {
  readonly UI: UserInterface;
  readonly gameData: GameData;
  readonly networkController: NetworkController;

  constructor(UI: UserInterface, gameData: GameData, networkController?: NetworkController) {
    this.UI = UI;
    this.gameData = gameData;
    // this.networkController = networkController;
  };

  public updateUI():void {
    global.updateUI(this.UI);
  };

  public updateGameData(): void {
    global.updateGameData(this.gameData);
  };

  // public leaveGame():void {
    // this.networkController.leaveGame();
  // };
}
