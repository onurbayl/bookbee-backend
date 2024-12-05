import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "../user/user.entity";
import { CustomerAddress } from "../customer-address/customer-address.entity";
import { Coupon } from "../coupon/coupon.entity";

@Entity()
@Unique(["usedCoupon"])
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    @JoinColumn([{ name: 'user_id', referencedColumnName: 'id' }])
    user: User;

    @ManyToOne(() => CustomerAddress)
    @JoinColumn([{ name: 'address_id', referencedColumnName: 'id' }])
    address: CustomerAddress;

    @Column({ type: 'timestamp' })
    orderDate: Date;

    @ManyToOne(() => Coupon, { nullable: true })
    @JoinColumn([{ name: 'used_coupon_id', referencedColumnName: 'id' }])
    usedCoupon: Coupon | null;

    @Column({ type: 'numeric' })
    totalPrice: number;

}