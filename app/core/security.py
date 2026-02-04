import os
import base64
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from app.core.config import settings

class Security:
    def __init__(self, key: str = None):
        # AES-256-GCM needs a 32-byte key. 
        # We derive it from our SECRET_KEY or a dedicated ENCRYPTION_KEY
        key_str = key or settings.SECRET_KEY
        # Ensure key is 32 bytes for AES-256
        self.key = key_str.encode().ljust(32)[:32]
        self.aesgcm = AESGCM(self.key)

    def encrypt(self, data: str) -> str:
        """Encrypt data using AES-256-GCM"""
        if not data:
            return ""
        nonce = os.urandom(12)
        ciphertext = self.aesgcm.encrypt(nonce, data.encode(), None)
        # Store nonce + ciphertext as base64
        return base64.b64encode(nonce + ciphertext).decode('utf-8')

    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt data using AES-256-GCM"""
        if not encrypted_data:
            return ""
        try:
            raw_data = base64.b64decode(encrypted_data)
            nonce = raw_data[:12]
            ciphertext = raw_data[12:]
            decrypted = self.aesgcm.decrypt(nonce, ciphertext, None)
            return decrypted.decode('utf-8')
        except Exception:
            return "Decryption failed"

security_manager = Security()
