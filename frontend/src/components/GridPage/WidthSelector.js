import React from "react";
import GridState from "./GridState";

function WidthSelector(props) {
  const { gridState, setGrid, getWidth } = props;

  function onWidthMinus() {
    setGrid((prevGrid) => {
      if (
        gridState !== GridState.Waiting &&
        gridState !== GridState.Completed
      ) {
        const height = prevGrid.length;
        const width = prevGrid[0].length;
        let newGrid = new Array(height).fill(0).map(() =>
          new Array(width === 2 ? 2 : width - 1).fill({
            value: 0,
            solution: false,
          })
        );
        for (let i = 0; i < (width === 2 ? 2 : width - 1); i++) {
          for (let j = 0; j < height; j++) {
            newGrid[j][i] = prevGrid[j][i];
          }
        }
        return newGrid;
      }
      return prevGrid;
    });
  }

  function onWidthPlus() {
    setGrid((prevGrid) => {
      if (
        gridState !== GridState.Waiting &&
        gridState !== GridState.Completed
      ) {
        const height = prevGrid.length;
        const width = prevGrid[0].length;
        let newGrid = new Array(height).fill(0).map(() =>
          new Array(width === 9 ? 9 : width + 1).fill({
            value: 0,
            solution: false,
          })
        );
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

  return (
    <div>
      <label>Width:</label>
      <br />
      <div className="d-flex justify-content-around">
        <div className="d-flex align-items-center">
          <button className="btn btn-primary mx-2" onClick={onWidthMinus}>
            -
          </button>
          <label className="display-6 mb-1">{getWidth()}</label>
          <button className="btn btn-primary mx-2" onClick={onWidthPlus}>
            +
          </button>
        </div>
      </div>
    </div>
  );
}

export default WidthSelector;
