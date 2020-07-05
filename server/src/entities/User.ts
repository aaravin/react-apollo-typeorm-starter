import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
} from 'typeorm';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column({ nullable: true })
  profileImageURL: string;
}
