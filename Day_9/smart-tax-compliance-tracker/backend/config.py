import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Vector Store
    VECTOR_STORE_PATH = "backend/data/vector_store"
    EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
    
    # LLM Config
    GEMINI_API_KEY = "AIzaSyDPsEavgnqJ4ltBgCOtgtqWj_u9vjsbovU"
    LLM_MODEL = "gemini-1.5-flash" if GEMINI_API_KEY else "gpt-4"
    
    # Data Paths
    DATA_PATH = "backend/data"
    INVOICES_PATH = f"{DATA_PATH}/invoices"
    TRANSACTIONS_PATH = f"{DATA_PATH}/transactions"
    LEDGERS_PATH = f"{DATA_PATH}/ledgers"
    REGULATIONS_PATH = f"{DATA_PATH}/regulations"
    CALENDAR_PATH = f"{DATA_PATH}/compliance_calendar.ics"
    
    # Agent Config
    DOCUMENT_CHUNK_SIZE = 1000
    DOCUMENT_CHUNK_OVERLAP = 200
    RAG_THRESHOLD = 0.7  # Similarity threshold for retrieval