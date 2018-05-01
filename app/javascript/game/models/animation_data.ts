import Unit from "./unit";
import AnimationController from "../controllers/animation_controller";

interface AnimationDataInitializationData {
  unit: Unit;
  path: Coords[];
  index: number;
  animationController: AnimationController;
}

export default class AnimationData {
  public unit: Unit;
  public path: Coords[];
  public index: number;
  public animationController: AnimationController;

  constructor(parameters: AnimationDataInitializationData) {
    this.unit = parameters.unit;
    this.path = parameters.path;
    this.index = parameters.index;
    this.animationController = parameters.animationController;
  }
}
