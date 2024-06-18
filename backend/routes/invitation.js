const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/User");
const Group = require("../models/Group");
const Invitation = require("../models/Invitation");
const router = express.Router();
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Create a new invitation
router.post("/", auth, async (req, res) => {
  try {
    const { email, groupId } = req.body;
    console.log(email, groupId);
    // Find the group
    const group = await Group.findById(groupId);
    if (!group) {
      console.log("Group not found");
      return res.status(404).json({ msg: "Group not found" });
    }

    // Check if the requester is the group admin
    console.log(group.admin.toString(), req.user.id);
    if (group.admin.toString() !== req.user.id) {
      console.log("Not authorized");
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Find the user to invite
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ msg: "User not found" });
    }

    // Create a new invitation
    const invitation = new Invitation({
      email,
      group: groupId,
      sender: req.user.id,
    });
    await invitation.save();

    // Add the invitation to the group and user
    group.invitations.push(invitation);
    user.invitations.push(invitation);
    await group.save();
    await user.save();

    res.json(invitation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Get invitations
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ msg: "User not found" });
    }

    const invitationIds = user.invitations.map(
      (invitation) => new ObjectId(invitation)
    );

    const invitations = await Invitation.find({ _id: { $in: invitationIds } })
      .populate("group", "name")
      .populate("sender", "name");

    console.log(invitations);
    const formattedInvitations = invitations.map((invitation) => ({
      id: invitation._id,
      groupId: invitation.group._id,
      groupName: invitation.group.name,
      senderId: invitation.sender._id,
      senderName: invitation.sender.name,
    }));

    console.log(formattedInvitations);
    res.json(formattedInvitations);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Accept an invitation and add the user to the group
router.put("/:id/accept", auth, async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    if (!invitation) {
      console.log("Invitation not found");
      return res.status(404).json({ msg: "Invitation not found" });
    }

    const user = await User.findById(req.user.id);

    // Check if the current user is the receiver of the invitation
    if (invitation.email.toString() !== user.email) {
      console.log("User not authorized to accept this invitation");
      return res
        .status(401)
        .json({ msg: "User not authorized to accept this invitation" });
    }

    // Update the status of the invitation to "accepted"
    invitation.status = "accepted";
    await invitation.save();

    // Add the user to the group
    const group = await Group.findById(invitation.group);
    if (!group) {
      console.log("Group not found");
      return res.status(404).json({ msg: "Group not found" });
    }

    // Check if the user is already a member of the group
    if (!group.members.includes(req.user.id)) {
      group.members.push(req.user.id);
      await group.save();
    }

    // Remove the invitation from the user's invitations array
    user.invitations = user.invitations.filter(
      (invId) => invId.toString() !== req.params.id
    );
    await user.save();

    // Delete the invitation from the Invitation collection
    await Invitation.findByIdAndDelete(req.params.id);

    res.json({ invitation, group });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Reject an invitation
router.put("/:id/reject", auth, async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);
    if (!invitation) {
      console.log("Invitation not found");
      return res.status(404).json({ msg: "Invitation not found" });
    }

    const user = await User.findById(req.user.id);

    // Check if the current user is the receiver of the invitation
    if (invitation.email.toString() !== user.email) {
      console.log("User not authorized to reject this invitation");
      return res
        .status(401)
        .json({ msg: "User not authorized to reject this invitation" });
    }

    // Remove the invitation from the user's invitations array
    user.invitations = user.invitations.filter(
      (invId) => invId.toString() !== req.params.id
    );
    await user.save();

    // Delete the invitation from the Invitation collection
    await Invitation.findByIdAndDelete(req.params.id);

    res.json({ msg: "Invitation rejected successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
