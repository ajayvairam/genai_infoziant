import logging
from typing import Optional
from fastapi import Header, HTTPException, status
import jwt
from app.core.config import settings

logger = logging.getLogger(__name__)

class UserContext:
    def __init__(self, user_id: str, email: Optional[str] = None, is_guest: bool = False):
        self.user_id = user_id
        self.email = email or "guest@debugmate.local"
        self.is_guest = is_guest

async def get_current_user(authorization: Optional[str] = Header(None)) -> UserContext:
    """
    Extracts and validates user identity from the Authorization Bearer header.
    Supports:
    1. Supabase JWT tokens (verified using SUPABASE_JWT_SECRET if set)
    2. Guest/Anonymous sessions for instant out-of-the-box college demos
    """
    if not authorization:
        # Allow default guest mode for instant zero-friction demo
        return UserContext(user_id="guest-default-user", email="guest@debugmate.local", is_guest=True)
    
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected 'Bearer <token>'"
        )
    
    token = parts[1]
    
    if token.startswith("guest-"):
        return UserContext(user_id=token, email=f"{token}@debugmate.local", is_guest=True)

    # If Supabase JWT Secret is provided, decode and verify
    if settings.SUPABASE_JWT_SECRET:
        try:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                options={"verify_aud": False}
            )
            user_id = payload.get("sub")
            email = payload.get("email")
            if not user_id:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token missing subject claim")
            return UserContext(user_id=user_id, email=email, is_guest=False)
        except jwt.PyJWTError as e:
            logger.warning(f"JWT verification failed: {e}")
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid authentication token: {str(e)}")

    # If no JWT secret is configured, attempt unverified decode for user info or fallback
    try:
        unverified_payload = jwt.decode(token, options={"verify_signature": False})
        user_id = unverified_payload.get("sub") or "authenticated-user"
        email = unverified_payload.get("email") or "user@debugmate.local"
        return UserContext(user_id=user_id, email=email, is_guest=False)
    except Exception:
        # Fallback to guest user ID based on token hash
        return UserContext(user_id=f"user-{abs(hash(token)) % 100000}", email="user@debugmate.local", is_guest=False)

