import { MatrixProvider } from "./context/MatrixContext.tsx";
import Table from "./components/Table.tsx";
import "./styles/main.css";
import React, { useEffect, useState } from "react";

function App() {
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [highlightedCount, setHighlightedCount] = useState(1);

  useEffect(() => {
    if (highlightedCount >= rows) {
      setHighlightedCount(rows - 1);
    }
  }, [rows, highlightedCount]);

  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= 100) {
      setRows(value);
    }
  };

  const handleColsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= 100) {
      setCols(value);
    }
  };

  const handleHighlightedCountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = Number(e.target.value);
    if (value >= 0 && value < rows) {
      setHighlightedCount(value);
    }
  };
  return (
    <MatrixProvider
      initialRows={rows}
      initialCols={cols}
      highlightedCount={highlightedCount}
    >
      <div className="app-container">
        <h1 className="app-header">Frontend React Matrix Table</h1>
        <div className="input-container">
          <label>
            Rows (M):
            <input
              type="number"
              value={rows}
              onChange={handleRowsChange}
              min={1}
              max={100}
              className="input-field"
            />
          </label>
          <label>
            Columns (N):
            <input
              type="number"
              value={cols}
              onChange={handleColsChange}
              min={1}
              max={100}
              className="input-field"
            />
          </label>
          <label>
            Cells to Highlight (X):
            <input
              type="number"
              value={highlightedCount}
              onChange={handleHighlightedCountChange}
              min={0}
              max={rows - 1}
              className="input-field"
            />
          </label>
        </div>
        <Table />
      </div>
    </MatrixProvider>
  );
}

export default App;
