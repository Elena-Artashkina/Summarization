from fastapi import APIRouter
from ..ml.model import summarize_text
from .schemas import TextRequest

router = APIRouter()

@router.post("/summarize")
async def summarize_text_endpoint(text: TextRequest):
    """Генерирует саммари по исходному тексту.
    
    Параметр:
    TextRequest : str
    
    Возвращает:
    summary : str"""
    
    summary = summarize_text(text.text)
    return {"summary": summary}