"use client";

import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserContext } from "../lib/utils/UserProvider";
import GroupManagementHUD from "../lib/components/GroupManagementHUD";

const Settings = () => {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [pendingInvites, setPendingInvites] = useState([]);
  const router = useRouter();

  useEffect(() => {
    let timeoutId = setTimeout(() => {
      if (!user) {
        router.push("/login");
      } else {
        setUsername(user.name);
      }
    }, 75);

    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/groups", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });
        setGroups(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchInvitations = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/invitation", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });
        setPendingInvites(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchGroups();
    fetchInvitations();

    return () => clearTimeout(timeoutId);
  }, [router, user]);

  // Change user info
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        "http://localhost:5001/api/users/me",
        { name: username, password },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setUser(res.data);
      setPassword("");
      alert("User updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  // Create a group
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5001/api/groups",
        { name: newGroup },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setGroups([...groups, res.data]);
      setNewGroup("");
    } catch (err) {
      console.error(err);
      alert("Failed to create group");
    }
  };

  // Invite a user
  const handleInviteUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5001/api/invitation",
        { email: inviteEmail, groupId: selectedGroup },
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setInviteEmail("");
      setSelectedGroup("");
      alert("Invitation sent successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to send invitation");
    }
  };

  // accept an invite
  const handleAcceptInvitation = async (invitationId) => {
    console.log("Accepting invitation", invitationId);
    try {
      const res = await axios.put(
        `http://localhost:5001/api/invitation/${invitationId}/accept`,
        {},
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setPendingInvites(
        pendingInvites.filter((inv) => inv._id !== invitationId)
      );
      alert("Invitation accepted successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to accept invitation");
    }
  };

  const handleRejectInvitation = async (invitationId) => {
    console.log("Accepting invitation", invitationId);
    try {
      const res = await axios.put(
        `http://localhost:5001/api/invitation/${invitationId}/reject`,
        {},
        { headers: { "x-auth-token": localStorage.getItem("token") } }
      );
      setPendingInvites(
        pendingInvites.filter((inv) => inv._id !== invitationId)
      );
      alert("Invitation rejected!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to reject invitation");
    }
  };

  const isAdminOfAnyGroup = groups.some((group) => group.admin === user?._id);

  return (
    <div className="min-h-screen flex flex-row bg-gray-100">
      {/* Left side - Manage User, Create Group, and Pending Invitations */}
      {/* Manage User */}
      <div className="flex flex-col items-center w-1/4 bg-gray-200 p-4">
        <div className="bg-white p-4 rounded shadow-md w-full max-w-lg mb-4">
          <h2 className="text-lg font-bold mb-2">Manage User</h2>
          <form onSubmit={handleUpdateUser}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Update User
            </button>
          </form>
        </div>
        {/* End Manage User */}
        {/* Create Group */}
        <div className="bg-white p-4 rounded shadow-md w-full mb-4">
          <h2 className="text-lg font-bold mb-2">Create Group</h2>
          <form onSubmit={handleCreateGroup}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Group Name</label>
              <input
                type="text"
                value={newGroup}
                onChange={(e) => setNewGroup(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded"
            >
              Create Group
            </button>
          </form>
        </div>
        {/* End Create Group */}
        {/* Pending Invitations */}
        <div className="bg-white p-4 rounded shadow-md w-full">
          <h2 className="text-lg font-bold mb-2">Pending Invitations</h2>
          {pendingInvites.length === 0 ? (
            <p>No pending invitations</p>
          ) : (
            pendingInvites.map((invitation) => (
              <div key={invitation.id} className="border p-4 mb-2 rounded">
                <p>
                  Group: {invitation.groupName} - Invited by:{" "}
                  {invitation.senderName}
                </p>
                <div className="flex gap-2">
                  <button
                    className="bg-green-500 text-white p-2 rounded border"
                    onClick={() => handleAcceptInvitation(invitation.id)}
                  >
                    Accept
                  </button>
                  <button
                    className="bg-red-500 text-white p-2 rounded border"
                    onClick={() => handleRejectInvitation(invitation.id)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* End Pending Invitations */}
        {/* Admin panel */}

        {isAdminOfAnyGroup && (
          <div className="bg-white p-4 rounded shadow-md w-full mt-4">
            <div className="bg-white p-4 rounded shadow-md w-full max-w-lg mb-4">
              <h2 className="text-lg font-bold mb-2">Send Invitations</h2>
              <form onSubmit={handleInviteUser} className="flex flex-col gap-4">
                <select
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select a group</option>
                  {groups.map((group) => (
                    <option key={group._id} value={group._id}>
                      {group.name}
                    </option>
                  ))}
                </select>

                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full p-2 border rounded"
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Send Invitation
                </button>
              </form>
            </div>
          </div>
        )}

        {/* End admin panel */}
      </div>

      {/* Right side - Group management HUD */}
      <div className="flex-1 bg-gray-300 p-4">
        <GroupManagementHUD user={user} />
        {/* Group management HUD content */}
      </div>
    </div>
  );
};

export default Settings;
