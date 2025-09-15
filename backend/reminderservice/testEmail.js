const mongoose = require("mongoose");
const User = require("../models/User");
const { getTasksForUser } = require("./taskService");
const { sendReminderEmail } = require("./emailService");

async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017/todo-list");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

async function testEmailSending(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.error("User not found");
      return;
    }

    const tasks = await getTasksForUser(user._id);
    await sendReminderEmail(user, tasks);

    console.log("Test email sent successfully");
  } catch (error) {
    console.error("Error sending test email:", error);
  } finally {
    await mongoose.connection.close();
  }
}

const userId = process.argv[2];
if (!userId) {
  console.error("Please provide a user ID as a command-line argument");
  process.exit(1);
}

connectToDatabase().then(() => testEmailSending(userId));
