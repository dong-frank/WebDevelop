import { Controller , Post , Body , Provide , Inject, Get} from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { AppDataSource } from "../db";
import { User } from "../entity/user";
import * as jwt from "jsonwebtoken";

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
    console.log(AppDataSource.isInitialized); // 检查数据源是否已初始化
    console.log(AppDataSource.options.entities); // 检查实体是否已加载
    console.log(User); // 检查 User 实体是否正确导入
    const { username , password } = body;
    const userRepository = AppDataSource.getRepository(User);


    const user = await userRepository.findOne({ where: {username}});  
    const users = await userRepository.find();
    console.log(users); // 打印所有用户信息

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

  @Get("/userdata")
    async getUserData() {
        return { username: "admin", avatarUrl: "https://avatars0.githubusercontent.com/u/29393772?s=460&v=4", interests: ["前端", "后端"] };
    }
}