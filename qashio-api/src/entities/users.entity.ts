import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  created_at: Date | null;

  @UpdateDateColumn({ type: 'timestamptz', nullable: true })
  updated_at: Date | null;
}
