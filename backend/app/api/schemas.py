from pydantic import BaseModel

class TextRequest(BaseModel):
    """Модель для текстового запроса пользователя"""
    
    text : str