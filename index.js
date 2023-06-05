import express from 'express';
import db from './config/database.js';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
//import db from './config/database.js';
import dotenv from 'dotenv';
const app = express();
dotenv.config();

try {
  await db.authenticate();
  console.log('Database connected');
  await db.sync();
} catch (error) {
  console.log('Database error: ', error);
}

app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
