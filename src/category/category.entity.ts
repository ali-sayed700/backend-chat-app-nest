import { Product } from 'src/product/product.entity';
import {
  Column,
  Entity,
  ManyToMany,
  // JoinColumn,
  // OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  name: string;

  // @OneToMany(() => Product, (prod) => prod.category, { cascade: true }) // specify inverse side as a second parameter
  // prods: Product[];
  @ManyToMany(() => Product, (prod) => prod.category)
  prods: Product[];
}
