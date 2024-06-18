"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useTransition, animated } from "react-spring";
// icons
import { FaCheckCircle, FaRegCircle } from "react-icons/fa";
import { TiDelete, TiDeleteOutline } from "react-icons/ti";
import { MdDelete } from "react-icons/md";

import "./dashboard.css";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/tasks", {
          headers: { "x-auth-token": token },
        });
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, [router]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const today = new Date();
    const dueDateValue = dueDate
      ? new Date(dueDate).toISOString()
      : new Date(today.setHours(0, 0, 0, 0)).toISOString();
    try {
      const res = await axios.post(
        "http://localhost:5001/api/tasks",
        { title, description, dueDate: dueDateValue },
        { headers: { "x-auth-token": token } }
      );
      setTasks([...tasks, res.data]);
      setTitle("");
      setDescription("");
      setDueDate("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5001/api/tasks/${id}`, {
        headers: { "x-auth-token": token },
      });
      setTasks(tasks.filter((task) => task._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSelectedTasks = async () => {
    const token = localStorage.getItem("token");
    try {
      const promises = selectedTasks.map((taskId) =>
        axios.delete(`http://localhost:5001/api/tasks/${taskId}`, {
          headers: { "x-auth-token": token },
        })
      );
      await Promise.all(promises);
      setTasks(tasks.filter((task) => !selectedTasks.includes(task._id)));
      setSelectedTasks([]);
      setDeleteMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTaskSelection = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  const handleToggleCompleted = async (taskId) => {
    const token = localStorage.getItem("token");
    try {
      const taskToUpdate = tasks.find((task) => task._id === taskId);
      if (!taskToUpdate.completed) {
        const updatedTask = { ...taskToUpdate, completed: true };
        const res = await axios.put(
          `http://localhost:5001/api/tasks/${taskId}`,
          updatedTask,
          { headers: { "x-auth-token": token } }
        );
        setTasks(tasks.map((task) => (task._id === taskId ? res.data : task)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getFormattedDate = (date) => {
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    return adjustedDate.toISOString().split("T")[0];
  };

  const transitions = useTransition(tasks, {
    from: { opacity: 0, transform: "translate3d(0,-40px,0)" },
    enter: { opacity: 1, transform: "translate3d(0,0px,0)" },
    leave: { opacity: 0, transform: "translate3d(0,-40px,0)" },
    keys: (task) => task._id,
  });

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-gray-200 p-4">
        <h2 className="text-lg font-bold mb-4">Add Task</h2>
        <form onSubmit={handleAddTask}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Main content */}
      <div className="w-4/5 p-4">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-bold">Active Tasks</h1>
          <button onClick={() => setDeleteMode(!deleteMode)} className="">
            {deleteMode ? (
              <TiDeleteOutline size={24} />
            ) : (
              <TiDelete size={24} />
            )}
          </button>
        </div>
        <ul>
          {transitions((style, task) => (
            <animated.li
              key={task._id}
              style={style}
              className={`bg-white p-4 rounded-xl shadow mb-2 flex justify-between items-center ${
                deleteMode && selectedTasks.includes(task._id)
                  ? "selected-task bg-red-300"
                  : task.completed
                  ? "completed-task bg-green-200"
                  : ""
              }`}
              onClick={() => handleTaskSelection(task._id)}
            >
              <div>
                <h3 className="text-lg font-bold">{task.title}</h3>
                <p>{task.description}</p>
                <p>
                  Due:{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "No due date"}
                </p>
              </div>
              <div className="flex items-center">
                {!deleteMode && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering task selection
                        if (!task.completed) {
                          handleToggleCompleted(task._id);
                        }
                      }}
                      className={`mr-2 ${
                        task.completed ? "text-green-500" : "text-gray-500"
                      }`}
                      disabled={task.completed}
                    >
                      {task.completed ? (
                        <FaCheckCircle size={24} />
                      ) : (
                        <FaRegCircle size={24} />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering task selection
                        handleDeleteTask(task._id);
                      }}
                    >
                      <MdDelete size={24} />
                    </button>
                  </>
                )}
              </div>
            </animated.li>
          ))}
        </ul>
        {deleteMode && selectedTasks.length > 0 && (
          <button
            onClick={handleDeleteSelectedTasks}
            className="bg-red-500 text-white p-2 rounded mt-4"
          >
            Delete Selected Tasks
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
