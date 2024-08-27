import 'dotenv/config'
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import db from "../db/db_connect"
import path from 'path';
import authRoutes from './routes/auth,route';

const app = express();
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
db

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.listen(process.env.PORT, () => {
  console.log('Server is running on port '+ process.env.PORT);
});
