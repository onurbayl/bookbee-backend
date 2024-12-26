import { orderItemDetailsDTO } from "src/app/order-item/dtos/order-item-details-dto";
import { User } from "src/app/user/user.entity"

export class orderDetailsDTO{
    id: number;
    user: User;
    addressInfo: string;
    orderDate: Date;
    subtotal: number;
    couponDiscountPercentage: number;
    totalPrice: number;
    orderItems: orderItemDetailsDTO[];
}