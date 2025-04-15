from transformers import pipeline

# Загружаем модель при старте (кешируется в памяти)
model = pipeline("summarization", model="t5-small")

def summarize_text(text: str) -> str:
    result = model(text, max_length=130)
    return result[0]["summary_text"]