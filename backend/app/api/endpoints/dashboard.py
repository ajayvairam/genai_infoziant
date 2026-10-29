from fastapi import APIRouter, Depends
from app.models.schemas import DashboardStats
from app.services.supabase_service import supabase_service
from app.core.security import get_current_user, UserContext

router = APIRouter()

@router.get("/stats", response_model=DashboardStats)
async def get_dashboard_stats(user: UserContext = Depends(get_current_user)):
    """
    Returns real statistics derived from the authenticated user's analyses in the database.
    """
    stats = await supabase_service.get_dashboard_stats(user.user_id)
    return stats

