import React, { useState } from "react";
import GridService from "@/services/GridService";
import { Grid, GridInput } from "@/types";
type GridCreateProps = {
  onGridCreated: (grid: Grid) => void;
  onClose:() => void;
};

const GridCreate: React.FC<GridCreateProps> = ({ onGridCreated, onClose }) =>  {
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(4);
  const [blockSize, setBlockSize] = useState(40);
  const [message, setMessage] = useState("");

  const generateCoordinates = (width: number, height: number): { longitude: number; latitude: number }[] => {
    const coordinates = [];
    for (let longitude = 0; longitude < height; longitude++) {
      for (let latitude = 0; latitude < width; latitude++) {
        coordinates.push({ longitude, latitude });
      }
    }
    return coordinates;
  };

  const handleCreateGrid = async () => {
    const coordinates = generateCoordinates(width, height);
    const payload: GridInput = { coordinates,measurement: blockSize };

    try {
      const response = await GridService.createGrid(payload);
      const data = await response.json();
      setMessage(`✅ Grid created! ID: ${data.id}`);
      onGridCreated(data);
    } catch (error: any) {
      console.error(error);
      setMessage("❌ Failed to create grid.");
    }
  };

return (
    <div className="bg-comp rounded-lg shadow-md px-4 py-4 flex flex-col items-start gap-4 transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:shadow-lg relative">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-lg font-medium text-text hover:text-link-text transition-colors duration-300">
          Create Grid
        </h2>
        <button
          onClick={onClose}
          className="text-text hover:text-link-text rounded-full p-2 focus:outline-none transition-colors duration-200"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-4 w-full">
        <div>
          <label className="block text-sm font-medium text-text">Width</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text">Height</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text">
            Block Size (px)
          </label>
          <input
            type="number"
            value={blockSize}
            onChange={(e) => setBlockSize(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleCreateGrid}
          className="w-full bg-button text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-200"
        >
          Create Grid
        </button>

        {message && (
          <p
            className={`text-center text-sm font-medium ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default GridCreate;
