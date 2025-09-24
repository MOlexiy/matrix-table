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
    setHoveredRowId,
    hoveredRowId,
    highlightCells,
    clearHighlights,
  } = useMatrix();

  const handleCellClick = () => {
    updateCellValue(rowId, cell.cellId, cell.cellValue + 1);
  };

  const handleMouseEnter = () => {
    setHoveredRowId(rowId);
    highlightCells(amount);
  };

  const handleMouseLeave = () => {
    setHoveredRowId(null);
    clearHighlights();
  };

  const percentage =
    amount > 0 ? ((cell.cellValue / amount) * 100).toFixed(2) : 0;
  const isCurrentRowHovered = hoveredRowId === rowId;

  const cellClasses = `table-cell ${cell.isHighlighted ? "highlighted" : ""}`;
  const cellStyle = {
    "--percentage": `${percentage}%`,
  } as React.CSSProperties;

  return (
    <td
      className={cellClasses}
      style={cellStyle}
      onClick={!isSumCell ? handleCellClick : undefined}
      onMouseEnter={isSumCell ? handleMouseEnter : undefined}
      onMouseLeave={isSumCell ? handleMouseLeave : undefined}
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
