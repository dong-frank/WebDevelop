import { Entity, PrimaryGeneratedColumn, Column , ManyToMany , JoinTable } from 'typeorm';
import { InterestCircle } from "./interest-circle";
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
}