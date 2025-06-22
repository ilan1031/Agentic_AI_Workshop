from sentence_transformers import SentenceTransformer
from backend.config import Config

class Embedder:
    def __init__(self):
        self.model = SentenceTransformer(Config.EMBEDDING_MODEL)
    
    def embed_text(self, text):
        return self.model.encode(text)
    
    def embed_documents(self, documents):
        return self.model.encode(documents)