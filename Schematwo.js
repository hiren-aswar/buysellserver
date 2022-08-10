var mongoose = require("mongoose");
const productschema = new mongoose.Schema({
  room: {
    type: Number ,
  },
  price: {
    type: Number,
  },
  product: {
    type: String,
  },
  auther: {
    type: String,
  },
  q: {
    type: Number,
  },
});
module.exports = mongoose.model("msgs", productschema);
