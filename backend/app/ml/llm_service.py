# from llama_cpp import Llama

# llm = Llama(
#       model_path="./models/model-q4_K.gguf",
#       # n_gpu_layers=-1, # Uncomment to use GPU acceleration
#       # seed=1337, # Uncomment to set a specific seed
#       # n_ctx=2048, # Uncomment to increase the context window
# )
# output = llm(
#       "Q: Name the planets in the solar system? A: ", # Prompt
#       max_tokens=100, # Generate up to 32 tokens, set to None to generate up to the end of the context window
#       stop=["Q:", "\n"], # Stop generating just before the model would generate a new question
#       echo=True # Echo the prompt back in the output
# ) # Generate a completion, can also call create_completion
# print(output)

# from llama_cpp import Llama
# from pathlib import Path

# MODEL_PATH = Path(__file__).parent / "models" / "model-q4_K.gguf"

# # Инициализация модели
# llm = Llama(
#     # model_path="./models/model-q4_K.gguf",
#     model_path=str(MODEL_PATH),
#     n_ctx=1024,
#     n_gpu_layers=-1  # Раскомментировать для GPU
# )

# def load_prompt_template() -> str:
#     """Загружает шаблон промпта из файла"""
#     # prompt_path = Path("./prompts/summary_prompt.txt")
#     prompt_path = Path(__file__).parent / "prompts" / "summary_prompt.txt"
#     return prompt_path.read_text(encoding="utf-8")

# def summarize(text: str) -> str:
#     """Генерирует суммаризацию текста"""
#     template = load_prompt_template()
#     prompt = template.format(text=text)  # Подставляем текст в шаблон
    
#     output = llm(
#         prompt,
#         max_tokens=150,
#         temperature=0.3,
#         stop=["\n###"]
#     )
#     return output["choices"][0]["text"]



# input_text = """
#     Мой офис находится далеко от дома. Я добираюсь туда полтора часа. 
#     Хорошо, что рабочий день начинается в десять. С одиннадцати до двенадцати у нас митинг. 
#     После него начинается обед. Чаще всего я заказываю пельмени, винегрет, солянку или щи. 
#     Больше всего мне нравятся пельмени. Рабочий день заканчивается в шесть часов. 
#     Домой я возвращаюсь около восьми, особенно если захожу в магазин.
# """
    
# result = summarize(input_text)
# print("Результат суммаризации:\n", result)


# backend/app/ml/llm_service.py
from llama_cpp import Llama
from pathlib import Path
import threading
import atexit

MODEL_PATH = Path(__file__).parent / "models" / "model-q4_K.gguf"

# Глобальные переменные для синглтона
_llm_instance = None
_prompt_template = None
_model_lock = threading.Lock()


def get_llm():
    """
    Возвращает экземпляр модели (синглтон с потокобезопасностью).
    Модель загружается только один раз при первом вызове.
    """
    global _llm_instance
    if _llm_instance is None:
        with _model_lock:
            if _llm_instance is None:
                print(f"Загрузка модели из {MODEL_PATH}...")
                _llm_instance = Llama(
                    model_path=str(MODEL_PATH),
                    n_ctx=1024,
                    n_gpu_layers=-1,
                    verbose=False,
                )
                print("Модель загружена и готова к работе")
                atexit.register(cleanup_llm)
    return _llm_instance


def cleanup_llm():
    """Очистка ресурсов модели при завершении"""
    global _llm_instance
    if _llm_instance:
        print("Выгрузка модели...")
        del _llm_instance
        _llm_instance = None


def load_prompt_template() -> str:
    """Загружает шаблон промпта из файла (с кэшированием)"""
    global _prompt_template
    if _prompt_template is None:
        prompt_path = Path(__file__).parent / "prompts" / "summary_prompt.txt"
        if not prompt_path.exists():
            prompt_path.parent.mkdir(parents=True, exist_ok=True)
            default_prompt = """Ты — ассистент. Напиши краткое содержание текста, используя только факты из текста. Не добавляй ничего от себя.

Пример:
Текст: "Я купил машину. Она красная."
Краткое содержание: Автор купил красную машину.

Теперь сделай то же самое.

Текст:
{text}

Краткое содержание:"""
            prompt_path.write_text(default_prompt, encoding="utf-8")
        
        _prompt_template = prompt_path.read_text(encoding="utf-8")
    
    return _prompt_template


def summarize(text: str) -> str:
    """Генерирует суммаризацию текста"""
    if not text or not text.strip():
        return "Текст не предоставлен для суммаризации."
    
    # Ограничиваем длину текста
    if len(text) > 2000:
        text = text[:2000] + "..."
    
    template = load_prompt_template()
    prompt = template.format(text=text)
    
    llm = get_llm()
    
    try:
        output = llm(
            prompt,
            max_tokens=300,
            temperature=0.3,
            stop=["\n###", "User:", "Assistant:", "\n\n\n"],
        )
        summary = output["choices"][0]["text"].strip()
        
        if not summary:
            sentences = text.split('.')
            summary = '. '.join(sentences[:3]) + '.'
        
        return summary
    except Exception as e:
        print(f"Ошибка при генерации суммаризации: {e}")
        sentences = text.split('.')
        fallback = '. '.join(sentences[:3]) + '.'
        return fallback if len(fallback) > 10 else "Не удалось создать резюме."


# Для проверки
# if __name__ == "__main__":
#     test_text = "Это тестовый текст для проверки суммаризации."
#     result = summarize(test_text)
#     print(f"Результат: {result}")