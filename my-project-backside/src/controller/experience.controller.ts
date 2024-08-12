import { Controller, Inject, Post, Provide } from "@midwayjs/core";
import { Context } from "@midwayjs/koa";
import { AppDataSource } from "../db";
import { UserCircleExperience } from "../entity/user-circle-experience";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

@Provide()
@Controller('/api')
export class ExperienceController {
    @Inject()
    ctx: Context

    @Post('/experience')
    async experience() {
        const token = ((this.ctx.request.body as { token: string }).token);
        const circleId = ((this.ctx.request.body as { circleId: number }).circleId);
        const experience = ((this.ctx.request.body as { experience: number }).experience);
        let decoded: JwtPayload;
        try {
            decoded = jwt.verify(token, 'your_jwt_secret') as JwtPayload;
        } catch (err) {
            console.error(err);
            this.ctx.status = 401;
            return { message: '用户不存在,请先注册或登录' };
        }
        
        const userCircleExperienceRepository = AppDataSource.getRepository(UserCircleExperience);
        const userCircleExperience = await userCircleExperienceRepository.findOne({
            where: {
                user: { id: decoded.id },
                circle: { id: circleId }
            },
            relations: ['user', 'circle'] // 确保加载相关联的实体
        });
        userCircleExperience.experience += experience;
        await userCircleExperienceRepository.save(userCircleExperience);
    }
}