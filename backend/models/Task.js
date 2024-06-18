const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users" },
  title: { type: String, required: true },
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Task", TaskSchema);
