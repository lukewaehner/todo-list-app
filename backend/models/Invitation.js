const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InvitationSchema = new Schema({
  email: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  group: { type: Schema.Types.ObjectId, ref: "Group", required: true },
  sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Invitation", InvitationSchema);
