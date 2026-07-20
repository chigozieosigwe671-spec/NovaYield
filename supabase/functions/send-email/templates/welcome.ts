import { emailLayout } from "../layout.ts";

export function welcomeTemplate(data: any) {
  return emailLayout(
    "Welcome to NovaYield",
    `
      <p>Hello <strong>${data?.name || "Investor"}</strong>,</p>

      <p>Your account has been created successfully.</p>

      <p>We're excited to welcome you to NovaYield.</p>

      <p>You can now:</p>

      <ul>
        <li>Deposit funds</li>
        <li>Start investing</li>
        <li>Track profits</li>
        <li>Earn referral bonuses</li>
      </ul>

      <p>
        <a href="${data?.loginUrl || "https://novayield.netlify.app/login"}"
        style="background:#E31E24;color:white;padding:12px 20px;border-radius:6px;text-decoration:none;">
        Login
        </a>
      </p>
    `
  );
}