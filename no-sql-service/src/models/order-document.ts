
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { json } from 'express';
import { Document } from 'mongoose';

@Schema()
export class OrderTransaction extends Document {
    @Prop()
    transactionId: string;

    @Prop({ type: json })
    order: any;


}

export const OrderTransactionSchema = SchemaFactory.createForClass(OrderTransaction);