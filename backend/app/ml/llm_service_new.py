# backend/app/ml/llm_service.py
from pathlib import Path
from functools import lru_cache
import hashlib
from .llm_loading import load_llm
from .prompt_templates import get_summarize_prompt


# Путь к модели (как в вашем старом файле)
MODEL_PATH = Path(__file__).parent / "models" / "model-q4_K.gguf"


class LLMService:
    """
    Сервис для работы с LLM (суммаризация)
    """
    
    def __init__(
        self,
        model_path: Path = None,
        device: str = "cuda",  # или "cpu"
        n_ctx: int = 6200,
        max_tokens: int = 8192,
        temperature: float = 0.25,
    ):
        """
        Инициализация сервиса
        
        Args:
            model_path: Путь к локальной модели в формате .gguf
            device: Устройство ("cuda" или "cpu")
            n_ctx: Размер контекста
            max_tokens: Максимальное количество токенов
            temperature: Температура генерации
        """
        self.model_path = model_path or MODEL_PATH
        self.device = device
        self.n_ctx = n_ctx
        self.max_tokens = max_tokens
        self.temperature = temperature
        self._llm = None
    
    def _load_model(self):
        """Загружает LLM модель через llm_loading.py"""
        self._llm = load_llm(
            model_filepath=self.model_path,
            device=self.device,
        )
        print("Модель загружена и готова к работе")
    
    @property
    def llm(self):
        """Ленивая загрузка модели"""
        if self._llm is None:
            self._load_model()
        return self._llm
    
    def _get_text_hash(self, text: str) -> str:
        """Генерирует хеш текста для кэширования"""
        return hashlib.md5(text.encode()).hexdigest()
    
    @lru_cache(maxsize=100)
    def _cached_summarize(self, text_hash: str, text: str) -> str:
        """Функция с кэшированием для одинаковых текстов"""
        # Ограничиваем длину текста (чтобы не превысить контекст)
        max_text_length = 5000  # Ограничение для экономии токенов
        original_text = text
        
        if len(text) > max_text_length:
            text = text[:max_text_length] + "..."
            print(f"Текст сокращён с {len(original_text)} до {len(text)} символов")
        
        # Выбираем промпт в зависимости от длины текста
        prompt_template = get_summarize_prompt(len(text))
        
        # Формируем промпт
        prompt = prompt_template.format(text=text)
        
        try:
            # Вызываем модель через LangChain
            response = self.llm.invoke(prompt)
            
            # Извлекаем ответ
            if hasattr(response, 'content'):
                summary = response.content
            else:
                summary = str(response)
            
            summary = summary.strip()
            
            # Если резюме получилось пустым, возвращаем первые предложения
            if not summary:
                sentences = original_text.split('.')
                summary = '. '.join(sentences[:3]) + '.'
            
            return summary
            
        except Exception as e:
            print(f"Ошибка при суммаризации: {e}")
            # Fallback: возвращаем первые 3 предложения
            sentences = original_text.split('.')
            fallback_summary = '. '.join(sentences[:3]) + '.'
            return fallback_summary if len(fallback_summary) > 10 else "Не удалось создать резюме."
    
    def summarize(self, text: str) -> str:
        """
        Суммаризация текста
        
        Args:
            text: Исходный текст
        
        Returns:
            Краткое содержание текста
        """
        if not text or not text.strip():
            return "Текст не предоставлен для суммаризации."
        
        # Используем хеш для кэширования
        text_hash = self._get_text_hash(text)
        return self._cached_summarize(text_hash, text)
    
    # async def summarize_async(self, text: str) -> str:
    #     """
    #     Асинхронная версия суммаризации
    #     """
    #     import asyncio
    #     loop = asyncio.get_event_loop()
    #     return await loop.run_in_executor(None, self.summarize, text)


# Создаём синглтон для использования в приложении
_service_instance = None


def get_llm_service() -> LLMService:
    """Возвращает синглтон сервиса LLM"""
    global _service_instance
    if _service_instance is None:
        _service_instance = LLMService(
            device="cuda",      # или "cpu" если нет GPU
        )
    return _service_instance


# Простая функция для обратной совместимости
def summarize(text: str) -> str:
    """Быстрая суммаризация текста"""
    service = get_llm_service()
    return service.summarize(text)