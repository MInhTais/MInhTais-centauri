import { eq } from "drizzle-orm"
import axios from 'axios';
import { users } from "../../db/schema"
import * as schema from "../../db/schema";
import db from "db/db_connect";
import { hashPassword } from "~/utils/hash";


export interface GoogleUser {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export const findByEmailService = async ({email}:{email:string}) => {
  const result = await db.query.users.findFirst({
    where: eq(users.email,email),
    with: {
      decentralizations:true
    }
  })
  return result
}

export const registerService = async ({ email, password, name,avatar }: { email: string, password?: string, name?: string,avatar?:string }) => {
    return await db.insert(schema.users).values({ email, name, password: password ? hashPassword(password):null,avatar }).returning(
      {email:users.email,name:users.name,avatar:users.avatar}
    );
};

export const decentralizationsService = async ({ email }: { email: string }) =>{
  return await db.insert(schema.decentralizations).values({emailAuthor:email,roleName:'USER'})
}

export const updateEmailVerifiedToken = async ({token,email}:{token:string,email:string})=>{
  await db.update(users)
  .set({emailVerifiedToken:token })
  .where(eq(users.email, email)).returning()
}

export const refreshTokenService = async ({token,email}:{token:string,email:string})=> {
  await db.insert(schema.refreshToken).values({token,userId:email})
}

export const getOauthGooleToken = async (code:string | undefined) => {
  const body = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI,
    grant_type: 'authorization_code'
  }
  const { data } = await axios.post(
    'https://oauth2.googleapis.com/token',
    body,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
  return data
}

export const getGoogleUser = async ({ id_token, access_token }:{id_token:string, access_token:string}) => {
  const { data } = await axios.get(
    'https://www.googleapis.com/oauth2/v1/userinfo',
    {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    }
  )
  return data
}