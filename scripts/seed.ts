
import db from "../db/db_connect";
import * as schema from "../db/schema";

const main = async () => {
  try {
    console.log("Delete table in database")
    await db.delete(schema.roles)
    await db.delete(schema.decentralizations)
    await db.delete(schema.users)
    await db.delete(schema.refreshToken)
    
    console.log("Sending database");
    await db.insert(schema.roles).values([
      {
        roleName:'USER',
        roleUtf8:'Người dùng',
        description:'',
      },
      {
        roleName:'ADMIN',
        roleUtf8:'Quản lí',
        description:''
      }
    ])

    await db.insert(schema.users).values([
      {
        email:'minhtai2019cb2@gmail.com',
        password:'$2a$08$dIbgffpJH5k/xYi6cM4GO.bwFzBqCPyRsyVIYu7Qoy4pPod5vrQ5i',
        dateOfBirth:'2001-10-19',
        name:'Nguyễn Minh Tại',
        createdAt: new Date()
      },
      {
        email:'minhanh201@gmail.com',
        password:'$2a$08$dIbgffpJH5k/xYi6cM4GO.bwFzBqCPyRsyVIYu7Qoy4pPod5vrQ5i',
        dateOfBirth:'2001-09-19',
        name:'Nguyễn Minh Anh',
        createdAt: new Date()
      },
    ])

    await db.insert(schema.decentralizations).values([
      {
        emailAuthor:'minhtai2019cb2@gmail.com',
        roleName:'USER'
      },
      {
        emailAuthor:'minhtai2019cb2@gmail.com',
        roleName:'ADMIN'
      },
      {
        emailAuthor:'minhanh201@gmail.com',
        roleName:'USER'
      }
    ])

    console.log("Sedding finished");

  } 
  catch (error) {
      console.log(error) 
      throw new Error("Failed to send database");
  }
}

main()