# backend/app/ml/llm_loading.py
from pathlib import Path
from langchain_core.callbacks.manager import CallbackManager
from langchain_community.llms import LlamaCpp

# Простой callback manager без стриминга (или можно вообще без него)
_callback_manager = CallbackManager([])


def _get_gpu_layers_num(device: str) -> int | None:
    """
    Получает значение количества слоёв, которые загружаются на GPU.
    Если инференс на GPU, то на него загружаются все слои (функция возвращает -1).
    Если инференс на CPU, то никакие слои не загружаются на GPU (функция возвращает None).
    """
    if device.startswith("cuda"):
        return -1
    return None


def load_llm(model_filepath: Path, device: str = "cpu"):
    """
    Загружает локальную LLM в формате .gguf.
    
    Args:
        model_filepath: Путь до чекпойнта модели в формате .gguf.
        device: Устройство, на котором инференсится модель ("cuda" или "cpu").
    
    Returns:
        Инстанс LlamaCpp.
    """
    if not model_filepath.exists():
        raise FileNotFoundError(f"Модель не найдена по пути: {model_filepath}")
    
    print(f"Загрузка модели из {model_filepath}...")
    print(f"Устройство: {device}")
    
    return LlamaCpp(
        model_path=model_filepath.as_posix(),
        n_gpu_layers=_get_gpu_layers_num(device),
        f16_kv=True,
        n_ctx=6200,
        max_tokens=8192,
        repeat_penalty=1.3,
        last_n_tokens_size=1024,
        temperature=0.25,
        # callback_manager=_callback_manager,  # убираем для версии 1.3.0
        verbose=True,
        seed=42,
        stop=["bot", "1)", "Примеры ответов", "<", ">", "###", "User:", "Assistant:"],
    )