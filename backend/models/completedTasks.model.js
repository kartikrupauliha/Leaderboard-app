const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tasksDone = new mongoose.Schema({
  taskId: { type: String },
  points: { type: Number },
});
const answeredQuestions = new mongoose.Schema({
  question: { type: String },
  answer: { type: String },
});

const completedTasksSchema = new mongoose.Schema({
  userId: { type: String },
  assignmentId: { type: String },
  Tasks: [tasksDone],
  Questions: [answeredQuestions],
  totalScore: { type: Number, default: 0 },
});

const CompletedTask = mongoose.model("CompletedTask", completedTasksSchema);
module.exports = CompletedTask;
