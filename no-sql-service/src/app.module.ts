import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderTransaction, OrderTransactionSchema } from './models/order-document';
import { MessagePublisher } from './services/message-subscriber.service';

@Module({
  imports: [MongooseModule.forRoot('mongodb://mybuild.centralus.cloudapp.azure.com:27017', {
    user: 'root',
    pass: 'P@ssw0rd',
    dbName: 'order-logger',

  }),
  MongooseModule.forFeature([{ name: OrderTransaction.name, schema: OrderTransactionSchema }])
  ],
  controllers: [AppController],
  providers: [AppService, MessagePublisher],
})
export class AppModule { }
