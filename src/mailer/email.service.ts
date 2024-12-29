import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { orderDetailsDTO } from 'src/app/order/dtos/order-details-dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendTestEmail(): Promise<void> {
    await this.mailerService.sendMail({
      to: 'metinsoyalp344@gmail.com',
      subject: 'Test Email',        // Subject of the email
      text: 'This is a test email from NestJS Mailer!',  // Plain text body
      html: '<b>This is a test email from NestJS Mailer!</b>',  // HTML body (optional)
    });
  }

  async sendOrderEmail(orderDetails: orderDetailsDTO): Promise<void> {

    const htmlContent = `
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Details</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border: 1px solid #ddd;
        }
        th {
          background-color: #f4f4f4;
        }
        h2 {
          color: #333;
        }
        .highlight {
          background-color: #f9f9f9;
        }
      </style>
    </head>
    <body>
      <h2>Order Details</h2>

      <p><strong>Order ID:</strong> ${orderDetails.id}</p>
      <p><strong>Order Date:</strong> ${new Date(orderDetails.orderDate).toLocaleString()}</p>

      <h3>User Details</h3>
      <p><strong>Name:</strong> ${orderDetails.user.name}</p>
      <p><strong>Email:</strong> ${orderDetails.user.email}</p>
      <p><strong>Address:</strong> ${orderDetails.addressInfo}</p>
      <p><strong>Balance:</strong> $${orderDetails.user.balance}</p>

      <h3>Order Items</h3>
      <table>
        <thead>
          <tr>
            <th>Book Name</th>
            <th>Writer</th>
            <th>Unit Price</th>
            <th>Quantity</th>
            <th>Discounted Price</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          ${orderDetails.orderItems
            .map(
              (item) => `
              <tr>
                <td>${item.book.name}</td>
                <td>${item.book.writer}</td>
                <td>$${item.unitPrice}</td>
                <td>${item.quantity}</td>
                <td>$${item.discountedPrice}</td>
                <td>$${item.totalPrice}</td>
              </tr>
            `
            )
            .join('')}
        </tbody>
      </table>

      <h3>Summary</h3>
      <p><strong>Subtotal:</strong> $${orderDetails.subtotal}</p>
      <p><strong>Coupon Discount:</strong> ${orderDetails.couponDiscountPercentage}%</p>
      <p><strong>Total Price (after discount):</strong> $${orderDetails.totalPrice}</p>

    </body>
    </html>
    `;

    await this.mailerService.sendMail({
      to: orderDetails.user.email,
      subject: 'Your Order has been completed.',
      text: 'This is a test email from NestJS Mailer!',
      html: htmlContent,
    });
  }

}