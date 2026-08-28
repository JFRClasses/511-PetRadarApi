import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { Point } from 'typeorm';
@Entity('SYSTEM_USER')
export class User{
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    name!: string 
    @Column()
    lastName!: string 
    @Column()
    email!: string 
    @Column()
    password!: string 
    @Column()
    isPetAlertEnabled!: boolean 
    @Column({
        spatialFeatureType: 'Point',
        type: 'geometry',
        srid: 4326
    })
    location?: Point 
    @Column()
    radius!:number
}