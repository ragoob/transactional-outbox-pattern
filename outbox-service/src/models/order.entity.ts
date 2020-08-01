import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    order_id: number;
    @Column()
    order_total: number;
    @Column()
    order_desc: string;
}