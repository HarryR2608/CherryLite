const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let Grid = new Schema({
  grid_added: {
    type: String,
  },
  grid_completed: {
    type: String,
  },
  grid_priority: {
    type: String,
  },
  grid_status: {
    type: String,
  },
  grid_grid: {
    type: String,
  },
  grid_solution: {
    type: String,
  },
});

module.exports = mongoose.model("Grid", Grid);
