// taskService.js
const Task = require("../models/Task"); // Adjust the path as needed

async function getTasksForUser(userId) {
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const oneMonthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const tasks = await Task.find({ userId: userId });

  return {
    nextWeek: tasks.filter(
      (task) => task.dueDate <= oneWeekFromNow && !task.completed
    ),
    nextMonth: tasks.filter(
      (task) =>
        task.dueDate > oneWeekFromNow &&
        task.dueDate <= oneMonthFromNow &&
        !task.completed
    ),
    longerTerm: tasks.filter(
      (task) => task.dueDate > oneMonthFromNow && !task.completed
    ),
  };
}

module.exports = { getTasksForUser };
