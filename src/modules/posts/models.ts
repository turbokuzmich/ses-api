import { DataTypes } from 'sequelize';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { User } from '../users/models';
import * as _ from 'lodash';

@Table({
  tableName: 'posts',
  name: {
    singular: 'post',
    plural: 'posts',
  },
})
export class Post extends Model {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataTypes.TEXT)
  text!: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  userId!: number;

  @BelongsTo(() => User, 'userId')
  user!: User;

  get serialized() {
    return _.omit(this.toJSON(), ['updatedAt']);
  }
}

@Table({
  modelName: 'User',
  tableName: 'users',
})
export class UserWithPosts extends User {
  @HasMany(() => Post)
  posts?: Post[];
}
