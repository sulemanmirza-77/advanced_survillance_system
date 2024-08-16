import os
import smtplib
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart


def send_mail(img_file_name, sender_email, sender_password, recipient_email):
    try:
        # Read the image data
        with open(img_file_name, 'rb') as img_file:
            img_data = img_file.read()

        # Create a multipart message
        msg = MIMEMultipart()
        msg['Subject'] = 'Fall Alert'
        msg['From'] = sender_email
        msg['To'] = recipient_email

        # Add text to the email
        text = MIMEText("Fall Detected. Send HELP")
        msg.attach(text)

        # Attach the image
        image = MIMEImage(img_data, name=os.path.basename(img_file_name))
        msg.attach(image)

        # Send the email
        with smtplib.SMTP('smtp.gmail.com', 587) as s:
            s.starttls()
            s.login(sender_email, sender_password)
            s.sendmail(sender_email, recipient_email, msg.as_string())

        print("Email sent successfully.")

    except FileNotFoundError:
        print(f"Error: The file '{img_file_name}' does not exist.")
    except smtplib.SMTPAuthenticationError:
        print("Error: Authentication failed. Check your email and password.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

# Example usage:
# send_mail('car_sale.png', 'aisssurvellence@gmail.com', 'aisssurvellence.com', 'shakeelsial05@gmail.com')
