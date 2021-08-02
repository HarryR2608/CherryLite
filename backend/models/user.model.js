const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let User = new Schema({
  user_username: {
    type: String,
  },
  user_password: {
    type: String,
  },
  user_grids: [{ type: Schema.Types.ObjectId, ref: "Grid" }],
});

module.exports = mongoose.model("User", User);
