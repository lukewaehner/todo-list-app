import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
const GroupManagementHUD = ({ user }) => {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [taskPagination, setTaskPagination] = useState({});

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/groups", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });
        console.log("Res", res);
        setGroups(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (user) {
      fetchGroups();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setIsAdmin(groups.some((group) => group.admin === user._id));
    }
  }, [groups, user]);

  const fetchGroupDetails = async (groupId) => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/groups/${groupId}`,
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      const { members, tasks } = res.data;
      console.log(tasks);
      setUsers(members);
      setTasks(tasks);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGroupSelect = (groupId) => {
    setSelectedGroup(groupId);
    fetchGroupDetails(groupId);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5001/api/groups/${selectedGroup}/assign-task`,
        {
          title: newTaskTitle,
          description: newTaskDescription,
          dueDate: newTaskDueDate,
          userId: selectedUserId,
        },
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskDueDate("");
      setSelectedUserId("");
      fetchGroupDetails(selectedGroup);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (userId, direction) => {
    setTaskPagination((prev) => {
      const currentPage = prev[userId] || 1;
      const newPage = direction === "next" ? currentPage + 1 : currentPage - 1;
      return { ...prev, [userId]: newPage };
    });
  };

  // editable
  const tasksPerPage = 5;

  return (
    <div className="">
      {/* Top strip for group selection and admin panel */}
      <div className="bg-gray-200 p-4 flex justify-evenly items-center">
        {/* Group selection dropdown */}
        <div className="bg-gray-400 p-5 rounded-lg flex flex-col justify-center items-center min-h-100">
          <h1 className="text-gl font-bold mb-2">Group Selector</h1>
          <select
            value={selectedGroup}
            onChange={(e) => handleGroupSelect(e.target.value)}
            className="p-2 border rounded text-center"
          >
            {selectedGroup ? null : (
              <option disabled value="">
                Select a group
              </option>
            )}
            {groups.map((group) => (
              <option key={group._id} value={group._id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
        {/* Create Task form */}
        {isAdmin && (
          <div className="flex ml-4 bg-gray-400 rounded-lg items-center justify-center">
            <div className="p-4 rounded w-full">
              <h2 className="text-lg font-bold mb-2 text-center">
                Assign Task
              </h2>
              <form
                onSubmit={handleCreateTask}
                className="flex flex-wrap items-center justify-center"
              >
                <div className="w-full flex mb-2">
                  <div className="mr-2 flex-1">
                    <input
                      type="text"
                      placeholder="Enter task title"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      className="w-full p-2 border rounded h-10"
                    />
                  </div>
                  <div className="flex-1">
                    <textarea
                      placeholder="Enter task description"
                      value={newTaskDescription}
                      onChange={(e) => setNewTaskDescription(e.target.value)}
                      className="w-full p-2 border rounded h-10"
                      rows="1"
                    />
                  </div>
                </div>
                <div className="w-full flex justify-between items-center mb-2">
                  <div className="flex-1 mr-1">
                    <input
                      type="date"
                      placeholder="Select due date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                  <div className="flex-1 mr-1">
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full p-1 border rounded"
                    >
                      <option value="">Select a user</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <button
                      type="submit"
                      className="w-full bg-blue-500 text-white p-1 rounded"
                    >
                      Assign Task
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      {/* User cards */}
      <div className="flex flex-col mt-4">
        {users.map((user) => {
          const userTasks = tasks.filter(
            (task) => task.assignedTo === user._id
          );
          const currentPage = taskPagination[user._id] || 1;
          const paginatedTasks = userTasks.slice(
            (currentPage - 1) * tasksPerPage,
            currentPage * tasksPerPage
          );

          const canScrollLeft = currentPage !== 1;
          const canScrollRight = currentPage * tasksPerPage < userTasks.length;

          return (
            <div key={user._id} className="bg-gray-400 p-4 m-2 rounded">
              <h3 className="text-lg font-bold mb-2">{user.name}</h3>
              <div className="flex flex-wrap">
                {paginatedTasks.map((task) => (
                  <div
                    key={task._id}
                    className="bg-white p-2 m-2 rounded shadow-md"
                    style={{ width: "18%" }}
                  >
                    {task?.task?.title ?? "N/A"}
                  </div>
                ))}
              </div>
              {userTasks.length > tasksPerPage && (
                <div className="flex justify-between items-center mt-1">
                  <button
                    onClick={() => handlePageChange(user._id, "prev")}
                    disabled={!canScrollLeft}
                    className={`p-1 rounded ${!canScrollLeft && "opacity-20"}`}
                  >
                    <FaArrowLeft size={24} />
                  </button>
                  <button
                    onClick={() => handlePageChange(user._id, "next")}
                    disabled={!canScrollRight}
                    className={`p-1 rounded ${!canScrollRight && "opacity-20"}`}
                  >
                    <FaArrowRight size={24} />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupManagementHUD;
