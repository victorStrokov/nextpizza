import { Resend } from 'resend';
import { PayOrderTemplate } from '../components/shared/email-templates/pay-order';

export const sendEmail = async (
  to: string,
  subject: string,
  template: React.ReactNode
) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'strokof2@gmail.com',
    subject: 'Hello World',
    text: 'HI THERE',
    react: template,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
