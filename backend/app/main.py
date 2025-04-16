from fastapi import FastAPI
from app.api.router import router
from fastapi.middleware.cors import CORSMiddleware  

app = FastAPI(
    title='Summarization'
)

app.include_router(router, prefix="/api/v1")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Или "*" для всех
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.1", port=8000, reload=True)