from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from collections import Counter
import re
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# from ..ml.model import summarize_text
# from .schemas import TextRequest
from ..schemas.text import TextRequest
from .deps import get_db
from ..crud.summarization import create_db_summarization

from ..ml.llm_service import summarize
# from ..ml.llm_service_new import summarize

from ..crud.summarization import create_db_summarization
from ..core.db import Session

from fastapi import BackgroundTasks
import uuid
from typing import Dict

from ..ml.smm_law_rules import (
    RESTRICTED_TOPICS,
    ADS_REQUIRED,
    FORBIDDEN_ADS_WORDS,
    PERSONAL_DATA_KEYWORDS,
    DEFAMATION_KEYWORDS,
    BLOGGER_MARKING
)

# Скачиваем стоп-слова (один раз при запуске)
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)
    
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)
    
# try:
#     nltk.data.find('tokenizers/punkt_tab')
# except LookupError:
#     nltk.download('punkt_tab', quiet=True)

try:
    nltk.data.find('taggers/averaged_perceptron_tagger_ru')
except LookupError:
    nltk.download('averaged_perceptron_tagger_ru', quiet=True)

try:
    nltk.data.find('taggers/averaged_perceptron_tagger')
except LookupError:
    nltk.download('averaged_perceptron_tagger', quiet=True)
    
RUSSIAN_STOP_WORDS = set(stopwords.words('russian'))
ENGLISH_STOP_WORDS = set(stopwords.words('english'))

# Объединяем стоп-слова для обоих языков
STOP_WORDS = RUSSIAN_STOP_WORDS.union(ENGLISH_STOP_WORDS)
# print(STOP_WORDS)

# Словари для маппинга тегов на человекочитаемые названия
POS_MAPPING_RU = {
    'NOUN': 'Существительные',
    'VERB': 'Глаголы',
    'ADJ': 'Прилагательные',
    'ADV': 'Наречия',
    'PRON': 'Местоимения',
    'NUM': 'Числительные',
    'CONJ': 'Союзы',
    'PREP': 'Предлоги',
    'PART': 'Частицы',
    'INTJ': 'Междометия',
}

POS_MAPPING_EN = {
    'NOUN': 'Nouns',
    'VERB': 'Verbs',
    'ADJ': 'Adjectives',
    'ADV': 'Adverbs',
    'PRON': 'Pronouns',
    'NUM': 'Numerals',
    'CONJ': 'Conjunctions',
    'PREP': 'Prepositions',
    'PART': 'Particles',
    'INTJ': 'Interjections',
}

router = APIRouter()

# @router.post("/summarize")
# async def summarize_text_endpoint(text: TextRequest, db : Session = Depends(get_db)):
#     """
#     Генерирует саммари по исходному тексту.
    
#     Args:
#         text (TextRequest): Исходный текст.
#         db (Session): Сессия SQLAlchemy для работы с БД.
    
#     Returns:
#         summary (str): Суммаризированный текст.
#     """
#     summary = summarize_text(text.text)
#     create_db_summarization(db, text.text, summary)
#     return {"summary": summary}

def detect_language(text: str) -> str:
    """
    Определяет язык текста (русский или английский)
    """
    text_lower = text.lower()
    russian_chars = len(re.findall(r'[а-яё]', text_lower))
    english_chars = len(re.findall(r'[a-z]', text_lower))
    
    if russian_chars > english_chars:
        return 'rus'  # Для русского NLTK использует 'rus'
    else:
        return 'eng'  # Для английского 'eng'
    
def tokenize_text(text: str) -> list:
    """
    Токенизация текста без использования NLTK punkt
    """
    # Оставляем только буквы и пробелы
    text = re.sub(r'[^\w\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text)
    text = text.strip().lower()
    
    # Разбиваем на слова
    return text.split() if text else []

# @router.post("/summarize")
# async def summarize_text_endpoint(text: TextRequest, db : Session = Depends(get_db)):
#     """
#     Генерирует саммари по исходному тексту.
    
#     Args:
#         text (TextRequest): Исходный текст.
#         db (Session): Сессия SQLAlchemy для работы с БД.
    
#     Returns:
#         summary (str): Суммаризированный текст.
#     """
#     summary = summarize(text.text)
#     create_db_summarization(db, text.text, summary)
#     return {"summary": summary}

# Хранилище статусов задач
task_statuses: Dict[str, dict] = {}

# Функция для фоновой обработки
def process_summarize(task_id: str, text: str, db: Session):
    """
    Фоновая задача для суммаризации текста
    """
    try:
        # Выполняем суммаризацию
        summary = summarize(text)
        
        # Сохраняем в БД (нужно создать новую сессию, так как исходная уже закрыта)
        # from ..crud.summarization import create_db_summarization
        # from ..db.session import SessionLocal
        
        db_local = Session()
        try:
            create_db_summarization(db_local, text, summary)
            task_statuses[task_id] = {"status": "completed", "result": summary}
        finally:
            db_local.close()
            
    except Exception as e:
        print(f"Ошибка при суммаризации: {e}")
        task_statuses[task_id] = {"status": "failed", "error": str(e)}


@router.post("/summarize")
async def summarize_text_endpoint(
    text: TextRequest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Генерирует саммари по исходному тексту (асинхронно).
    
    Args:
        text (TextRequest): Исходный текст.
        background_tasks (BackgroundTasks): Фоновые задачи FastAPI.
        db (Session): Сессия SQLAlchemy для работы с БД.
    
    Returns:
        task_id (str): Идентификатор задачи для отслеживания статуса.
    """
    # Генерируем уникальный ID задачи
    task_id = str(uuid.uuid4())
    
    # Сохраняем начальный статус
    task_statuses[task_id] = {"status": "processing", "result": None}
    
    # Копируем текст, чтобы избежать проблем с сессией
    text_content = text.text
    
    # Запускаем фоновую задачу
    background_tasks.add_task(process_summarize, task_id, text_content, db)
    
    # Немедленно возвращаем ID задачи
    return {"task_id": task_id, "status": "processing"}


@router.get("/summarize/status/{task_id}")
async def get_summarize_status(task_id: str):
    """
    Проверка статуса задачи суммаризации.
    
    Args:
        task_id (str): Идентификатор задачи.
    
    Returns:
        status (dict): Статус задачи и результат (если готов).
    """
    status = task_statuses.get(task_id)
    
    if not status:
        return {"status": "not_found"}
    
    return status

# @router.post("/summarize")
# async def summarize_text_endpoint(text: TextRequest, db: Session = Depends(get_db)):
#     """
#     Генерирует саммари по исходному тексту.
#     """
#     try:
#         summary = summarize(text.text)
#         create_db_summarization(db, text.text, summary)
#         return {"summary": summary}
#     except Exception as e:
#         print(f"Ошибка суммаризации: {e}")
#         return {"summary": "Произошла ошибка при генерации резюме."}

@router.post("/wordcloud")
async def wordcloud_endpoint(text: TextRequest):
    """
    Генерирует облако слов из текста.
    Поддерживает русский, английский и другие языки.
    Удаляет стоп-слова для русского и английского.
    """
    if not text.text or not text.text.strip():
        return {"words": []}
    
    # Приводим к нижнему регистру
    text_lower = text.text.lower()
    
    # Оставляем только буквы (любых алфавитов) и пробелы
    # \w в Python включает буквы, цифры и подчеркивание
    # Нам нужны только буквы, поэтому используем \p{L} через regex или более простой подход
    cleaned_text = re.sub(r'[^a-zа-яё\s]', '', text_lower, flags=re.IGNORECASE)
    cleaned_text = re.sub(r'\s+', ' ', cleaned_text)
    cleaned_text = cleaned_text.strip()
    
    if not cleaned_text:
        return {"words": []}
    
    # Разбиваем на слова
    words = cleaned_text.split()
    
    # Фильтруем слова
    filtered_words = []
    for word in words:
        # Пропускаем слишком короткие слова (меньше 2 букв)
        if len(word) <= 1:
            continue
        
        # Удаляем стоп-слова (только для русского и английского)
        # Для других языков стоп-слова не удаляем
        if word in STOP_WORDS:
            continue
        
        # Проверяем, что слово состоит только из букв (русских или английских)
        if re.match(r'^[a-z]+$', word) or re.match(r'^[а-яё]+$', word):
            filtered_words.append(word)
        else:
            # Если слово содержит символы других алфавитов, тоже добавляем
            # (например, немецкие, французские буквы)
            filtered_words.append(word)
    
    # Если после фильтрации слов нет, возвращаем пустой результат
    if not filtered_words:
        return {"words": []}
    
    # Подсчет частоты слов
    word_counts = Counter(filtered_words)
    
    # Формируем ответ для облака слов (топ-100 слов)
    words_for_cloud = [
        {"text": word, "value": count}
        for word, count in word_counts.most_common(100)
    ]
    # print(words_for_cloud)
    
    return {"words": words_for_cloud}

@router.post("/partofspeechanalysis")
async def pos_analysis_endpoint(text: TextRequest):
    """
    Анализ частей речи в тексте.
    """
    if not text.text or not text.text.strip():
        return {"pos_distribution": {}}
    
    language = detect_language(text.text)
    
    # Очищаем текст
    text_clean = re.sub(r'[^\w\s]', ' ', text.text)
    text_clean = re.sub(r'\s+', ' ', text_clean)
    text_clean = text_clean.strip()
    
    if not text_clean:
        return {"pos_distribution": {}}
    
    # Токенизация (без NLTK punkt)
    tokens = tokenize_text(text_clean)
    
    # Удаляем стоп-слова и короткие слова
    # tokens = [t for t in tokens if t.lower() not in STOP_WORDS and len(t) > 1]
    
    if not tokens:
        return {"pos_distribution": {}}
    
    # POS-теггинг
    try:
        if language == 'rus':
            tagged = nltk.pos_tag(tokens, lang='rus')
        else:
            tagged = nltk.pos_tag(tokens, lang='eng')
    except Exception as e:
        print(f"POS tagging error: {e}")
        return {"pos_distribution": {}}
    
    # Подсчет частей речи
    pos_counts = Counter()
    
    if language == 'rus':
        for word, tag in tagged:
            if tag.startswith('N') or tag == 'S':
                pos_counts['NOUN'] += 1
            elif tag.startswith('V'):
                pos_counts['VERB'] += 1
            elif tag.startswith('A'):
                pos_counts['ADJ'] += 1
            elif tag.startswith('ADV'):
                pos_counts['ADV'] += 1
            elif tag in ['PR', 'P']:
                pos_counts['PRON'] += 1
            elif tag.startswith('NUM'):
                pos_counts['NUM'] += 1
            elif tag.startswith('CONJ'):
                pos_counts['CONJ'] += 1
            elif tag.startswith('PREP'):
                pos_counts['PREP'] += 1
    else:
        for word, tag in tagged:
            if tag.startswith('N'):
                pos_counts['NOUN'] += 1
            elif tag.startswith('V'):
                pos_counts['VERB'] += 1
            elif tag.startswith('J'):
                pos_counts['ADJ'] += 1
            elif tag.startswith('R'):
                pos_counts['ADV'] += 1
            elif tag in ['PRP', 'PRP$']:
                pos_counts['PRON'] += 1
            elif tag.startswith('CD'):
                pos_counts['NUM'] += 1
            elif tag.startswith('CC') or tag.startswith('IN'):
                pos_counts['CONJ'] += 1
            elif tag == 'TO':
                pos_counts['PREP'] += 1
    
    total = sum(pos_counts.values())
    if total == 0:
        return {"pos_distribution": {}}
    
    mapping = POS_MAPPING_RU if language == 'rus' else POS_MAPPING_EN
    
    distribution = {
        mapping.get(pos, pos): round((count / total) * 100, 1)
        for pos, count in pos_counts.items()
    }
    
    return {"pos_distribution": distribution}

@router.post("/text-stats")
async def text_statistics_endpoint(text: TextRequest):
    """
    Возвращает полную статистику текста
    """
    if not text.text or not text.text.strip():
        return {
            "word_count": 0,
            "char_count": 0,
            "char_count_no_spaces": 0,
            "sentence_count": 0,
            "paragraph_count": 0,
            "unique_words": 0,
            "lexical_diversity": 0,
            "avg_word_length": 0,
            "avg_sentence_length": 0,
            "reading_time": "0 сек",
            "difficulty_level": "Нет данных",
            "flesch_index": 0,
            "top_words": []
        }
    
    # Очистка текста
    cleaned = re.sub(r'[^\w\s]', ' ', text.text)
    words = cleaned.lower().split()
    
    # Базовая статистика
    word_count = len(words)
    char_count = len(text.text)
    char_count_no_spaces = len(text.text.replace(' ', '').replace('\n', '').replace('\t', ''))
    
    # Предложения и абзацы
    sentences = re.split(r'[.!?]+', text.text)
    sentence_count = len([s for s in sentences if s.strip()])
    paragraphs = [p for p in text.text.split('\n') if p.strip()]
    paragraph_count = len(paragraphs)
    
    # Уникальные слова
    unique_words = len(set(words))
    ttr = round((unique_words / word_count) * 100, 1) if word_count > 0 else 0
    
    # Средняя длина слова
    avg_word_len = round(sum(len(w) for w in words) / word_count, 1) if word_count > 0 else 0
    
    # Средняя длина предложения
    avg_sentence_len = round(word_count / sentence_count, 1) if sentence_count > 0 else 0
    
    # Время чтения (200 слов в минуту)
    reading_time_minutes = word_count / 200
    if reading_time_minutes < 1:
        reading_time = f"{int(reading_time_minutes * 60)} сек"
    else:
        mins = int(reading_time_minutes)
        secs = int((reading_time_minutes - mins) * 60)
        reading_time = f"{mins} мин {secs} сек"
    
    # Топ-5 частых слов (исключая стоп-слова)
    filtered_words = [w for w in words if w not in STOP_WORDS and len(w) > 2]
    word_freq = Counter(filtered_words)
    top_words = [{"word": w, "count": c} for w, c in word_freq.most_common(5)]
    
    # Уровень сложности на основе средней длины слова и предложения
    if avg_word_len < 5 and avg_sentence_len < 15:
        difficulty_level = "Лёгкий"
        difficulty_icon = ""
    elif avg_word_len < 7 and avg_sentence_len < 25:
        difficulty_level = "Средний"
        difficulty_icon = ""
    else:
        difficulty_level = "Сложный"
        difficulty_icon = ""
    
    # Индекс удобочитаемости Флеша (адаптированная формула)
    # Чем выше индекс, тем легче текст
    flesch_index = round(206.835 - 1.015 * avg_sentence_len - 84.6 * (avg_word_len / 5), 1)
    flesch_index = max(0, min(100, flesch_index))
    
    return {
        "word_count": word_count,
        "char_count": char_count,
        "char_count_no_spaces": char_count_no_spaces,
        "sentence_count": sentence_count,
        "paragraph_count": paragraph_count,
        "unique_words": unique_words,
        "lexical_diversity": ttr,
        "avg_word_length": avg_word_len,
        "avg_sentence_length": avg_sentence_len,
        "reading_time": reading_time,
        "difficulty_level": f"{difficulty_icon} {difficulty_level}",
        "flesch_index": flesch_index,
        "top_words": top_words
    }
    
@router.post("/smm/legal-check")
async def smm_legal_check(text: TextRequest):
    """
    Юридическая проверка поста для социальных сетей
    """
    print(f"Получен запрос на юридическую проверку...")
    
    if not text.text or not text.text.strip():
        return {
            "status": "warning",
            "status_text": "⚠️ Текст не предоставлен",
            "violations": [],
            "warnings": [],
            "blogger_note": None
        }
    
    lower_text = text.text.lower()
    violations = []
    warnings = []
    
    # 1. Проверка на ограниченные темы (по целым словам)
    for keyword, info in RESTRICTED_TOPICS.items():
        # Экранируем специальные символы и ищем целое слово
        pattern = r'\b' + re.escape(keyword) + r'\b'
        if re.search(pattern, lower_text):
            warnings.append({
                "type": "restricted",
                "title": f"⚠️ Ограничено: {keyword.title()}",
                "message": f"Реклама {keyword} имеет ограничения",
                "requirement": info["marketing"],
                "penalty": info["penalty"],
                "law": info["law"],
                "action": "Проверить наличие лицензии/ограничений"
            })
    
    # 2. Проверка на маркировку рекламы (по целым словам)
    for keyword, info in ADS_REQUIRED.items():
        pattern = r'\b' + re.escape(keyword) + r'\b'
        if re.search(pattern, lower_text):
            warnings.append({
                "type": "marketing",
                "title": f"🏷️ Требуется маркировка: {keyword.title()}",
                "message": f"Пост содержит коммерческую информацию",
                "requirement": f"Добавить маркировку '{info['label']}'",
                "penalty": info["penalty"],
                "law": info["law"],
                "action": "Промаркировать пост"
            })
            break  # Достаточно одного предупреждения
    
    # 3. Проверка запрещённых слов в рекламе (по целым словам)
    for keyword, info in FORBIDDEN_ADS_WORDS.items():
        pattern = r'\b' + re.escape(keyword) + r'\b'
        if re.search(pattern, lower_text):
            warnings.append({
                "type": "ads_violation",
                "title": f"⚠️ Запрещённое слово: '{keyword}'",
                "message": info["issue"],
                "penalty": info["penalty"],
                "action": "Заменить на нейтральное слово"
            })
    
    # 4. Проверка персональных данных (по целым словам)
    for keyword, info in PERSONAL_DATA_KEYWORDS.items():
        pattern = r'\b' + re.escape(keyword) + r'\b'
        if re.search(pattern, lower_text):
            violations.append({
                "type": "personal_data",
                "title": f"🔒 Персональные данные: {keyword.title()}",
                "message": f"Сбор и обработка {keyword} регулируется законом",
                "penalty": info["penalty"],
                "law": info["law"],
                "action": "Добавить согласие на обработку ПД или убрать запрос"
            })
    
    # 5. Проверка на клевету, оскорбления и мат (по целым словам)
    for keyword, info in DEFAMATION_KEYWORDS.items():
        pattern = r'\b' + re.escape(keyword) + r'\b'
        if re.search(pattern, lower_text):
            violations.append({
                "type": "defamation",
                "title": f"⚠️ Оскорбление/нецензурная лексика: '{keyword}'",
                "message": "Использование оскорбительных или нецензурных выражений нарушает законодательство",
                "penalty": info["penalty"],
                "law": info["law"],
                "action": "Удалить или заменить на нейтральные выражения"
            })
    
    # Формируем итоговое заключение
    if violations:
        status = "danger"
        status_text = "❌ Публикация НЕ РЕКОМЕНДОВАНА"
    elif warnings:
        status = "warning"
        status_text = "⚠️ Требуются доработки"
    else:
        status = "success"
        status_text = "✅ Юридически безопасно"
    
    result = {
        "status": status,
        "status_text": status_text,
        "violations": violations,
        "warnings": warnings,
        "blogger_note": BLOGGER_MARKING if len(text.text) > 100 else None
    }
    
    print(f"Результат проверки: {status}, violations: {len(violations)}, warnings: {len(warnings)}")
    return result