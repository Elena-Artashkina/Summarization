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

from llama_cpp import Llama
from pathlib import Path

# Инициализация модели
llm = Llama(
    model_path="./models/model-q4_K.gguf",
    n_ctx=1024,
    # n_gpu_layers=-1  # Раскомментировать для GPU
)

def load_prompt_template() -> str:
    """Загружает шаблон промпта из файла"""
    prompt_path = Path("./prompts/summary_prompt.txt")
    return prompt_path.read_text(encoding="utf-8")

def summarize(text: str) -> str:
    """Генерирует суммаризацию текста"""
    template = load_prompt_template()
    prompt = template.format(text=text)  # Подставляем текст в шаблон
    
    output = llm(
        prompt,
        max_tokens=150,
        temperature=0.3,
        stop=["\n###"]
    )
    return output["choices"][0]["text"]



input_text = """
    Мой офис находится далеко от дома. Я добираюсь туда полтора часа. 
    Хорошо, что рабочий день начинается в десять. С одиннадцати до двенадцати у нас митинг. 
    После него начинается обед. Чаще всего я заказываю пельмени, винегрет, солянку или щи. 
    Больше всего мне нравятся пельмени. Рабочий день заканчивается в шесть часов. 
    Домой я возвращаюсь около восьми, особенно если захожу в магазин.
"""
    
result = summarize(input_text)
print("Результат суммаризации:\n", result)


