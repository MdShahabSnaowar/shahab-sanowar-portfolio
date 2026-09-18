import os
import html
import requests
from datetime import datetime, timezone

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)

# Allow the portfolio frontend to call this API.
# For production, replace "*" with your exact portfolio domain.
CORS(app, resources={r"/api/*": {"origins": "*"}})

BREVO_API_KEY = os.getenv("BREVO_API_KEY", "").strip()
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME", "").strip()
EMAIL_FROM_NAME = os.getenv("EMAIL_FROM_NAME", "Shahab Sanowar").strip()
OWNER_EMAIL = os.getenv("OWNER_EMAIL", EMAIL_USERNAME).strip()

REQUIRED_FIELDS = ("name", "email", "service")


def send_email(to_email, subject, text_body, html_body, reply_to=None):
    if not BREVO_API_KEY or not EMAIL_USERNAME:
        raise RuntimeError("Brevo email configuration is missing")

    payload = {
        "sender": {
            "name": EMAIL_FROM_NAME,
            "email": EMAIL_USERNAME,
        },
        "to": [{"email": to_email}],
        "subject": subject,
        "textContent": text_body,
        "htmlContent": html_body,
    }

    if reply_to:
        payload["replyTo"] = {"email": reply_to}

    response = requests.post(
        "https://api.brevo.com/v3/smtp/email",
        headers={
            "accept": "application/json",
            "api-key": BREVO_API_KEY,
            "content-type": "application/json",
        },
        json=payload,
        timeout=30,
    )

    if not response.ok:
        raise RuntimeError(
            f"Brevo API error {response.status_code}: {response.text[:500]}"
        )


@app.get("/api/health")
def health():
    return jsonify({"ok": True, "service": "portfolio-contact-api"})


@app.post("/api/contact")
def contact():
    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    visitor_email = str(data.get("email", "")).strip()
    service = str(data.get("service", "")).strip()
    message = str(data.get("message", "")).strip()

    missing = [
        field for field in REQUIRED_FIELDS
        if not str(data.get(field, "")).strip()
    ]
    if missing:
        return jsonify({
            "ok": False,
            "message": "Please fill all required fields."
        }), 400

    if (
        len(name) > 120
        or len(visitor_email) > 254
        or len(service) > 120
        or len(message) > 5000
    ):
        return jsonify({
            "ok": False,
            "message": "One or more fields are too long."
        }), 400

    if "@" not in visitor_email or "." not in visitor_email.split("@")[-1]:
        return jsonify({
            "ok": False,
            "message": "Please enter a valid email address."
        }), 400

    submitted_at = datetime.now(timezone.utc).astimezone().strftime(
        "%d %b %Y, %I:%M %p"
    )

    # Escape visitor input before inserting it into HTML email.
    safe_name = html.escape(name)
    safe_email = html.escape(visitor_email, quote=True)
    safe_service = html.escape(service)
    safe_message = html.escape(
        message or "No additional message was provided."
    ).replace("\n", "<br>")
    safe_submitted_at = html.escape(submitted_at)

    # ======================================================
    # OWNER EMAIL
    # ======================================================

    owner_subject = f"New Portfolio Enquiry — {name}"

    owner_body = f"""Hello Shahab,

You have received a new enquiry through your portfolio website.

CONTACT DETAILS
Name: {name}
Email: {visitor_email}
Service Needed: {service}
Submitted: {submitted_at}

PROJECT MESSAGE
{message or "No additional message was provided."}

You can reply directly to this email to respond to {name}.

— Shahab Sanowar Portfolio
"""

    owner_html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Portfolio Enquiry</title>
</head>
<body style="margin:0;padding:0;background:#05090a;font-family:Arial,Helvetica,sans-serif;color:#e8f0f0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#05090a;padding:40px 15px;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;background:#081214;border:1px solid #153438;border-radius:18px;overflow:hidden;">
<tr><td style="padding:32px;border-bottom:1px solid #153438;">
<div style="font-size:12px;letter-spacing:3px;color:#16dfc2;font-weight:bold;margin-bottom:12px;">NEW PORTFOLIO ENQUIRY</div>
<div style="font-size:28px;line-height:1.3;font-weight:700;color:#ffffff;">Someone wants to <span style="color:#16dfc2;">work with you.</span></div>
</td></tr>
<tr><td style="padding:28px 32px 12px 32px;">
<p style="margin:0;font-size:16px;line-height:1.7;color:#a9b8bb;">A new person has contacted you through your portfolio website. Here are the details of the enquiry.</p>
</td></tr>
<tr><td style="padding:18px 32px 12px 32px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0c181a;border:1px solid #183b3e;border-radius:14px;"><tr><td style="padding:22px;">
<div style="font-size:11px;letter-spacing:2px;color:#16dfc2;font-weight:bold;margin-bottom:18px;">CONTACT DETAILS</div>
<div style="margin-bottom:18px;font-size:15px;line-height:1.6;color:#b6c4c6;"><strong style="color:#ffffff;">Name</strong><br>{safe_name}</div>
<div style="margin-bottom:18px;font-size:15px;line-height:1.6;color:#b6c4c6;"><strong style="color:#ffffff;">Email</strong><br><a href="mailto:{safe_email}" style="color:#16dfc2;text-decoration:none;">{safe_email}</a></div>
<div style="font-size:15px;line-height:1.6;color:#b6c4c6;"><strong style="color:#ffffff;">Service Needed</strong><br>{safe_service}</div>
</td></tr></table>
</td></tr>
<tr><td style="padding:12px 32px 18px 32px;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0c181a;border:1px solid #183b3e;border-radius:14px;"><tr><td style="padding:22px;">
<div style="font-size:11px;letter-spacing:2px;color:#16dfc2;font-weight:bold;margin-bottom:14px;">PROJECT MESSAGE</div>
<div style="font-size:15px;line-height:1.8;color:#c2ced0;">{safe_message}</div>
</td></tr></table>
</td></tr>
<tr><td style="padding:2px 32px 25px 32px;"><p style="margin:0;font-size:12px;color:#687b7e;">Submitted on {safe_submitted_at}</p></td></tr>
<tr><td style="padding:22px 32px;border-top:1px solid #153438;background:#071012;">
<p style="margin:0;font-size:13px;line-height:1.7;color:#708285;">You can simply reply to this email to respond to <strong style="color:#b8c7c9;">{safe_name}</strong>.</p>
<p style="margin:12px 0 0 0;font-size:12px;color:#16dfc2;">— Shahab Sanowar Portfolio</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
"""

    # ======================================================
    # CLIENT EMAIL
    # ======================================================

    visitor_subject = "Thanks for Reaching Out — Shahab Sanowar"

    visitor_body = f"""Hi {name},

Thank you for reaching out through my portfolio website.

I've successfully received your enquiry regarding "{service}".

I'll review the details you shared and get back to you as soon as possible.

I appreciate you taking the time to share your requirements with me.

Best regards,
Shahab Sanowar
Backend Developer | Python & Django
"""

    visitor_html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Thank You — Shahab Sanowar</title>
</head>
<body style="margin:0;padding:0;background:#05090a;font-family:Arial,Helvetica,sans-serif;color:#e8f0f0;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#05090a;padding:40px 15px;">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:620px;background:#081214;border:1px solid #153438;border-radius:18px;overflow:hidden;">
<tr><td style="padding:34px 32px;border-bottom:1px solid #153438;">
<div style="font-size:12px;letter-spacing:3px;color:#16dfc2;font-weight:bold;margin-bottom:14px;">SHAHAB SANOWAR</div>
<div style="font-size:30px;line-height:1.3;font-weight:700;color:#ffffff;">Thanks for <span style="color:#16dfc2;">reaching out.</span></div>
</td></tr>
<tr><td style="padding:32px;">
<p style="margin:0 0 18px 0;font-size:17px;line-height:1.6;color:#ffffff;">Hi {safe_name},</p>
<p style="margin:0 0 20px 0;font-size:15px;line-height:1.8;color:#a9b8bb;">Thank you for getting in touch through my portfolio website. I've successfully received your enquiry.</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0c181a;border:1px solid #183b3e;border-radius:14px;margin:24px 0;"><tr><td style="padding:22px;">
<div style="font-size:11px;letter-spacing:2px;color:#16dfc2;font-weight:bold;margin-bottom:10px;">YOUR ENQUIRY</div>
<div style="font-size:18px;line-height:1.5;color:#ffffff;font-weight:600;">{safe_service}</div>
</td></tr></table>
<p style="margin:0 0 22px 0;font-size:15px;line-height:1.8;color:#a9b8bb;">I'll review the details you shared and get back to you as soon as possible.</p>
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#071b18;border:1px solid #15564d;border-radius:12px;"><tr><td style="padding:18px 20px;">
<span style="display:inline-block;width:8px;height:8px;background:#16dfc2;border-radius:50%;margin-right:8px;"></span>
<span style="color:#16dfc2;font-size:14px;font-weight:bold;">Enquiry received successfully</span>
</td></tr></table>
<p style="margin:28px 0 0 0;font-size:15px;line-height:1.8;color:#a9b8bb;">I appreciate you taking the time to share your requirements with me.</p>
<p style="margin:28px 0 0 0;font-size:15px;line-height:1.8;color:#ffffff;">Best regards,<br><strong>Shahab Sanowar</strong><br><span style="color:#16dfc2;">Backend Developer</span> <span style="color:#718083;">· Python &amp; Django</span></p>
</td></tr>
<tr><td style="padding:22px 32px;border-top:1px solid #153438;background:#071012;">
<p style="margin:0;font-size:12px;line-height:1.7;color:#687b7e;">This is an automatic confirmation email from Shahab Sanowar's portfolio website.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>
"""

    try:
        # 1. New enquiry to Shahab
        send_email(
            OWNER_EMAIL,
            owner_subject,
            owner_body,
            owner_html,
            reply_to=visitor_email,
        )

        # 2. Confirmation to visitor/client
        send_email(
            visitor_email,
            visitor_subject,
            visitor_body,
            visitor_html,
        )

        return jsonify({
            "ok": True,
            "message": "Message sent successfully. Thank you!"
        })

    except Exception as exc:
        # Never expose Brevo API keys or internal provider errors.
        app.logger.exception(
            "Portfolio contact email failed: %s",
            exc
        )
        return jsonify({
            "ok": False,
            "message": "Unable to send your message right now. Please try again."
        }), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=False)
