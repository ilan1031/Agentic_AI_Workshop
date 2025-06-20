from langchain_huggingface import HuggingFaceEmbeddings
from config import MONGO_URI, DB_NAME, VECTOR_STORE_COLLECTION
from pymongo import MongoClient

def get_embedder():
    return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

def get_vector_collection():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    return db[VECTOR_STORE_COLLECTION]