import React from "react";
import GridState from "./GridState";

function HeightSelector(props) {
  const { gridState, setGrid, getHeight } = props;

  function onHeightPlus() {
    setGrid((prevGrid) => {
      if (
        gridState !== GridState.Waiting &&
        gridState !== GridState.Completed
      ) {
        const height = prevGrid.length;
        const width = prevGrid[0].length;
        let newGrid = new Array(height === 9 ? 9 : height + 1)
          .fill(0)
          .map(() => new Array(width).fill({ value: 0, solution: false }));
        for (let i = 0; i < width; i++) {
          for (let j = 0; j < height; j++) {
            newGrid[j][i] = prevGrid[j][i];
          }
        }
        return newGrid;
      }
      return prevGrid;
    });
  }

  function onHeightMinus() {
    setGrid((prevGrid) => {
      if (
        gridState !== GridState.Waiting &&
        gridState !== GridState.Completed
      ) {
        const height = prevGrid.length;
        const width = prevGrid[0].length;
        let newGrid = new Array(height === 2 ? 2 : height - 1)
          .fill(0)
          .map(() => new Array(width).fill({ value: 0, solution: false }));
        for (let i = 0; i < width; i++) {
          for (let j = 0; j < (height === 2 ? 2 : height - 1); j++) {
            newGrid[j][i] = prevGrid[j][i];
          }
        }
        return newGrid;
      }
      return prevGrid;
    });
  }

  return (
    <div>
      <label>Height:</label>
      <br />
      <div className="d-flex justify-content-around">
        <div className="d-flex align-items-center">
          <button className="btn btn-primary mx-2" onClick={onHeightMinus}>
            -
          </button>
          <label className="display-6 mb-1">{getHeight()}</label>
          <button className="btn btn-primary mx-2" onClick={onHeightPlus}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeightSelector;
