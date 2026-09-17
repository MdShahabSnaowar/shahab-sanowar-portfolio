import os
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


def send_email(to_email, subject, text_body, reply_to=None):
    if not BREVO_API_KEY or not EMAIL_USERNAME:
        raise RuntimeError("Brevo email configuration is missing")

    payload = {
        "sender": {
            "name": EMAIL_FROM_NAME,
            "email": EMAIL_USERNAME,
        },
        "to": [
            {"email": to_email}
        ],
        "subject": subject,
        "textContent": text_body,
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
        # Send both emails through Brevo over HTTPS.
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
        # Do not expose Brevo API credentials or internal details to the browser.
        app.logger.exception("Portfolio contact email failed: %s", exc)
        return jsonify({
            "ok": False,
            "message": "Unable to send your message right now. Please try again."
        }), 500


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=False)
