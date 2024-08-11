import { Controller, Get, Inject, Post, Fields } from '@midwayjs/core';
import { Context } from "@midwayjs/koa";
import { AppDataSource } from "../db";
import { InterestCircle } from "../entity/interest-circle";
import { User } from "../entity/user";
import { UserCircleExperience } from '../entity/user-circle-experience';
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

  @Post('/my-interest-circles')
  async getMyInterestCircles() {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const token = ((this.ctx.request.body as { token: string }).token);
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, 'your_jwt_secret') as JwtPayload;
    } catch (err) {
      console.error(err);
      this.ctx.status = 401;
      return { message: '用户不存在,请先注册或登录' };
    }
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.id }, relations: ['circles', 'circles.users'] });

    this.ctx.body = {
      success: true,
      data: user.circles
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
    const userCircleExperienceRepository = AppDataSource.getRepository(UserCircleExperience);
    if (!interestCircle.users.some(u => u.id === user.id)) {
      interestCircle.users.push(user);
      await interestCircleRepository.save(interestCircle);
      const interestCircleNew = await interestCircleRepository.findOne({ where: { id: circleId } });
      user.circles.push(interestCircleNew);
      await userRepository.save(user);
      const userCircleExperience = new UserCircleExperience();
      userCircleExperience.user = user;
      userCircleExperience.circle = interestCircle;
      userCircleExperience.experience = 0;
      await userCircleExperienceRepository.save(userCircleExperience);
      return { message: '加入成功' };
    } else {
      return { message: '加入失败,您已加入该圈子' };
    }

  }

  @Post('/create-circle')
  async createCircle(@Fields() fields: any) {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const { name, avatar, intro, token } = fields;
    // console.log(fields);
    console.log(name);
    console.log(avatar);
    console.log(intro);
    // const token = ((this.ctx.request.body as { token: string }).token);
    // const circleName = ((this.ctx.request.body as { name: string }).name)
    // const avatar = ((this.ctx.request.body as { avatar: string }).avatar)
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
    const userCircleExperienceRepository = AppDataSource.getRepository(UserCircleExperience);
    if (!await interestCircleRepository.findOne({ where: { name: name } })) {
      const interestCircle = new InterestCircle();
      interestCircle.name = name;
      interestCircle.avatar = avatar;
      interestCircle.users = [user];
      interestCircle.intro = intro;
      await interestCircleRepository.save(interestCircle);
      user.circles.push(interestCircle);
      await userRepository.save(user);
      const userCircleExperience = new UserCircleExperience();
      userCircleExperience.user = user;
      userCircleExperience.circle = interestCircle;
      userCircleExperience.experience = 0;
      await userCircleExperienceRepository.save(userCircleExperience);
      return { message: '创建成功' };
    } else {
      return { message: '创建失败,该圈子已存在' };
    }
  }

  @Get('/my-interest-circles-detail/:circleId')
  async getMyInterestCircle() {
    console.log('getMyInterestCircle', this.ctx.params.circleId);
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    const userCircleExperienceRepository = AppDataSource.getRepository(UserCircleExperience);

    const experiences = await userCircleExperienceRepository.find({
      where: {
        circle: { id: this.ctx.params.circleId },
      },
      relations: ['user', 'circle'],
    });

    if (experiences.length === 0) {
      return { message: '未找到经验记录' };
    }

    return experiences.map(exp => ({
      userId: exp.user.id,
      username: exp.user.username,
      circleId: exp.circle.id,
      experience: exp.experience,
    }));
  

  }
  

}
