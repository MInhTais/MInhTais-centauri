"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleUser = exports.getOauthGooleToken = exports.refreshTokenService = exports.updateEmailVerifiedToken = exports.decentralizationsService = exports.registerService = exports.findByEmailService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const axios_1 = __importDefault(require("axios"));
const schema_1 = require("../../db/schema");
const schema = __importStar(require("../../db/schema"));
const db_connect_1 = __importDefault(require("../../db/db_connect"));
const hash_1 = require("../utils/hash");
const findByEmailService = async ({ email }) => {
    const result = await db_connect_1.default.query.users.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.users.email, email),
        with: {
            decentralizations: true
        }
    });
    return result;
};
exports.findByEmailService = findByEmailService;
const registerService = async ({ email, password, name, avatar }) => {
    return await db_connect_1.default.insert(schema.users).values({ email, name, password: password ? (0, hash_1.hashPassword)(password) : null, avatar }).returning({ email: schema_1.users.email, name: schema_1.users.name, avatar: schema_1.users.avatar });
};
exports.registerService = registerService;
const decentralizationsService = async ({ email }) => {
    return await db_connect_1.default.insert(schema.decentralizations).values({ emailAuthor: email, roleName: 'USER' });
};
exports.decentralizationsService = decentralizationsService;
const updateEmailVerifiedToken = async ({ token, email }) => {
    await db_connect_1.default.update(schema_1.users)
        .set({ emailVerifiedToken: token })
        .where((0, drizzle_orm_1.eq)(schema_1.users.email, email)).returning();
};
exports.updateEmailVerifiedToken = updateEmailVerifiedToken;
const refreshTokenService = async ({ token, email }) => {
    await db_connect_1.default.insert(schema.refreshToken).values({ token, userId: email });
};
exports.refreshTokenService = refreshTokenService;
const getOauthGooleToken = async (code) => {
    const body = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_AUTHORIZED_REDIRECT_URI,
        grant_type: 'authorization_code'
    };
    const { data } = await axios_1.default.post('https://oauth2.googleapis.com/token', body, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    return data;
};
exports.getOauthGooleToken = getOauthGooleToken;
const getGoogleUser = async ({ id_token, access_token }) => {
    const { data } = await axios_1.default.get('https://www.googleapis.com/oauth2/v1/userinfo', {
        params: {
            access_token,
            alt: 'json'
        },
        headers: {
            Authorization: `Bearer ${id_token}`
        }
    });
    return data;
};
exports.getGoogleUser = getGoogleUser;
