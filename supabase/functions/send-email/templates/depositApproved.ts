import { emailLayout } from "../layout.ts";

export function depositApprovedTemplate(data: any) {
  return emailLayout(
    "Deposit Approved",
    `
      <p>Hello ${data?.name || "Investor"},</p>

      <p>Your deposit of <strong>$${data?.amount}</strong> has been approved.</p>

      <p>The funds have been credited to your wallet.</p>
    `
  );
}