"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
const generateAccessToken = (user) => {
    return jsonwebtoken_1.default.sign(user, SECRET_KEY, { expiresIn: '15m', algorithm: 'HS512' });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign(user, REFRESH_SECRET_KEY, { expiresIn: '7d', algorithm: 'HS512' });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, SECRET_KEY);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            console.error('Token has expired:', error);
            throw new Error('Token has expired');
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.error('Invalid token:', error);
            throw new Error('Invalid token');
        }
        else {
            console.error('Error verifying token:', error);
            throw error;
        }
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        console.log('Token:', token);
        console.log('Secret Key:', SECRET_KEY);
        return jsonwebtoken_1.default.verify(token, REFRESH_SECRET_KEY);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            console.error('Token has expired:', error);
            throw new Error('Token has expired');
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.error('Invalid token:', error);
            throw new Error('Invalid token');
        }
        else {
            console.error('Error verifying token:', error);
            throw error;
        }
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
