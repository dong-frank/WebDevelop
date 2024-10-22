import { Controller, Post, Provide, Inject, Fields } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { AppDataSource } from "../db";
import { User } from "../entity/user";
import { Article } from "../entity/article";
import { InterestCircle } from "../entity/interest-circle";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";


@Provide()
@Controller("/api")
export class PublishController {
    @Inject()
    ctx: Context;

    @Post("/publish")
    async publish(@Fields() fields: any) {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const { title, content, tags, token } = fields;
        let parsedTags;
    try {
        parsedTags = JSON.parse(tags);
    } catch (error) {
        console.error('Error parsing tags:', error);
        throw new Error('Invalid tags format');
    }
    console.log(parsedTags);
        const images = Object.keys(fields)
            .filter(key => key.startsWith('images['))
            .map(key => {
                const index = key.match(/\d+/)[0]; // 提取索引
                return {
                    index: parseInt(index, 10),
                    url: fields[key]
                };
            })
            .sort((a, b) => a.index - b.index) // 按索引排序
            .map(image => image.url); // 只保留 URL

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
        const interestCircleRepository = AppDataSource.getRepository(InterestCircle);
        const circle = await interestCircleRepository.findOne({ where: { name: parsedTags} });
        console.log(circle);
        const articleRepository = AppDataSource.getRepository(Article);
        const article = articleRepository.create({
            title,
            content,
            tags: parsedTags,
            images ,
            author_id: user.id,
            likes: 0,
            views: 0,
            comments_count: 0,
            created_at: new Date(),
            updated_at: new Date(),
            circle: circle
        });
        await articleRepository.save(article);
        console.log(article);

        return { message: "发布成功",data:article };
    }

}