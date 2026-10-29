from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.models.schemas import (
    AnalyzeRequest,
    AnalyzeResponse,
    ChatRequest,
    ChatResponse,
    HistoryItem,
    HistorySaveRequest
)
from app.services.debugger import debugger_service
from app.services.supabase_service import supabase_service
from app.core.security import get_current_user, UserContext

router = APIRouter()

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_error(
    req: AnalyzeRequest,
    user: UserContext = Depends(get_current_user)
):
    """
    Analyzes an error message / stack trace and code snippet using Gemini LLM.
    Returns structured explanation, root cause, steps to fix, and corrected code.
    """
    try:
        return await debugger_service.analyze_error(req, user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Analysis failed: {str(e)}"
        )

@router.post("/chat", response_model=ChatResponse)
async def chat_followup(
    req: ChatRequest,
    user: UserContext = Depends(get_current_user)
):
    """
    Answers contextual follow-up questions regarding a previously analyzed error.
    """
    try:
        return await debugger_service.answer_chat(req, user)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat error: {str(e)}"
        )

@router.get("/history", response_model=List[HistoryItem])
async def get_history(
    search: Optional[str] = Query(None, description="Search term for title or error"),
    language: Optional[str] = Query(None, description="Filter by programming language"),
    user: UserContext = Depends(get_current_user)
):
    """
    Retrieves the debugging history for the authenticated user.
    """
    return await supabase_service.get_user_history(user.user_id, search=search, language=language)

@router.post("/history", response_model=HistoryItem)
async def save_history(
    req: HistorySaveRequest,
    user: UserContext = Depends(get_current_user)
):
    """
    Manually save or bookmark an analysis to history.
    """
    saved = await supabase_service.save_analysis(
        user_id=user.user_id,
        title=req.title,
        language=req.language,
        error_message=req.error_message,
        source_code=req.source_code,
        diagnosis=req.diagnosis,
        corrected_code=req.corrected_code
    )
    return saved

@router.get("/history/{analysis_id}", response_model=HistoryItem)
async def get_history_item(
    analysis_id: str,
    user: UserContext = Depends(get_current_user)
):
    """
    Retrieves a single saved analysis by ID, strictly verifying ownership.
    """
    item = await supabase_service.get_analysis_by_id(analysis_id, user.user_id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found or you do not have permission to access it."
        )
    return item

@router.delete("/history/{analysis_id}")
async def delete_history_item(
    analysis_id: str,
    user: UserContext = Depends(get_current_user)
):
    """
    Deletes an analysis record belonging to the authenticated user.
    """
    success = await supabase_service.delete_analysis(analysis_id, user.user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found or could not be deleted."
        )
    return {"message": "Analysis deleted successfully", "id": analysis_id}
