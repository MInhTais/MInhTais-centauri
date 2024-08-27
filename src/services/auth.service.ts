import db from "db/db_connect"
import { users } from "db/schema"
import { eq } from "drizzle-orm"
import * as schema from "../../db/schema";



export const findByEmailService = async ({email}:{email:string}) => {
  const result = await db.query.users.findFirst({
    where: eq(users.email,email),
    with:{
      decentralizations:true
    }
  })
  return result
}

export const refreshTokenService = async ({token,email}:{token:string,email:string})=> {
  await db.insert(schema.refreshToken).values({token,userId:email})
}