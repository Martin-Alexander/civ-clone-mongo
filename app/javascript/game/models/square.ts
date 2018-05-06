import Unit from "./unit";
import Structure from "./structure";
import UserInterface from "./../user_interface";
import { UnitType } from "./../../enums/modules"


export default class Square {
  readonly id: string;
  readonly terrain: TerrainType;
  readonly type: string;
  readonly x: number;
  readonly y: number;

  public units: Unit[];
  public structures: Structure[];

  public constructor(rawSquareData: RawSquareData) {
    this.units = [];
    this.structures = []

    rawSquareData.units.forEach(unit => this.units.push(new Unit(unit, this)));
    rawSquareData.structures.forEach(unit => this.structures.push(new Structure(unit, this)));

    this.id = rawSquareData.id;
    this.terrain = rawSquareData.terrain;
    this.type = rawSquareData.type;
    this.x = rawSquareData.x;
    this.y = rawSquareData.y;
  };

  public isOwnedBy(player: any): boolean {    
    return this.units[0] && this.units[0].player_number == player.number;
  };

  public color(selectionSquare: Square): string {
    const terrainColorLookup: { [key: string]: string } = {
      grass: "#0e960c",
      plains: "#dbab0d",
      desert: "#f9f459",
      forest: "#086001",
      marsh: "#70876d",
      hill: "#a08a73",
      mountains: "#848484",
      water: "#2651d3"
    }

    if (this == selectionSquare) {
      return "white";
    } else if (this.terrain) {
      return terrainColorLookup[this.terrain];
    }
    
    return "#0e960c";
  };

  public hasCompletedStructure(type: StructureType): boolean {
    return this.structures.some(structure => structure.type === type && structure.complete)
  };

  public equalTo(otherSquare: Square | Coords): boolean {
    return this.x === otherSquare.x && this.y === otherSquare.y;
  };

  public getCoordinates(): { [key: string]: number } {
    return { x: this.x, y: this.y };
  };

  public render(context: CanvasRenderingContext2D, UI: UserInterface): void {
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(UI.tileWidth / 2, UI.tileHeight / 2);
    context.lineTo(0, UI.tileHeight);
    context.lineTo(-UI.tileWidth / 2, UI.tileHeight / 2);
    context.closePath();
    context.fillStyle = this.color(UI.selection.square);
    context.fill();
    if (UI.reachableSquares && UI.reachableSquares.includes(this)) {
      context.beginPath();
      context.moveTo(0, 0);
      context.lineTo(UI.tileWidth / 2, UI.tileHeight / 2);
      context.lineTo(0, UI.tileHeight);
      context.lineTo(-UI.tileWidth / 2, UI.tileHeight / 2);
      context.closePath();
      context.fillStyle = "rgba(255, 255, 255, 0.8)";
      context.fill();
    }

    // If there are more than one unit in this square draw the multiple unit indicator
    if (this.units.length > 1) { this.renderUnitStackIndicator(context, UI); }
  };

  public renderUnitStackIndicator(context: CanvasRenderingContext2D, UI: UserInterface): void {
    const yOffset = UI.tileHeight / 15;
    const xOffset = 0;
    context.beginPath();
    context.ellipse(0 + xOffset, UI.tileHeight / 2 + yOffset, UI.tileWidth / 4, UI.tileHeight / 4,
      0, Math.PI * 0, Math.PI * 2);
    context.fillStyle = "grey";
    context.fill();
  }

  public hasStructure(structureName: StructureType): boolean {
    return this.structures.some(structure => structure.type === structureName);
  };

  // Assumes that only one structure of each type exists in a given square
  public getStructure(structureName: StructureType): any {
    return this.structures.find(structure => structure.type === structureName);
  };

  public getMilitaryUnit(): Unit | undefined {
    return this.units.find(unit => unit.type !== UnitType.worker);
  };

  public getCivilianUnit(): Unit | undefined {
    return this.units.find(unit => unit.type === UnitType.worker);
  };

  public hasMilitaryUnit(): boolean {
    return this.units.some(unit => unit.type !== UnitType.worker);
  };

  public hasCivilianUnit(): boolean {
    return this.units.some(unit => unit.type === UnitType.worker);
  };

  public isFreeOfEnemyUnits(movingUnit: Unit): boolean {
    return this.units.every((unit: Unit): boolean => {
      return unit.player_number === movingUnit.player_number;
    });
  };

  public isEmpty(): boolean {
    return this.units.length === 0;
  }
}
