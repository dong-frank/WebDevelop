import { Controller , Post , Body , Provide , Inject, Get, Headers } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { AppDataSource } from "../db";
import { User } from "../entity/user";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

@Provide()
@Controller("/api")
export class LoginController {
  @Inject()
  ctx: Context;

  @Post("/login")
  async login(@Body() body:{username:string,password:string}) {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    
    const { username , password } = body;
    const userRepository = AppDataSource.getRepository(User);


    const user = await userRepository.findOne({ where: {username}});  

    if (!user) {
      this.ctx.status = 401;
      return { message: "用户名错误" };
    }
    
      const isPasswordValid = user.password === password;

      if (!isPasswordValid) {
        this.ctx.status = 401;
        return { message: "用户名或密码错误" };
      }

      const token = jwt.sign({ id: user.id , username: user.username},'your_jwt_secret',{ expiresIn: '1h' });

      return { message: "登录成功",token };
  }

  @Post("/register")
  async register(@Body() body:{username:string,password:string}) {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const { username , password } = body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: {username}});
    if (user) {
      this.ctx.status = 401;
      return { message: "注册失败，用户名已存在" };
    }
    const newUser = new User();
    newUser.username = username;
    newUser.password = password;
    await userRepository.save(newUser);
    return { message: "注册成功" };
  }

  @Get("/userdata")
    async getUserData(@Headers('authorization') token: string) {

      if (!token){
        this.ctx.status = 401;
        return { message: "未登录" };
      }

      try {
        const tokenWithoutBearer = token.replace('Bearer ', '');
            const decoded = jwt.verify(tokenWithoutBearer, 'your_jwt_secret') as JwtPayload;
            
            return {
              username: decoded.username,
              id: decoded.id
            };
      }catch (error) {
        this.ctx.status = 401;
        return { message: "未登录" };
    }
  }
}