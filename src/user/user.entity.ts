import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Room } from 'src/room/room.entity';
import { Message } from 'src/message/message.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20 })
  public username: string;

  @Column({ unique: true, length: 100 })
  public email: string;

  @Column()
  public password: string;

  @Column({ nullable: true })
  public about: string;

  @Column({
    default:
      'https://res.cloudinary.com/dtzs4c2uv/image/upload/v1666326774/noavatar_rxbrbk.png',
  })
  public image: string;

  @Column('uuid', { array: true, default: [] })
  public friends: string[];

  @Column('uuid', { array: true, default: [] })
  public blocked: string[];

  @Column('uuid', { array: true, default: [] })
  public requests: string[];

  @OneToMany(() => Room, (room) => room.userId)
  rooms: Room[];

  @ManyToMany(() => Room, (room) => room.participants)
  participants: Room[];

  @ManyToMany(() => Room, (room) => room.admins)
  admins: Room[];

  @OneToMany(() => Message, (message) => message.userId)
  messages: Message[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @BeforeInsert()
  // @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
