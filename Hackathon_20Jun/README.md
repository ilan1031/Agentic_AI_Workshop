# 🧠 AgentPy – AI-Based Auto-Reconciliation Engine (LangChain + LangGraph + FastAPI)

Video link: https://drive.google.com/drive/folders/14S8-FA731YrRFK33RrCU_az2VrpARrc2?usp=sharing

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

Here's a comprehensive guide to how the full system works with visual flow diagrams and step-by-step instructions:

### 🧩 Full System Architecture
```mermaid
graph LR
    A[Frontend] -->|API Calls| B[Node.js Backend]
    A -->|Direct API Calls| C[Python Agents]
    B -->|Data Storage| D[MongoDB]
    C -->|Vector Storage| D
    C -->|Data Processing| B
    D -->|Data Retrieval| C
    D -->|Data Retrieval| B
```

### 🌐 Connection Flow Diagram
```mermaid
sequenceDiagram
    participant User as User (Browser)
    participant FE as Next.js Frontend
    participant Node as Node.js Backend
    participant Py as Python Agents
    participant DB as MongoDB

    User->>FE: Uploads bank feed (CSV)
    FE->>Node: POST /api/transactions/upload
    Node->>Py: POST /extract-transactions
    Py->>DB: Store transactions
    Py-->>Node: Extracted transactions
    Node-->>FE: Transaction data
    
    FE->>Py: POST /match-invoices
    Py->>DB: Vector search invoices
    Py->>DB: Update matches
    Py-->>FE: Match results
    
    FE->>Py: POST /categorize
    Py->>DB: Update categories
    Py-->>FE: Categorized data
    
    FE->>Py: POST /detect-discrepancies
    Py->>DB: Flag discrepancies
    Py-->>FE: Discrepancy report
    
    FE->>Py: POST /reconcile
    Py->>DB: Create reconciliation log
    Py-->>FE: Final report
```

### 🛠️ How to Use the Full System

**Prerequisites:**
1. Python 3.8+
2. Node.js 16+
3. MongoDB Atlas account
4. Gemini API key

**Setup Instructions:**

1. **Start Python Agents:**
   ```bash
   cd agent_py
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   venv\Scripts\activate    # Windows
   pip install -r requirements.txt
   python app.py  # Runs on http://localhost:8000
   ```

2. **Start Node.js Backend:**
   ```bash
   cd backend
   npm install
   npm run dev  # Runs on http://localhost:3001
   ```

3. **Start Next.js Frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev  # Runs on http://localhost:3000
   ```

**User Workflow:**

1. **Access Dashboard:**
   - Open `http://localhost:3000`
   - View financial summary and recent activity

   ![Dashboard](https://via.placeholder.com/800x400?text=Reconciliation+Dashboard)

2. **Upload Bank Feed:**
   - Navigate to Reconcile → Upload
   - Select CSV or JSON file
   - Click "Start Reconciliation"

   ![Upload Screen](https://via.placeholder.com/800x400?text=Bank+Feed+Upload)

3. **Monitor Agent Progress:**
   - Automatic redirect to agent status page
   - Real-time visualization of processing steps:
     - Transaction Extraction
     - Invoice Matching
     - Categorization
     - Discrepancy Detection
     - Final Approval

   ![Agent Status](https://via.placeholder.com/800x400?text=Agent+Processing+Status)

4. **Review Results:**
   - View matched transactions
   - Examine flagged discrepancies
   - Approve/reject items
   - Download PDF report

   ![Results Screen](https://via.placeholder.com/800x400?text=Reconciliation+Results)

5. **Manage Invoices:**
   - Create new invoices
   - View invoice history
   - Edit existing invoices

   ![Invoice Management](https://via.placeholder.com/800x400?text=Invoice+Management)

### 🔧 Key Configuration Files

1. **Python Agents (agent_py/.env):**
   ```env
   GEMINI_API_KEY=your_gemini_key
   MONGO_URI=mongodb+srv://user:pass@cluster0.mongodb.net/db
   ```

2. **Node.js Backend (backend/.env):**
   ```env
   MONGO_URI=mongodb+srv://user:pass@cluster0.mongodb.net/db
   PORT=3001
   FASTAPI_URL=http://localhost:8000
   ```

3. **Frontend (frontend/.env.local):**
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   NEXT_PUBLIC_FASTAPI_URL=http://localhost:8000
   ```

### 💡 Sample API Calls

**1. Upload Bank Feed (Frontend → Node.js):**
```javascript
// Frontend code
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/transactions/upload', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};
```

**2. Match Invoices (Node.js → Python Agents):**
```python
# Node.js backend code
const matchInvoices = async (transactions) => {
  const response = await axios.post(
    'http://localhost:8000/match-invoices',
    { transactions }
  );
  return response.data;
};
```

**3. Vector Search (Python → MongoDB):**
```python
# Python agent code
def find_similar_invoices(transaction):
    query = {
        "transaction": transaction['description'],
        "path": "embedding",
        "k": 5
    }
    results = vector_collection.aggregate([
        {"$vectorSearch": query}
    ])
    return list(results)
```

### 🚀 Production Deployment

1. **Frontend:**
   ```bash
   cd frontend
   npm run build
   npm run start
   ```

2. **Backend Services:**
   - Use PM2 for process management:
   ```bash
   pm2 start "npm run dev" --name node-backend
   pm2 start "python app.py" --name python-agents
   ```

3. **Environment Variables:**
   - Set production values in `.env.production` files
   - Use secrets management for API keys

### 📊 Performance Metrics

| Component | CPU | Memory | Latency |
|-----------|-----|--------|---------|
| Python Agents | 2 vCPU | 2GB | 200-500ms |
| Node.js Backend | 1 vCPU | 1GB | 50-100ms |
| MongoDB | 4 vCPU | 8GB | 5-20ms |

### ⚠️ Troubleshooting Tips

1. **Connection Issues:**
   - Verify all services are running on correct ports
   - Check CORS configuration in Python/Node servers
   ```python
   # FastAPI CORS setup
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["http://localhost:3000"],
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **MongoDB Vector Search:**
   - Ensure index is properly configured:
   ```json
   {
     "fields": [{
       "type": "vector",
       "path": "embedding",
       "numDimensions": 384,
       "similarity": "cosine"
     }]
   }
   ```

3. **Agent Timeouts:**
   - Increase timeout in frontend API calls:
   ```javascript
   // Axios configuration
   axios.create({
     timeout: 30000 // 30 seconds
   })
   ```

This complete system provides an AI-powered reconciliation engine with seamless integration between all components. The visual interface allows finance teams to easily upload bank feeds, monitor AI processing, and review reconciliation results with audit trails.
