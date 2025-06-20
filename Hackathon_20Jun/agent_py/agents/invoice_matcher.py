from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from rag.retriever import retriever
from config import GEMINI_API_KEY, MONGO_URI, DB_NAME, INVOICES_COLLECTION
from pymongo import MongoClient
from bson import ObjectId
import json

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
invoices_collection = db[INVOICES_COLLECTION]
transactions_collection = db["transactions"]

prompt = ChatPromptTemplate.from_template(
    """Match transactions to invoices using RAG. Analyze:
    Transaction: {transaction}
    Context: {context}

    Return JSON with:
    - matched_invoice_id
    - match_score (0-1)
    - status: MATCHED/UNMATCHED
    - justification"""
)

model = ChatGoogleGenerativeAI(
    model="models/gemini-1.5-flash",
    temperature=0,
    google_api_key=GEMINI_API_KEY,
    convert_system_message_to_human=True,
    api_version="v1"
)

def parse_response(x):
    try:
        return json.loads(x.content.strip().split("\n")[-1])
    except Exception:
        return {
            "matched_invoice_id": None,
            "match_score": 0,
            "status": "UNMATCHED",
            "justification": "Parsing failed"
        }

def serialize_transaction(txn):
    txn = txn.copy()
    if "_id" in txn and isinstance(txn["_id"], ObjectId):
        txn["_id"] = str(txn["_id"])
    return txn

def match_invoices(input_dict):
    transactions = input_dict["transactions"]
    matched_results = []

    for transaction in transactions:
        transaction = serialize_transaction(transaction)
        context = retriever.invoke(json.dumps(transaction))

        chain = (
            {"transaction": RunnablePassthrough(), "context": RunnablePassthrough()}
            | prompt
            | model
            | RunnableLambda(parse_response)
        )

        result = chain.invoke({
            "transaction": transaction,
            "context": context
        })

        transactions_collection.update_one(
            {"_id": ObjectId(transaction["_id"])},
            {"$set": result}
        )

        matched_results.append(result)

    return {"matched_results": matched_results}

invoice_matcher = RunnableLambda(match_invoices)
