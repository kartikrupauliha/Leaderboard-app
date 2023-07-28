const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestsSchema = new mongoose.Schema({
    userId: { type: String },
    assignmentId: { type: String },
    approved: {type : Boolean},
  });

const Requests = mongoose.model("requests", requestsSchema);
module.exports = Requests;