import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Projects {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  name: string;

  @Column({
    unique: true,
  })
  path: string;

  @Column()
  currentBranch: string;

  @Column({ nullable: true })
  setupCommand: string;

  @Column({ nullable: true })
  lastSetupDate: Date;

  @Column({ nullable: true })
  setupErrorDetails: string;

  @Column({ nullable: true })
  lastInstallationStatus: boolean;

  @Column()
  url: string;
}
