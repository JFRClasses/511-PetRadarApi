import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private emails: string[] = ['devjdfr@gmail.com'];
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.MAILER_SERVICE,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_TOKEN,
      },
    });
  }

  async sendEmail() {
    await this.transporter.sendMail({
      to: 'devjdfr@gmail.com',
      subject: 'Hola',
      text: 'Hola envio un correo',
    });
  }
}
