import { Request, Response, NextFunction } from 'express';
import { findByEmailService } from '../services/auth.service';
import { responseError } from '../utils/response';
import { verifyAccessToken } from '~/utils/jwt';


export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  try {
    const user = verifyAccessToken(token as string);
    (req as any).user = user;
    next();
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
     res.status(401).json({
      message:error.message,
      data:{}
     })
  }
};
}

export const checkEmailExistence = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  try {
      const user = await findByEmailService({email})
      if (!user) {
        next();
      }
      else{
        return res.status(422).json(responseError({message:'Lỗi',data:{
          password: "Tài khoản đã tồn tại"
        }}))
      }
  } catch (error) {
    console.log(error)
    
  }
};

