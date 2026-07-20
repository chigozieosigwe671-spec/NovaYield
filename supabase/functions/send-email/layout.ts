export function emailLayout(title: string, body: string) {
  return `
  <div style="font-family:Arial,sans-serif;background:#f5f5f5;padding:40px;">
    <div style="max-width:650px;margin:auto;background:#fff;border-radius:12px;overflow:hidden;">

      <div style="background:#E31E24;padding:25px;text-align:center;">

            <img
                src="https://novayield.netlify.app/og-image.jpg"
                alt="NovaYield"
                style="height:70px;max-width:220px;display:block;margin:0 auto;"
            />

      </div>
      <div style="padding:35px;">
        <h2>${title}</h2>

        ${body}

        <hr style="margin:30px 0">

        <p style="color:#666;">
          Thank you for choosing NovaYield.
        </p>

        <p style="color:#999;font-size:13px;">
          Need help? novayieldhelp@gmail.com
        </p>
      </div>

      <div style="background:#fafafa;padding:15px;text-align:center;color:#999;font-size:12px;">
        © ${new Date().getFullYear()} NovaYield
      </div>

    </div>
  </div>
  `;
}