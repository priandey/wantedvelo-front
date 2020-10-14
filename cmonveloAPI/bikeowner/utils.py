import secrets
import random
import string

def generate_url_key():
    length = random.randint(5,10)
    key = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(length))
    return key