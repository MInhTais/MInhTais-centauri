"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenRelation = exports.refreshToken = exports.decentralizationsRelation = exports.usersRelation = exports.decentralizations = exports.users = exports.roles = exports.UserVerifyStatus = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
exports.UserVerifyStatus = (0, pg_core_1.pgEnum)("type", ["Unverified", "Verified", "Banned"]);
exports.roles = (0, pg_core_1.pgTable)('roles', {
    roleName: (0, pg_core_1.varchar)('role_name', { length: 50 }).primaryKey(),
    roleUtf8: (0, pg_core_1.varchar)('role_utf8', { length: 50 }),
    description: (0, pg_core_1.text)("description"),
});
exports.users = (0, pg_core_1.pgTable)('users', {
    email: (0, pg_core_1.varchar)('email', { length: 100 }).primaryKey(),
    name: (0, pg_core_1.varchar)('name', { length: 50 }),
    password: (0, pg_core_1.text)('password'),
    dateOfBirth: (0, pg_core_1.date)('date_of_birth'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().$onUpdate(() => new Date()),
    emailVerifiedToken: (0, pg_core_1.text)('email_verified_token'),
    forgotPasswordToken: (0, pg_core_1.text)('forgot_password_token'),
    avatar: (0, pg_core_1.text)('avatar'),
    verify: (0, exports.UserVerifyStatus)('type')
});
exports.decentralizations = (0, pg_core_1.pgTable)('decentralizations', {
    id: (0, pg_core_1.integer)("id").primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
    emailAuthor: (0, pg_core_1.varchar)('email_author', { length: 100 }),
    roleName: (0, pg_core_1.varchar)('role_name', { length: 50 })
});
exports.usersRelation = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    decentralizations: many(exports.decentralizations),
    refreshTokens: many(exports.refreshToken),
}));
exports.decentralizationsRelation = (0, drizzle_orm_1.relations)(exports.decentralizations, ({ one }) => ({
    authorDecentralizations: one(exports.users, {
        fields: [exports.decentralizations.emailAuthor],
        references: [exports.users.email]
    })
}));
exports.refreshToken = (0, pg_core_1.pgTable)('refreshToken', {
    id: (0, pg_core_1.integer)('id').primaryKey().generatedAlwaysAsIdentity({ startWith: 1 }),
    token: (0, pg_core_1.text)('refresh_token'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow().$onUpdate(() => new Date()),
    userId: (0, pg_core_1.varchar)('email', { length: 100 })
});
exports.refreshTokenRelation = (0, drizzle_orm_1.relations)(exports.refreshToken, ({ one }) => ({
    authorToken: one(exports.users, {
        fields: [exports.refreshToken.userId],
        references: [exports.users.email]
    })
}));
