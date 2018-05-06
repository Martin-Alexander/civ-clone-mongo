import Square from "./square";
import UserInterface from "./../user_interface";
import { UnitType } from "./../../enums/modules";

export default class Unit {
  readonly id: string;
  readonly player_number: number;
  readonly square: Square;
  readonly type: UnitType;

  public go_to: Coords[];
  public strength: number;
  public moves: number;
  public order: OrderType;
  public state: string;

  public constructor(rawUnitData: RawUnitData, square: Square) {
    this.square = square;
    this.go_to = rawUnitData.go_to;
    this.id = rawUnitData.id;
    this.moves = rawUnitData.moves;
    this.order = rawUnitData.order;
    this.player_number = rawUnitData.player_number;
    this.state = rawUnitData.state;
    this.strength = rawUnitData.strength;
    this.type = rawUnitData.type;
  };

  public render(context: CanvasRenderingContext2D, UI: UserInterface): void {
    context.beginPath();
    context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 4, UI.tileHeight / 4,
      0, Math.PI * 0, Math.PI * 2);
    context.fillStyle = "grey";
    context.fill();
    context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 4, UI.tileHeight / 4, 0, Math.PI * 1.25, Math.PI * 0.25);
    context.fillStyle = this.playerColor();
    context.fill();
    context.beginPath();
    context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 4, UI.tileHeight / 4, 0, Math.PI * 0.25, Math.PI * 1.25);
    context.fillStyle = this.typeColor();
    context.fill();
    this.drawStrength(context, UI)
  };

  private playerColor(): string {
    const opacity = this.opacity();

    const unitPlayerColorLookup: { [key: number]: string } = {
      1: `rgba(255, 0, 0, ${opacity}`,
      2: `rgba(0, 0, 255, ${opacity}`,
      3: `rgb(255, 192, 203, ${opacity})`,
      4: `rgb(128, 0, 128, ${opacity})`,
      5: `rgb(255, 165, 0, ${opacity})`
    };

    return unitPlayerColorLookup[this.player_number]
  };

  private typeColor(): string {
    // const opacity = this.opacity();
    const opacity = 1;

    const unitTypeColorLookup: { [key: string]: string } = {
      worker: `rgb(71,34,12, ${opacity})`,
      infantry: `rgb(2,3,102, ${opacity})`,
      tank: `rgb(5,61,5, ${opacity})`,
      ship: `rgb(91,91,91, ${opacity})`
    };

    return unitTypeColorLookup[this.type];
  };

  private opacity(): string {
    if (this.moves === 0) {
      return "0.4";
    } else {
      return "1";
    }
  }
  
  drawStrength(context: CanvasRenderingContext2D, UI: UserInterface): void | boolean {
    if (this.type === UnitType.worker) return false;
    context.font = `${(UI.tileHeight / 2)}px sans-serif`;
    context.fillStyle = "white";
    context.fillText(`${this.strength}`, -(UI.tileHeight / 7), UI.tileHeight * 0.65);
  };
}
