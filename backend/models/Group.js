const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Invitation = require("./Invitation");
const GroupSchema = new Schema({
  name: { type: String, required: true },
  admin: { type: Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  tasks: [
    {
      task: { type: Schema.Types.ObjectId, ref: "Task" },
      assignedTo: { type: Schema.Types.ObjectId, ref: "User" },
    },
  ],
  invitations: [{ type: Schema.Types.ObjectId, ref: "Invitation" }],
});

module.exports = mongoose.model("Group", GroupSchema);
