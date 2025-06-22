from langchain_core.runnables import RunnableLambda, RunnablePassthrough
from langchain_core.prompts import ChatPromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI
from config import GEMINI_API_KEY, MONGO_URI, DB_NAME, RECONCILIATION_LOGS_COLLECTION
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import json

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
logs_collection = db[RECONCILIATION_LOGS_COLLECTION]
transactions_collection = db["transactions"]

prompt = ChatPromptTemplate.from_template(
    """Generate reconciliation report for:
    {summary_data}

    Return JSON with:
    - report_id
    - timestamp
    - summary
    - pdf_url (dummy)
    - status: APPROVED/REJECTED"""
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
            "report_id": "NA",
            "timestamp": str(datetime.utcnow()),
            "summary": "Parsing failed",
            "pdf_url": "reports/NA.pdf",
            "status": "REJECTED"
        }

def approve_reconciliation(input_dict):
    transactions = input_dict["transactions"]

    summary = {
        "total_transactions": len(transactions),
        "matched_count": sum(1 for t in transactions if t.get("status") == "MATCHED"),
        "flagged_count": sum(1 for t in transactions if t.get("flags")),
        "high_severity_count": sum(1 for t in transactions if t.get("severity") == "HIGH")
    }

    chain = (
        {"summary_data": RunnablePassthrough()}
        | prompt
        | model
        | RunnableLambda(parse_response)
    )

    report = chain.invoke(json.dumps(summary))

    log_entry = {
        "timestamp": datetime.utcnow(),
        "transactions": [ObjectId(t["_id"]) for t in transactions],
        "summary": summary,
        "pdf_report": report.get("pdf_url"),
        "status": report.get("status")
    }

    logs_collection.insert_one(log_entry)

    return {"report": report}

reconciliation_approver = RunnableLambda(approve_reconciliation)
