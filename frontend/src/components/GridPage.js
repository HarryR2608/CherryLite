import React, { useEffect, useState } from "react";

function GridPage() {
  const [width, setWidth] = useState(5);
  const [height, setHeight] = useState(5);
  const [grid, setGrid] = useState([[]]);

  useEffect(() => {
    setGrid(new Array(height).fill(0).map(() => new Array(width).fill(0)));
  }, [width, height]);

  function onGridClick(e) {
    const x = e.target.id % height;
    const y = (e.target.id - x) / height;
    setGrid((prevGrid) => {
      let grid = new Array(height).fill(0).map(() => new Array(width).fill(0));
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
          grid[j][i] = prevGrid[j][i];
        }
      }
      grid[y][x] = prevGrid[y][x] === 9 ? 0 : prevGrid[y][x] + 1;
      return grid;
    });
  }

  function onWidthPlus(e) {
    setWidth((prevWidth) => {
      return prevWidth === 9 ? 9 : prevWidth + 1;
    });
  }

  function onWidthMinus(e) {
    setWidth((prevWidth) => {
      return prevWidth === 2 ? 2 : prevWidth - 1;
    });
  }

  function onHeightPlus(e) {
    setHeight((prevHeight) => {
      return prevHeight === 9 ? 9 : prevHeight + 1;
    });
  }

  function onHeightMinus(e) {
    setHeight((prevHeight) => {
      return prevHeight === 2 ? 2 : prevHeight - 1;
    });
  }

  function onSubmit(e) {
    console.log("submit");
  }

  return (
    <div className="text-center">
      <label>Width:</label>
      <br />
      <div className="d-flex justify-content-around">
        <div className="d-flex align-items-center">
          <button className="btn btn-primary mx-2" onClick={onWidthMinus}>
            -
          </button>
          <label className="display-6 mb-1">{width}</label>
          <button className="btn btn-primary mx-2" onClick={onWidthPlus}>
            +
          </button>
        </div>
      </div>
      <br />
      <label>Height:</label>
      <br />
      <div className="d-flex justify-content-around">
        <div className="d-flex align-items-center">
          <button className="btn btn-primary mx-2" onClick={onHeightMinus}>
            -
          </button>
          <label className="display-6 mb-1">{height}</label>
          <button className="btn btn-primary mx-2" onClick={onHeightPlus}>
            +
          </button>
        </div>
      </div>
      <br />
      <div>
        {grid.map((y, indexY) => (
          <div>
            {y.map((x, indexX) => (
              <button
                id={indexY * height + indexX}
                className="btn btn-primary rounded-0 m-1"
                onClick={onGridClick}
              >
                {grid[indexY][indexX]}
              </button>
            ))}
            <br />
          </div>
        ))}
      </div>
      <br />
      <button className="btm btn-primary rounded-0" onClick={onSubmit}>
        SUBMIT
      </button>
    </div>
  );
}

export default GridPage;
