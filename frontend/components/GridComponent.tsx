import React, { useState, useEffect } from "react";

const GridComponent = () => {
  const height = 10;
  const width = 10;

  const [blockSize, setBlockSize] = useState(40);
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0 });
  const [path, setPath] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const stops = [
    { x: 2, y: 3 },
    { x: 5, y: 7 },
    { x: 8, y: 1 },
  ];

  const calculatePath = (start, end) => {
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

  const handleStopClick = (x, y) => {
    const newPath = calculatePath(carPosition, { x, y });
    setPath(newPath);
    setCurrentStep(0);
  };

  useEffect(() => {
    if (path.length === 0) return;
    if (currentStep >= path.length) return;

    const timer = setTimeout(() => {
      setCarPosition(path[currentStep]);
      setCurrentStep(currentStep + 1);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentStep, path]);

  const renderGrid = () => {
    const grid = [];

    for (let h = height - 1; h >= 0; h--) {
      const row = [];
      for (let w = 0; w < width; w++) {
        const isCar = carPosition.x === w && carPosition.y === h;
        const isStop = stops.some((stop) => stop.x === w && stop.y === h);
        const isPath = path.some(
          (step) => step.x === w && step.y === h
        );

        row.push(
          <div
            key={`${w},${h}`}
            className="grid-cell"
            style={{
              width: blockSize,
              height: blockSize,
              cursor: isStop ? "pointer" : "default",
              userSelect: "none",
              backgroundColor: isPath ? "#a0e3f0" : "transparent",
              border: isCar ? "2px solid red" : "1px solid black",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => isStop && handleStopClick(w, h)}
          >
            {isCar ? "🚗" : isStop ? "🟢" : `(${w},${h})`}
          </div>
        );
      }
      grid.push(
        <div key={`row-${h}`} className="grid-row" style={{ display: "flex" }}>
          {row}
        </div>
      );
    }

    return grid;
  };

  return (
    <div className="grid-container">
      <h1 className="grid-title">Adjustable Grid Block Size</h1>

      <div className="grid-controls">
        <label className="grid-label">
          Block Size (px):
          <input
            type="number"
            value={blockSize}
            onChange={(e) => setBlockSize(Number(e.target.value))}
            className="grid-input"
          />
        </label>
      </div>

      <div className="grid-wrapper">{renderGrid()}</div>
    </div>
  );
};

export default GridComponent;
