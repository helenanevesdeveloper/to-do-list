import hashlib
import hmac
import secrets
from dataclasses import dataclass

from app.application.ports.password_hasher import PasswordHasher
from app.domain.validation import require_non_empty_string


@dataclass(slots=True, frozen=True)
class PBKDF2PasswordHasher(PasswordHasher):
    iterations: int = 600_000
    salt_bytes: int = 16
    algorithm: str = "sha256"

    def hash(self, password: str) -> str:
        require_non_empty_string(password, field_name="password")

        salt = secrets.token_bytes(self.salt_bytes)
        derived_key = hashlib.pbkdf2_hmac(
            self.algorithm,
            password.encode("utf-8"),
            salt,
            self.iterations,
        )
        return (
            f"pbkdf2_{self.algorithm}"
            f"${self.iterations}"
            f"${salt.hex()}"
            f"${derived_key.hex()}"
        )

    def verify(self, password: str, encoded_hash: str) -> bool:
        require_non_empty_string(password, field_name="password")

        algorithm_label, iterations, salt_hex, digest_hex = encoded_hash.split(
            "$",
            maxsplit=3,
        )

        expected_label = f"pbkdf2_{self.algorithm}"
        if algorithm_label != expected_label:
            return False

        recalculated_digest = hashlib.pbkdf2_hmac(
            self.algorithm,
            password.encode("utf-8"),
            bytes.fromhex(salt_hex),
            int(iterations),
        )
        return hmac.compare_digest(recalculated_digest.hex(), digest_hex)
