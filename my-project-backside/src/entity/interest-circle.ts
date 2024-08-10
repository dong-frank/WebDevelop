import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { User } from "./user";

@Entity()
export class InterestCircle {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column( {default: 'http://127.0.0.1:3000/default_avatar.png'})
    avatar: string;

    @ManyToMany(() => User, user => user.circles)
    users: User[];

}