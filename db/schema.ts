import { relations } from "drizzle-orm";
import { date, integer, pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const UserVerifyStatus = pgEnum("type", ["Unverified", "Verified","Banned"]);

export const roles = pgTable('roles',{
  roleName : varchar('role_name',{length:50}).primaryKey(),
  roleUtf8 : varchar('role_utf8',{length:50}),
  description: text("description"),

})

export const users = pgTable('users', {
  email: varchar('email',{length:100}).primaryKey(),
  name: varchar('name', { length: 50 }),
  password : text('password'),
  dateOfBirth: date('date_of_birth'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
  emailVerifiedToken:text('email_verified_token'),
  forgotPasswordToken:text('forgot_password_token'),
  avatar:text('avatar'),
  verify: UserVerifyStatus('type')
});

export const decentralizations = pgTable('decentralizations',{
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
  emailAuthor: varchar('email_author',{length:100}),
  roleName : varchar('role_name',{length:50})
})

export const usersRelation = relations(users,({many})=>({
  decentralizations : many(decentralizations),
  refreshTokens:many(refreshToken),
}))

export const decentralizationsRelation = relations(decentralizations,({one})=>({
  authorDecentralizations: one(
    users,{
      fields:[decentralizations.emailAuthor],
      references:[users.email]
    }
  ) 
}))

export const refreshToken = pgTable('refreshToken',{
  id:integer('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
  token:text('refresh_token'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date()),
  userId: varchar('email',{length:100})
})

export const refreshTokenRelation = relations(refreshToken,({one})=>({
  authorToken: one(
    users,{
      fields:[refreshToken.userId],
      references:[users.email]
    }
  )
}))