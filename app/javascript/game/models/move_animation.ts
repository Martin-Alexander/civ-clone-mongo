import Square from "./square";
import Unit from "./unit";
import AnimationController from "../controllers/animation_controller";
import UserInterface from "../user_interface";

export default class MoveAnimation {
  readonly animationData: any;
  readonly callback: (() => any);
  readonly fromSquare: Square;
  readonly toSquare: Square;
  readonly unit: Unit;
  readonly animationController: AnimationController;
  readonly xDirection: number;
  readonly yDirection: number;
  
  private counter: number;
  private done: boolean;

  constructor(animationData: any, callback: (() => any)) {
    this.animationData = animationData;
    this.callback = callback;
    this.fromSquare = animationData.path[animationData.index];
    this.toSquare = animationData.path[animationData.index + 1];
    this.counter = 0;
    this.unit = animationData.unit;
    this.animationController = animationData.animationController;
    this.done = false;

    if (this.fromSquare.x > this.toSquare.x && this.fromSquare.y == this.toSquare.y) {
      this.xDirection = -1; this.yDirection = -1;
    } else if (this.fromSquare.x < this.toSquare.x && this.fromSquare.y == this.toSquare.y) {
      this.xDirection = 1; this.yDirection = 1;
    } else if (this.fromSquare.y > this.toSquare.y && this.fromSquare.x == this.toSquare.x) {
      this.xDirection = 1; this.yDirection = -1;
    } else if (this.fromSquare.y < this.toSquare.y && this.fromSquare.x == this.toSquare.x) {
      this.xDirection = -1; this.yDirection = 1;
    } else if (this.fromSquare.y > this.toSquare.y && this.fromSquare.x > this.toSquare.x) {
      this.xDirection = 0; this.yDirection = -2;
    } else if (this.fromSquare.y > this.toSquare.y && this.fromSquare.x < this.toSquare.x) {
      this.xDirection = 2; this.yDirection = 0;
    } else if (this.fromSquare.y < this.toSquare.y && this.fromSquare.x > this.toSquare.x) {
      this.xDirection = -2; this.yDirection = 0;
    } else if (this.fromSquare.y < this.toSquare.y && this.fromSquare.x < this.toSquare.x) {
      this.xDirection = 0; this.yDirection = 2;
    }    
  };

  public draw(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, UI: UserInterface): void {
    context.save();
    context.translate(
      (this.fromSquare.x - this.fromSquare.y) * (UI.tileWidth / 2) + (canvas.width / 2) + UI.offset.x, 
      ((this.fromSquare.y + this.fromSquare.x) * UI.tileHeight / 2) + UI.offset.y + ((canvas.height - 15 * UI.tileHeight) / 2)
    );
    context.translate(this.counter * this.xDirection, (this.counter * this.yDirection) / 2);
    this.unit.render(context, UI);
    context.restore();
    // Rather than a dynamic move animation speed based on total move distance
    // this.counter += this.animationData.path.length * (UI.tileHeight / 10);
    // Use a fixed speed
    this.counter += 5 * (UI.tileHeight / 10);
    if (this.counter >= UI.tileHeight) { 
      this.animationController.loadNextPieceMoveAnimation(this.animationData, this.callback);
      this.done = true;
    }
  };
};
