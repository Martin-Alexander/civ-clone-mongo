import Square from "./square";
import UserInterface from "./../user_interface";
import { StructureType } from "./../../enums/modules";
import GameData from "../game_data";

export default class Structure {
  readonly id: string;
  readonly type: StructureType;
  readonly square: Square;
  readonly game: GameData;
  readonly player_number: number;

  public complete: boolean;
  public construction_level: number;
  public size: number;
  public production: UnitType;

  constructor(rawStructureData: RawStructureData, square: Square) {
    this.square = square;
    this.game = square.game;
    this.id = rawStructureData.id;
    this.complete = rawStructureData.complete;
    this.construction_level = rawStructureData.construction_level;
    this.player_number = rawStructureData.player_number;
    this.type = rawStructureData.type;
    this.size = rawStructureData.size;
    this.production = rawStructureData.production;
  };
  
  // This is all going away when artwork is done, so I'm not going to bother making it look nice
  public render(context: CanvasRenderingContext2D, UI: UserInterface): void {
    if (this.type === StructureType.city) {
      context.beginPath();
      context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 3, UI.tileHeight / 3, 0, Math.PI * 1.25, Math.PI * 0.25);
      context.fillStyle = this.typeColor();
      context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 3, UI.tileHeight / 3, 0, Math.PI * 0.25, Math.PI * 1.25);
      context.fillStyle = this.typeColor();
      context.fill();
    } else if (this.type === StructureType.road) {
      // El Atrocidad

      if (this.game.findSquare(this.square.x - 1, this.square.y - 1).hasStructure(StructureType.road)) {
        this.drawRoad("north", context, UI);
      }

      if (this.game.findSquare(this.square.x, this.square.y - 1).hasStructure(StructureType.road)) {
        this.drawRoad("north-east", context, UI);
      }

      if (this.game.findSquare(this.square.x + 1, this.square.y - 1).hasStructure(StructureType.road)) {
        this.drawRoad("east", context, UI);
      }
      
      if (this.game.findSquare(this.square.x + 1, this.square.y).hasStructure(StructureType.road)) {
        this.drawRoad("south-east", context, UI);
      }

      if (this.game.findSquare(this.square.x + 1, this.square.y + 1).hasStructure(StructureType.road)) {
        this.drawRoad("south", context, UI);
      }
      
      if (this.game.findSquare(this.square.x, this.square.y + 1).hasStructure(StructureType.road)) {
        this.drawRoad("south-west", context, UI);
      }
      
      if (this.game.findSquare(this.square.x - 1, this.square.y + 1).hasStructure(StructureType.road)) {
        this.drawRoad("west", context, UI);
      }

      if (this.game.findSquare(this.square.x - 1, this.square.y).hasStructure(StructureType.road)) {
        this.drawRoad("north-west", context, UI);
      }

    } else {
      context.beginPath();
      context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 3, UI.tileHeight / 3, 0, Math.PI * 1.25, Math.PI * 0.25);
      context.fillStyle = this.typeColor();
      context.fill();
      context.beginPath();
      context.ellipse(0, UI.tileHeight / 2, UI.tileWidth / 3, UI.tileHeight / 3, 0, Math.PI * 0.25, Math.PI * 1.25);
      context.fillStyle = this.playerColor();
      context.fill();
    }
  };

  private drawRoad(direction: string, context: CanvasRenderingContext2D, UI: UserInterface): void {
    context.beginPath();
    context.moveTo(0, UI.tileHeight / 2);
    switch (direction) {
      case "north-west": {
        context.lineTo(UI.tileWidth / -4, UI.tileHeight / 4);
        break;
      }
      case "west": {
        context.lineTo(UI.tileWidth / -2, UI.tileHeight / 2);
        break;
      }
      case "south-west": {
        context.lineTo(UI.tileWidth / -4, UI.tileHeight * 3 / 4);
        break;
      }
      case "south": {
        context.lineTo(0, UI.tileHeight);
        break;
      }
      case "south-east": {
        context.lineTo(UI.tileWidth / 4, UI.tileHeight * 3 / 4);
        break;
      }
      case "east": {
        context.lineTo(UI.tileWidth / 2, UI.tileHeight / 2);
        break;
      }
      case "north-east": {
        context.lineTo(UI.tileWidth / 4, UI.tileHeight / 4);
        break;

      }
      case "north": {
        context.lineTo(0, 0);
        break;
      }
    }
    context.strokeStyle = "#42240f";
    context.lineWidth = UI.tileHeight / 20;
    context.stroke();
  }

  // This is all going away when artwork is done, so I'm not going to bother making it look nice
  public renderLabel(square: Square, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, UI: UserInterface) {
    if (this.type === StructureType.city) {
      context.save();
      context.translate(
        (square.x - square.y) * (UI.tileWidth / 2) + (canvas.width / 2) + UI.offset.x, 
        ((square.y + square.x) * UI.tileHeight / 2) + UI.offset.y + ((canvas.height - 15 * UI.tileHeight) / 2)
      );
      context.font = `${(UI.tileHeight / 2)}px sans-serif`;
      context.fillStyle = this.playerColor();
      context.fillText(`${this.size}`, -(UI.tileHeight / 9), UI.tileHeight);
      context.restore();
    }
  };

  private typeColor(): string {
    const structureTypeColorLookup: { [key: string]: string } = {
      road: "#bf743f",
      fortress: "#3a3a3a",
      farm: "#627221",
      city: "#80a09f"
    }
  
    return structureTypeColorLookup[this.type];
  };

  private playerColor(): string {
    const structurePlayerColorLookup: { [key: number]: string } = {
      1: "red",
      2: "blue",
      3: "pink",
      4: "purple",
      5: "orange"
    };
  
    return structurePlayerColorLookup[this.player_number];
  };
}
