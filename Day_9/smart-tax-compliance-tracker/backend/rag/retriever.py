from backend.rag.vector_store import VectorStore
from backend.config import Config
import google.generativeai as genai

class Retriever:
    def __init__(self):
        self.vector_store = VectorStore()
        if Config.GEMINI_API_KEY:
            genai.configure(api_key=Config.GEMINI_API_KEY)
            self.llm = genai.GenerativeModel(model_name=Config.LLM_MODEL)
        else:
            # Fallback to other LLM (implementation would vary)
            self.llm = None

    def retrieve(self, query):
        # Step 1: Check vector store
        vector_results = self.vector_store.similarity_search(query)
        relevant_results = [res for res in vector_results if res["score"] >= Config.RAG_THRESHOLD]
        
        if relevant_results:
            return "\n".join([res["document"] for res in relevant_results[:3]])
        
        # Step 2: Fallback to LLM
        if not self.llm:
            return "LLM not configured. Please set GEMINI_API_KEY."
            
        response = self.llm.generate_content(f"Tax regulation query: {query}")
        result = response.text
        
        # Step 3: Store new knowledge
        self.vector_store.add_documents([result])
        return result