import 'dotenv/config'
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";

const client = new Client({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // ssl: false
});

client.connect().then(()=>{
  console.log("DB connected successfully")
})
.catch((err)=>{
  console.log(err)
})

const db = drizzle(client,{schema});

export default db;