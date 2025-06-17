from backend.rag.retriever import Retriever

class RegulationRetrieverAgent:
    def __init__(self):
        self.retriever = Retriever()

    def retrieve_regulation(self, query):
        return self.retriever.retrieve(query)