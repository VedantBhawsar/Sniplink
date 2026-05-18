import { Resend } from 'resend';
import { RESEND_API_KEY, CLIENT_URL, EMAIL_FROM } from '../config/constant';

const resend = new Resend(RESEND_API_KEY);

export async function sendPasswordResetEmail(
  to: string,
  name: string,
  token: string,
): Promise<void> {
  const resetUrl = `${CLIENT_URL}/reset-password?token=${token}`;

  await resend.emails.send({
    from: EMAIL_FROM,
    to,
    subject: 'Reset your Sniplink password',
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#111">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:32px">
          <div style="width:36px;height:36px;background:#6366f1;border-radius:10px;display:flex;align-items:center;justify-content:center">
            <span style="color:#fff;font-size:18px;font-weight:bold">S</span>
          </div>
          <span style="font-size:18px;font-weight:700;font-family:monospace">Sniplink</span>
        </div>

        <h1 style="font-size:22px;font-weight:700;margin:0 0 8px">Reset your password</h1>
        <p style="color:#555;margin:0 0 24px">Hi ${name}, we received a request to reset your password. Click the button below — this link expires in 1 hour.</p>

        <a href="${resetUrl}"
           style="display:inline-block;background:#6366f1;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600;font-size:14px">
          Reset password
        </a>

        <p style="margin:24px 0 0;font-size:13px;color:#888">
          If you didn't request this, you can safely ignore this email. Your password won't change.
        </p>
        <p style="margin:8px 0 0;font-size:12px;color:#aaa">
          Or copy this link: <a href="${resetUrl}" style="color:#6366f1">${resetUrl}</a>
        </p>
      </div>
    `,
  });
}
