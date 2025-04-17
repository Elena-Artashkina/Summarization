from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from pydantic import BaseModel


class BaseEntity(DeclarativeBase):
    id: Mapped[int] = mapped_column(primary_key=True)

    
class BaseSchema(BaseModel):
    pass