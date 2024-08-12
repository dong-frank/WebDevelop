import { Controller, Post, Provide, Inject, Fields } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { AppDataSource } from "../db";
import { User } from "../entity/user";
import { Article } from "../entity/article";
import { Comment } from "../entity/comment";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";


@Provide()
@Controller("/api")

export class CommentController {
    @Inject()
    ctx: Context;

    @Post("/comment")
    async comment(@Fields() fields: any) {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const { content, article_id, token } = fields;
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

        const articleRepository = AppDataSource.getRepository(Article);
        const article = await articleRepository.findOne({ where: { id: article_id } , relations: ['circle'] });

        const commentRepository = AppDataSource.getRepository(Comment);
        const comment = commentRepository.create({
            content,
            article,
            author: user,
            created_at: new Date()
        });
        await commentRepository.save(comment);
        return {
            success: true,
            data: article,
            message: '评论成功'
        }
    }
}
