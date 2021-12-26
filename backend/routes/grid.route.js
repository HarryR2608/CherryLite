const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const router = express.Router();

let Grid = require("../models/grid.model");

router.route("/get").get((req, res) => {
  Grid.find(req.body, (err, grids) => {
    if (err) {
      console.log(err);
    } else {
      res.json(grids);
    }
  });
});

router.route("/get/:id").get((req, res) => {
  Grid.findById(req.params.id, (err, grid) => {
    if (err) {
      res.status(400).send("Failed to retrieve grid");
    } else {
      res.status(200).json(grid);
    }
  });
});

router.route("/add").post((req, res) => {
  let grid = new Grid();

  grid.grid_submitted = req.body.hasOwnProperty("grid_submitted")
    ? req.body.grid_submitted
    : "";
  grid.grid_completed = req.body.hasOwnProperty("grid_completed")
    ? req.body.grid_completed
    : "";
  grid.grid_priority = req.body.hasOwnProperty("grid_priority")
    ? req.body.grid_priority
    : "";
  grid.grid_status = req.body.hasOwnProperty("grid_status")
    ? req.body.grid_status
    : "";
  grid.grid_grid = req.body.hasOwnProperty("grid_grid")
    ? req.body.grid_grid
    : "";
  grid.grid_solution = req.body.hasOwnProperty("grid_solution")
    ? req.body.grid_solution
    : "";

  grid.save((err, inserted) => {
    if (err) {
      res.status(400).send("Adding grid failed");
    } else {
      res.status(200).json({ grid_id: inserted._id });
    }
  });
});

router.route("/update/:id").post((req, res) => {
  let id = req.params.id;
  let updatedGrid = {};
  if (req.body.hasOwnProperty("grid_submitted"))
    updatedGrid["grid_submitted"] = req.body.grid_submitted;
  if (req.body.hasOwnProperty("grid_completed"))
    updatedGrid["grid_completed"] = req.body.grid_completed;
  if (req.body.hasOwnProperty("grid_priority"))
    updatedGrid["grid_priority"] = req.body.grid_priority;
  if (req.body.hasOwnProperty("grid_status"))
    updatedGrid["grid_status"] = req.body.grid_status;
  if (req.body.hasOwnProperty("grid_grid"))
    updatedGrid["grid_grid"] = req.body.grid_grid;
  if (req.body.hasOwnProperty("grid_solution"))
    updatedGrid["grid_solution"] = req.body.grid_solution;
  Grid.findByIdAndUpdate(id, updatedGrid, { new: true }, (err, grid) => {
    if (err) {
      res.status(400).send("Update grid failed");
    } else {
      res.status(200).json(grid);
    }
  });
});

router.route("/delete/:id").post((req, res) => {
  let id = req.params.id;
  Grid.findByIdAndDelete(id, (err, grid) => {
    if (err) {
      res.status(400).send("Removing grid failed");
    } else {
      res.status(200).json(grid);
    }
  });
});

router.route("/delete").post((req, res) => {
  Grid.deleteMany((err) => {
    if (err) {
      res.status(400).send("Removing all grids failed");
    } else {
      res.status(200).json({ Grid: "All grids successfully removed" });
    }
  });
});
module.exports = router;
