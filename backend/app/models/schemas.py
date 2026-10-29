from typing import List, Optional, Any, Dict
from pydantic import BaseModel, Field

class AnalyzeRequest(BaseModel):
    error_message: str = Field(..., min_length=2, max_length=15000, description="The error message or stack trace")
    language: str = Field(default="Python", max_length=50, description="Programming language of the code")
    source_code: Optional[str] = Field(default="", max_length=50000, description="The relevant source code snippet")
    category: Optional[str] = Field(default="Auto-Detect", max_length=50, description="Category of error")

class DiagnosisDetail(BaseModel):
    summary: str = Field(..., description="Clear explanation of what went wrong in plain terms")
    root_cause: str = Field(..., description="The fundamental reason why this error occurred")
    error_location: str = Field(default="Not specifically identifiable from the snippet", description="File, line, or syntax token where error occurs")
    steps_to_fix: List[str] = Field(default_factory=list, description="Step-by-step instructions to fix the issue")
    corrected_code: Optional[str] = Field(default=None, description="The corrected code snippet")
    why_it_works: str = Field(default="", description="Deep-dive explanation of the underlying programming concept")
    prevention_tips: List[str] = Field(default_factory=list, description="Best practices to avoid this error in future")
    confidence: str = Field(default="High", description="High, Medium, or Low confidence")
    limitations: str = Field(default="Generated based on provided snippet. Full project dependencies or runtime state may alter results.", description="Caveats and limitations")

class AnalyzeResponse(BaseModel):
    id: Optional[str] = None
    title: str
    language: str
    error_message: str
    source_code: Optional[str] = None
    diagnosis: DiagnosisDetail
    corrected_code: Optional[str] = None
    created_at: str

class ChatMessage(BaseModel):
    role: str = Field(..., description="'user' or 'assistant'")
    message: str = Field(...)
    created_at: Optional[str] = None

class ChatRequest(BaseModel):
    analysis_id: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=2000, description="The follow-up question")
    error_context: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Context from previous analysis")
    chat_history: Optional[List[ChatMessage]] = Field(default_factory=list, description="Previous messages in this session")

class ChatResponse(BaseModel):
    reply: str
    created_at: str

class HistorySaveRequest(BaseModel):
    title: str
    language: str
    error_message: str
    source_code: Optional[str] = None
    diagnosis: Dict[str, Any]
    corrected_code: Optional[str] = None

class HistoryItem(BaseModel):
    id: str
    user_id: str
    title: str
    language: str
    error_message: str
    source_code: Optional[str] = None
    diagnosis: Dict[str, Any]
    corrected_code: Optional[str] = None
    created_at: str

class LanguageStat(BaseModel):
    language: str
    count: int
    percentage: float

class DashboardStats(BaseModel):
    total_analyses: int
    resolved_count: int
    top_languages: List[LanguageStat]
    recent_analyses: List[HistoryItem]
