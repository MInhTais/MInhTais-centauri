import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY!;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY!;

export const generateAccessToken = (user: any) => {
  return jwt.sign(user, SECRET_KEY, { expiresIn: '15m', algorithm:'HS512' });
};

export const generateRefreshToken = (user: any) => {
  return jwt.sign(user, REFRESH_SECRET_KEY, { expiresIn: '7d' , algorithm:'HS512' });
};

export const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('Token has expired:', error);
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error('Invalid token:', error);
      throw new Error('Invalid token');
    } else {
      console.error('Error verifying token:', error);
      throw error;
    }
  }
};

export const verifyRefreshToken = (token: string) => {
  try {
    console.log('Token:', token);
    console.log('Secret Key:', SECRET_KEY);
    return jwt.verify(token, REFRESH_SECRET_KEY);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('Token has expired:', error);
      throw new Error('Token has expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error('Invalid token:', error);
      throw new Error('Invalid token');
    } else {
      console.error('Error verifying token:', error);
      throw error;
    }
  }
};