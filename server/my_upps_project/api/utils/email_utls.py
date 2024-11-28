
from django.core.mail import EmailMultiAlternatives
from django.core.mail import get_connection

def send_email(subject, message, from_email, recipient_list, host_user, host_password, fail_silently=False):
    connection = get_connection(
        backend="django.core.mail.backends.smtp.EmailBackend",
        host="smtp.gmail.com",
        port=587,
        username=host_user,
        password=host_password,
        use_tls=True,
    )
    email = EmailMultiAlternatives(
        subject, message, from_email, recipient_list, connection=connection
    )
    email.send(fail_silently=fail_silently)