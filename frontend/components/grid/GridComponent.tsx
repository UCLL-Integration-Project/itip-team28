import { Grid, Reader } from "@/types";
import React, { useState, useEffect } from "react";
type GridComponentProps = {
  grid: Grid | null;
  readers: Array<Reader>;
};

const GridComponent: React.FC<GridComponentProps> = ({ grid, readers }) => {
  const [blockSize, setBlockSize] = useState(40);
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0 });
  const [path, setPath] = useState<Array<{ x: number; y: number }>>([]);

  const [currentStep, setCurrentStep] = useState(0);
  useEffect(() => {

    if (grid?.measurement && blockSize !== grid.measurement) {
      setBlockSize(grid.measurement);
    }

    if (path.length > 0 && currentStep < path.length) {
      const timer = setTimeout(() => {
        setCarPosition(path[currentStep]);
        setCurrentStep(currentStep + 1);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [grid?.measurement, blockSize, path, currentStep]);

  if (!grid) {
    return <div className="text-gray-600 text-center">No grid created yet</div>;
  }


  const width = Math.max(...grid.coordinates.map((c) => c.latitude)) + 1;
  const height = Math.max(...grid.coordinates.map((c) => c.longitude)) + 1;

  const stops = [
    { x: 2, y: 3 },
    { x: 5, y: 7 },
    { x: 8, y: 1 },
  ];

  const calculatePath = (
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) => {
    const path = [];
    let { x: currentX, y: currentY } = start;

    while (currentX !== end.x) {
      currentX += currentX < end.x ? 1 : -1;
      path.push({ x: currentX, y: currentY });
    }

    while (currentY !== end.y) {
      currentY += currentY < end.y ? 1 : -1;
      path.push({ x: currentX, y: currentY });
    }

    return path;
  };

  const handleStopClick = (x: number, y: number) => {
    const newPath = calculatePath(carPosition, { x, y });
    setPath(newPath);
    setCurrentStep(0);
  };



  const renderGrid = () => {
    const gridCells = [];

    for (let h = height - 1; h >= 0; h--) {
      const row = [];

      for (let w = 0; w < width; w++) {
        const coord = grid.coordinates.find(
          (c) => c.longitude === h && c.latitude === w
        );

        if (!coord) {
          row.push(
            <div key={`${w},${h}`} className="grid-cell empty-cell"
              style={{ width: blockSize, height: blockSize }} />);
          continue;
        }

        const isCar = carPosition.x === w && carPosition.y === h;
        //const isStop = stops.some((stop) => stop.x === w && stop.y === h);
        const isPath = path.some((step) => step.x === w && step.y === h);
        const isReader = readers.some((reader) => reader.coordinates?.latitude === w && reader.coordinates?.longitude === h);

        let className = "grid-cell";
        if (isCar) className += " car";
        else if (isPath) className += " bg-blue-500 bg-opacity-70";
        else if (isReader) className += " stop cursor-pointer";

        row.push(
          <div
            key={`${w},${h}`}
            className={className}
            style={{ width: blockSize, height: blockSize }}
            onClick={() => isReader && handleStopClick(w, h)}
            title={`Coordinate ID: ${coord.id} (Lng: ${coord.longitude}, Lat: ${coord.latitude})`}
          >
            {isCar ? "🚗" : isReader ? "🟢" : `(${w},${h})`}
          </div>
        );
      }

      gridCells.push(
        <div key={`row-${h}`} className="grid-row">
          {row}
        </div>
      );
    }

    return gridCells;
  };

  return (
    <div className="grid-container">
      <h1 className="grid-title">Adjustable Grid Block Size</h1>

      <div className="grid-controls">
        <label className="grid-label">

          Block Size (px): <span>{blockSize}</span>
        </label>
      </div>

      <div className="grid-wrapper">{grid && renderGrid()}</div>
    </div>
  );
};

export default GridComponent;
