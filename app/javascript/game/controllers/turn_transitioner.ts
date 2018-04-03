import UserInterface from "../user_interface";
import ReactController from "./react_controller";

export default class TurnTransitioner {
  readonly UI: UserInterface;
  readonly reactController: ReactController;

  constructor(UI: UserInterface, reactController: ReactController) {
    this.UI = UI;
    this.reactController = reactController;
  };

  public begin(): void {
    this.UI.ongoingTurnTransition = true;
    this.UI.clearAllSelection();
    this.UI.currentPath = null;
  };

  public end(): void {
    this.UI.ongoingTurnTransition = false;
    this.UI.ready = false;
    this.UI.clearAllSelection();

    this.reactController.updateGameData();
  };

  public ready(): void {
    if (this.UI.ready) {
      this.UI.ready = false;
    } else {
      this.UI.clearAllSelection();
      this.UI.currentPath = null;
      this.UI.ready = true;
    }
  };
};
