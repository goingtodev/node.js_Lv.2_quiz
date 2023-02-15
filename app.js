import express from 'express';
import database from './model/database.js';
import authRoute from './routes/auth.js';
import postRoute from './routes/posts.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(express.json());

app.use('/', authRoute);
app.use('/posts', postRoute);

const { PORT } = process.env;

database();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
