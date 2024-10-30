import pyotp
import qrcode
import os
from urllib.parse import urljoin
from django.conf import settings
import random

def twofactorAuth(username):
    # Generate a random base32 key
    key = pyotp.random_base32()
    # Create a TOTP instance with the generated key
    totp = pyotp.TOTP(key)
    # Generate the provisioning URI for the TOTP instance
    url = totp.provisioning_uri(name=username, issuer_name='ft_transcendence')
    qrcode_dir = "/app/authentication/qrcodes"
    if not os.path.exists(qrcode_dir):
        os.makedirs(qrcode_dir)
    random_number = random.randint(0, 100000)
    num = random_number % 1000
    # qrcode_path = os.path.join(qrcode_dir, f'{username}.png')
    qrcode_path = os.path.join(qrcode_dir, f'{username}_{num}.png')
    qrcode.make(url).save(qrcode_path)
    otp = totp.now()
    return key, otp, qrcode_path, qrcode_dir
