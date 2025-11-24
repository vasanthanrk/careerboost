from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from jinja2 import Environment, FileSystemLoader
import os

config = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT")),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
)

template_env = Environment(
    loader=FileSystemLoader("app/templates/email_templates")
)

async def send_email(template_name, subject, recipients, data):
    template = template_env.get_template(template_name)
    html_content = template.render(data)

    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        body=html_content,
        subtype="html",
    )

    fm = FastMail(config)
    await fm.send_message(message)

def new_user_mail_to_user(background_tasks, recipients, data):
    background_tasks.add_task(
        send_email,
        template_name="welcome_user.html",
        subject="Welcome to SmartCV Maker",
        recipients=recipients,
        data=data
    )

def new_user_mail_to_admin(background_tasks, recipients, data):
    background_tasks.add_task(
        send_email,
        template_name="admin_new_user_alert.html",
        subject="New User Registration",
        recipients=recipients,
        data=data
    )