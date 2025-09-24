import { useContext } from "react";
import type { MatrixContextType } from "../context/MatrixContext";
import MatrixContext from "../context/MatrixContext";

export const useMatrix = (): MatrixContextType => {
  const context = useContext(MatrixContext);
  if (!context) {
    throw new Error("useMatrix must be used within a MatrixProvider");
  }
  return context;
};
