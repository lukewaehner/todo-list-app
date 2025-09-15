require("dotenv").config();
const emailjs = require("@emailjs/nodejs");

console.log(
  process.env.EMAILJS_PUBLIC_KEY,
  process.env.EMAILJS_PRIVATE_KEY,
  process.env.EMAILJS_SERVICE_ID,
  process.env.EMAILJS_TEMPLATE_ID
);
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
});

async function sendReminderEmail(user, tasks) {
  const templateParams = {
    to_name: user.name,
    to_email: user.email,
    next_week_tasks: formatTasks(tasks.nextWeek),
    next_month_tasks: formatTasks(tasks.nextMonth),
    longer_term_tasks: formatTasks(tasks.longerTerm),
  };

  try {
    await emailjs.send(
      process.env.EMAILJS_SERVICE_ID, // Use the service ID here
      process.env.EMAILJS_TEMPLATE_ID, // Use the template ID here
      templateParams
    );
    console.log(`Email sent to ${user.email}`);
  } catch (error) {
    console.error(`Failed to send email to ${user.email}:`, error);
  }
}

function formatTasks(tasks) {
  return tasks.map((task) => `${task.title} - Due: ${task.dueDate}`).join("\n");
}

module.exports = { sendReminderEmail };
