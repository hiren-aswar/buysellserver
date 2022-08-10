var mongoose = require("mongoose");
const productschema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: Number,
    required: true,
    unique: true,
  },
  role: {
    type: String,
  },
  room: {
    type: Number,
  },
});
module.exports = mongoose.model("companys", productschema);
