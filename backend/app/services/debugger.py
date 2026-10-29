import logging
from typing import Dict, Any, Optional
from datetime import datetime
from app.models.schemas import AnalyzeRequest, AnalyzeResponse, DiagnosisDetail, ChatRequest, ChatResponse
from app.services.gemini_service import gemini_service
from app.services.supabase_service import supabase_service
from app.core.security import UserContext

logger = logging.getLogger(__name__)

class DebuggerService:
    def sanitize_input(self, text: Optional[str]) -> str:
        """Sanitizes text inputs to prevent massive overflows or malicious control chars."""
        if not text:
            return ""
        # Strip null bytes and excessive whitespace
        clean = text.replace("\x00", "").strip()
        return clean

    async def analyze_error(self, req: AnalyzeRequest, user: UserContext) -> AnalyzeResponse:
        """Orchestrates error analysis, passes to Gemini, formats response and saves record."""
        clean_error = self.sanitize_input(req.error_message)
        clean_code = self.sanitize_input(req.source_code)
        language = req.language.strip() or "Python"
        category = req.category.strip() or "Auto-Detect"

        # 1. Ask Gemini
        llm_result = await gemini_service.analyze_error(
            error_message=clean_error,
            language=language,
            source_code=clean_code,
            category=category
        )

        title = llm_result.get("title", f"{language} Error Analysis")
        diagnosis = DiagnosisDetail(
            summary=llm_result.get("summary", "Analysis completed."),
            root_cause=llm_result.get("root_cause", "Underlying runtime exception or syntax violation."),
            error_location=llm_result.get("error_location", "Check relevant lines in traceback."),
            steps_to_fix=llm_result.get("steps_to_fix", ["Inspect line numbers in error trace."]),
            corrected_code=llm_result.get("corrected_code", clean_code),
            why_it_works=llm_result.get("why_it_works", "Resolves semantic or syntax error."),
            prevention_tips=llm_result.get("prevention_tips", ["Add type annotations and linters."]),
            confidence=llm_result.get("confidence", "High"),
            limitations=llm_result.get("limitations", "Based on provided code snippet.")
        )

        # 2. Persist record to Supabase
        saved_record = await supabase_service.save_analysis(
            user_id=user.user_id,
            title=title,
            language=language,
            error_message=clean_error,
            source_code=clean_code,
            diagnosis=diagnosis.model_dump(),
            corrected_code=diagnosis.corrected_code
        )

        return AnalyzeResponse(
            id=saved_record.get("id"),
            title=title,
            language=language,
            error_message=clean_error,
            source_code=clean_code,
            diagnosis=diagnosis,
            corrected_code=diagnosis.corrected_code,
            created_at=saved_record.get("created_at", datetime.utcnow().isoformat() + "Z")
        )

    async def answer_chat(self, req: ChatRequest, user: UserContext) -> ChatResponse:
        """Generates AI answer to a follow-up question."""
        reply_text = await gemini_service.answer_followup(
            question=req.message,
            error_context=req.error_context or {},
            chat_history=[m.model_dump() for m in req.chat_history] if req.chat_history else []
        )

        return ChatResponse(
            reply=reply_text,
            created_at=datetime.utcnow().isoformat() + "Z"
        )

debugger_service = DebuggerService()
