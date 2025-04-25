from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..ml.model import summarize_text
# from .schemas import TextRequest
from ..schemas.text import TextRequest
from .deps import get_db
from ..crud.summarization import create_db_summarization

router = APIRouter()

@router.post("/summarize")
async def summarize_text_endpoint(text: TextRequest, db : Session = Depends(get_db)):
    """
    Генерирует саммари по исходному тексту.
    
    Args:
        text (TextRequest): Исходный текст.
        db (Session): Сессия SQLAlchemy для работы с БД.
    
    Returns:
        summary (str): Суммаризированный текст.
    """
    summary = summarize_text(text.text)
    create_db_summarization(db, text.text, summary)
    return {"summary": summary}