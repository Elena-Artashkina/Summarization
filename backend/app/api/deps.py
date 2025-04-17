from collections.abc import Generator
from ..core.db import Session


def get_db() -> Generator:
    try:
        db = Session()
        yield db
    finally:
        db.close()
