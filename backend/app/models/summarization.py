from ..common import BaseEntity
from sqlalchemy.orm import Mapped

class Summary(BaseEntity):
    __tablename__ = "summarization"
    text: Mapped[str]
    summary: Mapped[str]
     