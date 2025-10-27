import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/todos";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [editStatus, setEditStatus] = useState("PENDING");

  // Fetch all todos
  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err.message);
    }
  };

  // Add new todo
  const addTodo = async () => {
    if (!taskName.trim()) return alert("Please enter a task");
    try {
      await axios.post(API_URL, { task_name: taskName });
      setTaskName("");
      fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err.message);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err.message);
    }
  };

  // Start editing
  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditTask(todo.task_name);
    setEditStatus(todo.status);
  };

  // Update todo
  const updateTodo = async () => {
    try {
      await axios.put(`${API_URL}/${editId}`, {
        task_name: editTask,
        status: editStatus,
      });
      setEditId(null);
      setEditTask("");
      setEditStatus("PENDING");
      fetchTodos();
    } catch (err) {
      console.error("Error updating todo:", err.message);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>TODO List</h2>

      {/* Add new task */}
      <div style={styles.addBox}>
        <input
          style={styles.input}
          type="text"
          placeholder="Enter new task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <button style={styles.addBtn} onClick={addTodo}>
          Add
        </button>
      </div>

      {/* Edit box */}
      {editId && (
        <div style={styles.editBox}>
          <h4>Edit Task</h4>
          <input
            style={styles.input}
            type="text"
            value={editTask}
            onChange={(e) => setEditTask(e.target.value)}
          />
          <select
            style={styles.select}
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
          >
            <option value="PENDING">PENDING</option>
            <option value="STARTED">STARTED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
          <button style={styles.updateBtn} onClick={updateTodo}>
            Update
          </button>
          <button style={styles.cancelBtn} onClick={() => setEditId(null)}>
            Cancel
          </button>
        </div>
      )}

      {/* Todo list */}
      <div style={styles.listBox}>
        {todos.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} style={styles.todoItem}>
              <div>
                <strong>{todo.task_name}</strong>
                <span style={styles.status}> ({todo.status})</span>
              </div>
              <div>
                <button style={styles.editBtn} onClick={() => startEdit(todo)}>
                  Edit
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Inline styles (simple box layout)
const styles = {
  container: {
    maxWidth: "500px",
    margin: "30px auto",
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
  },
  heading: {
    textAlign: "center",
  },
  addBox: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },
  input: {
    flex: 1,
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  addBtn: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "8px 12px",
    cursor: "pointer",
  },
  listBox: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  todoItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#fff",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  editBtn: {
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    marginRight: "5px",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "5px 10px",
    cursor: "pointer",
  },
  editBox: {
    backgroundColor: "#eef6ff",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  select: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginLeft: "5px",
  },
  updateBtn: {
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "6px 10px",
    marginLeft: "5px",
    cursor: "pointer",
  },
  cancelBtn: {
    backgroundColor: "#aaa",
    color: "white",
    border: "none",
    borderRadius: "5px",
    padding: "6px 10px",
    marginLeft: "5px",
    cursor: "pointer",
  },
  status: {
    color: "#555",
    fontSize: "0.9em",
  },
};

export default TodoApp;