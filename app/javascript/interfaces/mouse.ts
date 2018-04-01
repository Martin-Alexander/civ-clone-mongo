interface Mouse {
  right: { down: boolean };
  left: { down: boolean };
  positionOnLastDown: Coords;
  rawPosition: Coords;
  rawIsoPosition: Coords;
  centerRelativePosition: Coords;
  preDragDistance: number
};