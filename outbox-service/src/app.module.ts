import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { OrderController } from './order.controller';
import { OrderService } from './services/order.service';
import { Order } from './models/order.entity';
import { OrderOutBox } from './models/order-outbox.entity';
import { ScheduleModule } from '@nestjs/schedule/dist/schedule.module';
import { OutBoxSchedulerService } from './services/outbox-scheduler.service';
import { MessagePublisher } from './services/message-publisher.service';
@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        "type": "postgres",
        "host": "mybuild.centralus.cloudapp.azure.com",
        "port": 5432,
        "username": "postgres",
        "password": "outbox-P@ssword",
        "database": "Transactional-outbox",
        "logging": true,
        "autoLoadEntities": true,
        "synchronize": true,
        "entities": [
          "dist/**/*.entity.{ts,js}",

        ]
      }),
    TypeOrmModule.forFeature([
      Order,
      OrderOutBox
    ]),
    ScheduleModule.forRoot()
  ],
  controllers: [AppController, OrderController],
  providers: [AppService, OrderService, MessagePublisher, OutBoxSchedulerService],
})
export class AppModule { }
