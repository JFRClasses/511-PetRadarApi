import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import 'dotenv/config';
import { envs } from 'src/config/envs';
@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private emails: string[] = ['devjdfr@gmail.com'];
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: envs.MAILER_SERVICE,
      auth: {
        user: envs.MAILER_USER,
        pass: envs.MAILER_TOKEN,
      },
    });
  }

  async sendEmail(template:string) {
    await this.transporter.sendMail({
      to: 'devjdfr@gmail.com',
      subject: 'Mascota Perdida',
      html:template,
    });
  }
}
