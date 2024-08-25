import create from 'zustand';

interface GridState {
  grid: string[][];
  setGrid: (newGrid: string[][]) => void;
  updateCell: (row: number, col: number, value: string) => void;
}

const useGridStore = create<GridState>((set) => ({
  grid: [],

  setGrid: (newGrid) => set({ grid: newGrid }),

  updateCell: (row, col, value) => set((state) => {
    const updatedGrid = state.grid.map((r, rowIndex) =>
      r.map((cell, colIndex) => (rowIndex === row && colIndex === col ? value : cell))
    );
    return { grid: updatedGrid };
  }),
}));

export default useGridStore;
