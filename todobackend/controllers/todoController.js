const Todo = require('../models/todoModel');
const logger = require('../utils/logger');

// GET all todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.getAll();
    logger.info('Fetched all todos');
    res.json(todos);
  } catch (err) {
    logger.error(`Error fetching todos: ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

// POST create new todo
exports.createTodo = async (req, res) => {
  try {
    const { task_name } = req.body;

    if (!task_name) {
      logger.warn('Task name missing in createTodo');
      return res.status(400).json({ error: 'Task name is required' });
    }

    const existingTask = await Todo.findByName(task_name);
    if (existingTask.length > 0) {
      logger.warn(`Duplicate task: ${task_name}`);
      return res.status(400).json({ error: 'Task already exists' });
    }

    const newTodo = await Todo.create(task_name);
    logger.info(`Todo created successfully: ${task_name}`);
    res.status(201).json(newTodo);

  } catch (err) {
    logger.error(`Failed to create todo: ${err.message}`);
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

// PUT update todo
exports.updateTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const { task_name, status } = req.body;

    if (!task_name && !status) {
      logger.warn(`Missing fields for update on ID ${id}`);
      return res.status(400).json({ error: 'task_name or status is required' });
    }

    const validStatus = ['PENDING', 'STARTED', 'COMPLETED'];
    if (status && !validStatus.includes(status)) {
      logger.warn(`Invalid status provided for ID ${id}: ${status}`);
      return res.status(400).json({ error: `Invalid status. Must be one of ${validStatus.join(', ')}` });
    }

    const updatedTodo = await Todo.update(id, task_name, status);

    if (!updatedTodo) {
      logger.warn(`Todo not found for update: ID ${id}`);
      return res.status(404).json({ error: 'Todo not found' });
    }

    logger.info(`Todo updated successfully: ID ${id}`);
    res.json(updatedTodo);

  } catch (err) {
    logger.error(`Error updating todo ID ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

// DELETE (soft delete)
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Todo.softDelete(id);

    if (deleted === 0) {
      logger.warn(`Todo not found for delete: ID ${id}`);
      return res.status(404).json({ error: 'Todo not found' });
    }

    logger.info(`Todo soft-deleted successfully: ID ${id}`);
    res.json({ message: 'Todo deleted successfully' });

  } catch (err) {
    logger.error(`Error deleting todo ID ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};
