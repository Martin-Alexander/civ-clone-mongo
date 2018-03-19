import { AStarSquareCollection } from "./a_star_square_collection";
import { BoardMethods }          from "./board_methods";
import { AStarSquare }           from "./a_star_square";

function AStar(squares, unit, startSquare, finishSquare) {
  this.unit         = unit;
  this.startSquare  = new AStarSquare(startSquare);
  this.finishSquare = new AStarSquare(finishSquare);
  this.squares      = new AStarSquareCollection(squares.map(square => new AStarSquare(square)));
}

AStar.prototype.find = function() {
  if (this.finishSquare.isUnreachable() && !this.startSquare.equalTo(this.finishSquare)) { return []; }

  const closedSquares = new AStarSquareCollection();
  const openedSquares = new AStarSquareCollection([this.startSquare]);

  this.startSquare.currentPathCost = 0;

  while (openedSquares.stillHasSquaresLeft()) {
    openedSquares.huristicSort(this.finishSquare);

    const currentSquare = openedSquares.getNewCurrentSquare();
    closedSquares.addSquare(currentSquare);

    if (currentSquare.equalTo(this.finishSquare)) { return this.resolvePath(currentSquare); }

    const neighbours = this.getNeighboursOf(currentSquare);

    neighbours.forEach((neighbour) => {
      if (currentSquare.currentPathCost + neighbour.moveCost(this.unit, currentSquare) < neighbour.currentPathCost) {
        if (openedSquares.doesNotInclude(neighbour) && closedSquares.doesNotInclude(neighbour)) { 
          openedSquares.addSquare(neighbour);
        }

        neighbour.pathVia = currentSquare;
        neighbour.currentPathCost = neighbour.moveCost(this.unit, currentSquare) + currentSquare.currentPathCost;
      }
    });
  }

  return this.resolvePath(currentSquare);
}

AStar.prototype.findSquare = BoardMethods.findSquare;

AStar.prototype.getNeighboursOf = BoardMethods.neighboursAndCurrentSquare;

AStar.prototype.resolvePath = function(square) {
  const path = [];
  let currentSquare = square;

  while (currentSquare !== null) {
    path.unshift({
      x: currentSquare.x,
      y: currentSquare.y
    });

    currentSquare = currentSquare.pathVia;
  }

  return path;
}

export { AStar };