import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from "typeorm";
import { User } from "./user";
import { UserCircleExperience } from './user-circle-experience';

@Entity()
export class InterestCircle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    intro: string;

    @Column({ default: 'http://127.0.0.1:3000/default_avatar.png' })
    avatar: string;

    @ManyToMany(() => User, user => user.circles)
    users: User[];

    @OneToMany(() => UserCircleExperience, experience => experience.circle)
    userExperiences: UserCircleExperience[];

}