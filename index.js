const express = require('express');
const cors = require('cors'); 
const dotenv = require('dotenv'); 
dotenv.config(); const app = express(); 

app.use(cors()); app.use(express.json()); 
const todosRouter = require('./router/todos'); 
app.use('/todos', todosRouter); 
app.listen(5000, () => { console.log('Server running on (http://localhost:5000)')}); 
  
  app.listen(process.env.PORT,() => { console.log('Server running on http://localhost:${process.env.PORT}'); });