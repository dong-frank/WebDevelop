import { Controller, Get, Inject, Post } from '@midwayjs/core';
import { Context } from "@midwayjs/koa";
import { AppDataSource } from "../db";
import { InterestCircle } from "../entity/interest-circle";
import { User } from "../entity/user";
import * as jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

@Controller('/api')
export class HomeController {
  @Inject()
  ctx: Context;

  @Get('/interest-circles')
  async getInterestCircles() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const interestCircleRepository = AppDataSource.getRepository(InterestCircle);
    const interestCircles = await interestCircleRepository.find({ relations: ['users'] });
    console.log(interestCircles);
    this.ctx.body = {
      success: true,
      data: interestCircles
    }

  }

  @Post('/join-circle')
  async joinCircle() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const token = ((this.ctx.request.body as { token: string }).token);
    const circleId = ((this.ctx.request.body as { circleId: number, userId: number }).circleId);

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, 'your_jwt_secret') as JwtPayload;
    } catch (err) {
      console.error(err);
      this.ctx.status = 401;
      return { message: '用户不存在,请先注册或登录' };
    }
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id }, relations: ['circles'] });
    const interestCircleRepository = AppDataSource.getRepository(InterestCircle);
    const interestCircle = await interestCircleRepository.findOne({ where: { id: circleId }, relations: ['users'] });
    if (!interestCircle.users.some(u => u.id === user.id)) {
      interestCircle.users.push(user);
      await interestCircleRepository.save(interestCircle);
      const interestCircleNew = await interestCircleRepository.findOne({ where: { id: circleId } });
      user.circles.push(interestCircleNew);
      await userRepository.save(user);
      return { message: '加入成功' };
    } else {
      return { message: '加入失败,您已加入该圈子' };
    }

  }

  @Post('/create-circle')
  async createCircle() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const token = ((this.ctx.request.body as { token: string }).token);
    const circleName = ((this.ctx.request.body as { name: string }).name)
    const avatar = ((this.ctx.request.body as { avatar: string }).avatar)
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, 'your_jwt_secret') as JwtPayload;
    } catch (err) {
      console.error(err);
      this.ctx.status = 401;
      return { message: '用户不存在,请先注册或登录' };
    }
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id }, relations: ['circles'] });
    const interestCircleRepository = AppDataSource.getRepository(InterestCircle);
    if (!interestCircleRepository.findOne({ where: { name: circleName } })) {
      const interestCircle = new InterestCircle();
      interestCircle.name = circleName;
      interestCircle.avatar = avatar;
      interestCircle.users = [user];
      await interestCircleRepository.save(interestCircle);
      user.circles.push(interestCircle);
      await userRepository.save(user);
      return { message: '创建成功' };
    } else {
      return { message: '创建失败,该圈子已存在' };
    }
  }
}
