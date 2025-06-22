from fastapi import FastAPI, UploadFile, File, HTTPException, Body, Request
from workflows.langgraph_flow import app as workflow_app
from agents.transaction_extractor import transaction_extractor
from agents.invoice_matcher import invoice_matcher
from agents.categorizer import categorizer
from agents.discrepancy_detector import discrepancy_detector
from agents.reconciliation_approver import reconciliation_approver
import io
import pandas as pd
import json

app = FastAPI()

@app.post("/extract-transactions")
async def extract_transactions(file: UploadFile = File(...)):
    try:
        content = await file.read()
        file_type = file.filename.split(".")[-1].lower()

        if file_type == "csv":
            df = pd.read_csv(io.BytesIO(content))
            content_str = df.to_json(orient="records")
        elif file_type == "json":
            content_str = content.decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        result = transaction_extractor.invoke({
            "file_content": content_str,
            "file_type": file_type
        })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/match-invoices")
async def match_invoices(request: Request):
    try:
        body = await request.json()
        transactions = body.get("transactions", [])
        if not isinstance(transactions, list):
            raise ValueError("Invalid format: 'transactions' must be a list")
        result = invoice_matcher.invoke({"transactions": transactions})
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/categorize")
async def categorize_transactions(request: Request):
    try:
        body = await request.json()
        transactions = body.get("transactions", [])
        if not isinstance(transactions, list):
            raise ValueError("Invalid format: 'transactions' must be a list")
        result = categorizer.invoke({"transactions": transactions})
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/detect-discrepancies")
async def detect_discrepancies(request: Request):
    try:
        body = await request.json()
        transactions = body.get("transactions", [])
        if not isinstance(transactions, list):
            raise ValueError("Invalid format: 'transactions' must be a list")
        result = discrepancy_detector.invoke({"transactions": transactions})
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/reconcile")
async def reconcile(request: Request):
    try:
        body = await request.json()
        transactions = body.get("transactions", [])
        if not isinstance(transactions, list):
            raise ValueError("Invalid format: 'transactions' must be a list")
        result = reconciliation_approver.invoke({"transactions": transactions})
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/full-reconciliation")
async def full_reconciliation(file: UploadFile = File(...)):
    try:
        content = await file.read()
        file_type = file.filename.split(".")[-1].lower()

        if file_type == "csv":
            df = pd.read_csv(io.BytesIO(content))
            content_str = df.to_json(orient="records")
        elif file_type == "json":
            content_str = content.decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")

        result = workflow_app.invoke({
            "file_content": content_str,
            "file_type": file_type
        })
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
