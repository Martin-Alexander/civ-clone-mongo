import Square from "./../models/square";
import MoveAnimation from "./../models/move_animation";
import GameRenderer from "../views/game_renderer";
import AnimationData from "../models/animation_data";

export default class AnimationController {
  readonly renderer: GameRenderer;
  
  constructor(renderer: GameRenderer) {
    this.renderer = renderer;
  };

  public pieceMove(data: any, callback: (() => any)): boolean {
    if (data.path.length < 2) { return false; }

    const fromSquare = new Square(data.new_squares[0]);
    const toSquare = new Square(data.new_squares[1]);

    const animationData = new AnimationData({
        unit: toSquare.units[0],
        path: data.path,
        index: 0,
        animationController: this
      });

    this.renderer.addAnimation(new MoveAnimation(animationData, callback));

    return true;
  };

  public loadNextPieceMoveAnimation(animationData: AnimationData, callback: (() => any)): void {
    if (animationData.index < animationData.path.length - 2) {
      animationData.index += 1;
      this.renderer.addAnimation(new MoveAnimation(animationData, callback));
    } else {
      callback();
    }
  }
};
