import React from "react";
import TableCell from "./TableCell";
import "../styles/main.css";
import { useMatrix } from "../hooks/useMatrix.ts";

export interface Cell {
  cellId: number;
  cellValue: number;
  isHighlighted?: boolean;
}

export interface Row {
  rowId: number;
  cells: Cell[];
  amount: number;
}

interface TableRowProps {
  row: Row;
}

const TableRow: React.FC<TableRowProps> = ({ row }) => {
  const { removeRow } = useMatrix();

  return (
    <tr>
      <td>{row.rowId}</td>
      {row.cells.map((cell) => (
        <TableCell
          key={cell.cellId}
          rowId={row.rowId}
          cell={cell}
          amount={row.amount}
        />
      ))}
      <TableCell
        rowId={row.rowId}
        cell={{ cellId: -1, cellValue: row.amount }}
        amount={row.amount}
        isSumCell={true}
      />
      <td>
        <button onClick={() => removeRow(row.rowId)} className="remove-btn">
          Remove
        </button>
      </td>
    </tr>
  );
};

export default TableRow;
