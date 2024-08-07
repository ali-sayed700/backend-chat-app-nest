import { Message } from 'src/message/message.entity';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @ManyToOne(() => User, (user) => user.rooms, { nullable: true })
  userId: User;

  @JoinTable()
  @ManyToMany(() => User, (user) => user.participants, { cascade: true })
  participants: User[];

  @JoinTable()
  @ManyToMany(() => User, (user) => user.admins, { cascade: true })
  admins: User[];

  @OneToMany(() => Message, (message) => message.roomId)
  messages: Message[];

  @Column({ nullable: true })
  public description: string;

  @Column({ length: 50 })
  public name: string;

  @Column({ nullable: true })
  public image: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
