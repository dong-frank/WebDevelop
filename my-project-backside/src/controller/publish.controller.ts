import { Controller, Post, Provide, Inject, Fields } from "@midwayjs/core";
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
    async publish(@Fields() fields: any,) {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const { title, content, tags, token } = fields;

        const images = Object.keys(fields)
            .filter(key => key.startsWith('images['))
            .map(key => fields[key]);

        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, 'your_jwt_secret') as JwtPayload;
        } catch (err) {
            console.error(err);
            this.ctx.status = 401;
            return { message: '用户不存在,请先注册或登录' };
        }
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: decoded.id } });

        if (!user) {
            this.ctx.status = 404;
            return { message: '用户不存在,请先注册或登录' };
        }

        const articleRepository = AppDataSource.getRepository(Article);
        const article = articleRepository.create({
            title,
            content,
            tags,
            images: images.map(file => file.filepath),
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