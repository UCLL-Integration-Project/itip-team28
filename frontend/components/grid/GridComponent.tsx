import { Grid, Reader } from "@/types";
import React, { useState, useEffect } from "react";

type GridComponentProps = {
  grid: Grid | null;
  readers: Array<Reader>;
  setSelectedReaderId?: (id: number | null) => void;
  setActiveComponent?: (component: string | null) => void;
  startMoving: boolean;
  setStartMoving: (val: boolean) => void;
};

const GridComponent: React.FC<GridComponentProps> = ({ grid, readers, setSelectedReaderId, setActiveComponent,startMoving, setStartMoving}) => {
  const [blockSize, setBlockSize] = useState(40);
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0 });
  const [path, setPath] = useState<Array<{ x: number; y: number }>>([]);

  const [currentStep, setCurrentStep] = useState(0);
  useEffect(() => {
    if (grid?.measurement && blockSize !== grid.measurement) {
      setBlockSize(grid.measurement);
    }
  }, [grid?.measurement, blockSize]);

  // This useEffect handles the car movement
  useEffect(() => {
    if (!startMoving || path.length === 0 || currentStep >= path.length) return;

    const timer = setTimeout(() => {
      setCarPosition(path[currentStep]);
      setCurrentStep((prev) => prev + 1);
    if (currentStep + 1 === path.length) {
        setStartMoving(false); 
      }

    }, 300);

    return () => clearTimeout(timer);
  }, [startMoving, path, currentStep]);
  useEffect(() => {
    if (startMoving && currentStep >= path.length) {
      setStartMoving(false);
    }
  }, [currentStep, path.length, startMoving, setStartMoving]);


  if (!grid) {
    return <div className="text-gray-600 text-center">No grid created yet</div>;
  }


  const width = Math.max(...grid.coordinates.map((c) => c.longitude)) + 1;
  const height = Math.max(...grid.coordinates.map((c) => c.latitude)) + 1;

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

  for (let h = 0; h < height; h++) {
    const row = [];

    for (let w = 0; w < width; w++) {
      const coord = grid.coordinates.find(
        (c) => c.longitude === w && c.latitude === h
      );

      if (!coord) {
        row.push(
          <div
            key={`${w},${h}`}
            className="grid-cell empty-cell"
            style={{ width: blockSize, height: blockSize }}
          />
        );
        continue;
      }

      const isCar = carPosition.x === w && carPosition.y === h;
      const isPath = path.some((step) => step.x === w && step.y === h);
      const reader = readers.find(
        (r) =>
          r.coordinates?.longitude === w &&
          r.coordinates?.latitude === h
      );

      let className = "grid-cell";
      if (isCar) className += " car";
      else if (isPath) className += " bg-blue-500 bg-opacity-70";
      else if (reader) className += " stop cursor-pointer";

      row.push(
        <div
          key={`${w},${h}`}
          className={className}
          style={{ width: blockSize, height: blockSize }}
          onClick={() => {
            if (reader) {
              setSelectedReaderId?.(reader.id!); 
              setActiveComponent?.("readers"); 
          }
            reader && handleStopClick(w, h);}}
          title={
            reader
              ? `${reader.name} (${w},${h})`
              : `(${w},${h})`
          }
        >
          {isCar ? "🚗" : reader ? reader.name || "🟢" : `(${w},${h})`}
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
