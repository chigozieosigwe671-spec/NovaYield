import { emailLayout } from "../layout.ts";

export function investmentStartedTemplate(data: any) {
  return emailLayout(
    "Investment Activated",
    `
      <p>Hello <strong>${data?.name || "Investor"}</strong>,</p>

      <p>Congratulations! Your investment has been successfully activated.</p>

      <table style="width:100%;border-collapse:collapse;margin:25px 0;">
        <tr>
          <td style="padding:10px;border:1px solid #eee;"><strong>Investment Plan</strong></td>
          <td style="padding:10px;border:1px solid #eee;">${data?.plan || "N/A"}</td>
        </tr>

        <tr>
          <td style="padding:10px;border:1px solid #eee;"><strong>Investment Amount</strong></td>
          <td style="padding:10px;border:1px solid #eee;">$${data?.amount || 0}</td>
        </tr>

        <tr>
          <td style="padding:10px;border:1px solid #eee;"><strong>Daily Profit</strong></td>
          <td style="padding:10px;border:1px solid #eee;">$${data?.dailyProfit || 0}</td>
        </tr>

        <tr>
          <td style="padding:10px;border:1px solid #eee;"><strong>Status</strong></td>
          <td style="padding:10px;border:1px solid #eee;color:green;"><strong>ACTIVE</strong></td>
        </tr>
      </table>

      <p>
        Your investment has started earning according to your selected plan.
      </p>

      <p style="margin-top:30px;">
        <a
          href="https://novayield.netlify.app/dashboard"
          style="
            background:#E31E24;
            color:white;
            padding:12px 22px;
            border-radius:6px;
            text-decoration:none;
            display:inline-block;
          "
        >
          View Dashboard
        </a>
      </p>
    `
  );
}