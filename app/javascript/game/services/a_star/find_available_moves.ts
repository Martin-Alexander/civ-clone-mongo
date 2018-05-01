import Rules from "../../rules";

export default function findAvailableMoves(unit, freshMoves): number {
  if (freshMoves) {
    return Rules.baseMovementRateForUnit(unit);
  }

  return unit.moves;
}
