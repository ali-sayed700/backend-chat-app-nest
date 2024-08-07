import { Category } from 'src/category/category.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  // ManyToMany,
  // ManyToOne,
  // JoinColumn,
  // OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  product: string;

  // @OneToOne(() => Category, (category) => category.id) // specify inverse side as a second parameter
  @ManyToMany(() => Category, (category) => category.prods, { cascade: true }) // specify inverse side as a second parameter
  @JoinTable()
  category: Category[];
}
// @JoinColumn()
