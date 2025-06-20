# 🧠 AgentPy – AI-Based Auto-Reconciliation Engine (LangChain + LangGraph + FastAPI)

## Overview

This is the AI Agent layer for the **Agentic Auto-Reconciliation Engine**, built with FastAPI and LangChain/LangGraph. It powers the core AI workflows:
- Transaction extraction
- Invoice matching (RAG)
- Categorization
- Discrepancy detection
- Reconciliation report approval

---

## 📐 Architecture & Agent Flow

```
Bank CSV/API
     ↓
[Transaction Extractor]──→ MongoDB:transactions
     ↓
[Invoice Matcher (RAG)]──→ MongoDB:invoices
     ↓
[Categorizer]────────────→ MongoDB: GL Codes
     ↓
[Discrepancy Detector]──→ MongoDB:flags
     ↓
[Reconciliation Approver]→ MongoDB:reconciliation_logs
```

Uses LangChain `RunnableLambda` for each stage. MongoDB Atlas is used for transactional and vector storage.

---

## 🚀 FastAPI Endpoints

Base URL: `http://localhost:8000/`

| Endpoint                  | Method | Description |
|--------------------------|--------|-------------|
| `/extract-transactions`  | POST   | Upload `.csv` or `.json` with transactions |
| `/match-invoices`        | POST   | Match bank transactions to invoices using RAG |
| `/categorize`            | POST   | Categorize transactions into GL codes |
| `/detect-discrepancies`  | POST   | Detect mismatches between invoice & transaction |
| `/reconcile`             | POST   | Generate final approval summary |
| `/full-reconciliation`   | POST   | Upload CSV and run entire flow |

---

## 🧪 Example: Match Invoices

```bash
POST /match-invoices
Content-Type: application/json

{
  "transactions": [
    {
      "_id": "68551e15707222fda4fcae0d",
      "date": "2024-06-01",
      "amount": 20000,
      "ref": "TRX123",
      "party": "ABC Ltd"
    }
  ]
}
```

---

## 🧱 Directory (AgentPy/)

```
AgentPy/
├── agents/
│   ├── transaction_extractor.py
│   ├── invoice_matcher.py
│   ├── categorizer.py
│   ├── discrepancy_detector.py
│   └── reconciliation_approver.py
├── workflows/
│   └── langgraph_flow.py
├── rag/
│   └── retriever.py
├── config.py
└── api.py
```

---

## 🔗 Usage

1. Activate virtual env: `source venv/bin/activate`
2. Install dependencies: `pip install -r requirements.txt`
3. Run API: `uvicorn api:app --reload`
4. Test using Postman or frontend

---

## 🧪 Testing

Use `/tests/` folder with `pytest` or Postman collection. Each agent can be invoked individually.

---

## 📂 MongoDB Collections

- `transactions`
- `invoices`
- `reconciliation_logs`
- `vector_store` (if using ChromaDB fallback)

---

## 🌐 Embeddings

Using:
```python
HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
```

Stored in MongoDB Atlas with vector indexing enabled.

---