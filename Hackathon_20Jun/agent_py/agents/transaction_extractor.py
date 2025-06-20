import io
from langchain_core.runnables import RunnableLambda
from config import MONGO_URI, DB_NAME, TRANSACTIONS_COLLECTION
from pymongo import MongoClient
import pandas as pd
import json

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[TRANSACTIONS_COLLECTION]

def extract_transactions(input_dict):
    file_content = input_dict["file_content"]
    file_type = input_dict["file_type"]

    if file_type == "csv":
        transactions = json.loads(file_content)
    elif file_type == "json":
        transactions = json.loads(file_content)
    else:
        transactions = []

    inserted_ids = []
    if transactions:
        result = collection.insert_many(transactions)
        inserted_ids = [str(_id) for _id in result.inserted_ids]
        # Inject string _id if needed
        for txn, _id in zip(transactions, result.inserted_ids):
            txn["_id"] = str(_id)

    return {
        "inserted_ids": inserted_ids,
        "transactions": transactions
    }

transaction_extractor = RunnableLambda(extract_transactions)
