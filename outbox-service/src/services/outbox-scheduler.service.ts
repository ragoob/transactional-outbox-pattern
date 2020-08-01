import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule/dist/decorators/cron.decorator";
import { CronExpression } from "@nestjs/schedule/dist/enums/cron-expression.enum";
import { OrderOutBox } from "src/models/order-outbox.entity";
import { Order } from "src/models/order.entity";
import { MessagePublisher } from "./message-publisher.service";
import { OrderService } from "./order.service";

@Injectable()
export class OutBoxSchedulerService {
    private readonly logger = new Logger(OutBoxSchedulerService.name);
    constructor(private messagePublisher: MessagePublisher, private orderService: OrderService) {

    }



    //every min start after 45 sc
    @Cron('45 * * * * *')
    async handleCron() {
        const outbox: OrderOutBox[] = await this.orderService.getunSentOrders();
        const orders: Order[] = await this.orderService.getOrdersByIds(outbox.map(i => i.order_id));
        outbox.forEach(async b => {
            const order = orders.find(o => o.order_id == b.order_id);
            await this.messagePublisher.publish(b.operation_id, order);
            await this.orderService.markTransactionAsSent(b);
        });
    }

}