import logging
import uuid
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)

class SupabaseService:
    def __init__(self):
        self.client = None
        self._local_analyses: Dict[str, Dict[str, Any]] = {}
        self._local_chat_messages: Dict[str, List[Dict[str, Any]]] = {}
        self._init_supabase()

    def _init_supabase(self):
        if settings.SUPABASE_URL and settings.SUPABASE_KEY:
            try:
                from supabase import create_client, Client
                self.client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                logger.info("Connected to Supabase client successfully.")
            except Exception as e:
                logger.warning(f"Could not initialize Supabase client: {e}. Falling back to internal store.")
        else:
            logger.info("SUPABASE_URL/SUPABASE_KEY not configured. Using local store for history and stats.")

    async def save_analysis(
        self,
        user_id: str,
        title: str,
        language: str,
        error_message: str,
        source_code: Optional[str],
        diagnosis: Dict[str, Any],
        corrected_code: Optional[str]
    ) -> Dict[str, Any]:
        """Saves a diagnosed error analysis record."""
        record_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat() + "Z"

        record = {
            "id": record_id,
            "user_id": user_id,
            "title": title,
            "language": language,
            "error_message": error_message,
            "source_code": source_code,
            "diagnosis": diagnosis,
            "corrected_code": corrected_code,
            "created_at": timestamp
        }

        if self.client:
            try:
                response = self.client.table("debug_analyses").insert({
                    "id": record_id,
                    "user_id": user_id,
                    "title": title,
                    "language": language,
                    "error_message": error_message,
                    "source_code": source_code,
                    "diagnosis": diagnosis,
                    "corrected_code": corrected_code,
                }).execute()
                if response.data:
                    return response.data[0]
            except Exception as e:
                logger.error(f"Failed to insert into Supabase: {e}. Storing locally.")

        # Local fallback store
        self._local_analyses[record_id] = record
        return record

    async def get_user_history(self, user_id: str, search: Optional[str] = None, language: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieves history for the authenticated user with optional search and language filter."""
        if self.client:
            try:
                query = self.client.table("debug_analyses").select("*").eq("user_id", user_id).order("created_at", desc=True)
                if language and language.lower() != "all":
                    query = query.eq("language", language)
                response = query.execute()
                items = response.data or []
                if search:
                    s = search.lower()
                    items = [it for it in items if s in it.get("title", "").lower() or s in it.get("error_message", "").lower()]
                return items
            except Exception as e:
                logger.error(f"Failed to query Supabase: {e}. Reading from local store.")

        # Local store
        user_items = [
            item for item in self._local_analyses.values()
            if item["user_id"] == user_id
        ]
        # Sort descending by creation
        user_items.sort(key=lambda x: x["created_at"], reverse=True)

        if language and language.lower() != "all":
            user_items = [it for it in user_items if it.get("language", "").lower() == language.lower()]

        if search:
            s = search.lower()
            user_items = [it for it in user_items if s in it.get("title", "").lower() or s in it.get("error_message", "").lower()]

        return user_items

    async def get_analysis_by_id(self, analysis_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single analysis by ID, strictly enforcing user ownership."""
        if self.client:
            try:
                response = self.client.table("debug_analyses").select("*").eq("id", analysis_id).eq("user_id", user_id).execute()
                if response.data:
                    return response.data[0]
            except Exception as e:
                logger.error(f"Failed to query Supabase for analysis {analysis_id}: {e}")

        # Local store
        item = self._local_analyses.get(analysis_id)
        if item and item.get("user_id") == user_id:
            return item
        return None

    async def delete_analysis(self, analysis_id: str, user_id: str) -> bool:
        """Deletes an analysis record, strictly verifying user ownership."""
        if self.client:
            try:
                response = self.client.table("debug_analyses").delete().eq("id", analysis_id).eq("user_id", user_id).execute()
                return bool(response.data)
            except Exception as e:
                logger.error(f"Failed to delete analysis from Supabase: {e}")

        # Local store
        item = self._local_analyses.get(analysis_id)
        if item and item.get("user_id") == user_id:
            del self._local_analyses[analysis_id]
            if analysis_id in self._local_chat_messages:
                del self._local_chat_messages[analysis_id]
            return True
        return False

    async def get_dashboard_stats(self, user_id: str) -> Dict[str, Any]:
        """Calculates dashboard metrics derived from the real user analyses."""
        items = await self.get_user_history(user_id)
        total = len(items)
        if total == 0:
            return {
                "total_analyses": 0,
                "resolved_count": 0,
                "top_languages": [],
                "recent_analyses": []
            }

        # Language distribution
        lang_counts: Dict[str, int] = {}
        resolved_count = 0
        for item in items:
            lang = item.get("language") or "Other"
            lang_counts[lang] = lang_counts.get(lang, 0) + 1
            if item.get("corrected_code"):
                resolved_count += 1

        top_langs = [
            {
                "language": lang,
                "count": count,
                "percentage": round((count / total) * 100, 1)
            }
            for lang, count in sorted(lang_counts.items(), key=lambda x: x[1], reverse=True)
        ]

        return {
            "total_analyses": total,
            "resolved_count": resolved_count,
            "top_languages": top_langs,
            "recent_analyses": items[:5]
        }

supabase_service = SupabaseService()
