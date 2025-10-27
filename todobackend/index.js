const express = require('express');
const cors = require('cors'); 
const dotenv = require('dotenv'); 
const logger = require('./utils/logger');

dotenv.config(); const app = express(); 

app.use(cors());
 app.use(express.json()); 
const todosRouter = require('./routes/todoRoutes');


app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  next();
});


app.use('/todos', todosRouter); //All routes starting with /todos go to todoRoutes.js
app.listen(5000, () => { console.log('Server running on (http://localhost:5000)')}); 
  
  app.listen(process.env.PORT,() => { console.log('Server running on http://localhost:${process.env.PORT}'); });