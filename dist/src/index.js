"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const db_connect_1 = __importDefault(require("../db/db_connect"));
const path_1 = __importDefault(require("path"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const auth_service_1 = require("./services/auth.service");
const jwt_1 = require("./utils/jwt");
const app = (0, express_1.default)();
app.use('/assets', express_1.default.static(path_1.default.join(__dirname, 'assets')));
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use('/auth', auth_route_1.default);
db_connect_1.default;
app.get('/api/oauth/google', async (req, res, next) => {
    try {
        const { code } = req.query;
        const data = await (0, auth_service_1.getOauthGooleToken)(code); // Get OAuth token from Google
        const { id_token, access_token } = data; // Extract ID token and access token
        const googleUser = await (0, auth_service_1.getGoogleUser)({ id_token, access_token }); // Get Google user info
        if (!googleUser.verified_email) {
            return res.status(403).json({
                message: 'Google email not verified',
            });
        }
        const userWithPassword = await (0, auth_service_1.findByEmailService)({ email: googleUser.email });
        if (userWithPassword) {
            const access_token = (0, jwt_1.generateAccessToken)({
                email: userWithPassword.email,
                name: userWithPassword.name,
                role: userWithPassword.decentralizations,
            });
            const refresh_token = (0, jwt_1.generateRefreshToken)({
                email: userWithPassword.email,
                name: userWithPassword.name,
            });
            await (0, auth_service_1.refreshTokenService)({ email: userWithPassword.email, token: refresh_token });
            return res.redirect(`http://localhost:3000/login/oauth?access_token=${access_token}&refresh_token=${refresh_token}&user=${encodeURIComponent(JSON.stringify(userWithPassword))}`);
        }
        else {
            const user = await (0, auth_service_1.registerService)({ email: googleUser.email, name: googleUser.name, avatar: googleUser.picture });
            await (0, auth_service_1.decentralizationsService)({ email: user[0].email });
            const userWithPassword = await (0, auth_service_1.findByEmailService)({ email: user[0].email });
            if (userWithPassword) {
                const access_token = (0, jwt_1.generateAccessToken)({
                    email: userWithPassword.email,
                    name: userWithPassword.name,
                    role: userWithPassword.decentralizations,
                });
                const refresh_token = (0, jwt_1.generateRefreshToken)({
                    email: userWithPassword.email,
                    name: userWithPassword.name,
                });
                await (0, auth_service_1.refreshTokenService)({ email: userWithPassword.email, token: refresh_token });
                return res.redirect(`http://localhost:3000/login/oauth?access_token=${access_token}&refresh_token=${refresh_token}&user=${encodeURIComponent(JSON.stringify(userWithPassword))}`);
            }
        }
    }
    catch (error) {
        next(error);
    }
});
app.listen(process.env.PORT, () => {
    console.log('Server is running on port ' + process.env.PORT);
});
