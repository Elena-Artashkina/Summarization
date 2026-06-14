# backend/app/ml/prompt_templates.py
from langchain_core.prompts import PromptTemplate

# Шаблон для суммаризации текста
SUMMARIZE_PROMPT = PromptTemplate(
    input_variables=["text"],
    template="""Ты — ассистент, который создает краткие и точные резюме текстов.
Пожалуйста, напиши краткое содержание следующего текста. Резюме должно:
1. Сохранять ключевые идеи и факты
2. Быть лаконичным (3-5 предложений)
3. Сохранять основную мысль и логику оригинала
4. Использовать простой и понятный язык

Текст для суммаризации:
{text}

Краткое содержание:""",
)

# Шаблон для очень длинных текстов
LONG_TEXT_SUMMARIZE_PROMPT = PromptTemplate(
    input_variables=["text"],
    template="""Проанализируй следующий текст и выдели 3-5 самых важных предложений, которые передают его основную суть.

Текст:
{text}

Ключевые предложения:""",
)


def get_summarize_prompt(text_length: int = 0) -> PromptTemplate:
    """Возвращает соответствующий промпт в зависимости от длины текста"""
    if text_length > 5000:
        return LONG_TEXT_SUMMARIZE_PROMPT
    return SUMMARIZE_PROMPT