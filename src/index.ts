import 'dotenv/config'
import cors from 'cors';
import express from 'express';
import db from "../db/db_connect"
import path from 'path';
import authRoutes from './routes/auth,route';

const app = express();
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
db

app.listen(process.env.PORT, () => {
  console.log('Server is running on port '+ process.env.PORT);
});
