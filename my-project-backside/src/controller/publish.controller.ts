import { Controller , Post , Body , Provide , Inject} from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { AppDataSource } from "../db";
import { User } from "../entity/user";
import { Article } from "../entity/article";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

@Provide()
@Controller("/api")
export class PublishController {
    @Inject()
    ctx: Context;

    @Post("/publish")
    async publish(@Body() body:{title:string,content:string,tags:string,images:string,token:string}) {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { title , content , tags , images , token } = body;
        const userRepository = AppDataSource.getRepository(User);

        const tokenWithoutBearer = token.replace('Bearer ', '');
        const decoded = jwt.verify(tokenWithoutBearer, 'your_jwt_secret') as JwtPayload;

        const user = await userRepository.findOne({ where: {id: decoded.id}});

        if (!user) {
            this.ctx.status = 401;
            return { message: "未登录,请先登录" };
        }

        const articleRepository = AppDataSource.getRepository(Article);
        const article = articleRepository.create({
            id: 0,
            title,
            content,
            tags,
            images,
            author_id: user.id,
            likes: 0,
            comments_count: 0,
            created_at: new Date(),
            updated_at: new Date()
        });

        await articleRepository.save(article);

        return { message: "发布成功" };
    }

}