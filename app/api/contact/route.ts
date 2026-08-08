import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

type Body = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const CONTACT_TO = process.env.CONTACT_TO_EMAIL;

async function sendMail(body: Body) {
  // If SMTP is fully configured, use it.
  if (SMTP_HOST && SMTP_USER && SMTP_PASS && CONTACT_TO) {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `${body.name || 'Website'} <${body.email || SMTP_USER}>`,
      to: CONTACT_TO,
      subject: body.subject || 'Website contact',
      text: `${body.message || ''}\n\nFrom: ${body.name || 'Anonymous'} <${body.email || ''}>`,
      html: `<p>${(body.message || '').replace(/\n/g, '<br/>')}</p><p>From: <strong>${body.name || 'Anonymous'}</strong> &lt;${body.email || ''}&gt;</p>`,
    });

    return { info };
  }

  // In development, fall back to Ethereal test account so messages can be previewed.
  if (process.env.NODE_ENV !== 'production') {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    const info = await transporter.sendMail({
      from: `${body.name || 'Website'} <${body.email || testAccount.user}>`,
      to: testAccount.user,
      subject: body.subject || 'Website contact (dev)',
      text: `${body.message || ''}\n\nFrom: ${body.name || 'Anonymous'} <${body.email || ''}>`,
      html: `<p>${(body.message || '').replace(/\n/g, '<br/>')}</p><p>From: <strong>${body.name || 'Anonymous'}</strong> &lt;${body.email || ''}&gt;</p>`,
    });

    const preview = nodemailer.getTestMessageUrl(info) || null;
    return { info, preview };
  }

  // Production without SMTP configured
  throw new Error('SMTP or contact configuration missing (set SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL)');
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;
    if (!body.email || !body.message || !body.name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await sendMail(body);
    return NextResponse.json({ ok: true, preview: result?.preview ?? null });
  } catch (err: any) {
    console.error('Contact API error', err);
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}
