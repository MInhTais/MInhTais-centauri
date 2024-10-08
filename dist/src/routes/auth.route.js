"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const authRoutes = (0, express_1.Router)();
authRoutes.post('/login', auth_controller_1.loginController);
authRoutes.post('/register', authMiddleware_1.checkEmailExistence, auth_controller_1.registerController);
authRoutes.post('/token', auth_controller_1.refreshTokenController);
authRoutes.get('/verify-password/:token', auth_controller_1.verifyPasswordController);
exports.default = authRoutes;
