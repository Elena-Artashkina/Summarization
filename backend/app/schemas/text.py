from ..common import BaseSchema

class TextRequest(BaseSchema):
    """Модель для текстового запроса пользователя"""
    
    text : str
    