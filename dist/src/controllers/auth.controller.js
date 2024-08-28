"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPasswordController = exports.refreshTokenController = exports.registerController = exports.loginController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_service_1 = require("../services/auth.service");
const jwt_1 = require("../utils/jwt");
const httpStatus_1 = require("../constants/httpStatus");
const response_1 = require("../utils/response");
const mailer_1 = require("../utils/mailer");
const loginController = async (req, res) => {
    const { email, password } = req.body;
    const userPromies = (0, auth_service_1.findByEmailService)({ email });
    const [userWithPassword] = await Promise.all([userPromies]);
    if (userWithPassword && bcryptjs_1.default.compareSync(password, userWithPassword.password)) {
        const access_token = (0, jwt_1.generateAccessToken)({ email: userWithPassword.email, name: userWithPassword.name, role: userWithPassword.decentralizations });
        const refresh_token = (0, jwt_1.generateRefreshToken)({ email: userWithPassword.email, name: userWithPassword.name });
        await (0, auth_service_1.refreshTokenService)({ email: userWithPassword.email, token: refresh_token });
        const user = (({ password, ...rest }) => rest)(userWithPassword);
        res.json((0, response_1.responseSuccess)({ data: { access_token, refresh_token, user }, message: 'Đăng nhập thành công', status: httpStatus_1.HttpStatus.OK }));
    }
    else {
        res.status(422).json((0, response_1.responseError)({ message: 'Lỗi', data: {
                password: "Email hoặc mật khẩu không đúng"
            } }));
    }
};
exports.loginController = loginController;
const registerController = async (req, res) => {
    const { email, name, password } = req.body;
    const userPromies = await (0, auth_service_1.findByEmailService)({ email: email });
    if (!userPromies) {
        const result = await (0, auth_service_1.registerService)({ email, name, password });
        await (0, auth_service_1.decentralizationsService)({ email: result[0].email });
        const userPromies = await (0, auth_service_1.findByEmailService)({ email: email });
        const [userProfile] = await Promise.all([userPromies]);
        const accessToken = (0, jwt_1.generateAccessToken)({ email: result[0].email, name: result[0].name, role: userProfile?.decentralizations });
        await (0, auth_service_1.updateEmailVerifiedToken)({ email: result[0].email, token: accessToken });
        const subject = 'Verify your email!';
        const htmlContent = `
    <!DOCTYPE html>
        <html>
        <head>

          <meta charset="utf-8">
          <meta http-equiv="x-ua-compatible" content="ie=edge">
          <title>Verify your email address</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style type="text/css">
          /**
           * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
           */
          @media screen {
            @font-face {
              font-family: 'Source Sans Pro';
              font-style: normal;
              font-weight: 400;
              src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
            }
            @font-face {
              font-family: 'Source Sans Pro';
              font-style: normal;
              font-weight: 700;
              src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
            }
          }
          /**
           * Avoid browser level font resizing.
           * 1. Windows Mobile
           * 2. iOS / OSX
           */
          body,
          table,
          td,
          a {
            -ms-text-size-adjust: 100%; /* 1 */
            -webkit-text-size-adjust: 100%; /* 2 */
          }
          /**
           * Remove extra space added to tables and cells in Outlook.
           */
          table,
          td {
            mso-table-rspace: 0pt;
            mso-table-lspace: 0pt;
          }
          /**
           * Better fluid images in Internet Explorer.
           */
          img {
            -ms-interpolation-mode: bicubic;
          }
          /**
           * Remove blue links for iOS devices.
           */
          a[x-apple-data-detectors] {
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            text-decoration: none !important;
          }
          /**
           * Fix centering issues in Android 4.4.
           */
          div[style*="margin: 16px 0;"] {
            margin: 0 !important;
          }
          body {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /**
           * Collapse table borders to avoid space between cells.
           */
          table {
            border-collapse: collapse !important;
          }
          a {
            color: #1a82e2;
          }
          img {
            height: auto;
            line-height: 100%;
            text-decoration: none;
            border: 0;
            outline: none;
          }
          </style>

        </head>
        <body style="background-color: #e9ecef;">

          <!-- start preheader -->
          <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
            A preheader is the short summary text that follows the subject line when an email is viewed in the inbox.
          </div>
          <!-- end preheader -->

          <!-- start body -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%">

            <!-- start logo -->
            <tr>
              <td align="center" bgcolor="#e9ecef">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td align="center" valign="top" style="padding: 36px 24px;">
                      <a href=${`http://localhost:8080/auth/verify-password/${accessToken}`} target="_blank" style="display: inline-block;">
                        <img src="https://www.blogdesire.com/wp-content/uploads/2019/07/blogdesire-1.png" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
                      </a>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end logo -->

            <!-- start hero -->
            <tr>
              <td align="center" bgcolor="#e9ecef">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
                      <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
                    </td>
                  </tr>
                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end hero -->

            <!-- start copy block -->
            <tr>
              <td align="center" bgcolor="#e9ecef">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                  <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                      <p style="margin: 0;">To continue setting up your account, please verify that this is your email address. <a href="https://blogdesire.com">Paste</a>, you can safely delete this email.</p>
                    </td>
                  </tr>
                  <!-- end copy -->

                  <!-- start button -->
                  <tr>
                    <td align="left" bgcolor="#ffffff">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                          <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                              <tr>
                                <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                                  <a href=${`http://localhost:8080/auth/verify-password/${accessToken}`} target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 6px;">Verify email address</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <!-- end button -->

                  <!-- start copy -->
                  <tr>
                    <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
                      <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                      <p style="margin: 0;"><a href="https://blogdesire.com" target="_blank">https://blogdesire.com/xxx-xxx-xxxx</a></p>
                    </td>
                  </tr>
                  <!-- end copy -->                 

                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end copy block -->

            <!-- start footer -->
            <tr>
              <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
                <!--[if (gte mso 9)|(IE)]>
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
                <tr>
                <td align="center" valign="top" width="600">
                <![endif]-->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

                  <!-- start permission -->
                  <tr>
                    <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                      <p style="margin: 0;">You received this email because we received a request for [type_of_action] for your account. If you didn't request [type_of_action] you can safely delete this email.</p>
                    </td>
                  </tr>
                  <!-- end permission -->

                  <!-- start unsubscribe -->
                  <tr>
                    <td align="center" bgcolor="#e9ecef" style="padding: 12px 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 20px; color: #666;">
                      <p style="margin: 0;">To stop receiving these emails, you can <a href="https://www.blogdesire.com" target="_blank">unsubscribe</a> at any time.</p>
                      <p style="margin: 0;">Paste 1234 S. Broadway St. City, State 12345</p>
                    </td>
                  </tr>
                  <!-- end unsubscribe -->

                </table>
                <!--[if (gte mso 9)|(IE)]>
                </td>
                </tr>
                </table>
                <![endif]-->
              </td>
            </tr>
            <!-- end footer -->

          </table>
          <!-- end body -->

        </body>
        </html>
    `;
        await (0, mailer_1.sendEmail)(result[0].email, subject, htmlContent);
        res.json((0, response_1.responseSuccess)({ message: 'Đăng kí thành công vui lòng xác thực mail', data: {}, status: httpStatus_1.HttpStatus.OK }));
    }
    else {
        res.json((0, response_1.responseError)({ message: 'Lỗi', data: {
                password: "Tài khoản đã tồn tại"
            } }));
    }
};
exports.registerController = registerController;
const refreshTokenController = async (req, res) => {
    const { refresh_token } = req.body;
    console.log(refresh_token);
    if (!refresh_token)
        return res.status(401).send('Refresh Token Required');
    try {
        const user = (0, jwt_1.verifyRefreshToken)(refresh_token);
        const userPromies = (0, auth_service_1.findByEmailService)({ email: user.email });
        const [userWithPassword] = await Promise.all([userPromies]);
        if (userWithPassword) {
            const access_token = (0, jwt_1.generateAccessToken)({ email: userWithPassword.email, name: userWithPassword.name, role: userWithPassword.decentralizations });
            res.json((0, response_1.responseSuccess)({ data: { access_token }, message: 'refreshToken thành công', status: httpStatus_1.HttpStatus.OK }));
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(401).json({
                message: error.message,
                data: {}
            });
        }
    }
};
exports.refreshTokenController = refreshTokenController;
const verifyPasswordController = async (req, res) => {
    const token = req.params.token;
    const { email } = (0, jwt_1.verifyAccessToken)(token);
    const user = await (0, auth_service_1.findByEmailService)({ email });
    if (user?.email && token === user.emailVerifiedToken) {
        await (0, auth_service_1.updateEmailVerifiedToken)({ email, token: '' });
        const access_token = (0, jwt_1.generateAccessToken)({ email: user.email, name: user.name, role: user.decentralizations });
        const refresh_token = (0, jwt_1.generateRefreshToken)({ email: user.email, name: user.name });
        const profile = await (0, auth_service_1.findByEmailService)({ email });
        await (0, auth_service_1.refreshTokenService)({ email: user.email, token: refresh_token });
        const { password, ...userWithoutPassword } = profile;
        console.log(userWithoutPassword);
        return res.redirect(`http://localhost:3000/auth/verify-password?access_token=${access_token}&refresh_token=${refresh_token}&user=${encodeURIComponent(JSON.stringify(userWithoutPassword))}`);
    }
    else {
        const message = 'Tài khoản đã được xác thực';
        const type = 'error';
        return res.redirect(`http://localhost:3000/auth/verify-password?type=${type}&message=${message}`);
    }
};
exports.verifyPasswordController = verifyPasswordController;
