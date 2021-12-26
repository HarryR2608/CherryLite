import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { GetGrid, UpdateGrid } from "../Fetcher/GridFetch";
import GridState from "./GridState";
import WidthSelector from "./WidthSelector";
import HeightSelector from "./HeightSelector";
import PrioritySelector from "./PrioritySelector";

function GridPage() {
  let { gridId } = useParams();
  let computationIntervalRef = useRef(0);

  const [gridState, setGridState] = useState(GridState.Editing);
  const [grid, setGrid] = useState([[{}]]);
  const [priority, setPriority] = useState("medium");
  const [gridInfo, setGridInfo] = useState({
    _id: "",
    grid_added: "",
    grid_completed: "",
    grid_priority: "",
    grid_status: "",
    grid_grid: "",
    grid_solution: "",
  });

  const updateGridFromString = useCallback((gridStr, solution) => {
    setGrid(() => {
      const rows = gridStr.split("_");
      const row = rows[0].split("-");
      const width = row.length;
      const height = rows.length;
      let newGrid = new Array(height)
        .fill(0)
        .map(() => new Array(width).fill({}));
      for (let j = 0; j < height; j++) {
        const row = rows[j].split("-");
        for (let i = 0; i < width; i++) {
          newGrid[j][i] = { value: Number(row[i]), solution: false };
        }
      }
      if (solution.length > 0) {
        newGrid = mapSolution(newGrid, solution);
      }
      return newGrid;
    });
  }, []);

  const getGridString = useCallback(() => {
    let strGrid = "";
    const width = grid[0].length;
    const height = grid.length;
    for (let j = 0; j < height - 1; j++) {
      for (let i = 0; i < width - 1; i++) {
        strGrid += grid[j][i].value + "-";
      }
      strGrid += grid[j][width - 1].value + "_";
    }
    for (let i = 0; i < width - 1; i++) {
      strGrid += grid[height - 1][i].value + "-";
    }
    strGrid += grid[height - 1][width - 1].value;
    return strGrid;
  }, [grid]);

  const checkComputation = useCallback(async () => {
    const data = await GetGrid(gridId);

    if (data === null) {
      clearInterval(computationIntervalRef.current);
      return;
    }

    setGrid((prevGrid) => {
      if (data.grid_status === "completed") {
        mapSolution(prevGrid, data.grid_solution);
      }
      return prevGrid;
    });

    if (data.grid_status === "completed") {
      updateGridInfo(data);
    }
  }, [gridId]);

  useEffect(() => {
    async function fetchData() {
      const data = await GetGrid(gridId);
      updateGridFromString(data.grid_grid, data.grid_solution);
      setPriority(data.grid_priority);
      updateGridInfo(data);
    }
    fetchData().then((r) => r);
  }, [gridId, updateGridFromString]);

  useEffect(() => {
    return () => {
      clearInterval(computationIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    const strGrid = getGridString();
    setGridState(() => {
      if (strGrid !== gridInfo.grid_grid) {
        return GridState.Editing;
      } else if (
        strGrid === gridInfo.grid_grid &&
        gridInfo.grid_status === "editing"
      ) {
        return GridState.Saved;
      } else if (
        strGrid === gridInfo.grid_grid &&
        (gridInfo.grid_status === "waiting" ||
          gridInfo.grid_status === "calculating" ||
          gridInfo.grid_status === "fetched")
      ) {
        return GridState.Waiting;
      } else if (
        strGrid === gridInfo.grid_grid &&
        gridInfo.grid_status === "completed"
      ) {
        return GridState.Completed;
      }
    });
  }, [grid, gridInfo, getGridString]);

  useEffect(() => {
    if (gridState === GridState.Waiting) {
      computationIntervalRef.current = setInterval(checkComputation, 5000);
    } else {
      clearInterval(computationIntervalRef.current);
    }
  }, [gridState, checkComputation]);

  useEffect(() => {
    setGrid((prevGrid) => {
      if (
        gridState === GridState.Completed &&
        gridInfo.grid_solution.length > 0
      ) {
        return mapSolution(prevGrid, gridInfo.grid_solution);
      }
      return prevGrid;
    });
  }, [gridState, gridInfo.grid_solution]);

  function getWidth() {
    return grid[0].length;
  }

  function getHeight() {
    return grid.length;
  }

  function updateGridInfo(data) {
    setGridInfo({
      _id: data._id,
      grid_added: data.grid_added,
      grid_completed: data.grid_completed,
      grid_priority: data.grid_priority,
      grid_status: data.grid_status,
      grid_grid: data.grid_grid,
      grid_solution: data.grid_solution,
    });
  }

  function mapSolution(currentGrid, solution) {
    const height = currentGrid.length;
    const width = currentGrid[0].length;
    let x = 0;
    let y = 0;
    let count = 0;
    do {
      currentGrid[y][x].solution = true;
      if (solution.charAt(count) === "1") {
        x++;
      } else {
        y++;
      }
      count++;
    } while ((x !== width - 1 || y !== height - 1) && count <= solution.length);
    currentGrid[y][x].solution = true;

    return currentGrid;
  }

  function onGridClick(e) {
    const width = getWidth();
    const height = getHeight();
    const x = e.target.id % 10;
    const y = (e.target.id - x) / 10;
    setGrid((prevGrid) => {
      if (
        gridState !== GridState.Waiting &&
        gridState !== GridState.Completed
      ) {
        let grid = new Array(height)
          .fill(0)
          .map(() => new Array(width).fill({}));
        for (let i = 0; i < width; i++) {
          for (let j = 0; j < height; j++) {
            grid[j][i] = { value: prevGrid[j][i].value, solution: false };
          }
        }
        grid[y][x].value =
          prevGrid[y][x].value === 9 ? 0 : prevGrid[y][x].value + 1;
        return grid;
      }
      return prevGrid;
    });
  }

  async function onSubmit() {
    if (gridState === GridState.Editing) {
      let update = {};
      update["grid_status"] = "editing";
      update["grid_grid"] = getGridString();
      update["grid_priority"] = priority;
      const res = await UpdateGrid(gridInfo._id, update);
      updateGridInfo(res);
    } else if (gridState === GridState.Saved) {
      let update = {};
      update["grid_status"] = "waiting";
      update["grid_added"] = Math.floor(new Date().getTime() / 1000).toString();
      const res = await UpdateGrid(gridInfo._id, update);
      updateGridInfo(res);
    }
  }

  async function onRandomise() {
    if (gridState === GridState.Editing || gridState === GridState.Saved) {
      const width = getWidth();
      const height = getHeight();
      let randGridStr = "";
      for (let j = 0; j < height; j++) {
        for (let i = 0; i < width; i++) {
          randGridStr += Math.floor(Math.random() * 10).toString();
          if (i !== width - 1) {
            randGridStr += "-";
          }
        }
        if (j !== height - 1) {
          randGridStr += "_";
        }
      }
      updateGridFromString(randGridStr, "");
    }
  }

  async function onReset() {
    let update = {};
    update["grid_status"] = "editing";
    update["grid_grid"] = "0-0_0-0";
    update["grid_added"] = "";
    update["grid_completed"] = "";
    update["grid_solution"] = "";
    update["grid_priority"] = "medium";
    const res = await UpdateGrid(gridInfo._id, update);
    updateGridInfo(res);
    setPriority("medium");
    let newGrid = new Array(2).fill(0).map(() => new Array(2).fill({}));
    for (let j = 0; j < 2; j++) {
      for (let i = 0; i < 2; i++) {
        newGrid[j][i] = { value: 0, solution: false };
      }
    }
    setGrid(newGrid);
  }

  return (
    <div className="text-center">
      <WidthSelector
        gridState={gridState}
        setGrid={setGrid}
        getWidth={getWidth}
      />
      <br />
      <HeightSelector
        gridState={gridState}
        setGrid={setGrid}
        getHeight={getHeight}
      />
      <br />
      <PrioritySelector priority={priority} setPriority={setPriority} />
      <br />
      <div>
        {grid.map((y, indexY) => (
          <div key={indexY}>
            {y.map((x, indexX) => (
              <button
                key={indexY * 10 + indexX}
                id={indexY * 10 + indexX}
                className={
                  "btn btn-primary rounded-0 m-1 " +
                  (gridState === GridState.Completed &&
                  grid[indexY][indexX].solution
                    ? "bg-success"
                    : "bg-primary")
                }
                onClick={onGridClick}
              >
                {grid[indexY][indexX].value}
              </button>
            ))}
            <br />
          </div>
        ))}
      </div>
      <br />
      <button className="btm btn-primary rounded-0" onClick={onSubmit}>
        {gridState === GridState.Editing
          ? "Save"
          : gridState === GridState.Saved
          ? "Submit"
          : gridState === GridState.Waiting
          ? "Calculating..."
          : gridState === GridState.Completed
          ? "Completed!"
          : "Error"}
      </button>
      <br />
      <button className="btm btn-primary m-3 rounded-0" onClick={onRandomise}>
        Randomise
      </button>
      <br />
      <button className="btm btn-primary m-3 rounded-0" onClick={onReset}>
        Reset
      </button>
    </div>
  );
}

export default GridPage;
