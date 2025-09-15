const cron = require("node-cron");
const User = require("./models/User");
const { getTasksForUser } = require("./taskService");
const { sendReminderEmail } = require("./emailService");

// Hourly: At the beginning of every hour
cron.schedule("0 * * * *", async () => {
  const users = await User.find({ emailFrequency: "hourly" });
  for (const user of users) {
    const tasks = await getTasksForUser(user._id);
    await sendReminderEmail(user, tasks);
  }
});

// Every 3 Hours: At minutes 0 past every 3rd hour
cron.schedule("0 */3 * * *", async () => {
  const users = await User.find({ emailFrequency: "three_hours" });
  for (const user of users) {
    const tasks = await getTasksForUser(user._id);
    await sendReminderEmail(user, tasks);
  }
});

// Every 6 Hours: At minutes 0 past every 6th hour
cron.schedule("0 */6 * * *", async () => {
  const users = await User.find({ emailFrequency: "six_hours" });
  for (const user of users) {
    const tasks = await getTasksForUser(user._id);
    await sendReminderEmail(user, tasks);
  }
});

// Twice a Day: At 8:00 AM and 8:00 PM
cron.schedule("0 8,20 * * *", async () => {
  const users = await User.find({ emailFrequency: "twice_a_day" });
  for (const user of users) {
    const tasks = await getTasksForUser(user._id);
    await sendReminderEmail(user, tasks);
  }
});

// Daily: At 8:00 AM every day
cron.schedule("0 8 * * *", async () => {
  const users = await User.find({ emailFrequency: "daily" });
  for (const user of users) {
    const tasks = await getTasksForUser(user._id);
    await sendReminderEmail(user, tasks);
  }
});

// Weekly: At 8:00 AM every Monday
cron.schedule("0 8 * * 1", async () => {
  const users = await User.find({ emailFrequency: "weekly" });
  for (const user of users) {
    const tasks = await getTasksForUser(user._id);
    await sendReminderEmail(user, tasks);
  }
});
