import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { User } from './user';
import { InterestCircle } from './interest-circle';

@Entity()
export class UserCircleExperience {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.circleExperiences)
  user: User;

  @ManyToOne(() => InterestCircle, circle => circle.userExperiences)
  circle: InterestCircle;

  @Column()
  experience: number;
}