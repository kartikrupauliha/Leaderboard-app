const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
  title: String,
  points: Number,
});

const questionSchema = new mongoose.Schema({
  question: String,
  answer: String,
});

// Create a schema for the assignment data
const assignmentSchema = new mongoose.Schema({
  name: String,
  title: String,
  description: String,
  tasks: [taskSchema],
  questions: [questionSchema],
  approval: Boolean,
  date:Number,
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
