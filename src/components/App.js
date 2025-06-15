import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(() => {
    const stored = localStorage.getItem("todo-tasks");
    return stored ? JSON.parse(stored) : [];
  });

  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("newest");

  useEffect(() => {
    localStorage.setItem("todo-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAdd = () => {
    const trimmed = task.trim();
    if (trimmed.length < 3) {
      alert("Task must be at least 3 characters long.");
      return;
    }
    const newTask = {
      id: Date.now(),
      text: trimmed,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTasks([newTask, ...tasks]);
    setTask("");
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const filtered = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "az") return a.text.localeCompare(b.text);
    if (sort === "za") return b.text.localeCompare(a.text);
    return new Date(b.createdAt) - new Date(a.createdAt); // newest
  });

  return (
    <div className="App">
      <h1>My To-Do List</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter a task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <button onClick={handleAdd}>Add</button>
      </div>

      <div className="controls">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="newest">Newest</option>
          <option value="az">A–Z</option>
          <option value="za">Z–A</option>
        </select>
      </div>

      <ul className="task-list">
        {sorted.length === 0 ? (
          <li className="empty">No tasks</li>
        ) : (
          sorted.map((t) => (
            <li key={t.id} className={t.completed ? "done" : ""}>
              <span onClick={() => toggleComplete(t.id)}>{t.text}</span>
              <button onClick={() => handleDelete(t.id)}>✕</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default App;
