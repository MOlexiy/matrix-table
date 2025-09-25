import React from "react";
import "../styles/main.css";
import { useMatrix } from "../hooks/useMatrix.ts";

interface CellProps {
  rowId: number;
  cell: { cellId: number; cellValue: number; isHighlighted?: boolean };
  amount: number;
  isSumCell?: boolean;
}

const TableCell: React.FC<CellProps> = ({ rowId, cell, amount, isSumCell }) => {
  const {
    updateCellValue,
    highlightCells,
    clearHighlights,
    setHoveredRowId,
    hoveredRowId,
    matrix,
  } = useMatrix();

  const handleCellClick = () => {
    updateCellValue(rowId, cell.cellId, cell.cellValue + 1);
    highlightCells(cell.cellValue);
  };

  const handleMouseEnter = () => {
    if (isSumCell) setHoveredRowId(rowId);
    else highlightCells(cell.cellValue);
  };

  const handleMouseLeave = () => {
    if (isSumCell) setHoveredRowId(null);
    else clearHighlights();
  };

  const percentage =
    amount > 0 ? ((cell.cellValue / amount) * 100).toFixed(2) : 0;
  const isCurrentRowHovered = hoveredRowId === rowId;
  const hoveredRow = matrix.find((r) => r.rowId === hoveredRowId);
  const maxCellValueInRow = hoveredRow
    ? Math.max(...hoveredRow.cells.map((c) => c.cellValue))
    : 0;
  const heatmapPercentage =
    maxCellValueInRow > 0 ? (cell.cellValue / maxCellValueInRow) * 100 : 0;

  const cellClasses = `table-cell ${cell.isHighlighted ? "highlighted" : ""} ${isCurrentRowHovered ? "percentage-row" : ""}`;
  const cellStyle = {
    "--percentage": `${percentage}%`,
    "--heatmap-percentage": `${heatmapPercentage}%`,
  } as React.CSSProperties;

  return (
    <td
      className={cellClasses}
      style={cellStyle}
      onClick={isSumCell ? undefined : handleCellClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isSumCell
        ? amount
        : isCurrentRowHovered
          ? `${percentage}%`
          : cell.cellValue}
    </td>
  );
};

export default TableCell;
