import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne, JoinColumn,CreateDateColumn,} from "typeorm"
import { User } from "./user.entity.js";

@Entity("otp")
export class Otp {
  @PrimaryGeneratedColumn()
  id!: string;

  @ManyToOne(() => User, {
    onDelete: "CASCADE",
  })
    @Column({type:"int"})
  userId!: number;
  @JoinColumn({ name: "userId" })
  user!: User;

  

  @Column({
    type: "varchar",
    length: 4,
  })
  otp!: string;


  @Column({
    type: "timestamp",
  })
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}