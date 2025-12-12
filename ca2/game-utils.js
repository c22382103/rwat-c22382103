// game-utils.js
// Small helper functions used by the memory game.

export function parseBoardSize(sizeAttr) {
  const defaultRows = 3;
  const defaultCols = 4;

  if (!sizeAttr || typeof sizeAttr !== "string") {
    return {
      rows: defaultRows,
      cols: defaultCols,
      totalPairs: (defaultRows * defaultCols) / 2
    };
  }

  const parts = sizeAttr.split("x");
  const rows = parseInt(parts[0]?.trim(), 10);
  const cols = parseInt(parts[1]?.trim(), 10);

  const validRows = Number.isNaN(rows) ? defaultRows : rows;
  const validCols = Number.isNaN(cols) ? defaultCols : cols;

  return {
    rows: validRows,
    cols: validCols,
    totalPairs: getTotalPairs(validRows, validCols)
  };
}

export function getTotalPairs(rows, cols) {
  return (rows * cols) / 2;
}