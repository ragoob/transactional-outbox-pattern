import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { KAFAKA_ORDERR_READ_TOPIC, KAFKA_BROKER, KAFKA_GROUP_ID } from "src/configuration/constants";
import { Consumer, Kafka } from 'kafkajs';
import { timeStamp } from "console";
import { OrderTransaction } from "src/models/order-document";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class MessagePublisher implements OnModuleInit, OnModuleDestroy {

    private consumer: Consumer;

    constructor(@InjectModel(OrderTransaction.name) private orderTransactionModel: Model<OrderTransaction>) {
        const kafkaConfig: Kafka = new Kafka({
            brokers: [KAFKA_BROKER],
        });

        this.consumer = kafkaConfig.consumer({ groupId: KAFKA_GROUP_ID });
    }
    async onModuleDestroy() {
        try {
            await this.consumer.disconnect();
        } catch (error) {
            console.log(error);
        }
    }
    async onModuleInit() {
        try {
            await this.consumer.connect();
            await this.consumer.subscribe({ topic: KAFAKA_ORDERR_READ_TOPIC, fromBeginning: false });
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    const payload: any = JSON.parse(message.value.toString());
                    const createdTransaction = new this.orderTransactionModel({
                        transactionId: payload.transactionId,
                        order: payload.payloadMessage

                    });
                    await createdTransaction.save();
                    console.log({
                        value: message.value.toString(),
                    })
                },
            })

        } catch (error) {
            console.log(error);
        }
    }




}