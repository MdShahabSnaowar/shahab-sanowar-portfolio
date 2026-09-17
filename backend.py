import os
import smtplib
from email.message import EmailMessage
from datetime import datetime, timezone

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)

# Allow the portfolio frontend to call this API.
# For production, replace "*" with your exact portfolio domain.
CORS(app, resources={r"/api/*": {"origins": "*"}})

SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
EMAIL_USERNAME = os.getenv("EMAIL_USERNAME", "").strip()
EMAIL_APP_PASSWORD = os.getenv("EMAIL_APP_PASSWORD", "").strip()
OWNER_EMAIL = os.getenv("OWNER_EMAIL", EMAIL_USERNAME).strip()

REQUIRED_FIELDS = ("name", "email", "service")


def send_email(to_email, subject, text_body, reply_to=None):
    if not EMAIL_USERNAME or not EMAIL_APP_PASSWORD:
        raise RuntimeError("Email credentials are missing in .env")

    msg = EmailMessage()
    msg["From"] = EMAIL_USERNAME
    msg["To"] = to_email
    msg["Subject"] = subject

    if reply_to:
        msg["Reply-To"] = reply_to

    msg.set_content(text_body)

    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as server:
        server.starttls()
        server.login(EMAIL_USERNAME, EMAIL_APP_PASSWORD)
        server.send_message(msg)


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

    missing = [field for field in REQUIRED_FIELDS if not str(data.get(field, "")).strip()]
    if missing:
        return jsonify({
            "ok": False,
            "message": "Please fill all required fields."
        }), 400

    if len(name) > 120 or len(visitor_email) > 254 or len(service) > 120 or len(message) > 5000:
        return jsonify({
            "ok": False,
            "message": "One or more fields are too long."
        }), 400

    # Basic email validation. The browser also validates the email field.
    if "@" not in visitor_email or "." not in visitor_email.split("@")[-1]:
        return jsonify({
            "ok": False,
            "message": "Please enter a valid email address."
        }), 400

    submitted_at = datetime.now(timezone.utc).astimezone().strftime("%d %b %Y, %I:%M %p")

    # 1) Email sent to Shahab
    owner_subject = f"New Portfolio Contact — {name}"
    owner_body = f"""Hello Shahab,

Someone has contacted you through your portfolio website.

CONTACT DETAILS
----------------
Name: {name}
Email: {visitor_email}
Service Needed: {service}
Submitted: {submitted_at}

MESSAGE
----------------
{message}

You can reply directly to this email to respond to {name}.

— Portfolio Contact System
"""

    # 2) Thank-you email sent to the visitor
    visitor_subject = "Thank You for Reaching Out — Shahab Sanowar"
    visitor_body = f"""Hi {name},

Thank you for reaching out through my portfolio website.

I've received your message regarding "{service}" and will review the details carefully. I'll get back to you as soon as possible.

I appreciate you taking the time to share your idea with me.

Best regards,
Shahab Sanowar
Backend Developer | Python & Django
"""

    try:
        # Send both emails from the server using the Gmail App Password.
        send_email(
            OWNER_EMAIL,
            owner_subject,
            owner_body,
            reply_to=visitor_email,
        )

        send_email(
            visitor_email,
            visitor_subject,
            visitor_body,
        )

        return jsonify({
            "ok": True,
            "message": "Message sent successfully. Thank you!"
        })

    except Exception as exc:
        # Do not expose SMTP credentials or internal details to the browser.
        app.logger.exception("Portfolio contact email failed: %s", exc)
        return jsonify({
            "ok": False,
            "message": "Unable to send your message right now. Please try again."
        }), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=False)
