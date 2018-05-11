import Square from "./../models/square";
import MoveAnimation from "./../models/move_animation";
import GameRenderer from "../views/game_renderer";
import AnimationData from "../models/animation_data";
import Unit from "../models/unit";
import GameData from "../game_data";

export default class AnimationController {
  readonly renderer: GameRenderer;
  readonly gameData: GameData;
  
  constructor(renderer: GameRenderer, gameData: GameData) {
    this.gameData = gameData;
    this.renderer = renderer;
  };

  public pieceMove(data: any, callback: animationCallbackFunction): boolean {
    if (data.path.length < 2) { return false; }

    const fromSquare = new Square(data.new_squares[0], this.gameData);
    // const toSquare = new Square(data.new_squares[1]);

    const animationData = new AnimationData({
        unit: new Unit(data.moved_unit, fromSquare),
        path: data.path,
        index: 0,
        animationController: this
      });

    this.renderer.addAnimation(new MoveAnimation(animationData, callback));

    return true;
  };

  public loadNextPieceMoveAnimation(animationData: AnimationData, callback: animationCallbackFunction): void {
    if (animationData.index < animationData.path.length - 2) {
      animationData.index += 1;
      this.renderer.addAnimation(new MoveAnimation(animationData, callback));
    } else {
      callback();
    }
  }
};
