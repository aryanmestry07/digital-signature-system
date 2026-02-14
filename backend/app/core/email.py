import smtplib
from email.message import EmailMessage

def send_email(to_email: str, subject: str, body: str):
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = "aryanmestry264@gmail.com"
    msg["To"] = to_email
    msg.set_content(body)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
        smtp.login("aryanmestry264@gmail.com", "aryan@12345")
        smtp.send_message(msg)
