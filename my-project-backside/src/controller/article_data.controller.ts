import { Controller,  Provide, Inject,  Post } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { AppDataSource } from "../db";
// import { User } from "../entity/user";
import { Article } from "../entity/article";

@Provide()
@Controller("/api")
export class ArticleDataController {
    @Inject()
    ctx: Context;

    @Post("/like/:id")
    async likeArticle() {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const articleRepository = AppDataSource.getRepository(Article);
        const article = await articleRepository.findOne({ where: { id: this.ctx.params.id }});

        if (!article) {
            this.ctx.status = 404;
            return { message: '文章不存在' };
        }

        article.likes += 1;
        await articleRepository.save(article);

        this.ctx.body = {
            success: true,
            data: article
        }
    }

    @Post("/view/:id")
    async viewArticle() {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const articleRepository = AppDataSource.getRepository(Article);
        const article = await articleRepository.findOne({ where: { id: this.ctx.params.id }});

        if (!article) {
            this.ctx.status = 404;
            return { message: '文章不存在' };
        }

        article.views += 1;
        await articleRepository.save(article);
        this.ctx.body = {
            success: true,
            data: article
        }
    }
}