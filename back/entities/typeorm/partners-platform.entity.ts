import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PartnersPlatform {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    unique: true,
    nullable: false,
  })
  name: string;
}
