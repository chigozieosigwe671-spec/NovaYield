import { emailLayout } from "../layout.ts";

export function passwordResetTemplate(data: any) {
  return emailLayout(
    "Password Reset",
    `
      <p>Hello <strong>${data?.name || "Investor"}</strong>,</p>

      <p>We received a request to reset your NovaYield account password.</p>

      <p>Click the button below to reset your password.</p>

      <p style="margin:30px 0;">
        <a
          href="${data?.resetLink}"
          style="
            background:#E31E24;
            color:white;
            padding:12px 22px;
            border-radius:6px;
            text-decoration:none;
            display:inline-block;
          "
        >
          Reset Password
        </a>
      </p>

      <p>If you did not request a password reset, you can safely ignore this email.</p>

      <p>This link will expire automatically for your security.</p>
    `
  );
}