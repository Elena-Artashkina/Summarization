from fastapi import APIRouter
from ..ml.model import summarize_text
from .schemas import TextRequest

router = APIRouter()

@router.post("/summarize")
async def summarize_text_endpoint(text: TextRequest):
    """Генерирует саммари по исходному тексту.
    
    Request:
    TextRequest : str
    
    Responce:
    summary : str"""
    
    summary = summarize_text(text.text)
    return {"summary": summary}