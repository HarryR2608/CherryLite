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
  let grid = new Grid(req.body);
  grid.save((err) => {
    if (err) {
      res.status(400).send("Adding grid failed");
    } else {
      res.status(200).json({ Grid: "Grid added successfully" });
    }
  });
});

router.route("/update/:id").post((req, res) => {
  let id = req.params.id;
  Grid.updateOne(
    { _id: id },
    {
      $set: {
        id: req.body.id,
        grid_added: req.body.grid_added,
        grid_completed: req.body.grid_completed,
        grid_priority: req.body.grid_priority,
        grid_status: req.body.grid_status,
        grid_grid: req.body.grid_grid,
        grid_solution: req.body.grid_solution,
      },
    },
    (err, grid) => {
      if (err) {
        res.status(400).send("Update grid failed");
      } else {
        res.status(200).json(grid);
      }
    }
  );
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
