import 'dotenv/config'
import cors from 'cors';
import bodyParser from 'body-parser';
import express from 'express';
import db from "../db/db_connect"
import path from 'path';
import authRoutes from './routes/auth,route';
import { decentralizationsService, findByEmailService, getGoogleUser, getOauthGooleToken, GoogleUser, refreshTokenService, registerService } from './services/auth.service';
import { generateAccessToken, generateRefreshToken } from './utils/jwt';

const app = express();
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth', authRoutes);
db

app.get('/api/oauth/google', async (req, res, next) => {
  try {
    const { code } = req.query;
    const data = await getOauthGooleToken(code as string); // Get OAuth token from Google
    const { id_token, access_token } = data; // Extract ID token and access token
    const googleUser: GoogleUser = await getGoogleUser({ id_token, access_token }); // Get Google user info

    if (!googleUser.verified_email) {
      return res.status(403).json({
        message: 'Google email not verified',
      });
    }


    const userWithPassword = await findByEmailService({ email: googleUser.email });
    if (userWithPassword) {
      const access_token = generateAccessToken({
        email: userWithPassword.email,
        name: userWithPassword.name,
        role: userWithPassword.decentralizations,
      });
      const refresh_token = generateRefreshToken({
        email: userWithPassword.email,
        name: userWithPassword.name,
      });
      await refreshTokenService({ email: userWithPassword.email, token: refresh_token });

      return res.redirect(
        `http://localhost:3000/login/oauth?access_token=${access_token}&refresh_token=${refresh_token}&user=${encodeURIComponent(JSON.stringify(userWithPassword))}`
      );
    }
    else{
      const user = await registerService({email:googleUser.email,name:googleUser.name,avatar:googleUser.picture})
      await decentralizationsService({email:user[0].email})
      const userWithPassword = await findByEmailService({ email:user[0].email});
      if(userWithPassword){
        const access_token = generateAccessToken({
          email: userWithPassword.email,
          name: userWithPassword.name,
          role: userWithPassword.decentralizations,
        });
        const refresh_token = generateRefreshToken({
          email: userWithPassword.email,
          name: userWithPassword.name,
        });
        await refreshTokenService({ email: userWithPassword.email, token: refresh_token });
  
        return res.redirect(
          `http://localhost:3000/login/oauth?access_token=${access_token}&refresh_token=${refresh_token}&user=${encodeURIComponent(JSON.stringify(userWithPassword))}`
        );
      }
    }
  } catch (error) {
    next(error);
  }
});


app.listen(process.env.PORT, () => {
  console.log('Server is running on port '+ process.env.PORT);
});
