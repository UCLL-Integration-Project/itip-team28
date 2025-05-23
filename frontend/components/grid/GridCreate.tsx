import React, { useState } from "react";
import GridService from "@/services/GridService";
import { Grid, GridInput } from "@/types";
type GridCreateProps = {
  onGridCreated: (grid: Grid) => void;
};

const GridCreate: React.FC<GridCreateProps> = ({ onGridCreated }) =>  {
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
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10 space-y-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Create Grid</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Width</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Height</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Block Size (px)</label>
          <input
            type="number"
            value={blockSize}
            onChange={(e) => setBlockSize(Number(e.target.value))}
            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleCreateGrid}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow hover:bg-blue-700 transition duration-200"
        >
          Create Grid
        </button>

        {message && (
          <p className={`text-center text-sm font-medium ${message.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default GridCreate;
