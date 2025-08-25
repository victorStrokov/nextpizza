'use server';

import nodemailer from 'nodemailer';
import validator from 'validator';

/**
 * Отправка письма через SMTP (Яндекс)
 * @param to — email получателя
 * @param subject — тема письма
 * @param htmlContent — готовый HTML письма
 */

export async function sendEmail(
  to: string,
  subject: string,
  htmlContent: string,
  textContent?: string
) {
  if (!validator.isEmail(to)) {
    throw new Error(`Invalid email address: ${to}`);
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: process.env.YANDEX_EMAIL,
      pass: process.env.YANDEX_APP_PASSWORD,
    },
  });
  // Проверка подключения к SMTP
  await transporter.verify();

  // Генерация текстовой версии письма
  const plainText = htmlContent
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // убираем стили
    .replace(/<[^>]+>/g, '') // убираем все HTML-теги
    .replace(/\s+/g, ' ') // убираем лишние пробелы
    .trim(); // обрезаем пробелы по краям

  // Отправка письма
  const info = await transporter.sendMail({
    from: `"Next Pizza" <${process.env.YANDEX_EMAIL}>`,
    to,
    subject,
    html: htmlContent,
    text: textContent ?? plainText,
  });

  console.log('📨 Email sent successfully:', info.messageId);
  console.log('📦 SMTP response:', info);

  return info;
}
