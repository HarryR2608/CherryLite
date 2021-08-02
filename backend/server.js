const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 4000;

const gridRoutes = require("./routes/grid.route");

app.use(cors());
app.use(bodyParser.json());

app.use("/grid", gridRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/grid-memoisation", {
  useNewUrlParser: true,
});
const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

app.listen(PORT, () => {
  console.log("Server is running on Port: " + PORT);
});
