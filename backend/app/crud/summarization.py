from sqlalchemy.orm import Session

from ..models.summarization import Summary

def create_db_summarization(
    db : Session,
    text : str,
    summary : str
):
    """
    Создаёт запись в таблице summarization с переданным текстом и его суммаризацией.
    
    Args:
        db (Session): Сессия SQLAlchemy для работы с БД.
        text (str): Исходный текст.
        summary (str): Суммаризированный текст.
    
    Returns:
        Summarization: Созданная запись в БД.
    """
    db_summarization = Summary(text = text, summary = summary)
    db.add(db_summarization)
    db.commit()
    db.refresh(db_summarization)
    return db_summarization

def read_db_summarization():
    return

def update_db_summarization():
    return

def delete_dbsummarization():
    return



