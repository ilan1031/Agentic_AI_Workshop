from langchain_mongodb import MongoDBAtlasVectorSearch
from .embedder import get_embedder, get_vector_collection

embedder = get_embedder()
collection = get_vector_collection()

vector_store = MongoDBAtlasVectorSearch(
    collection=collection,
    embedding=embedder,
    index_name="vector_index"
)