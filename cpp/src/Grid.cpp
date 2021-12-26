#include "Grid.h"

json Grid::ToJson(Grid grid) {
    json jsonGrid;
    jsonGrid["_id"] = grid.id;
    jsonGrid["grid_added"] = grid.grid_added;
    jsonGrid["grid_completed"] = grid.grid_completed;
    jsonGrid["grid_priority"] = grid.grid_priority;
    jsonGrid["grid_status"] = grid.grid_status;
    jsonGrid["grid_grid"] = grid.grid_grid;
    jsonGrid["grid_solution"] = grid.grid_solution;
    return jsonGrid;
}

Grid Grid::FromJson(json jsonGrid) {
    Grid grid;
    grid.id = jsonGrid["_id"];
    grid.grid_added = jsonGrid["grid_added"];
    grid.grid_completed = jsonGrid["grid_completed"];
    grid.grid_priority = jsonGrid["grid_priority"];
    grid.grid_status = jsonGrid["grid_status"];
    grid.grid_grid = jsonGrid["grid_grid"];
    grid.grid_solution = jsonGrid["grid_solution"];
    return grid;
}