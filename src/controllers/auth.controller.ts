import {Request,Response} from 'express' 
import bcrypt from 'bcryptjs';
import { findByEmailService, refreshTokenService } from '~/services/auth.service';
import { generateAccessToken, generateRefreshToken } from '~/utils/jwt';
import { HttpStatus } from '~/constants/httpStatus';
import { responseError, responseSuccess } from '~/utils/response';

export const loginController = async (req:Request,res:Response) => {
  const { email, password } : {email:string, password:string} = req.body;
  const userPromies = findByEmailService({email})
  const [userWithPassword] = await Promise.all([userPromies])
  if (userWithPassword && bcrypt.compareSync(password, userWithPassword.password as string)) {
    const access_token = generateAccessToken({ email: userWithPassword.email, name: userWithPassword.name,role:userWithPassword.decentralizations });
    const refresh_token = generateRefreshToken({ email: userWithPassword.email, name: userWithPassword.name });
    await refreshTokenService({email:userWithPassword.email,token:refresh_token})
    const user: Omit<typeof userWithPassword, 'password'> = (({ password, ...rest }) => rest)(userWithPassword);
  setTimeout(()=>{
    res.json(
      responseSuccess({data:{access_token,refresh_token,user},message:'Đăng nhập thành công',status:HttpStatus.OK})
    );
  },1000)
  } else {
    res.status(422).json(
      responseError({message:'Lỗi',data:{
        password: "Email hoặc mật khẩu không đúng"
      }})
    )
  }
}