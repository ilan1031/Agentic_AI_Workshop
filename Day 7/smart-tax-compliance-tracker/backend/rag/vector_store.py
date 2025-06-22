import os
import numpy as np
import faiss
from backend.rag.embedder import Embedder
from backend.config import Config

class VectorStore:
    def __init__(self):
        self.embedder = Embedder()
        self.index = None
        self.documents = []
        self._initialize_vector_store()

    def _initialize_vector_store(self):
        if os.path.exists(Config.VECTOR_STORE_PATH):
            self.index = faiss.read_index(Config.VECTOR_STORE_PATH)
            self.documents = self._load_documents()
        else:
            self.index = faiss.IndexFlatL2(self.embedder.model.get_sentence_embedding_dimension())
            os.makedirs(os.path.dirname(Config.VECTOR_STORE_PATH), exist_ok=True)

    def _load_documents(self):
        doc_path = Config.VECTOR_STORE_PATH + "_docs.npy"
        return np.load(doc_path, allow_pickle=True).tolist() if os.path.exists(doc_path) else []

    def add_documents(self, documents):
        if not documents:
            return
            
        embeddings = self.embedder.embed_documents(documents)
        self.index.add(np.array(embeddings).astype('float32'))
        self.documents.extend(documents)
        self._save_vector_store()

    def similarity_search(self, query, k=5):
        query_embedding = self.embedder.embed_text(query)
        distances, indices = self.index.search(np.array([query_embedding]).astype('float32'), k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx >= 0 and idx < len(self.documents):
                results.append({
                    "document": self.documents[idx],
                    "score": float(distances[0][i])
                })
        return results

    def _save_vector_store(self):
        faiss.write_index(self.index, Config.VECTOR_STORE_PATH)
        np.save(Config.VECTOR_STORE_PATH + "_docs.npy", np.array(self.documents))