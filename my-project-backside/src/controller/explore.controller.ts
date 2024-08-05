import { Controller,  Provide, Inject,  Get } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { AppDataSource } from "../db";
// import { User } from "../entity/user";
import { Article } from "../entity/article";
// import * as jwt from "jsonwebtoken";
// import { JwtPayload } from "jsonwebtoken";

@Provide()
@Controller("/api")
export class ExploreController {
    @Inject()
    ctx: Context;

    @Get("/explore")
    async getArticles() {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const articleRepository = AppDataSource.getRepository(Article);
        const articles = await articleRepository.find();

        this.ctx.body = {
            success: true, 
            data: articles
        }
    }
}