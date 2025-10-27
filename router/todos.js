const express = require('express');
const router = express.Router();
const pool = require('../dbconnection.js');



//. get method used to get lisst of all todos
router.get('/', async (req , res)=> {
    try{
        const[rows] = await pool.query("SELECT * FROM todos WHERE deleted_at IS NULL");
        res.json(rows);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'error during fetch todos'});
    }
        
});



//post method to crteate the new info
router.post('/', async (req, res)=>{
    try{
        const{task_name} = req.body;

        if(!task_name){
            return res.status(400).json({error : 'task name is required'});
        }
        const [existingTask] = await pool.query(`SELECT * FROM todos WHERE task_name =?`, [task_name]);
    if(existingTask.length>0){
        return res.status(400).json({error: 'task already exist'});
    }
  const [result] = await pool.query(
      `INSERT INTO todos (task_name, status, created_at, updated_at, deleted_at)
       VALUES (?, 'PENDING', NOW(), NULL, NULL)`,
      [task_name]
    );

   const [newTodo] = await pool.query(`SELECT * FROM todos WHERE id=?`,[result.insertId]);
   res.status(201).json(newTodo[0]);
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:'Failed to create todo'});
    }
});




//put method used ot edit the exsisting info
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { task_name, status } = req.body;

    if (!task_name && !status) {
      return res.status(400).json({ error: 'task_name or status is required' });
    }

    const validStatus = ['PENDING', 'STARTED', 'COMPLETED'];
    if (status && !validStatus.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of ${validStatus.join(', ')}` });
    }

    const [result] = await pool.query(
      `UPDATE todos SET task_name = COALESCE(?, task_name), status = COALESCE(?, status),updated_at = NOW()
       WHERE id = ?`,
      [task_name || null, status || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    const [updatedTodo] = await pool.query('SELECT * FROM todos WHERE id = ?', [id]);
    res.json(updatedTodo[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});


// soft delete
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(`UPDATE todos SET deleted_at = NOW() WHERE id = ?`, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});
module.exports = router;
