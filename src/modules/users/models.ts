import { DataTypes } from 'sequelize';
import * as _ from 'lodash';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Index,
  Model,
  PrimaryKey,
  Table,
  Unique,
  Validate,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
})
export class User extends Model {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataTypes.TEXT)
  name!: string;

  @AllowNull(false)
  @Unique
  @Validate({ isEmail: true })
  @Column(DataTypes.TEXT)
  email!: string;

  @AllowNull(false)
  @Column(DataTypes.TEXT)
  password!: string;

  @Column(DataTypes.TEXT)
  fio?: string;

  @Column(DataTypes.STRING)
  vk?: string;

  @Column(DataTypes.STRING)
  telegram?: string;

  @HasMany(() => Subscription, 'userId')
  subscriptions?: Subscription[];

  @HasMany(() => Subscription, 'friendId')
  subscribers?: Subscription[];

  get serialized() {
    return _.omit(this.toJSON(), ['password', 'createdAt', 'updatedAt']);
  }
}

@Table({
  tableName: 'subscriptions',
})
export class Subscription extends Model {
  @Index({
    name: 'index_subscriptions_userid_friendid',
    type: 'UNIQUE',
    unique: true,
  })
  @PrimaryKey
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  userId!: number;

  @BelongsTo(() => User, 'userId')
  user!: User;

  @Index({
    name: 'index_subscriptions_userid_friendid',
    type: 'UNIQUE',
    unique: true,
  })
  @PrimaryKey
  @ForeignKey(() => User)
  @AllowNull(false)
  @Column(DataTypes.INTEGER)
  friendId!: number;

  @BelongsTo(() => User, 'friendId')
  friend!: User;
}
