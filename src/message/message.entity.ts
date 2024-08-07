import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import { Room } from 'src/room/room.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Room, (room) => room.messages, { cascade: true })
  @JoinColumn({ name: 'room_id' })
  roomId: Room;

  @ManyToOne(() => User, (user) => user.messages, { cascade: true })
  @JoinColumn({ name: 'user_id' })
  userId: User;

  @Column()
  text: string;

  @Column('simple-array')
  images: string[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
