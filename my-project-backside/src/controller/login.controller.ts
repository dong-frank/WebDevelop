import { Controller , Post , Body , Provide , Inject, Get} from "@midwayjs/core";
import { Context } from "@midwayjs/koa";

@Provide()
@Controller("/api")
export class LoginController {
  @Inject()
  ctx: Context;

  @Post("/login")
  async login(@Body() body:{username:string,password:string}) {
    const { username , password } = body;

    if (username === "admin" && password === "admin") {
      return { message: "登录成功" };
    }else{
        this.ctx.status = 401;
        return { message: "登录失败" };
    }
  }

  @Get("/userdata")
    async getUserData() {
        return { username: "admin", avatarUrl: "https://avatars0.githubusercontent.com/u/29393772?s=460&v=4", interests: ["前端", "后端"] };
    }
}