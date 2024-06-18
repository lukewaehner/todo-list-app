const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/todo-list")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

app.use("/api/users", require("./routes/users"));
app.use("/api/tasks", require("./routes/tasks"));
app.use("/api/groups", require("./routes/groups"));
app.use("/api/invitation", require("./routes/invitation"));

const PORT = process.env.PORT || 5001; // control center uses 5000 on mac
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
