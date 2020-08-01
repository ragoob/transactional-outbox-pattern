import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Logger, Post, Query, UseGuards } from '@nestjs/common';
import { Order } from 'src/models/order.entity';
import { OrderService } from 'src/services/order.service';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {

    }

    @Post()
    @HttpCode(201)
    public async create(@Body() order: Order): Promise<any> {
        if (order) {
            try {
                return await this.orderService.createOrder(order);

            } catch (error) {
                return new HttpException({ status: HttpStatus.INTERNAL_SERVER_ERROR, error: `Error, unable to save order ${error}` }, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        return new HttpException({ status: HttpStatus.BAD_REQUEST, error: `Bad request, the request body is not valid` }, HttpStatus.BAD_REQUEST);

    }

}
