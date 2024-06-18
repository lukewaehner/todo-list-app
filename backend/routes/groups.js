const express = require("express");
const auth = require("../middleware/auth");
const Group = require("../models/Group");
const Task = require("../models/Task");
const User = require("../models/User");
const router = express.Router();

// Create a group
router.post("/", auth, async (req, res) => {
  let { name } = req.body;

  try {
    const existingGroup = await Group.findOne({ name, admin: req.user.id });
    if (existingGroup) {
      return res.status(400).json({ msg: "Group already exists" });
    }
    const group = new Group({
      name,
      admin: req.user.id,
      members: [req.user.id], // Add the admin user ID by default
    });

    // Check if the user creating the group is an admin, and if not, make them an admin
    let user = await User.findById(req.user.id);
    if (!user.isAdmin) {
      user.isAdmin = true;
      await user.save();
    }

    await group.save();
    res.json(group);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Add a member to group
router.put("/:id/add-member", auth, async (req, res) => {
  const { email } = req.body;
  try {
    let group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ msg: "Group not found" });

    if (group.admin.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    group.members.push(user._id);
    await group.save();
    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Remover member from a group
router.put("/:id/remove-member", auth, async (req, res) => {
  const { email } = req.body;
  try {
    let group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ msg: "Group not found" });

    if (group.admin.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    group.members = group.members.filter(
      (member) => member.toString() !== user._id.toString()
    );

    await group.save();
    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Assign a task to a group member by user ID
router.put("/:id/assign-task", auth, async (req, res) => {
  const { title, description, dueDate, userId } = req.body;
  try {
    let group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ msg: "Group not found" });

    if (group.admin.toString() !== req.user.id)
      return res.status(401).json({ msg: "Unauthorized" });

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const task = new Task({
      title,
      description,
      dueDate,
      user: user._id,
    });

    await task.save();

    // Update the group's tasks field with the new task object and the assignedTo user
    group.tasks.push({ task: task._id, assignedTo: user._id });
    await group.save();

    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get group details
router.get("/:id", auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "name email")
      .populate({
        path: "tasks",
        populate: {
          path: "task",
          model: "Task",
        },
      });

    if (!group) return res.status(404).json({ msg: "Group not found" });

    console.log(group);
    res.json(group);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// get the tasks assigned to a user
router.get("/:id/tasks/:email", auth, async (req, res) => {
  const { email } = req.params;
  try {
    const group = await Group.findById(req.params.id).populate({
      path: "tasks",
      populate: [
        { path: "task", model: "Task" },
        { path: "assignedTo", model: "User" },
      ],
    });

    if (!group) return res.status(404).json({ msg: "Group not found" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const userTasks = group.tasks.filter(
      (task) =>
        task.assignedTo &&
        task.assignedTo._id.toString() === user._id.toString()
    );

    res.json(userTasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get user's groups
router.get("/", auth, async (req, res) => {
  console.log("Getting groups");
  try {
    const groups = await Group.find({ members: req.user.id });
    res.json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
