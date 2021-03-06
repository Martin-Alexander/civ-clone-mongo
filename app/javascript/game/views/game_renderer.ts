import UserInterface from "./../user_interface";
import GameData from "./../game_data";
import Square from "./../models/square";
import { StructureType } from "../../enums/modules";

export default class GameRenderer {
  readonly UI: UserInterface;
  readonly gameData: GameData;
  readonly parentElement: HTMLElement;
  
  public animations: any[];
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  constructor(UI: UserInterface, gameData: GameData, parentElement: HTMLElement) {
    this.UI = UI;
    this.gameData = gameData;
    this.parentElement = parentElement;
    this.animations = [];
    [this.canvas, this.context] = this.initializeCanvasContext();
  };

  public initialize(): void {
    const self: GameRenderer = this;
  
    window.setInterval(function() {
      self.drawAllSquares();
      self.drawAllAnimations();
      self.drawPathLine();
    }, 35);
  };
  
  public addAnimation(animation: any): void {
    this.animations.push(animation);
  };
  
  public drawAllAnimations(): void {
    this.animations.forEach(animation => animation.draw(this.canvas, this.context, this.UI));
    this.animations = this.animations.filter(animation => !animation.done);
  };

  public initializeCanvasContext(): [HTMLCanvasElement, CanvasRenderingContext2D] {
    const canvas = document.createElement("canvas");
    this.parentElement.insertAdjacentElement("beforebegin", canvas);
    this.manageCanvasSize(canvas);
    return [canvas, canvas.getContext("2d")];
  };

  public manageCanvasSize(canvas: HTMLCanvasElement): void {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    window.addEventListener("resize", () => {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
    });
  };
  
  public drawAllSquares(): void {
    const context = this.context;
    const canvas = this.canvas;
    const UI = this.UI;
  
    this.clearCanvas();

    this.gameData.squares.forEach((square) => {
      this.drawSquare(square);
    });
  
    this.gameData.squares.forEach((square) => {
      square.structures.forEach((structure) => {
        structure.renderLabel(square, canvas, context, UI);
      });
    });
  };
  
  public drawSquare(square: Square): void | false {
    if (!this.isSquareInBounds(square)) { return false; }
    
    const canvas = this.canvas;
    const context = this.context;
    const UI = this.UI;
  
    context.save();
    context.translate(
      (square.x - square.y) * (UI.tileWidth / 2) + (canvas.width / 2) + UI.offset.x, 
      ((square.y + square.x) * UI.tileHeight / 2) + UI.offset.y + ((canvas.height - 15 * UI.tileHeight) / 2)
    );
    square.render(context, UI);
    if (square.structures[0]) { 
      if (square.hasStructure(StructureType.city)) {
        square.getStructure(StructureType.city).render(context, UI);
      }

      if (square.hasStructure(StructureType.road)) {
        square.getStructure(StructureType.road).render(context, UI);
      }
    }
    if (UI.selection.square == square && UI.selection.unit)
      UI.selection.unit.render(context, UI);
    else if (square.units[0]) {
      square.units[0].render(context, UI);
    }
    context.restore();     
  };
  
  public drawPathLine(): void {
    const canvas = this.canvas;
    const context = this.context;
    const UI = this.UI;
  
    if (UI.currentPath && UI.currentPath.length > 1) { 
  
      context.save();
      context.translate(
        (UI.currentPath[0].x - UI.currentPath[0].y) * (UI.tileWidth / 2) + (canvas.width / 2) + UI.offset.x, 
        ((UI.currentPath[0].y + UI.currentPath[0].x) * UI.tileHeight / 2) + UI.offset.y + ((canvas.height - 15 * UI.tileHeight) / 2)
      );
      context.translate(0, UI.tileHeight / 2);
      context.beginPath();
      context.moveTo(0, 0);
      const cumulativeTranslationOffset: Coords = { x: 0, y: 0 };
  
      for (let i = 0; i < UI.currentPath.length - 1; i++) {
        const tranlation = this.pathLineCoordinates(UI.currentPath[i], UI.currentPath[i + 1]);
        cumulativeTranslationOffset.x += UI.tileWidth * tranlation.x;
        cumulativeTranslationOffset.y += UI.tileHeight * tranlation.y;
        context.lineTo(cumulativeTranslationOffset.x, cumulativeTranslationOffset.y);
        if (UI.currentPath[i + 1].moveNumber) {
          context.font = `${(UI.tileHeight / 2)}px sans-serif`;
          context.fillStyle = "black"
          context.fillText(`${UI.currentPath[i + 1].moveNumber}`, cumulativeTranslationOffset.x, cumulativeTranslationOffset.y - 2);
        }
      }
      context.strokeStyle = "blue";
      context.lineWidth = UI.tileHeight / 15;
      context.stroke();
      context.restore();
    }
  };
  
  public pathLineCoordinates = function(a: Coords, b: Coords): Coords {
    const xTranslation = b.x - a.x;
    const yTranslation = b.y - a.y;
  
    const key = xTranslation.toString() + yTranslation.toString();
  
    const lookUp: { [key: string]: Coords } = {
      "-1-1": { x: 0,    y: -1   },
      "0-1":  { x: 0.5,  y: -0.5 },
      "1-1":  { x: 1,    y: 0    },
      "10":   { x: 0.5,  y: 0.5  },
      "11":   { x: 0,    y: 1    },
      "01":   { x: -0.5, y: 0.5  },
      "-11":  { x: -1,   y: 0    },
      "-10":  { x: -0.5, y: -0.5 }
    }
  
    return lookUp[key];
  };
  
  public clearCanvas(): void {
    this.context.save();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.fillStyle = "rgba(0, 0, 0, 1)";
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.restore();  
  };

  public isSquareInBounds(square: Square): boolean {
    const x = (square.x - square.y) 
      * (this.UI.tileWidth / 2)
      + (this.canvas.width / 2)
      + this.UI.offset.x
    const y = ((square.y + square.x) * this.UI.tileHeight / 2)
      + this.UI.offset.y 
      + ((this.canvas.height - 15 * this.UI.tileHeight) / 2)
    return x + this.UI.tileWidth / 2 > 0 
      && x - this.UI.tileWidth / 2 < this.canvas.width 
      && y + this.UI.tileHeight > 0
      && y < this.canvas.height
  };
}
