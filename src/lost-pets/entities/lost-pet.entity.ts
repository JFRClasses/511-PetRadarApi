import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import type { Point } from 'typeorm';
@Entity('LOST_PET')
export class LostPet{
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    type!: string;

    @Column()
    name!: string;

    @Column({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326
    })
    location!: Point

    @Column()
    phone!: string;

    @Column()
    race!: string;

    @Column()
    age!: number;

    @Column()
    color!: string;

    @Column()
    ownerName!: string;
}