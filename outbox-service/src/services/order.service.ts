import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderOutBox } from 'src/models/order-outbox.entity';
import { Order } from 'src/models/order.entity';
import { IsNull, Repository } from "typeorm";
import { getManager } from "typeorm";

@Injectable()
export class OrderService {

    constructor(
        @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderOutBox) private readonly orderOutboxRepository: Repository<OrderOutBox>
    ) {

    }
    public async createOrder(order: Order): Promise<void> {
        await getManager().transaction("SERIALIZABLE", async transactionalEntityManager => {
            await this.orderRepository.insert(order);
            const outbox: OrderOutBox = new OrderOutBox();
            outbox.order_id = order.order_id;
            outbox.operation_type = 'insert'
            await this.orderOutboxRepository.insert(outbox);
        });


    }

    public getunSentOrders(): Promise<OrderOutBox[]> {
        return this.orderOutboxRepository.find({ where: [{ sent_date: IsNull() }] });
    }

    public markTransactionAsSent(transaction: OrderOutBox): Promise<OrderOutBox> {
        transaction.sent_date = new Date(Date.now());
        return this.orderOutboxRepository.save(transaction);
    }

    public getOrdersByIds(ids: number[]): Promise<Order[]> {
        return this.orderRepository.findByIds(ids);
    }

}
