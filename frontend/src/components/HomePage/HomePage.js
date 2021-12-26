import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { AddGrid, DeleteGrid, GetAllGrids } from "../Fetcher/GridFetch";

function HomePage() {
  let history = useHistory();
  let computationIntervalRef = useRef(0);

  const [grids, setGrids] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await GetAllGrids();
      setGrids(data);
      computationIntervalRef.current = setInterval(checkComputation, 5000);
    }
    fetchData().then((r) => r);

    return () => {
      clearInterval(computationIntervalRef.current);
    };
  }, []);

  function onGridClick(id) {
    history.push("/" + id);
  }

  async function onGridDelete(id) {
    await DeleteGrid(id);
    const data = await GetAllGrids();
    setGrids(data);
  }

  async function onGridCreate() {
    let grid = {};
    grid["grid_status"] = "editing";
    grid["grid_grid"] = "0-0_0-0";
    grid["grid_priority"] = "medium";
    await AddGrid(grid);
    const data = await GetAllGrids();
    setGrids(data);
  }

  async function checkComputation() {
    const location = window.location.pathname;
    if (location !== "/") {
      clearInterval(computationIntervalRef.current);
      return;
    }
    const data = await GetAllGrids();
    setGrids(data);
  }

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Grid</th>
            <th scope="col">Priority</th>
            <th scope="col">Status</th>
            <th scope="col" />
          </tr>
        </thead>
        <tbody>
          {grids.length !== 0 ? (
            grids.map((x, indexX) => (
              <tr key={indexX}>
                <th
                  className="btn"
                  scope="row"
                  onClick={() => onGridClick(x._id)}
                >
                  {x._id}
                </th>
                <th>{x.grid_grid}</th>
                <th>
                  {x.grid_priority === "low"
                    ? "Low"
                    : x.grid_priority === "medium"
                    ? "Medium"
                    : "High"}
                </th>
                <th>
                  {x.grid_status === "editing"
                    ? "In progress"
                    : x.grid_status === "waiting" ||
                      x.grid_status === "calculating" ||
                      x.grid_status === "fetched"
                    ? "Calculating"
                    : "Completed"}
                </th>
                <th className="btn" onClick={() => onGridDelete(x._id)}>
                  <DeleteForeverIcon />
                </th>
              </tr>
            ))
          ) : (
            <tr />
          )}
        </tbody>
      </table>
      <button className="btm btn-primary mt-5 rounded-0" onClick={onGridCreate}>
        Create new grid
      </button>
    </div>
  );
}

export default HomePage;
