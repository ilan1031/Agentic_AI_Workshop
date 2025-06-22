from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from config import GEMINI_API_KEY, MONGO_URI, DB_NAME, TRANSACTIONS_COLLECTION
from pymongo import MongoClient
from bson import ObjectId
import json

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
transactions_collection = db[TRANSACTIONS_COLLECTION]
invoices_collection = db["invoices"]

prompt = ChatPromptTemplate.from_template(
    """Detect discrepancies in transaction:
    Transaction: {transaction}
    Invoice: {invoice}

    Return JSON with:
    - flags: list of issues
    - justification
    - severity: LOW/MEDIUM/HIGH"""
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
        return {"flags": [], "justification": "Parsing failed", "severity": "LOW"}

def detect_discrepancies(input_dict):
    transactions = input_dict["transactions"]
    discrepancy_results = []

    for transaction in transactions:
        _id = ObjectId(transaction["_id"]) if isinstance(transaction["_id"], str) else transaction["_id"]
        invoice = invoices_collection.find_one(
            {"invoice_id": transaction.get("matched_invoice_id")}
        ) or {}

        chain = (
            {"transaction": RunnablePassthrough(), "invoice": RunnablePassthrough()}
            | prompt
            | model
            | RunnableLambda(parse_response)
        )

        result = chain.invoke({"transaction": transaction, "invoice": invoice})

        transactions_collection.update_one(
            {"_id": _id},
            {"$set": {
                "flags": result.get("flags", []),
                "discrepancy_justification": result.get("justification"),
                "severity": result.get("severity")
            }}
        )

        discrepancy_results.append(result)

    return {"discrepancy_results": discrepancy_results}

discrepancy_detector = RunnableLambda(detect_discrepancies)
