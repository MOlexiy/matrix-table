import {
  createContext,
  useState,
  type ReactNode,
  useCallback,
  useEffect,
} from "react";
import { getPercentile } from "../utils/calculations";
import type { Cell, Row } from "../components/TableRow";

export interface MatrixContextType {
  matrix: Row[];
  addRow: () => void;
  removeRow: (rowId: number) => void;
  updateCellValue: (rowId: number, cellId: number, value: number) => void;
  highlightCells: (hoveredCellValue: number) => void;
  clearHighlights: () => void;
  get60thPercentile: (columnIndex: number) => number;
  setHoveredRowId: (rowId: number | null) => void;
  hoveredRowId: number | null;
}

interface MatrixProviderProps {
  children: ReactNode;
  initialRows: number;
  initialCols: number;
  highlightedCount: number;
}

const MatrixContext = createContext<MatrixContextType | undefined>(undefined);

const generateMatrix = (M: number, N: number): Row[] => {
  const matrix: Row[] = [];
  for (let i = 0; i < M; i++) {
    const cells: Cell[] = [];
    let rowSum = 0;
    for (let j = 0; j < N; j++) {
      const cellValue =
        Math.floor(Math.random() * 100) + Math.floor(Math.random() * 100) + 100;
      cells.push({ cellId: j, cellValue });
      rowSum += cellValue;
    }
    matrix.push({ rowId: i, cells, amount: rowSum });
  }
  return matrix;
};

export const MatrixProvider = ({
  children,
  initialRows,
  initialCols,
  highlightedCount,
}: MatrixProviderProps) => {
  const [matrix, setMatrix] = useState<Row[]>(() =>
    generateMatrix(initialRows, initialCols),
  );
  const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);

  // const setHoveredRow = useCallback((rowId: number | null) => {
  //   setHoveredRowId(rowId);
  // }, []);
  //
  // const hoveredRow =
  //   hoveredRowId !== null
  //     ? matrix.find((row) => row.rowId === hoveredRowId) || null
  //     : null;

  useEffect(() => {
    setMatrix(generateMatrix(initialRows, initialCols));
  }, [initialRows, initialCols]);

  const calculateRowAmount = (cells: Cell[]) =>
    cells.reduce((sum, cell) => sum + cell.cellValue, 0);

  const addRow = useCallback(() => {
    const newRowId =
      matrix.length > 0 ? matrix[matrix.length - 1].rowId + 1 : 0;
    const numCols = matrix.length > 0 ? matrix[0].cells.length : 5;
    const newCells: Cell[] = [];
    for (let j = 0; j < numCols; j++) {
      newCells.push({
        cellId: j,
        cellValue:
          Math.floor(Math.random() * 100) +
          Math.floor(Math.random() * 100) +
          100,
      });
    }
    const newAmount = calculateRowAmount(newCells);
    setMatrix((prev) => [
      ...prev,
      { rowId: newRowId, cells: newCells, amount: newAmount },
    ]);
  }, [matrix]);

  const removeRow = useCallback((rowId: number) => {
    setMatrix((prev) => prev.filter((row) => row.rowId !== rowId));
  }, []);

  const updateCellValue = useCallback(
    (rowId: number, cellId: number, value: number) => {
      setMatrix((prev) =>
        prev.map((row) => {
          if (row.rowId === rowId) {
            const updatedCells = row.cells.map((cell) =>
              cell.cellId === cellId ? { ...cell, cellValue: value } : cell,
            );
            return {
              ...row,
              cells: updatedCells,
              amount: calculateRowAmount(updatedCells),
            };
          }
          return row;
        }),
      );
    },
    [],
  );

  const highlightCells = useCallback(
    (hoveredCellValue: number) => {
      const allCells = matrix.flatMap((row) =>
        row.cells.map((cell) => ({ ...cell, rowId: row.rowId }))
      );
      const distances = allCells.map((cell) => ({
        cellId: cell.cellId,
        rowId: cell.rowId,
        distance: Math.abs(cell.cellValue - hoveredCellValue),
      }));
      distances.sort((a, b) => a.distance - b.distance);
      const nearestXCells = distances.slice(0, highlightedCount);
      const nearestXCellIds = nearestXCells.map(cell => ({
        rowId: cell.rowId,
        cellId: cell.cellId
      }));

      setMatrix((prevMatrix) =>
        prevMatrix.map((row) => ({
          ...row,
          cells: row.cells.map((cell) => {
            const shouldHighlight = nearestXCellIds.some(
              (nearest) => nearest.rowId === row.rowId && nearest.cellId === cell.cellId
            );
            return { ...cell, isHighlighted: shouldHighlight };
          }),
        }))
      );
    },
    [highlightedCount, matrix],
  );

  const clearHighlights = useCallback(() => {
    setMatrix((prev) =>
      prev.map((row) => ({
        ...row,
        cells: row.cells.map((cell) => ({
          ...cell,
          isHighlighted: false,
        })),
      })),
    );
  }, []);

  const get60thPercentile = useCallback(
    (columnIndex: number) => {
      if (matrix.length === 0) return 0;
      const columnValues = matrix.map((row) => row.cells[columnIndex].cellValue);
      return getPercentile(columnValues, 60);
    },
    [matrix],
  );

  const value = {
    matrix,
    addRow,
    removeRow,
    updateCellValue,
    highlightCells,
    clearHighlights,
    get60thPercentile,
    setHoveredRowId,
    hoveredRowId,
  };

  return (
    <MatrixContext.Provider value={value}>{children}</MatrixContext.Provider>
  );
};

export default MatrixContext;
