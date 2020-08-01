import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { KAFAK_ORDER_SEND_TOPIC, KAFKA_BROKER, KAFKA_CLIENT_ID } from "src/configuration/constants";
import { Kafka, Producer } from 'kafkajs';

@Injectable()
export class MessagePublisher implements OnModuleInit, OnModuleDestroy {
    private producer: Producer;

    constructor() {
        const kafkaConfig: Kafka = new Kafka({
            brokers: [KAFKA_BROKER],
            clientId: KAFKA_CLIENT_ID
        });
        this.producer = kafkaConfig.producer();
    }
    async onModuleDestroy() {
        try {
            await this.producer.disconnect();
        } catch (error) {
            console.log(error);
        }
    }
    async onModuleInit() {
        try {
            await this.producer.connect();
        } catch (error) {
            console.log(error);
        }
    }

    publish(transactionId: string, payloadMessage: any): Promise<any> {
        const message = {
            payloadMessage,
            transactionId
        }
        return this.producer
            .send({
                topic: KAFAK_ORDER_SEND_TOPIC,
                messages: [{ value: JSON.stringify(message) }],
            })
            .catch(e => console.error(e.message, e));

    }


}