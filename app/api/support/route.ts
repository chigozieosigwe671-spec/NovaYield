import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { subject, message, email, name } = await req.json();

    const { error } = await resend.emails.send({
      from: "NovaYield <onboarding@resend.dev>",
      to: "novayieldhelp@gmail.com",
      subject: subject || "New Support Request",
      html: `
        <h2>New Support Request</h2>

        <p><strong>Name:</strong> ${name || "Unknown"}</p>

        <p><strong>Email:</strong> ${email || "Not provided"}</p>

        <p><strong>Message:</strong></p>

        <p>${message}</p>
      `,
    });

    if (error) {
      return NextResponse.json(error, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Support request sent successfully.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to send support request." },
      { status: 500 }
    );
  }
}