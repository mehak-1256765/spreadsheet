'use client';

import React, { useEffect, useState } from 'react';
import useGridStore from '../stores/useGridStore';
import { FaUndo, FaRedo, FaSearch, FaSearchPlus, FaSearchMinus, FaBold, FaItalic, FaUnderline, FaSave, FaEdit, FaTrashAlt } from 'react-icons/fa';

interface GridProps {
  currentPage: number;
}

const Grid: React.FC<GridProps> = ({ currentPage }) => {
  const { grid = [], setGrid, updateCell } = useGridStore();
  const [undoStack, setUndoStack] = useState<string[][][]>([]);
  const [redoStack, setRedoStack] = useState<string[][][]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(16);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [textStyle, setTextStyle] = useState<{ bold: boolean, italic: boolean, underline: boolean }>({
    bold: false,
    italic: false,
    underline: false,
  });

  const pageSize = 10;

  useEffect(() => {
    const rows = 100;
    const cols = 20;
    const initialGrid = Array.from({ length: rows }, () => Array(cols).fill(''));
    setGrid(initialGrid);
  }, [setGrid]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: number,
    col: number
  ) => {
    const value = e.target.value;

    if (isCellNumeric(row, col)) {
      if (!/^\d*$/.test(value)) {
        alert('Only numeric values are allowed in this cell.');
        return;
      }
    } else if (isCellText(row, col)) {
      if (!/^[a-zA-Z0-9]*$/.test(value)) {
        alert('Only alphanumeric values are allowed in this cell.');
        return;
      }
    }

    setUndoStack((prev) => [...prev, grid.map((row) => [...row])]);
    setRedoStack([]);

    updateCell(row, col, value);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack.pop()!;
      setRedoStack((prev) => [...prev, grid.map((row) => [...row])]);
      setGrid(previousState);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack.pop()!;
      setUndoStack((prev) => [...prev, grid.map((row) => [...row])]);
      setGrid(nextState);
    }
  };

  const handleEdit = () => {
    alert('Edit functionality goes here.');
  };

  const handleDelete = () => {
    alert('Delete functionality goes here.');
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => prev + 0.1);
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.1, 0.5)); // Minimum zoom level
  };

  const handleFontSizeIncrease = () => {
    setFontSize((prev) => prev + 2);
  };

  const handleFontSizeDecrease = () => {
    setFontSize((prev) => Math.max(prev - 2, 8)); // Minimum font size
  };

  const handleSave = () => {
    alert('Save functionality goes here.');
  };

  const handleBold = () => {
    setTextStyle((prev) => ({ ...prev, bold: !prev.bold }));
  };

  const handleItalic = () => {
    setTextStyle((prev) => ({ ...prev, italic: !prev.italic }));
  };

  const handleUnderline = () => {
    setTextStyle((prev) => ({ ...prev, underline: !prev.underline }));
  };

  const isCellNumeric = (row: number, col: number) => {
    return col === 1; // Example condition
  };

  const isCellText = (row: number, col: number) => {
    return col === 2; // Example condition
  };

  const getColumnLabel = (index: number) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let label = '';
    let num = index;
    while (num >= 0) {
      label = alphabet[num % 26] + label;
      num = Math.floor(num / 26) - 1;
    }
    return label;
  };

  const filterGrid = (grid: string[][], term: string) => {
    if (!term) return grid;

    return grid.map(row => row.map(cell => cell.includes(term) ? cell : ''));
  };

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const filteredGrid = filterGrid(grid, searchTerm);
  const currentGridPage = filteredGrid.slice(startIndex, endIndex);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4 bg-gray-100 p-2 rounded-md shadow-md">
        <div className="icon-container flex items-center gap-4">
          <div className="search-container flex items-center gap-2">
            {searchVisible && (
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ fontSize: `${fontSize}px`, zoom: zoomLevel }}
              />
            )}
            <FaSearch
              className="search-icon cursor-pointer"
              onClick={() => setSearchVisible(!searchVisible)}
            />
          </div>
          <div className="zoom-container flex items-center gap-2">
            <FaSearchPlus
              className="zoom-icon cursor-pointer"
              onClick={handleZoomIn}
            />
            <FaSearchMinus
              className="zoom-icon cursor-pointer"
              onClick={handleZoomOut}
            />
          </div>
          <div className="text-style-container flex items-center gap-2">
            <FaBold
              className={`text-style-icon cursor-pointer ${textStyle.bold ? 'font-bold' : ''}`}
              onClick={handleBold}
            />
            <FaItalic
              className={`text-style-icon cursor-pointer ${textStyle.italic ? 'italic' : ''}`}
              onClick={handleItalic}
            />
            <FaUnderline
              className={`text-style-icon cursor-pointer ${textStyle.underline ? 'underline' : ''}`}
              onClick={handleUnderline}
            />
          </div>
          <FaSave
            className="save-icon cursor-pointer"
            onClick={handleSave}
          />
          <FaUndo
            className={`icon cursor-pointer ${undoStack.length === 0 ? 'text-gray-400' : ''}`}
            onClick={handleUndo}
          />
          <FaRedo
            className={`icon cursor-pointer ${redoStack.length === 0 ? 'text-gray-400' : ''}`}
            onClick={handleRedo}
          />
          <FaEdit className="icon cursor-pointer" onClick={handleEdit} />
          <FaTrashAlt className="icon cursor-pointer" onClick={handleDelete} />
        </div>
      </div>

      <div className="overflow-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 bg-blue-600 text-white sticky left-0 z-10">#</th>
              {currentGridPage[0]?.map((_, colIndex) => (
                <th
                  key={colIndex}
                  className="border border-gray-300 p-2 bg-blue-600 text-white font-bold text-center"
                >
                  {getColumnLabel(colIndex)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentGridPage.map((row, rowIndex) => (
              <tr key={startIndex + rowIndex}>
                <td className="border border-gray-300 p-2 bg-gray-200 text-center font-bold sticky left-0 z-10">
                  {startIndex + rowIndex + 1}
                </td>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border border-gray-300 p-2 text-center">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleInputChange(e, startIndex + rowIndex, colIndex)}
                      className="w-full h-full p-1 border-none outline-none"
                      style={{ fontSize: `${fontSize}px`, zoom: zoomLevel, fontWeight: textStyle.bold ? 'bold' : 'normal', fontStyle: textStyle.italic ? 'italic' : 'normal', textDecoration: textStyle.underline ? 'underline' : 'none' }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Grid;
