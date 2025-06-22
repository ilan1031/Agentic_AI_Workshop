from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from pymongo import MongoClient
from bson import ObjectId
from config import GEMINI_API_KEY, MONGO_URI, DB_NAME, TRANSACTIONS_COLLECTION
import json

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[TRANSACTIONS_COLLECTION]

prompt = ChatPromptTemplate.from_template(
    """Categorize transaction using Indian GL codes:
    Transaction: {transaction}

    Return JSON with:
    - category
    - gl_code
    - gst_rate"""
)

model = ChatGoogleGenerativeAI(
    model="models/gemini-1.5-flash",
    google_api_key=GEMINI_API_KEY,
    temperature=0,
    convert_system_message_to_human=True,
    api_version="v1"
)

def parse_response(response):
    try:
        return json.loads(response.content.strip().split("\n")[-1])
    except Exception:
        return {"category": "Uncategorized", "gl_code": "0000", "gst_rate": 0}

def categorize(input_dict):
    transactions = input_dict["transactions"]
    categorized_results = []

    for transaction in transactions:
        _id = ObjectId(transaction["_id"]) if isinstance(transaction["_id"], str) else transaction["_id"]

        chain = (
            {"transaction": RunnablePassthrough()}
            | prompt
            | model
            | RunnableLambda(parse_response)
        )

        result = chain.invoke(transaction)

        collection.update_one(
            {"_id": _id},
            {"$set": {
                "category": result.get("category"),
                "gl_code": result.get("gl_code"),
                "gst_rate": result.get("gst_rate")
            }}
        )
        categorized_results.append(result)

    return {"categorized_results": categorized_results}

categorizer = RunnableLambda(categorize)
