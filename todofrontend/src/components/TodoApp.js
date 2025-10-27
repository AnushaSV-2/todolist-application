import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/todos";

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [editStatus, setEditStatus] = useState("PENDING");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  const addTodo = async () => {
    if (!taskName.trim()) return alert("Please enter a task");
    try {
      await axios.post(API_URL, { task_name: taskName });
      setTaskName("");
      fetchTodos();
    } catch (err) {
      console.error(err.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (err) {
      console.error(err.message);
    }
  };

  const startEdit = (todo) => {
    setEditId(todo.id);
    setEditTask(todo.task_name);
    setEditStatus(todo.status);
  };

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
      console.error(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Todo List</h2>

      {/* Add new task */}
      <div style={styles.addBox}>
        <input
          type="text"
          placeholder="Enter task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          style={styles.input}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {editId && (
        <div style={styles.editBox}>
          <input
            type="text"
            value={editTask}
            onChange={(e) => setEditTask(e.target.value)}
            style={styles.input}
          />
          <select
            value={editStatus}
            onChange={(e) => setEditStatus(e.target.value)}
          >
            <option value="PENDING">PENDING</option>
            <option value="STARTED">STARTED</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
          <button onClick={updateTodo}>Update</button>
          <button onClick={() => setEditId(null)}>Cancel</button>
        </div>
      )}

      <div>
        {todos.length === 0 ? (
          <p>No tasks yet.</p>
        ) : (
          todos.map((todo) => (
            <div key={todo.id} style={styles.todoItem}>
              <span>
                {todo.task_name} ({todo.status})
              </span>
              <span>
                <button onClick={() => startEdit(todo)}>Edit</button>
                <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "400px",
    margin: "30px auto",
    fontFamily: "Arial, sans-serif",
  },
  addBox: {
    display: "flex",
    gap: "5px",
    marginBottom: "10px",
  },
  input: {
    flex: 1,
    padding: "5px",
  },
  todoItem: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #ccc",
    padding: "5px 0",
  },
  editBox: {
    marginBottom: "10px",
  },
};

export default TodoApp;
