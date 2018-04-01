import Square from "./models/square";
import Unit from "./models/unit";
import Structure from "./models/structure";

export default class UserInterface {
  public tileHeight: number;
  public tileWidth: number;
  public offset: Coords;
  public tileMousePosition: Coords;
  public selection: {
    square: Square;
    unit: Unit;
    structure: Structure;
  };
  public currentPath: Coords[];
  public size: number;
  public ongoingTurnTransition: boolean;
  public ready: boolean;
  public reachableSquares: Square[];

  public constructor() {
    this.tileHeight = 40;
    this.tileWidth = 80;
    this.offset = { x: 0, y: 0 };
    this.tileMousePosition = { x: 0, y: 0 };
    this.selection = {
      square: null,
      unit: null,
      structure: null
    };
    this.currentPath = null;
    this.size = null;
    this.ongoingTurnTransition = false;
    this.ready = false;
    this.reachableSquares = null;    
  };

  public clearAllSelection(): void {
    this.selection = {
      square: null,
      unit: null,
      structure: null
    };
  
    this.currentPath = null;
    this.reachableSquares = null;    
  };
}