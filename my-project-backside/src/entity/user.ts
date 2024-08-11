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

  @Column()
  avatar: string;

  @ManyToMany(() => InterestCircle, circle => circle.users)
  @JoinTable()
  circles: InterestCircle[];

  @OneToMany(() => UserCircleExperience, experience => experience.user)
  circleExperiences: UserCircleExperience[];
}