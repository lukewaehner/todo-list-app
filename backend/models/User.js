const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  invitations: [{ type: Schema.Types.ObjectId, ref: "Invitation" }],
  emailSchedule: { type: String, default: "daily" },
});

module.exports = mongoose.model("User", UserSchema);
