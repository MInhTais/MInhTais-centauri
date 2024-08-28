"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmailExistence = exports.authenticateToken = void 0;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
const jwt_1 = require("../utils/jwt");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    try {
        const user = (0, jwt_1.verifyAccessToken)(token);
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        if (error instanceof Error) {
            res.status(401).json({
                message: error.message,
                data: {}
            });
        }
    }
    ;
};
exports.authenticateToken = authenticateToken;
const checkEmailExistence = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await (0, auth_service_1.findByEmailService)({ email });
        if (!user) {
            next();
        }
        else {
            return res.status(422).json((0, response_1.responseError)({ message: 'Lỗi', data: {
                    password: "Tài khoản đã tồn tại"
                } }));
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.checkEmailExistence = checkEmailExistence;
