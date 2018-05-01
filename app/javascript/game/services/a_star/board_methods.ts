import AStarSquareCollection from "./a_star_square_collection";
import AStarSquare from "./a_star_square";

export default class BoardMethods {
  public squares: AStarSquareCollection;

  constructor(squares: AStarSquareCollection) {
    this.squares = squares;
  }

  public neighbours(square: AStarSquare, radius: number = 1): AStarSquare[] {
    const xRange = Array.from(new Array(radius * 2 + 1), (x, i) => i + -radius);
    const yRange = Array.from(new Array(radius * 2 + 1), (x, i) => i + -radius);
    const neighbourSquares: AStarSquare[] = [];
  
    xRange.forEach((x) => {
      yRange.forEach((y) => {
        if (!(                                 // None of the following are true:
          (x === 0 && y === 0)              || // is original square
          x + square.x < 0                  || // is...
          y + square.y < 0                  || // outside...
          x + square.x > this.squares.size  || // board...
          y + square.y > this.squares.size     // bounderies
        )) {
          neighbourSquares.push(this.findSquare(x + square.x, y + square.y));
        }
      });
    });

    return neighbourSquares;
  };

  public neighboursAndCurrentSquare(square: AStarSquare, radius: number = 1): AStarSquare[] {
    const neighbourSquares = this.neighbours(square, radius);
    neighbourSquares.push(square);
  
    return neighbourSquares;
  };

  public findSquare(x: number, y: number): AStarSquare {
    return this.squares.aStarSquares[y * (this.squares.size + 1) + x];
  };
}  

