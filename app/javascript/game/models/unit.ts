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
    const unitPlayerColorLookup: { [key: number]: string } = {
      1: "red",
      2: "blue",
      3: "pink",
      4: "purple",
      5: "orange"
    };

    return unitPlayerColorLookup[this.player_number]
  };

  private typeColor(): string {
    const unitTypeColorLookup: { [key: string]: string } = {
      worker: "#47220c",
      infantry: "#020366",
      tank: "#053d05",
      ship: "#5b5b5b"
    };

    return unitTypeColorLookup[this.type];
  };
  
  drawStrength(context: CanvasRenderingContext2D, UI: UserInterface): void | boolean {
    if (this.type === UnitType.worker) return false;
    context.font = `${(UI.tileHeight / 2)}px sans-serif`;
    context.fillStyle = "white";
    context.fillText(`${this.strength}`, -(UI.tileHeight / 7), UI.tileHeight * 0.65);
  };
}