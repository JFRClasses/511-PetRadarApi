import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('PENDING_EMAIL')
export class PendingEmail{
    @PrimaryGeneratedColumn()
    id!:number;
    @Column()
    payload!:string;
    @Column()
    isPending!: boolean;
    @Column()
    subject!:string;
    @Column()
    to!:string
}