const pool = require('../database/dbconnection');

const Todo = {
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM todos WHERE deleted_at IS NULL");
    return rows;
  },

  create: async (task_name) => {
    const [result] = await pool.query(
      `INSERT INTO todos (task_name, status, created_at, updated_at, deleted_at)
       VALUES (?, 'PENDING', NOW(), NULL, NULL)`,
      [task_name]
    );
    const [newTodo] = await pool.query("SELECT * FROM todos WHERE id = ?", [result.insertId]);
    return newTodo[0];
  },

  update: async (id, task_name, status) => {
    await pool.query(
      `UPDATE todos 
       SET task_name = COALESCE(?, task_name), 
           status = COALESCE(?, status), 
           updated_at = NOW()
       WHERE id = ?`,
      [task_name || null, status || null, id]
    );
    const [updated] = await pool.query("SELECT * FROM todos WHERE id = ?", [id]);
    return updated[0];
  },

  softDelete: async (id) => {
    const [result] = await pool.query(
      "UPDATE todos SET deleted_at = NOW() WHERE id = ?",
      [id]
    );
    return result.affectedRows;
  },

  findByName: async (task_name) => {
    const [rows] = await pool.query("SELECT * FROM todos WHERE task_name = ?", [task_name]);
    return rows;
  },
};

module.exports = Todo;
