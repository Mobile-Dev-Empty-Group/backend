import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Study App! Confirm your Email',
      html: `<p>Mã xác nhận của bạn là: <b>${token}</b></p>`, // HTML đơn giản
    });
  }

  async sendForgotPassword(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Password OTP',
      html: `<p>Mã OTP lấy lại mật khẩu của bạn là: <b>${otp}</b></p><p>Hết hạn sau 15 phút.</p>`,
    });
  }
}