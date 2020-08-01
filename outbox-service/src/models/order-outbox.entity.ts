import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';
@Entity()
export class OrderOutBox {
    @PrimaryColumn({ type: "uuid" })
    @Generated("uuid") operation_id: string;
    @Column()
    operation_type: 'insert' | 'update' | 'delete';
    @Column()
    order_id: number;
    @Column({ nullable: true })

    sent_date?: Date;
}