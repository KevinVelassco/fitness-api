import { ApiProperty } from '@nestjs/swagger';

import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Entity({ name: 'users' })
@Unique('uq_user_auth_uid', ['authUid'])
@Unique('uq_user_email', ['email'])
@Unique('uq_user_phone', ['phone'])
export class User {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: '034fcf6f-c5e4-4910-8b74-c0fa3bde9208',
    uniqueItems: true,
  })
  @Generated('uuid')
  @Column({ name: 'auth_uid' })
  authUid: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @ApiProperty()
  @Column({ name: 'last_name', type: 'varchar', length: 100 })
  lastName: string;

  @ApiProperty({ uniqueItems: true })
  @Column({ type: 'varchar', length: 100 })
  email: string;

  @ApiProperty({ uniqueItems: true, required: false })
  @Column({ type: 'varchar', length: 10, nullable: true })
  phone?: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Exclude()
  @Column({ name: 'is_admin', type: 'bool', default: false })
  isAdmin: boolean;

  @Exclude()
  @Column({ name: 'is_active', type: 'bool', default: true })
  isActive: boolean;

  @Exclude()
  @Column({ name: 'verified_email', type: 'bool', default: false })
  verifiedEmail: boolean;

  @ApiProperty()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (!this.password) return;

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async checkPassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
