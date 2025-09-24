import React from "react";
import TableRow from "./TableRow";
import "../styles/main.css";
import { useMatrix } from "../hooks/useMatrix.ts";

const Table: React.FC = () => {
  const { matrix, addRow, get60thPercentile } = useMatrix();
  const numColumns = matrix.length > 0 ? matrix[0].cells.length : 0;

  return (
    <>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
          <tr>
            <th>Row ID</th>
            {Array.from({ length: numColumns }, (_, colIndex) => (
              <th key={colIndex}>Col {colIndex + 1}</th>
            ))}
            <th>Sum values</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {matrix.map((row) => (
            <TableRow key={row.rowId} row={row} />
          ))}
          </tbody>
          <tfoot>
          <tr>
            <td className="table-footer">60th percentile</td>
            {Array.from({ length: numColumns }).map((_, colIndex) => (
              <td key={colIndex} className="table-footer">
                {get60thPercentile(colIndex).toFixed(2)}
              </td>
            ))}
            <td className="table-footer" colSpan={2}></td>
          </tr>
          </tfoot>
        </table>
      </div>
      <button onClick={addRow} className="add-row-button">
        Add Row
      </button>
    </>
  );
};

export default Table;
