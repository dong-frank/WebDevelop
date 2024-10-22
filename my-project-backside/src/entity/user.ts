import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable ,OneToMany } from 'typeorm';
import { InterestCircle } from "./interest-circle";
import { UserCircleExperience } from './user-circle-experience';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({default:'http//127.0.0.1:3000/default_avatar.jpg'})
  avatar: string;

  @ManyToMany(() => InterestCircle, circle => circle.users)
  @JoinTable()
  circles: InterestCircle[];

  @OneToMany(() => UserCircleExperience, experience => experience.user)
  circleExperiences: UserCircleExperience[];
}